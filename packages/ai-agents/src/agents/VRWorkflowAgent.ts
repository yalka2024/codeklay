import * as THREE from 'three';
import { BaseAgent, AgentConfig, AgentAction, AgentResponse, AgentMetrics } from '../core/BaseAgent';
import { DeepSeekClient } from '@codepal/ai-agents';
import { VRAction, VRNode, VRWorkflow } from '../types';

export class VRWorkflowAgent extends BaseAgent {
  private scene: THREE.Scene;
  private deepseek: DeepSeekClient;
  private vrNodes: Map<string, VRNode> = new Map();
  private workflows: Map<string, VRWorkflow> = new Map();

  constructor(config: AgentConfig, scene: THREE.Scene, deepseekApiKey: string) {
    super(config);
    this.scene = scene;
    this.deepseek = new DeepSeekClient(deepseekApiKey);
  }

  async start(): Promise<void> {
    await super.start();
    this.logger.info('VR Workflow Agent started');
    
    // Start monitoring VR environment
    this.scheduleTask('monitor-vr-environment', '*/10 * * * *', () => this.monitorVREnvironment());
    this.scheduleTask('optimize-vr-performance', '0 */2 * * *', () => this.optimizeVRPerformance());
    this.scheduleTask('predict-vr-issues', '*/30 * * * *', () => this.predictVRIssues());
  }

  async stop(): Promise<void> {
    await super.stop();
    this.logger.info('VR Workflow Agent stopped');
  }

  async predictVRIssues(code: string): Promise<VRAction[]> {
    try {
      const issues = await this.deepseek.analyzeCode(code);
      const vrIssues = issues.filter(issue => 
        issue.type === 'performance' || 
        issue.type === 'memory' || 
        issue.type === 'latency' ||
        issue.type === 'vr-specific'
      );

      const actions: VRAction[] = vrIssues.map((issue) => ({
        type: 'highlight',
        nodeId: issue.nodeId || this.generateNodeId(),
        suggestion: issue.suggestion,
        predictedImpact: this.calculatePredictedImpact(issue),
        severity: issue.severity || 'medium'
      }));

      this.recordMetrics('vr_issues_predicted', { count: actions.length, issues: vrIssues });
      
      return actions;
    } catch (error) {
      this.logger.error('Error predicting VR issues:', error);
      throw error;
    }
  }

  async applyFix(nodeId: string, fix: string): Promise<VRAction> {
    try {
      const node = this.scene.getObjectByName(nodeId);
      if (node) {
        // Update 3D visualization
        if (node.material && node.material.color) {
          node.material.color.setHex(0x00ff00); // Green for fixed
        }
        
        // Apply the fix to the code
        const updatedCode = await this.deepseek.applyFix(nodeId, fix);
        
        this.recordMetrics('vr_fix_applied', { nodeId, fixType: 'code_update' });
        
        return {
          type: 'apply',
          nodeId,
          suggestion: fix,
          appliedAt: new Date()
        };
      }
      
      throw new Error(`VR node ${nodeId} not found`);
    } catch (error) {
      this.logger.error('Error applying VR fix:', error);
      throw error;
    }
  }

  async createVRNode(nodeData: Partial<VRNode>): Promise<VRNode> {
    try {
      const nodeId = this.generateNodeId();
      const node: VRNode = {
        id: nodeId,
        type: nodeData.type || 'code-block',
        position: nodeData.position || { x: 0, y: 0, z: 0 },
        code: nodeData.code || '',
        metadata: nodeData.metadata || {},
        createdAt: new Date(),
        status: 'active'
      };

      // Create 3D representation
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ 
        color: this.getNodeColor(node.type),
        transparent: true,
        opacity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = nodeId;
      mesh.position.set(node.position.x, node.position.y, node.position.z);
      
      this.scene.add(mesh);
      this.vrNodes.set(nodeId, node);

      this.recordMetrics('vr_node_created', { nodeId, type: node.type });
      
      return node;
    } catch (error) {
      this.logger.error('Error creating VR node:', error);
      throw error;
    }
  }

  async updateVRNode(nodeId: string, updates: Partial<VRNode>): Promise<VRNode> {
    try {
      const node = this.vrNodes.get(nodeId);
      if (!node) {
        throw new Error(`VR node ${nodeId} not found`);
      }

      const updatedNode = { ...node, ...updates, updatedAt: new Date() };
      this.vrNodes.set(nodeId, updatedNode);

      // Update 3D representation
      const mesh = this.scene.getObjectByName(nodeId);
      if (mesh && updates.position) {
        mesh.position.set(updates.position.x, updates.position.y, updates.position.z);
      }

      this.recordMetrics('vr_node_updated', { nodeId, updates: Object.keys(updates) });
      
      return updatedNode;
    } catch (error) {
      this.logger.error('Error updating VR node:', error);
      throw error;
    }
  }

  async createVRWorkflow(workflowData: Partial<VRWorkflow>): Promise<VRWorkflow> {
    try {
      const workflowId = this.generateWorkflowId();
      const workflow: VRWorkflow = {
        id: workflowId,
        name: workflowData.name || 'VR Workflow',
        nodes: workflowData.nodes || [],
        connections: workflowData.connections || [],
        status: 'active',
        createdAt: new Date(),
        metadata: workflowData.metadata || {}
      };

      this.workflows.set(workflowId, workflow);
      
      // Create 3D connections between nodes
      await this.createWorkflowConnections(workflow);

      this.recordMetrics('vr_workflow_created', { workflowId, nodeCount: workflow.nodes.length });
      
      return workflow;
    } catch (error) {
      this.logger.error('Error creating VR workflow:', error);
      throw error;
    }
  }

  async optimizeVRPerformance(): Promise<void> {
    try {
      const performanceIssues = await this.deepseek.analyzeVRPerformance(this.scene);
      
      for (const issue of performanceIssues) {
        if (issue.type === 'geometry_optimization') {
          await this.optimizeGeometry(issue.nodeId);
        } else if (issue.type === 'material_optimization') {
          await this.optimizeMaterial(issue.nodeId);
        } else if (issue.type === 'lighting_optimization') {
          await this.optimizeLighting();
        }
      }

      this.logger.info(`Optimized ${performanceIssues.length} VR performance issues`);
    } catch (error) {
      this.logger.error('Error optimizing VR performance:', error);
    }
  }

  async monitorVREnvironment(): Promise<void> {
    try {
      const metrics = await this.getVRMetrics();
      this.recordMetrics('vr_environment_metrics', metrics);
      
      // Alert if performance is degrading
      if (metrics.avgFrameRate < 60) {
        await this.sendNotification('vr_performance_alert', {
          message: 'VR performance is below optimal threshold',
          metrics
        });
      }
    } catch (error) {
      this.logger.error('Error monitoring VR environment:', error);
    }
  }

  async getVRMetrics(): Promise<any> {
    const nodeCount = this.vrNodes.size;
    const workflowCount = this.workflows.size;
    const activeNodes = Array.from(this.vrNodes.values()).filter(n => n.status === 'active').length;
    
    // Simulate frame rate calculation
    const avgFrameRate = Math.max(30, 90 - (nodeCount * 0.5));
    
    return {
      nodeCount,
      workflowCount,
      activeNodes,
      avgFrameRate,
      sceneComplexity: this.calculateSceneComplexity(),
      timestamp: new Date()
    };
  }

  private calculateSceneComplexity(): number {
    const geometryCount = this.scene.children.filter(child => child.type === 'Mesh').length;
    const materialCount = new Set(
      this.scene.children
        .filter(child => child.type === 'Mesh')
        .map(child => (child as THREE.Mesh).material)
    ).size;
    
    return geometryCount + materialCount;
  }

  private calculatePredictedImpact(issue: any): string {
    const impactMap = {
      'critical': '50%+ performance degradation',
      'high': '25-50% performance degradation',
      'medium': '10-25% performance degradation',
      'low': '5-10% performance degradation'
    };
    
    return impactMap[issue.severity] || 'Unknown impact';
  }

  private generateNodeId(): string {
    return `vr-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateWorkflowId(): string {
    return `vr-workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getNodeColor(type: string): number {
    const colorMap = {
      'code-block': 0x4a90e2, // Blue
      'function': 0x7ed321,   // Green
      'class': 0xf5a623,      // Orange
      'module': 0x9013fe,     // Purple
      'error': 0xd0021b,      // Red
      'warning': 0xf8e71c     // Yellow
    };
    
    return colorMap[type] || 0x4a90e2;
  }

  private async createWorkflowConnections(workflow: VRWorkflow): Promise<void> {
    for (const connection of workflow.connections) {
      const fromNode = this.scene.getObjectByName(connection.fromNodeId);
      const toNode = this.scene.getObjectByName(connection.toNodeId);
      
      if (fromNode && toNode) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          fromNode.position,
          toNode.position
        ]);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const line = new THREE.Line(geometry, material);
        line.name = `connection-${connection.fromNodeId}-${connection.toNodeId}`;
        
        this.scene.add(line);
      }
    }
  }

  private async optimizeGeometry(nodeId: string): Promise<void> {
    const mesh = this.scene.getObjectByName(nodeId) as THREE.Mesh;
    if (mesh && mesh.geometry) {
      mesh.geometry.computeBoundingBox();
      mesh.geometry.computeBoundingSphere();
    }
  }

  private async optimizeMaterial(nodeId: string): Promise<void> {
    const mesh = this.scene.getObjectByName(nodeId) as THREE.Mesh;
    if (mesh && mesh.material) {
      // Optimize material properties for VR
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => this.optimizeMaterialProperties(mat));
      } else {
        this.optimizeMaterialProperties(mesh.material);
      }
    }
  }

  private optimizeMaterialProperties(material: THREE.Material): void {
    // Optimize for VR performance
    material.needsUpdate = true;
    if (material instanceof THREE.MeshStandardMaterial) {
      material.roughness = Math.min(material.roughness, 0.8);
      material.metalness = Math.min(material.metalness, 0.5);
    }
  }

  private async optimizeLighting(): Promise<void> {
    // Optimize lighting for VR performance
    const lights = this.scene.children.filter(child => child.type.includes('Light'));
    lights.forEach(light => {
      if (light instanceof THREE.DirectionalLight) {
        light.intensity = Math.min(light.intensity, 1.0);
      }
    });
  }

  async executeAction(action: AgentAction): Promise<AgentResponse> {
    switch (action.type) {
      case 'predict_vr_issues':
        const { code } = action.params;
        const issues = await this.predictVRIssues(code);
        return {
          success: true,
          data: issues,
          timestamp: new Date()
        };

      case 'apply_vr_fix':
        const { nodeId, fix } = action.params;
        const result = await this.applyFix(nodeId, fix);
        return {
          success: true,
          data: result,
          timestamp: new Date()
        };

      case 'create_vr_node':
        const node = await this.createVRNode(action.params);
        return {
          success: true,
          data: node,
          timestamp: new Date()
        };

      case 'create_vr_workflow':
        const workflow = await this.createVRWorkflow(action.params);
        return {
          success: true,
          data: workflow,
          timestamp: new Date()
        };

      case 'get_vr_metrics':
        const metrics = await this.getVRMetrics();
        return {
          success: true,
          data: metrics,
          timestamp: new Date()
        };

      default:
        return {
          success: false,
          error: `Unknown action type: ${action.type}`,
          timestamp: new Date()
        };
    }
  }

  async getMetrics(): Promise<AgentMetrics> {
    const baseMetrics = await super.getMetrics();
    const vrMetrics = await this.getVRMetrics();

    return {
      ...baseMetrics,
      custom: {
        vrMetrics,
        vrIssuesPredicted: this.getMetricCount('vr_issues_predicted'),
        vrFixesApplied: this.getMetricCount('vr_fix_applied'),
        vrNodesCreated: this.getMetricCount('vr_node_created'),
        vrWorkflowsCreated: this.getMetricCount('vr_workflow_created')
      }
    };
  }
} 