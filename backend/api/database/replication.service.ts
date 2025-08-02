import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

export interface ReplicationConfig {
  enabled: boolean
  mode: 'master-slave' | 'master-master' | 'cluster'
  nodes: {
    id: string
    host: string
    port: number
    role: 'master' | 'slave' | 'replica'
    priority: number
    credentials?: {
      username: string
      password: string
    }
  }[]
  syncInterval: number // milliseconds
  conflictResolution: 'last-write-wins' | 'manual' | 'timestamp-based'
  healthCheck: {
    enabled: boolean
    interval: number
    timeout: number
  }
}

export interface ReplicationStatus {
  nodeId: string
  status: 'online' | 'offline' | 'syncing' | 'error'
  lastSync: Date
  lag: number // milliseconds
  errors: string[]
  isMaster: boolean
  connectedSlaves: number
}

@Injectable()
export class DatabaseReplicationService {
  private readonly logger = new Logger(DatabaseReplicationService.name)
  private readonly config: ReplicationConfig
  private readonly status: Map<string, ReplicationStatus> = new Map()
  private syncInterval?: NodeJS.Timeout
  private healthCheckInterval?: NodeJS.Timeout

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.config = this.getReplicationConfig()
    this.initializeReplication()
  }

  private getReplicationConfig(): ReplicationConfig {
    return {
      enabled: this.configService.get<boolean>('REPLICATION_ENABLED') || false,
      mode: this.configService.get<string>('REPLICATION_MODE') as any || 'master-slave',
      nodes: this.parseNodesConfig(),
      syncInterval: this.configService.get<number>('REPLICATION_SYNC_INTERVAL') || 30000,
      conflictResolution: this.configService.get<string>('REPLICATION_CONFLICT_RESOLUTION') as any || 'last-write-wins',
      healthCheck: {
        enabled: this.configService.get<boolean>('REPLICATION_HEALTH_CHECK') || true,
        interval: this.configService.get<number>('REPLICATION_HEALTH_INTERVAL') || 10000,
        timeout: this.configService.get<number>('REPLICATION_HEALTH_TIMEOUT') || 5000,
      },
    }
  }

  private parseNodesConfig(): ReplicationConfig['nodes'] {
    const nodesConfig = this.configService.get<string>('REPLICATION_NODES')
    if (!nodesConfig) {
      return []
    }

    try {
      return JSON.parse(nodesConfig)
    } catch {
      this.logger.warn('Invalid REPLICATION_NODES configuration')
      return []
    }
  }

  private initializeReplication(): void {
    if (!this.config.enabled || this.config.nodes.length === 0) {
      this.logger.log('Database replication is disabled or no nodes configured')
      return
    }

    this.logger.log(`Initializing replication in ${this.config.mode} mode with ${this.config.nodes.length} nodes`)

    // Initialize status for all nodes
    this.config.nodes.forEach(node => {
      this.status.set(node.id, {
        nodeId: node.id,
        status: 'offline',
        lastSync: new Date(0),
        lag: 0,
        errors: [],
        isMaster: node.role === 'master',
        connectedSlaves: 0,
      })
    })

    // Start health checks
    if (this.config.healthCheck.enabled) {
      this.startHealthChecks()
    }

    // Start sync process
    this.startSyncProcess()

    this.logger.log('Database replication initialized successfully')
  }

  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks()
    }, this.config.healthCheck.interval)
  }

  private startSyncProcess(): void {
    this.syncInterval = setInterval(async () => {
      await this.performSync()
    }, this.config.syncInterval)
  }

  private async performHealthChecks(): Promise<void> {
    const promises = this.config.nodes.map(async node => {
      try {
        const isHealthy = await this.checkNodeHealth(node)
        const currentStatus = this.status.get(node.id)!
        
        if (isHealthy && currentStatus.status !== 'online') {
          currentStatus.status = 'online'
          currentStatus.errors = []
          this.logger.log(`Node ${node.id} is now online`)
          this.eventEmitter.emit('replication.node.online', { nodeId: node.id })
        } else if (!isHealthy && currentStatus.status === 'online') {
          currentStatus.status = 'offline'
          this.logger.warn(`Node ${node.id} is now offline`)
          this.eventEmitter.emit('replication.node.offline', { nodeId: node.id })
        }
      } catch (error) {
        const currentStatus = this.status.get(node.id)!
        currentStatus.status = 'error'
        currentStatus.errors.push(error instanceof Error ? error.message : 'Unknown error')
        this.logger.error(`Health check failed for node ${node.id}:`, error)
      }
    })

    await Promise.all(promises)
  }

  private async checkNodeHealth(node: ReplicationConfig['nodes'][0]): Promise<boolean> {
    try {
      const dbPath = this.getNodeDatabasePath(node)
      
      // Check if database file exists and is accessible
      if (!fs.existsSync(dbPath)) {
        return false
      }

      // Try to execute a simple query
      const { stdout } = await execAsync(`sqlite3 "${dbPath}" "SELECT 1"`, {
        timeout: this.config.healthCheck.timeout,
      })

      return stdout.trim() === '1'
    } catch {
      return false
    }
  }

  private getNodeDatabasePath(node: ReplicationConfig['nodes'][0]): string {
    // In a real implementation, this would connect to remote databases
    // For now, we'll use local file paths
    return path.join(process.cwd(), `replica-${node.id}.db`)
  }

  private async performSync(): Promise<void> {
    if (this.config.mode === 'master-slave') {
      await this.performMasterSlaveSync()
    } else if (this.config.mode === 'master-master') {
      await this.performMasterMasterSync()
    } else if (this.config.mode === 'cluster') {
      await this.performClusterSync()
    }
  }

  private async performMasterSlaveSync(): Promise<void> {
    const masterNode = this.config.nodes.find(node => node.role === 'master')
    const slaveNodes = this.config.nodes.filter(node => node.role === 'slave')

    if (!masterNode || slaveNodes.length === 0) {
      return
    }

    const masterStatus = this.status.get(masterNode.id)
    if (masterStatus?.status !== 'online') {
      this.logger.warn('Master node is not available for sync')
      return
    }

    const syncPromises = slaveNodes.map(async slaveNode => {
      const slaveStatus = this.status.get(slaveNode.id)
      if (slaveStatus?.status !== 'online') {
        return
      }

      try {
        slaveStatus.status = 'syncing'
        await this.syncNodeToMaster(slaveNode, masterNode)
        slaveStatus.status = 'online'
        slaveStatus.lastSync = new Date()
        slaveStatus.lag = 0
        slaveStatus.errors = []
        
        this.logger.log(`Successfully synced slave ${slaveNode.id} to master`)
        this.eventEmitter.emit('replication.sync.completed', {
          slaveId: slaveNode.id,
          masterId: masterNode.id,
          timestamp: new Date(),
        })
      } catch (error) {
        slaveStatus.status = 'error'
        slaveStatus.errors.push(error instanceof Error ? error.message : 'Unknown error')
        this.logger.error(`Failed to sync slave ${slaveNode.id}:`, error)
        this.eventEmitter.emit('replication.sync.failed', {
          slaveId: slaveNode.id,
          masterId: masterNode.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    })

    await Promise.all(syncPromises)
  }

  private async performMasterMasterSync(): Promise<void> {
    const masterNodes = this.config.nodes.filter(node => node.role === 'master')
    
    for (let i = 0; i < masterNodes.length; i++) {
      for (let j = i + 1; j < masterNodes.length; j++) {
        const node1 = masterNodes[i]
        const node2 = masterNodes[j]
        
        const status1 = this.status.get(node1.id)
        const status2 = this.status.get(node2.id)
        
        if (status1?.status === 'online' && status2?.status === 'online') {
          try {
            await this.syncMasterToMaster(node1, node2)
            status1.lastSync = new Date()
            status2.lastSync = new Date()
            
            this.logger.log(`Successfully synced masters ${node1.id} and ${node2.id}`)
          } catch (error) {
            this.logger.error(`Failed to sync masters ${node1.id} and ${node2.id}:`, error)
          }
        }
      }
    }
  }

  private async performClusterSync(): Promise<void> {
    // Implement cluster sync logic
    this.logger.log('Cluster sync not yet implemented')
  }

  private async syncNodeToMaster(slaveNode: any, masterNode: any): Promise<void> {
    const masterDbPath = this.getNodeDatabasePath(masterNode)
    const slaveDbPath = this.getNodeDatabasePath(slaveNode)
    
    // Create a temporary backup of the master
    const tempBackup = `${masterDbPath}.temp.backup`
    await execAsync(`sqlite3 "${masterDbPath}" ".backup '${tempBackup}'"`)
    
    try {
      // Restore the backup to the slave
      await execAsync(`sqlite3 "${slaveDbPath}" < "${tempBackup}"`)
    } finally {
      // Clean up temporary backup
      if (fs.existsSync(tempBackup)) {
        fs.unlinkSync(tempBackup)
      }
    }
  }

  private async syncMasterToMaster(node1: any, node2: any): Promise<void> {
    const db1Path = this.getNodeDatabasePath(node1)
    const db2Path = this.getNodeDatabasePath(node2)
    
    // Get the last modification time of both databases
    const stats1 = fs.statSync(db1Path)
    const stats2 = fs.statSync(db2Path)
    
    // Determine which database is more recent
    const newerDb = stats1.mtime > stats2.mtime ? db1Path : db2Path
    const olderDb = stats1.mtime > stats2.mtime ? db2Path : db1Path
    
    // Sync the older database to match the newer one
    const tempBackup = `${newerDb}.temp.backup`
    await execAsync(`sqlite3 "${newerDb}" ".backup '${tempBackup}'"`)
    
    try {
      await execAsync(`sqlite3 "${olderDb}" < "${tempBackup}"`)
    } finally {
      if (fs.existsSync(tempBackup)) {
        fs.unlinkSync(tempBackup)
      }
    }
  }

  async getReplicationStatus(): Promise<ReplicationStatus[]> {
    return Array.from(this.status.values())
  }

  async getNodeStatus(nodeId: string): Promise<ReplicationStatus | null> {
    return this.status.get(nodeId) || null
  }

  async promoteToMaster(nodeId: string): Promise<void> {
    const node = this.config.nodes.find(n => n.id === nodeId)
    if (!node) {
      throw new Error(`Node ${nodeId} not found`)
    }

    if (node.role === 'master') {
      throw new Error(`Node ${nodeId} is already a master`)
    }

    // Update node role
    node.role = 'master'
    
    // Update status
    const status = this.status.get(nodeId)
    if (status) {
      status.isMaster = true
    }

    this.logger.log(`Promoted node ${nodeId} to master`)
    this.eventEmitter.emit('replication.node.promoted', { nodeId })
  }

  async demoteToSlave(nodeId: string): Promise<void> {
    const node = this.config.nodes.find(n => n.id === nodeId)
    if (!node) {
      throw new Error(`Node ${nodeId} not found`)
    }

    if (node.role === 'slave') {
      throw new Error(`Node ${nodeId} is already a slave`)
    }

    // Update node role
    node.role = 'slave'
    
    // Update status
    const status = this.status.get(nodeId)
    if (status) {
      status.isMaster = false
    }

    this.logger.log(`Demoted node ${nodeId} to slave`)
    this.eventEmitter.emit('replication.node.demoted', { nodeId })
  }

  async forceSync(nodeId: string): Promise<void> {
    const node = this.config.nodes.find(n => n.id === nodeId)
    if (!node) {
      throw new Error(`Node ${nodeId} not found`)
    }

    this.logger.log(`Forcing sync for node ${nodeId}`)
    
    if (node.role === 'slave') {
      const masterNode = this.config.nodes.find(n => n.role === 'master')
      if (masterNode) {
        await this.syncNodeToMaster(node, masterNode)
      }
    } else if (node.role === 'master') {
      // Sync with other masters
      const otherMasters = this.config.nodes.filter(n => n.role === 'master' && n.id !== nodeId)
      for (const otherMaster of otherMasters) {
        await this.syncMasterToMaster(node, otherMaster)
      }
    }
  }

  async stopReplication(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = undefined
    }

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = undefined
    }

    this.logger.log('Database replication stopped')
  }

  async startReplication(): Promise<void> {
    if (this.syncInterval || this.healthCheckInterval) {
      this.logger.warn('Replication is already running')
      return
    }

    this.initializeReplication()
  }

  async getReplicationHealth(): Promise<{ status: string; nodes: number; online: number; errors: number }> {
    const nodes = Array.from(this.status.values())
    const online = nodes.filter(n => n.status === 'online').length
    const errors = nodes.filter(n => n.status === 'error').length

    let status = 'healthy'
    if (errors > 0) {
      status = 'degraded'
    }
    if (online === 0) {
      status = 'critical'
    }

    return {
      status,
      nodes: nodes.length,
      online,
      errors,
    }
  }
} 