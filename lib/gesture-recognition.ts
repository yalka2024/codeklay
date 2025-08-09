import * as THREE from 'three';

// Gesture Recognition System for VR/AR Programming
export interface HandGesture {
  id: string;
  type: 'point' | 'grab' | 'pinch' | 'wave' | 'circle' | 'swipe' | 'custom';
  hand: 'left' | 'right' | 'both';
  position: THREE.Vector3;
  direction?: THREE.Vector3;
  intensity: number;
  confidence: number;
  duration: number;
  metadata?: Record<string, any>;
}

export interface GestureCommand {
  id: string;
  gesture: HandGesture;
  action: 'select' | 'move' | 'scale' | 'rotate' | 'create' | 'delete' | 'copy' | 'paste' | 'undo' | 'redo';
  target?: string; // ID of the object being manipulated
  parameters?: Record<string, any>;
  timestamp: number;
}

export interface GesturePattern {
  id: string;
  name: string;
  sequence: HandGesture[];
  action: string;
  description: string;
  confidence: number;
}

export class GestureRecognition {
  private gestures: HandGesture[] = [];
  private commands: GestureCommand[] = [];
  private patterns: Map<string, GesturePattern> = new Map();
  private isTracking: boolean = false;
  private handPositions: Map<string, THREE.Vector3> = new Map();
  private gestureHistory: HandGesture[] = [];
  private maxHistoryLength: number = 50;

  constructor() {
    this.initializeGesturePatterns();
  }

  private initializeGesturePatterns() {
    // Define common programming gestures
    const patterns = [
      {
        id: 'select_code',
        name: 'Select Code',
        sequence: [
          { type: 'point', hand: 'right', intensity: 0.8, duration: 0.5 }
        ],
        action: 'select',
        description: 'Point to select code block',
        confidence: 0.9
      },
      {
        id: 'move_code',
        name: 'Move Code',
        sequence: [
          { type: 'grab', hand: 'right', intensity: 0.7, duration: 0.3 },
          { type: 'point', hand: 'right', intensity: 0.6, duration: 0.5 }
        ],
        action: 'move',
        description: 'Grab and move code block',
        confidence: 0.85
      },
      {
        id: 'scale_code',
        name: 'Scale Code',
        sequence: [
          { type: 'pinch', hand: 'both', intensity: 0.8, duration: 0.4 }
        ],
        action: 'scale',
        description: 'Pinch to scale code block',
        confidence: 0.8
      },
      {
        id: 'rotate_code',
        name: 'Rotate Code',
        sequence: [
          { type: 'circle', hand: 'right', intensity: 0.7, duration: 0.6 }
        ],
        action: 'rotate',
        description: 'Circle gesture to rotate code',
        confidence: 0.75
      },
      {
        id: 'create_code',
        name: 'Create Code',
        sequence: [
          { type: 'wave', hand: 'right', intensity: 0.6, duration: 0.3 }
        ],
        action: 'create',
        description: 'Wave to create new code block',
        confidence: 0.7
      },
      {
        id: 'delete_code',
        name: 'Delete Code',
        sequence: [
          { type: 'swipe', hand: 'right', intensity: 0.8, duration: 0.2 }
        ],
        action: 'delete',
        description: 'Swipe to delete code block',
        confidence: 0.8
      },
      {
        id: 'copy_code',
        name: 'Copy Code',
        sequence: [
          { type: 'pinch', hand: 'right', intensity: 0.7, duration: 0.3 },
          { type: 'point', hand: 'right', intensity: 0.6, duration: 0.2 }
        ],
        action: 'copy',
        description: 'Pinch and point to copy',
        confidence: 0.75
      },
      {
        id: 'paste_code',
        name: 'Paste Code',
        sequence: [
          { type: 'point', hand: 'right', intensity: 0.6, duration: 0.2 },
          { type: 'pinch', hand: 'right', intensity: 0.7, duration: 0.3 }
        ],
        action: 'paste',
        description: 'Point and pinch to paste',
        confidence: 0.75
      },
      {
        id: 'undo_action',
        name: 'Undo Action',
        sequence: [
          { type: 'circle', hand: 'left', intensity: 0.6, duration: 0.4 }
        ],
        action: 'undo',
        description: 'Left hand circle to undo',
        confidence: 0.7
      },
      {
        id: 'redo_action',
        name: 'Redo Action',
        sequence: [
          { type: 'circle', hand: 'right', intensity: 0.6, duration: 0.4 }
        ],
        action: 'redo',
        description: 'Right hand circle to redo',
        confidence: 0.7
      }
    ];

    patterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern as GesturePattern);
    });
  }

  async startTracking(): Promise<void> {
    this.isTracking = true;
    this.gestureHistory = [];
    console.log('Gesture tracking started');
  }

  async stopTracking(): Promise<void> {
    this.isTracking = false;
    console.log('Gesture tracking stopped');
  }

  async updateHandPosition(hand: 'left' | 'right', position: THREE.Vector3): Promise<void> {
    if (!this.isTracking) return;

    this.handPositions.set(hand, position.clone());
    
    // Analyze hand movement for gestures
    await this.analyzeHandMovement(hand, position);
  }

  private async analyzeHandMovement(hand: 'left' | 'right', position: THREE.Vector3): Promise<void> {
    const previousPosition = this.handPositions.get(hand);
    if (!previousPosition) return;

    const movement = position.clone().sub(previousPosition);
    const distance = movement.length();
    const velocity = distance / 0.016; // Assuming 60fps

    // Detect different gesture types based on movement patterns
    if (distance > 0.1) {
      // Significant movement detected
      if (velocity > 2.0) {
        // Fast movement - likely swipe
        await this.detectSwipeGesture(hand, position, movement);
      } else if (distance > 0.3) {
        // Large movement - likely wave
        await this.detectWaveGesture(hand, position, movement);
      } else {
        // Moderate movement - likely point
        await this.detectPointGesture(hand, position, movement);
      }
    } else {
      // Minimal movement - check for static gestures
      await this.detectStaticGesture(hand, position);
    }
  }

  private async detectSwipeGesture(hand: 'left' | 'right', position: THREE.Vector3, movement: THREE.Vector3): Promise<void> {
    const gesture: HandGesture = {
      id: `gesture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'swipe',
      hand,
      position: position.clone(),
      direction: movement.normalize(),
      intensity: Math.min(1.0, movement.length() / 0.5),
      confidence: 0.8,
      duration: 0.2,
      metadata: {
        velocity: movement.length() / 0.016,
        direction: movement.normalize().toArray()
      }
    };

    await this.processGesture(gesture);
  }

  private async detectWaveGesture(hand: 'left' | 'right', position: THREE.Vector3, movement: THREE.Vector3): Promise<void> {
    const gesture: HandGesture = {
      id: `gesture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'wave',
      hand,
      position: position.clone(),
      direction: movement.normalize(),
      intensity: Math.min(1.0, movement.length() / 0.3),
      confidence: 0.7,
      duration: 0.3,
      metadata: {
        amplitude: movement.length(),
        frequency: 1.0
      }
    };

    await this.processGesture(gesture);
  }

  private async detectPointGesture(hand: 'left' | 'right', position: THREE.Vector3, movement: THREE.Vector3): Promise<void> {
    const gesture: HandGesture = {
      id: `gesture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'point',
      hand,
      position: position.clone(),
      direction: movement.normalize(),
      intensity: Math.min(1.0, movement.length() / 0.2),
      confidence: 0.9,
      duration: 0.5,
      metadata: {
        target: this.findTargetAtPosition(position)
      }
    };

    await this.processGesture(gesture);
  }

  private async detectStaticGesture(hand: 'left' | 'right', position: THREE.Vector3): Promise<void> {
    // Check for pinch gesture (both hands close together)
    const otherHand = hand === 'left' ? 'right' : 'left';
    const otherPosition = this.handPositions.get(otherHand);
    
    if (otherPosition) {
      const distance = position.distanceTo(otherPosition);
      if (distance < 0.1) {
        // Hands are close - likely pinch
        const gesture: HandGesture = {
          id: `gesture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'pinch',
          hand: 'both',
          position: position.clone(),
          intensity: Math.max(0, 1.0 - distance / 0.1),
          confidence: 0.85,
          duration: 0.3,
          metadata: {
            distance,
            bothHands: true
          }
        };

        await this.processGesture(gesture);
        return;
      }
    }

    // Check for grab gesture (hand closed)
    const grabGesture: HandGesture = {
      id: `gesture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'grab',
      hand,
      position: position.clone(),
      intensity: 0.7,
      confidence: 0.6,
      duration: 0.3,
      metadata: {
        handClosed: true
      }
    };

    await this.processGesture(grabGesture);
  }

  private findTargetAtPosition(position: THREE.Vector3): string | null {
    // Simulate finding a target object at the given position
    // In a real implementation, this would raycast to find objects
    const targets = ['code_block_1', 'code_block_2', 'code_block_3'];
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
    return randomTarget;
  }

  private async processGesture(gesture: HandGesture): Promise<void> {
    // Add to gesture history
    this.gestureHistory.push(gesture);
    if (this.gestureHistory.length > this.maxHistoryLength) {
      this.gestureHistory.shift();
    }

    // Add to all gestures
    this.gestures.push(gesture);

    // Check for gesture patterns
    const command = await this.checkGesturePatterns(gesture);
    if (command) {
      this.commands.push(command);
      await this.executeCommand(command);
    }

    // Emit gesture event
    this.emitGestureEvent(gesture);
  }

  private async checkGesturePatterns(currentGesture: HandGesture): Promise<GestureCommand | null> {
    // Check if current gesture matches any known patterns
    for (const [patternId, pattern] of this.patterns) {
      const match = await this.matchGesturePattern(pattern, currentGesture);
      if (match) {
        const command: GestureCommand = {
          id: `command_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          gesture: currentGesture,
          action: pattern.action as any,
          target: currentGesture.metadata?.target,
          parameters: {
            patternId,
            confidence: pattern.confidence
          },
          timestamp: Date.now()
        };

        return command;
      }
    }

    return null;
  }

  private async matchGesturePattern(pattern: GesturePattern, gesture: HandGesture): Promise<boolean> {
    // Simple pattern matching - in a real implementation, this would be more sophisticated
    const patternGesture = pattern.sequence[0]; // For simplicity, check first gesture only
    
    return (
      patternGesture.type === gesture.type &&
      patternGesture.hand === gesture.hand &&
      gesture.confidence >= pattern.confidence
    );
  }

  private async executeCommand(command: GestureCommand): Promise<void> {
    console.log(`Executing command: ${command.action}`, command);
    
    // In a real implementation, this would trigger the appropriate action
    switch (command.action) {
      case 'select':
        await this.executeSelectCommand(command);
        break;
      case 'move':
        await this.executeMoveCommand(command);
        break;
      case 'scale':
        await this.executeScaleCommand(command);
        break;
      case 'rotate':
        await this.executeRotateCommand(command);
        break;
      case 'create':
        await this.executeCreateCommand(command);
        break;
      case 'delete':
        await this.executeDeleteCommand(command);
        break;
      case 'copy':
        await this.executeCopyCommand(command);
        break;
      case 'paste':
        await this.executePasteCommand(command);
        break;
      case 'undo':
        await this.executeUndoCommand(command);
        break;
      case 'redo':
        await this.executeRedoCommand(command);
        break;
    }
  }

  private async executeSelectCommand(command: GestureCommand): Promise<void> {
    if (command.target) {
      console.log(`Selected target: ${command.target}`);
      // Trigger selection event
      this.emitCommandEvent('select', { target: command.target });
    }
  }

  private async executeMoveCommand(command: GestureCommand): Promise<void> {
    if (command.target && command.gesture.direction) {
      console.log(`Moving target: ${command.target} in direction:`, command.gesture.direction);
      // Trigger move event
      this.emitCommandEvent('move', { 
        target: command.target, 
        direction: command.gesture.direction,
        intensity: command.gesture.intensity
      });
    }
  }

  private async executeScaleCommand(command: GestureCommand): Promise<void> {
    if (command.target) {
      const scaleFactor = command.gesture.intensity;
      console.log(`Scaling target: ${command.target} by factor: ${scaleFactor}`);
      // Trigger scale event
      this.emitCommandEvent('scale', { 
        target: command.target, 
        scaleFactor 
      });
    }
  }

  private async executeRotateCommand(command: GestureCommand): Promise<void> {
    if (command.target && command.gesture.direction) {
      console.log(`Rotating target: ${command.target}`);
      // Trigger rotate event
      this.emitCommandEvent('rotate', { 
        target: command.target, 
        direction: command.gesture.direction,
        intensity: command.gesture.intensity
      });
    }
  }

  private async executeCreateCommand(command: GestureCommand): Promise<void> {
    console.log('Creating new code block at position:', command.gesture.position);
    // Trigger create event
    this.emitCommandEvent('create', { 
      position: command.gesture.position,
      hand: command.gesture.hand
    });
  }

  private async executeDeleteCommand(command: GestureCommand): Promise<void> {
    if (command.target) {
      console.log(`Deleting target: ${command.target}`);
      // Trigger delete event
      this.emitCommandEvent('delete', { target: command.target });
    }
  }

  private async executeCopyCommand(command: GestureCommand): Promise<void> {
    if (command.target) {
      console.log(`Copying target: ${command.target}`);
      // Trigger copy event
      this.emitCommandEvent('copy', { target: command.target });
    }
  }

  private async executePasteCommand(command: GestureCommand): Promise<void> {
    console.log('Pasting at position:', command.gesture.position);
    // Trigger paste event
    this.emitCommandEvent('paste', { 
      position: command.gesture.position 
    });
  }

  private async executeUndoCommand(command: GestureCommand): Promise<void> {
    console.log('Undoing last action');
    // Trigger undo event
    this.emitCommandEvent('undo', {});
  }

  private async executeRedoCommand(command: GestureCommand): Promise<void> {
    console.log('Redoing last action');
    // Trigger redo event
    this.emitCommandEvent('redo', {});
  }

  private emitGestureEvent(gesture: HandGesture): void {
    // Emit gesture event for external listeners
    const event = new CustomEvent('gesture', { detail: gesture });
    window.dispatchEvent(event);
  }

  private emitCommandEvent(action: string, data: any): void {
    // Emit command event for external listeners
    const event = new CustomEvent('gestureCommand', { 
      detail: { action, data, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }

  async addCustomGesturePattern(pattern: GesturePattern): Promise<void> {
    this.patterns.set(pattern.id, pattern);
    console.log(`Added custom gesture pattern: ${pattern.name}`);
  }

  async removeGesturePattern(patternId: string): Promise<void> {
    this.patterns.delete(patternId);
    console.log(`Removed gesture pattern: ${patternId}`);
  }

  async getGestureHistory(): Promise<HandGesture[]> {
    return this.gestureHistory.slice();
  }

  async getCommands(): Promise<GestureCommand[]> {
    return this.commands.slice();
  }

  async getPatterns(): Promise<GesturePattern[]> {
    return Array.from(this.patterns.values());
  }

  async clearHistory(): Promise<void> {
    this.gestureHistory = [];
    this.commands = [];
    console.log('Gesture history cleared');
  }

  async getGestureStatistics(): Promise<{
    totalGestures: number;
    gesturesByType: Record<string, number>;
    gesturesByHand: Record<string, number>;
    averageConfidence: number;
    mostCommonGesture: string;
  }> {
    const gesturesByType: Record<string, number> = {};
    const gesturesByHand: Record<string, number> = {};
    let totalConfidence = 0;

    this.gestures.forEach(gesture => {
      gesturesByType[gesture.type] = (gesturesByType[gesture.type] || 0) + 1;
      gesturesByHand[gesture.hand] = (gesturesByHand[gesture.hand] || 0) + 1;
      totalConfidence += gesture.confidence;
    });

    const mostCommonGesture = Object.entries(gesturesByType)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';

    return {
      totalGestures: this.gestures.length,
      gesturesByType,
      gesturesByHand,
      averageConfidence: this.gestures.length > 0 ? totalConfidence / this.gestures.length : 0,
      mostCommonGesture
    };
  }

  async calibrateGestureRecognition(): Promise<void> {
    // Perform gesture recognition calibration
    console.log('Starting gesture recognition calibration...');
    
    // Simulate calibration process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Gesture recognition calibration completed');
  }

  async exportGestureData(): Promise<any> {
    return {
      gestures: this.gestures,
      commands: this.commands,
      patterns: Array.from(this.patterns.values()),
      statistics: await this.getGestureStatistics(),
      timestamp: new Date()
    };
  }

  isTrackingActive(): boolean {
    return this.isTracking;
  }

  getHandPositions(): Map<string, THREE.Vector3> {
    return new Map(this.handPositions);
  }
} 