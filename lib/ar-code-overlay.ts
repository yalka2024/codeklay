import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

// AR Code Overlay System
export interface ARAnnotation {
  id: string;
  type: 'comment' | 'warning' | 'error' | 'suggestion' | 'highlight';
  content: string;
  position: THREE.Vector3;
  target?: string; // ID of the code element it refers to
  metadata?: Record<string, any>;
}

export interface ARCodeElement {
  id: string;
  type: 'function' | 'class' | 'variable' | 'import' | 'comment';
  name: string;
  content: string;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  annotations: ARAnnotation[];
  metadata?: Record<string, any>;
}

export interface ARSpatialInterface {
  id: string;
  name: string;
  elements: ARCodeElement[];
  layout: 'grid' | 'hierarchical' | 'flow' | 'spatial';
  position: THREE.Vector3;
  scale: THREE.Vector3;
  metadata?: Record<string, any>;
}

export class ARCodeOverlay {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private arSession: any;
  
  private codeElements: Map<string, ARCodeElement> = new Map();
  private annotations: Map<string, ARAnnotation> = new Map();
  private spatialInterfaces: Map<string, ARSpatialInterface> = new Map();
  
  private isARActive: boolean = false;
  private hitTestSource: any = null;
  private hitTestSourceRequested: boolean = false;

  constructor(container: HTMLElement) {
    this.initializeARScene(container);
    this.initializeEventListeners();
  }

  private initializeARScene(container: HTMLElement) {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent for AR

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 20);
    this.camera.position.set(0, 0, 0);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.xr.enabled = true;
    this.renderer.xr.setReferenceSpaceType('local');
    container.appendChild(this.renderer.domElement);

    // Add AR button
    const arButton = ARButton.createButton(this.renderer, {
      sessionInit: {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: container }
      }
    });
    container.appendChild(arButton);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 0);
    this.scene.add(directionalLight);

    // Start render loop
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  private initializeEventListeners() {
    // AR session events
    this.renderer.xr.addEventListener('sessionstart', this.onARSessionStart.bind(this));
    this.renderer.xr.addEventListener('sessionend', this.onARSessionEnd.bind(this));

    // Touch events for AR interaction
    this.renderer.domElement.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.renderer.domElement.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.renderer.domElement.addEventListener('touchend', this.onTouchEnd.bind(this));

    // Window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  async createCodeElement(
    type: ARCodeElement['type'],
    name: string,
    content: string,
    position: THREE.Vector3
  ): Promise<ARCodeElement> {
    const id = `code_element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create 3D representation of code element
    const mesh = this.createCodeElementMesh(type, name, content);
    mesh.position.copy(position);
    mesh.userData = { id, type: 'code_element' };

    this.scene.add(mesh);

    const codeElement: ARCodeElement = {
      id,
      type,
      name,
      content,
      position: position.clone(),
      scale: mesh.scale.clone(),
      annotations: [],
      metadata: {
        createdAt: new Date(),
        lines: content.split('\n').length,
        complexity: this.calculateComplexity(content)
      }
    };

    this.codeElements.set(id, codeElement);
    return codeElement;
  }

  private createCodeElementMesh(type: ARCodeElement['type'], name: string, content: string): THREE.Mesh {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    switch (type) {
      case 'function':
        geometry = new THREE.BoxGeometry(1, 0.5, 0.1);
        material = new THREE.MeshBasicMaterial({ color: 0x4CAF50, transparent: true, opacity: 0.8 });
        break;
      case 'class':
        geometry = new THREE.BoxGeometry(1.2, 0.8, 0.1);
        material = new THREE.MeshBasicMaterial({ color: 0x2196F3, transparent: true, opacity: 0.8 });
        break;
      case 'variable':
        geometry = new THREE.SphereGeometry(0.3, 8, 6);
        material = new THREE.MeshBasicMaterial({ color: 0xFF9800, transparent: true, opacity: 0.8 });
        break;
      case 'import':
        geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 8);
        material = new THREE.MeshBasicMaterial({ color: 0x9C27B0, transparent: true, opacity: 0.8 });
        break;
      case 'comment':
        geometry = new THREE.PlaneGeometry(1, 0.3);
        material = new THREE.MeshBasicMaterial({ color: 0x607D8B, transparent: true, opacity: 0.6 });
        break;
      default:
        geometry = new THREE.BoxGeometry(0.8, 0.4, 0.1);
        material = new THREE.MeshBasicMaterial({ color: 0x757575, transparent: true, opacity: 0.8 });
    }

    const mesh = new THREE.Mesh(geometry, material);
    
    // Add text label
    const textMesh = this.createTextMesh(name);
    textMesh.position.set(0, 0.6, 0);
    mesh.add(textMesh);

    return mesh;
  }

  private createTextMesh(text: string): THREE.Mesh {
    // Create simple text geometry
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(1, 0.25);
    
    return new THREE.Mesh(geometry, material);
  }

  private calculateComplexity(content: string): number {
    // Simple complexity calculation based on code metrics
    const lines = content.split('\n').length;
    const characters = content.length;
    const functions = (content.match(/function/g) || []).length;
    const classes = (content.match(/class/g) || []).length;
    const loops = (content.match(/for|while|forEach/g) || []).length;
    
    return Math.min(100, (lines * 0.1 + characters * 0.01 + functions * 10 + classes * 15 + loops * 5));
  }

  async createAnnotation(
    type: ARAnnotation['type'],
    content: string,
    position: THREE.Vector3,
    target?: string
  ): Promise<ARAnnotation> {
    const id = `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create 3D annotation
    const mesh = this.createAnnotationMesh(type, content);
    mesh.position.copy(position);
    mesh.userData = { id, type: 'annotation' };

    this.scene.add(mesh);

    const annotation: ARAnnotation = {
      id,
      type,
      content,
      position: position.clone(),
      target,
      metadata: {
        createdAt: new Date(),
        severity: this.getSeverityLevel(type)
      }
    };

    this.annotations.set(id, annotation);

    // Link to target code element if specified
    if (target) {
      const codeElement = this.codeElements.get(target);
      if (codeElement) {
        codeElement.annotations.push(annotation);
      }
    }

    return annotation;
  }

  private createAnnotationMesh(type: ARAnnotation['type'], content: string): THREE.Mesh {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;
    let color: number;

    switch (type) {
      case 'comment':
        geometry = new THREE.SphereGeometry(0.2, 8, 6);
        color = 0x2196F3;
        break;
      case 'warning':
        geometry = new THREE.ConeGeometry(0.2, 0.4, 8);
        color = 0xFF9800;
        break;
      case 'error':
        geometry = new THREE.OctahedronGeometry(0.2);
        color = 0xF44336;
        break;
      case 'suggestion':
        geometry = new THREE.TetrahedronGeometry(0.2);
        color = 0x4CAF50;
        break;
      case 'highlight':
        geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        color = 0xFFEB3B;
        break;
      default:
        geometry = new THREE.SphereGeometry(0.15, 8, 6);
        color = 0x9E9E9E;
    }

    material = new THREE.MeshBasicMaterial({ 
      color, 
      transparent: true, 
      opacity: 0.8 
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Add text label
    const textMesh = this.createTextMesh(content.substring(0, 20));
    textMesh.position.set(0, 0.4, 0);
    textMesh.scale.set(0.5, 0.5, 0.5);
    mesh.add(textMesh);

    return mesh;
  }

  private getSeverityLevel(type: ARAnnotation['type']): 'low' | 'medium' | 'high' {
    switch (type) {
      case 'error':
        return 'high';
      case 'warning':
        return 'medium';
      case 'suggestion':
      case 'highlight':
        return 'low';
      default:
        return 'low';
    }
  }

  async createSpatialInterface(
    name: string,
    layout: ARSpatialInterface['layout'],
    position: THREE.Vector3
  ): Promise<ARSpatialInterface> {
    const id = `interface_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create container for spatial interface
    const container = new THREE.Group();
    container.position.copy(position);
    
    // Add visual representation of the interface
    const interfaceMesh = this.createInterfaceMesh(layout);
    container.add(interfaceMesh);
    
    this.scene.add(container);

    const spatialInterface: ARSpatialInterface = {
      id,
      name,
      elements: [],
      layout,
      position: position.clone(),
      scale: container.scale.clone(),
      metadata: {
        createdAt: new Date(),
        elementCount: 0
      }
    };

    this.spatialInterfaces.set(id, spatialInterface);
    return spatialInterface;
  }

  private createInterfaceMesh(layout: ARSpatialInterface['layout']): THREE.Mesh {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    switch (layout) {
      case 'grid':
        geometry = new THREE.BoxGeometry(3, 2, 0.1);
        material = new THREE.MeshBasicMaterial({ 
          color: 0xE3F2FD, 
          transparent: true, 
          opacity: 0.3 
        });
        break;
      case 'hierarchical':
        geometry = new THREE.ConeGeometry(1.5, 2, 8);
        material = new THREE.MeshBasicMaterial({ 
          color: 0xF3E5F5, 
          transparent: true, 
          opacity: 0.3 
        });
        break;
      case 'flow':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 8);
        material = new THREE.MeshBasicMaterial({ 
          color: 0xE8F5E8, 
          transparent: true, 
          opacity: 0.3 
        });
        break;
      case 'spatial':
        geometry = new THREE.SphereGeometry(1.5, 16, 12);
        material = new THREE.MeshBasicMaterial({ 
          color: 0xFFF3E0, 
          transparent: true, 
          opacity: 0.3 
        });
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 1.5, 0.1);
        material = new THREE.MeshBasicMaterial({ 
          color: 0xF5F5F5, 
          transparent: true, 
          opacity: 0.3 
        });
    }

    return new THREE.Mesh(geometry, material);
  }

  async addElementToInterface(
    interfaceId: string,
    elementId: string,
    position?: THREE.Vector3
  ): Promise<void> {
    const spatialInterface = this.spatialInterfaces.get(interfaceId);
    const codeElement = this.codeElements.get(elementId);
    
    if (!spatialInterface || !codeElement) {
      throw new Error('Interface or element not found');
    }

    // Calculate position based on layout
    const elementPosition = position || this.calculateLayoutPosition(
      spatialInterface.layout,
      spatialInterface.elements.length,
      spatialInterface.position
    );

    // Move element to interface
    const elementMesh = this.scene.children.find(child => 
      child.userData?.id === elementId
    );
    
    if (elementMesh) {
      elementMesh.position.copy(elementPosition);
    }

    // Update code element position
    codeElement.position.copy(elementPosition);
    
    // Add to interface
    spatialInterface.elements.push(codeElement);
    spatialInterface.metadata!.elementCount = spatialInterface.elements.length;
  }

  private calculateLayoutPosition(
    layout: ARSpatialInterface['layout'],
    index: number,
    basePosition: THREE.Vector3
  ): THREE.Vector3 {
    const position = basePosition.clone();
    
    switch (layout) {
      case 'grid':
        const cols = 3;
        const row = Math.floor(index / cols);
        const col = index % cols;
        position.x += (col - 1) * 1.2;
        position.y += (1 - row) * 0.8;
        break;
      case 'hierarchical':
        const level = Math.floor(Math.log2(index + 1));
        const offset = index - Math.pow(2, level) + 1;
        position.y += (2 - level) * 0.5;
        position.x += (offset - Math.pow(2, level - 1)) * 0.8;
        break;
      case 'flow':
        position.x += index * 1.5;
        break;
      case 'spatial':
        const angle = (index / 8) * Math.PI * 2;
        const radius = 1.5;
        position.x += Math.cos(angle) * radius;
        position.z += Math.sin(angle) * radius;
        break;
    }
    
    return position;
  }

  async detectCodeInEnvironment(): Promise<ARCodeElement[]> {
    // Simulate AR code detection in real environment
    // In a real implementation, this would use computer vision
    const detectedElements: ARCodeElement[] = [];
    
    // Simulate detecting code elements at different positions
    const positions = [
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(0, 1, -1)
    ];
    
    const sampleCode = [
      { type: 'function' as const, name: 'calculateSum', content: 'function calculateSum(a, b) { return a + b; }' },
      { type: 'class' as const, name: 'User', content: 'class User { constructor(name) { this.name = name; } }' },
      { type: 'variable' as const, name: 'config', content: 'const config = { apiUrl: "https://api.example.com" };' },
      { type: 'import' as const, name: 'React', content: 'import React from "react";' }
    ];
    
    for (let i = 0; i < positions.length; i++) {
      const element = await this.createCodeElement(
        sampleCode[i].type,
        sampleCode[i].name,
        sampleCode[i].content,
        positions[i]
      );
      detectedElements.push(element);
    }
    
    return detectedElements;
  }

  async createRealWorldIntegration(codeElement: ARCodeElement, realWorldObject: any): Promise<void> {
    // Link code element to real-world object
    // This would integrate with computer vision APIs
    codeElement.metadata = {
      ...codeElement.metadata,
      realWorldObject: {
        type: realWorldObject.type,
        position: realWorldObject.position,
        confidence: realWorldObject.confidence
      }
    };
  }

  // Event handlers
  private onARSessionStart(): void {
    this.isARActive = true;
    console.log('AR session started');
    
    // Initialize hit testing
    this.initializeHitTesting();
  }

  private onARSessionEnd(): void {
    this.isARActive = false;
    console.log('AR session ended');
  }

  private async initializeHitTesting(): Promise<void> {
    if (this.hitTestSourceRequested) return;
    
    const session = this.renderer.xr.getSession();
    if (session) {
      try {
        this.hitTestSource = await session.requestHitTestSource({ space: this.renderer.xr.getReferenceSpace() });
        this.hitTestSourceRequested = true;
      } catch (error) {
        console.error('Failed to initialize hit testing:', error);
      }
    }
  }

  private onTouchStart(event: TouchEvent): void {
    if (!this.isARActive) return;
    
    // Handle touch interaction for AR
    const touch = event.touches[0];
    const position = new THREE.Vector3(
      (touch.clientX / window.innerWidth) * 2 - 1,
      -(touch.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    
    this.handleARInteraction(position);
  }

  private onTouchMove(event: TouchEvent): void {
    // Handle touch movement
  }

  private onTouchEnd(event: TouchEvent): void {
    // Handle touch end
  }

  private handleARInteraction(position: THREE.Vector3): void {
    // Convert screen position to world position
    this.raycaster.setFromCamera(position, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    
    if (intersects.length > 0) {
      const object = intersects[0].object;
      
      if (object.userData?.type === 'code_element') {
        // Show code details
        this.showCodeDetails(object.userData.id);
      } else if (object.userData?.type === 'annotation') {
        // Show annotation details
        this.showAnnotationDetails(object.userData.id);
      }
    } else {
      // Create new code element at hit point
      this.createCodeElementAtPosition(position);
    }
  }

  private showCodeDetails(elementId: string): void {
    const element = this.codeElements.get(elementId);
    if (element) {
      // Create floating UI with code details
      const ui = this.createCodeDetailsUI(element);
      this.scene.add(ui);
    }
  }

  private showAnnotationDetails(annotationId: string): void {
    const annotation = this.annotations.get(annotationId);
    if (annotation) {
      // Create floating UI with annotation details
      const ui = this.createAnnotationDetailsUI(annotation);
      this.scene.add(ui);
    }
  }

  private createCodeDetailsUI(element: ARCodeElement): THREE.Group {
    const group = new THREE.Group();
    
    // Create background panel
    const panelGeometry = new THREE.PlaneGeometry(2, 1.5);
    const panelMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x333333, 
      transparent: true, 
      opacity: 0.9 
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(0, 0, 0.1);
    group.add(panel);
    
    // Add text content
    const textMesh = this.createTextMesh(element.content.substring(0, 100));
    textMesh.position.set(0, 0, 0.2);
    group.add(textMesh);
    
    return group;
  }

  private createAnnotationDetailsUI(annotation: ARAnnotation): THREE.Group {
    const group = new THREE.Group();
    
    // Create background panel
    const panelGeometry = new THREE.PlaneGeometry(1.5, 1);
    const panelMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x666666, 
      transparent: true, 
      opacity: 0.9 
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(0, 0, 0.1);
    group.add(panel);
    
    // Add text content
    const textMesh = this.createTextMesh(annotation.content);
    textMesh.position.set(0, 0, 0.2);
    group.add(textMesh);
    
    return group;
  }

  private async createCodeElementAtPosition(position: THREE.Vector3): Promise<void> {
    // Create a new code element at the specified position
    const defaultCode = `// New code element
function newFunction() {
  console.log("Created in AR!");
}`;
    
    await this.createCodeElement('function', 'newFunction', defaultCode, position);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private render(): void {
    // Update AR session
    if (this.isARActive && this.hitTestSource) {
      const session = this.renderer.xr.getSession();
      if (session) {
        const frame = session.requestAnimationFrame((time: number, frame: any) => {
          // Handle hit testing
          if (this.hitTestSource) {
            const hitTestResults = frame.getHitTestResults(this.hitTestSource);
            if (hitTestResults.length > 0) {
              const hit = hitTestResults[0];
              const pose = hit.getPose(this.renderer.xr.getReferenceSpace());
              if (pose) {
                // Update AR content based on hit test
                this.updateARContent(pose.transform);
              }
            }
          }
        });
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private updateARContent(transform: any): void {
    // Update AR content based on real-world position
    // This would update the position of AR elements based on hit testing
  }

  // Public methods for external access
  getCodeElements(): ARCodeElement[] {
    return Array.from(this.codeElements.values());
  }

  getAnnotations(): ARAnnotation[] {
    return Array.from(this.annotations.values());
  }

  getSpatialInterfaces(): ARSpatialInterface[] {
    return Array.from(this.spatialInterfaces.values());
  }

  isARMode(): boolean {
    return this.isARActive;
  }

  async exportARScene(): Promise<any> {
    return {
      codeElements: this.getCodeElements(),
      annotations: this.getAnnotations(),
      spatialInterfaces: this.getSpatialInterfaces(),
      timestamp: new Date()
    };
  }
} 