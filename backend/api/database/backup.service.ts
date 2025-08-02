import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

const execAsync = promisify(exec)

export interface BackupConfig {
  schedule: string // Cron expression
  retention: number // Days to keep backups
  compression: boolean
  encryption: boolean
  encryptionKey?: string
  storage: {
    local: boolean
    s3?: {
      bucket: string
      region: string
      accessKey: string
      secretKey: string
    }
    gcs?: {
      bucket: string
      projectId: string
      keyFile: string
    }
  }
}

export interface BackupMetadata {
  id: string
  timestamp: Date
  size: number
  checksum: string
  version: string
  tables: string[]
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  error?: string
  storage: {
    local?: string
    s3?: string
    gcs?: string
  }
}

@Injectable()
export class DatabaseBackupService {
  private readonly logger = new Logger(DatabaseBackupService.name)
  private readonly backupDir: string
  private readonly config: BackupConfig

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.backupDir = this.configService.get<string>('BACKUP_DIR') || './backups'
    this.config = this.getBackupConfig()
    this.ensureBackupDirectory()
  }

  private getBackupConfig(): BackupConfig {
    return {
      schedule: this.configService.get<string>('BACKUP_SCHEDULE') || '0 2 * * *', // Daily at 2 AM
      retention: this.configService.get<number>('BACKUP_RETENTION_DAYS') || 30,
      compression: this.configService.get<boolean>('BACKUP_COMPRESSION') || true,
      encryption: this.configService.get<boolean>('BACKUP_ENCRYPTION') || false,
      encryptionKey: this.configService.get<string>('BACKUP_ENCRYPTION_KEY'),
      storage: {
        local: this.configService.get<boolean>('BACKUP_LOCAL') || true,
        s3: this.configService.get<string>('BACKUP_S3_BUCKET') ? {
          bucket: this.configService.get<string>('BACKUP_S3_BUCKET')!,
          region: this.configService.get<string>('BACKUP_S3_REGION') || 'us-east-1',
          accessKey: this.configService.get<string>('BACKUP_S3_ACCESS_KEY')!,
          secretKey: this.configService.get<string>('BACKUP_S3_SECRET_KEY')!,
        } : undefined,
        gcs: this.configService.get<string>('BACKUP_GCS_BUCKET') ? {
          bucket: this.configService.get<string>('BACKUP_GCS_BUCKET')!,
          projectId: this.configService.get<string>('BACKUP_GCS_PROJECT_ID')!,
          keyFile: this.configService.get<string>('BACKUP_GCS_KEY_FILE')!,
        } : undefined,
      },
    }
  }

  private ensureBackupDirectory(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }
  }

  async createBackup(): Promise<BackupMetadata> {
    const backupId = this.generateBackupId()
    const timestamp = new Date()
    const metadata: BackupMetadata = {
      id: backupId,
      timestamp,
      size: 0,
      checksum: '',
      version: await this.getDatabaseVersion(),
      tables: await this.getTableList(),
      status: 'pending',
      storage: {},
    }

    this.logger.log(`Starting backup: ${backupId}`)
    this.eventEmitter.emit('backup.started', metadata)

    try {
      metadata.status = 'in_progress'
      
      // Create backup file
      const backupPath = await this.createBackupFile(backupId)
      
      // Compress if enabled
      let finalPath = backupPath
      if (this.config.compression) {
        finalPath = await this.compressBackup(backupPath)
      }

      // Encrypt if enabled
      if (this.config.encryption && this.config.encryptionKey) {
        finalPath = await this.encryptBackup(finalPath, this.config.encryptionKey)
      }

      // Calculate metadata
      const stats = fs.statSync(finalPath)
      metadata.size = stats.size
      metadata.checksum = await this.calculateChecksum(finalPath)
      metadata.status = 'completed'

      // Upload to storage
      await this.uploadBackup(finalPath, metadata)

      // Cleanup old backups
      await this.cleanupOldBackups()

      this.logger.log(`Backup completed: ${backupId}, size: ${metadata.size} bytes`)
      this.eventEmitter.emit('backup.completed', metadata)

      return metadata
    } catch (error) {
      metadata.status = 'failed'
      metadata.error = error instanceof Error ? error.message : 'Unknown error'
      
      this.logger.error(`Backup failed: ${backupId}`, error)
      this.eventEmitter.emit('backup.failed', metadata)

      throw error
    }
  }

  private generateBackupId(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const random = crypto.randomBytes(4).toString('hex')
    return `backup-${timestamp}-${random}`
  }

  private async getDatabaseVersion(): Promise<string> {
    try {
      const { stdout } = await execAsync('sqlite3 --version')
      return stdout.trim()
    } catch {
      return 'unknown'
    }
  }

  private async getTableList(): Promise<string[]> {
    try {
      const dbPath = this.configService.get<string>('DATABASE_URL')?.replace('file:', '') || './dev.db'
      const { stdout } = await execAsync(`sqlite3 "${dbPath}" ".tables"`)
      return stdout.trim().split(/\s+/).filter(Boolean)
    } catch {
      return []
    }
  }

  private async createBackupFile(backupId: string): Promise<string> {
    const dbPath = this.configService.get<string>('DATABASE_URL')?.replace('file:', '') || './dev.db'
    const backupPath = path.join(this.backupDir, `${backupId}.sql`)

    try {
      // Create SQLite backup
      await execAsync(`sqlite3 "${dbPath}" ".backup '${backupPath}'"`)
      return backupPath
    } catch (error) {
      // Fallback to dump method
      await execAsync(`sqlite3 "${dbPath}" ".dump" > "${backupPath}"`)
      return backupPath
    }
  }

  private async compressBackup(filePath: string): Promise<string> {
    const compressedPath = `${filePath}.gz`
    await execAsync(`gzip -c "${filePath}" > "${compressedPath}"`)
    fs.unlinkSync(filePath) // Remove original
    return compressedPath
  }

  private async encryptBackup(filePath: string, key: string): Promise<string> {
    const encryptedPath = `${filePath}.enc`
    const keyHash = crypto.createHash('sha256').update(key).digest('hex')
    
    await execAsync(`openssl enc -aes-256-cbc -salt -in "${filePath}" -out "${encryptedPath}" -k "${keyHash}"`)
    fs.unlinkSync(filePath) // Remove unencrypted
    return encryptedPath
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const fileBuffer = fs.readFileSync(filePath)
    return crypto.createHash('sha256').update(fileBuffer).digest('hex')
  }

  private async uploadBackup(filePath: string, metadata: BackupMetadata): Promise<void> {
    // Local storage
    if (this.config.storage.local) {
      metadata.storage.local = filePath
    }

    // S3 storage
    if (this.config.storage.s3) {
      const s3Path = await this.uploadToS3(filePath, metadata.id)
      metadata.storage.s3 = s3Path
    }

    // Google Cloud Storage
    if (this.config.storage.gcs) {
      const gcsPath = await this.uploadToGCS(filePath, metadata.id)
      metadata.storage.gcs = gcsPath
    }
  }

  private async uploadToS3(filePath: string, backupId: string): Promise<string> {
    const { bucket, region, accessKey, secretKey } = this.config.storage.s3!
    const key = `backups/${backupId}/${path.basename(filePath)}`
    
    await execAsync(`aws s3 cp "${filePath}" "s3://${bucket}/${key}" --region ${region}`, {
      env: {
        ...process.env,
        AWS_ACCESS_KEY_ID: accessKey,
        AWS_SECRET_ACCESS_KEY: secretKey,
      },
    })

    return `s3://${bucket}/${key}`
  }

  private async uploadToGCS(filePath: string, backupId: string): Promise<string> {
    const { bucket, projectId, keyFile } = this.config.storage.gcs!
    const key = `backups/${backupId}/${path.basename(filePath)}`
    
    await execAsync(`gsutil -i "${keyFile}" cp "${filePath}" "gs://${bucket}/${key}"`)
    
    return `gs://${bucket}/${key}`
  }

  private async cleanupOldBackups(): Promise<void> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retention)

    const files = fs.readdirSync(this.backupDir)
    for (const file of files) {
      const filePath = path.join(this.backupDir, file)
      const stats = fs.statSync(filePath)
      
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath)
        this.logger.log(`Cleaned up old backup: ${file}`)
      }
    }
  }

  async restoreBackup(backupId: string, targetPath?: string): Promise<void> {
    this.logger.log(`Starting restore: ${backupId}`)
    this.eventEmitter.emit('backup.restore.started', { backupId })

    try {
      // Find backup file
      const backupPath = await this.findBackupFile(backupId)
      if (!backupPath) {
        throw new Error(`Backup not found: ${backupId}`)
      }

      // Decrypt if needed
      let restorePath = backupPath
      if (backupPath.endsWith('.enc')) {
        restorePath = await this.decryptBackup(backupPath)
      }

      // Decompress if needed
      if (restorePath.endsWith('.gz')) {
        restorePath = await this.decompressBackup(restorePath)
      }

      // Restore database
      const dbPath = targetPath || this.configService.get<string>('DATABASE_URL')?.replace('file:', '') || './dev.db'
      await this.restoreDatabase(restorePath, dbPath)

      this.logger.log(`Restore completed: ${backupId}`)
      this.eventEmitter.emit('backup.restore.completed', { backupId })
    } catch (error) {
      this.logger.error(`Restore failed: ${backupId}`, error)
      this.eventEmitter.emit('backup.restore.failed', { backupId, error })
      throw error
    }
  }

  private async findBackupFile(backupId: string): Promise<string | null> {
    // Check local storage
    const files = fs.readdirSync(this.backupDir)
    const localFile = files.find(file => file.includes(backupId))
    if (localFile) {
      return path.join(this.backupDir, localFile)
    }

    // Check S3
    if (this.config.storage.s3) {
      try {
        const { bucket, region, accessKey, secretKey } = this.config.storage.s3!
        const key = `backups/${backupId}/`
        
        const { stdout } = await execAsync(`aws s3 ls "s3://${bucket}/${key}" --region ${region}`, {
          env: {
            ...process.env,
            AWS_ACCESS_KEY_ID: accessKey,
            AWS_SECRET_ACCESS_KEY: secretKey,
          },
        })

        if (stdout.trim()) {
          const fileName = stdout.trim().split(/\s+/).pop()
          const localPath = path.join(this.backupDir, fileName!)
          await execAsync(`aws s3 cp "s3://${bucket}/${key}${fileName}" "${localPath}" --region ${region}`, {
            env: {
              ...process.env,
              AWS_ACCESS_KEY_ID: accessKey,
              AWS_SECRET_ACCESS_KEY: secretKey,
            },
          })
          return localPath
        }
      } catch (error) {
        this.logger.warn(`Failed to find backup in S3: ${error}`)
      }
    }

    return null
  }

  private async decryptBackup(filePath: string): Promise<string> {
    const decryptedPath = filePath.replace('.enc', '')
    const key = this.config.encryptionKey!
    const keyHash = crypto.createHash('sha256').update(key).digest('hex')
    
    await execAsync(`openssl enc -aes-256-cbc -d -in "${filePath}" -out "${decryptedPath}" -k "${keyHash}"`)
    return decryptedPath
  }

  private async decompressBackup(filePath: string): Promise<string> {
    const decompressedPath = filePath.replace('.gz', '')
    await execAsync(`gunzip -c "${filePath}" > "${decompressedPath}"`)
    return decompressedPath
  }

  private async restoreDatabase(backupPath: string, dbPath: string): Promise<void> {
    // Create backup of current database
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const currentBackup = `${dbPath}.backup.${timestamp}`
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, currentBackup)
    }

    // Restore from backup
    await execAsync(`sqlite3 "${dbPath}" < "${backupPath}"`)
  }

  async listBackups(): Promise<BackupMetadata[]> {
    const backups: BackupMetadata[] = []
    const files = fs.readdirSync(this.backupDir)

    for (const file of files) {
      if (file.startsWith('backup-')) {
        const filePath = path.join(this.backupDir, file)
        const stats = fs.statSync(filePath)
        
        const backupId = file.replace(/\.(sql|gz|enc)$/, '')
        backups.push({
          id: backupId,
          timestamp: stats.mtime,
          size: stats.size,
          checksum: await this.calculateChecksum(filePath),
          version: 'unknown',
          tables: [],
          status: 'completed',
          storage: { local: filePath },
        })
      }
    }

    return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  async getBackupHealth(): Promise<{ status: string; lastBackup?: Date; totalBackups: number }> {
    const backups = await this.listBackups()
    const lastBackup = backups[0]?.timestamp
    
    if (!lastBackup) {
      return { status: 'no_backups', totalBackups: 0 }
    }

    const daysSinceLastBackup = (Date.now() - lastBackup.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysSinceLastBackup > 1) {
      return { status: 'stale', lastBackup, totalBackups: backups.length }
    }

    return { status: 'healthy', lastBackup, totalBackups: backups.length }
  }
} 