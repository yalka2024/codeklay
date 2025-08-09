import * as THREE from 'three';
import { WebXRManager } from 'three/examples/jsm/webxr/WebXRManager.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

// VR Development Environment
export interface VRCodeBlock {
  id: string;
  content: string;
  language: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  metadata?: Record<string, any>;
}

export interface VRGesture {
  type: 'select' | 'move' | 'scale' | 'rotate' | 'delete' | 'create';
  position: THREE.Vector3;
  direction?: THREE.Vector3;
  intensity?: number;
  hand: 'left' | 'right';
  timestamp: number;
}

export interface VRCodeStructure {
  id: string;
  name: string;
  blocks: VRCodeBlock[];
  connections: Array<{
    from: string;
    to: string;
    type: 'dependency' | 'import' | 'function_call';
  }>;
  position: THREE.Vector3;
  scale: THREE.Vector3;
}

export interface VRDevelopmentSession {
  id: string;
  userId: string;
  projectId: string;
  structures: VRCodeStructure[];
  gestures: VRGesture[];
  settings: {
    codeScale: number;
    gestureSensitivity: number;
    autoSave: boolean;
    collaboration: boolean;
  };
  createdAt: Date;
  lastModified: Date;
}

export class VRDevelopmentEnvironment {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private xrManager: WebXRManager;
  private controller1: THREE.Group;
  private controller2: THREE.Group;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  
  private codeBlocks: Map<string, VRCodeBlock> = new Map();
  private codeStructures: Map<string, VRCodeStructure> = new Map();
  private gestures: VRGesture[] = [];
  private isVRActive: boolean = false;
  private session: VRDevelopmentSession | null = null;

  constructor(container: HTMLElement) {
    this.initializeScene(container);
    this.initializeControllers();
    this.initializeEventListeners();
  }

  private initializeScene(container: HTMLElement) {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1.6, 3);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.xr.enabled = true;
    container.appendChild(this.renderer.domElement);

    // Initialize XR manager
    this.xrManager = new WebXRManager(this.renderer);
    this.xrManager.setReferenceSpaceType('local');

    // Add VR button
    const vrButton = VRButton.createButton(this.renderer);
    container.appendChild(vrButton);

    // Initialize raycaster for interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    this.scene.add(directionalLight);

    // Add grid for reference
    const gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(gridHelper);

    // Start render loop
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  private initializeControllers() {
    // Create controller groups
    this.controller1 = new THREE.Group();
    this.controller2 = new THREE.Group();

    // Add controller geometry
    const controllerGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    ]);

    const line = new THREE.Line(controllerGeometry);
    line.name = 'line';
    line.scale.z = 5;

    this.controller1.add(line.clone());
    this.controller2.add(line.clone());

    this.scene.add(this.controller1);
    this.scene.add(this.controller2);
  }

  private initializeEventListeners() {
    // Mouse events for non-VR interaction
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));

    // VR controller events
    this.renderer.xr.addEventListener('sessionstart', this.onSessionStart.bind(this));
    this.renderer.xr.addEventListener('sessionend', this.onSessionEnd.bind(this));

    // Window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  async createCodeBlock(content: string, language: string, position: THREE.Vector3): Promise<VRCodeBlock> {
    const id = `codeblock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create 3D text geometry for code
    const textGeometry = this.createTextGeometry(content, language);
    const material = this.getLanguageMaterial(language);
    const mesh = new THREE.Mesh(textGeometry, material);
    
    mesh.position.copy(position);
    mesh.userData = { id, type: 'codeblock', content, language };

    this.scene.add(mesh);

    const codeBlock: VRCodeBlock = {
      id,
      content,
      language,
      position: position.clone(),
      rotation: mesh.rotation.clone(),
      scale: mesh.scale.clone(),
      metadata: {
        createdAt: new Date(),
        lines: content.split('\n').length,
        characters: content.length
      }
    };

    this.codeBlocks.set(id, codeBlock);
    return codeBlock;
  }

  private createTextGeometry(text: string, language: string): THREE.BufferGeometry {
    // Create a simple plane geometry for text display
    // In a real implementation, this would use proper 3D text rendering
    const geometry = new THREE.PlaneGeometry(2, 1.5);
    
    // Create texture from text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 384;
    
    // Set text style
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = '16px monospace';
    context.textBaseline = 'top';
    
    // Split text into lines and draw
    const lines = text.split('\n');
    const maxLines = 20;
    const displayLines = lines.slice(0, maxLines);
    
    displayLines.forEach((line, index) => {
      context.fillText(line, 10, 10 + index * 18);
    });
    
    if (lines.length > maxLines) {
      context.fillText(`... and ${lines.length - maxLines} more lines`, 10, 10 + maxLines * 18);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    
    return geometry;
  }

  private getLanguageMaterial(language: string): THREE.Material {
    const colors: Record<string, number> = {
      'javascript': 0xf7df1e,
      'typescript': 0x3178c6,
      'python': 0x3776ab,
      'java': 0xed8b00,
      'cpp': 0x00599c,
      'csharp': 0x178600,
      'go': 0x00add8,
      'rust': 0xce422b,
      'php': 0x777bb4,
      'ruby': 0xcc342d,
      'swift': 0xf05138,
      'kotlin': 0x7f52ff,
      'scala': 0xdc322f,
      'r': 0x276dc3,
      'matlab': 0xe16737,
      'sql': 0xe48e00,
      'html': 0xe34f26,
      'css': 0x1572b6,
      'default': 0x666666
    };

    const color = colors[language.toLowerCase()] || colors.default;
    return new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
  }

  async createCodeStructure(name: string, blocks: VRCodeBlock[], position: THREE.Vector3): Promise<VRCodeStructure> {
    const id = `structure_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create container for the structure
    const container = new THREE.Group();
    container.position.copy(position);
    
    // Add blocks to the container
    blocks.forEach((block, index) => {
      const blockMesh = this.scene.children.find(child => 
        child.userData?.id === block.id
      );
      
      if (blockMesh) {
        container.add(blockMesh);
        blockMesh.position.set(index * 2.5, 0, 0);
      }
    });
    
    this.scene.add(container);

    const structure: VRCodeStructure = {
      id,
      name,
      blocks,
      connections: [],
      position: position.clone(),
      scale: new THREE.Vector3(1, 1, 1)
    };

    this.codeStructures.set(id, structure);
    return structure;
  }

  async handleGesture(gesture: VRGesture): Promise<void> {
    this.gestures.push(gesture);
    
    switch (gesture.type) {
      case 'select':
        await this.handleSelectGesture(gesture);
        break;
      case 'move':
        await this.handleMoveGesture(gesture);
        break;
      case 'scale':
        await this.handleScaleGesture(gesture);
        break;
      case 'rotate':
        await this.handleRotateGesture(gesture);
        break;
      case 'delete':
        await this.handleDeleteGesture(gesture);
        break;
      case 'create':
        await this.handleCreateGesture(gesture);
        break;
    }
  }

  private async handleSelectGesture(gesture: VRGesture): Promise<void> {
    // Raycast to find objects at gesture position
    const intersects = this.raycastAtPosition(gesture.position);
    
    if (intersects.length > 0) {
      const object = intersects[0].object;
      const codeBlock = this.codeBlocks.get(object.userData?.id);
      
      if (codeBlock) {
        // Highlight selected code block
        this.highlightCodeBlock(codeBlock.id);
        
        // Show code details in VR UI
        this.showCodeDetails(codeBlock);
      }
    }
  }

  private async handleMoveGesture(gesture: VRGesture): Promise<void> {
    // Move selected objects based on gesture
    const selectedObjects = this.getSelectedObjects();
    
    selectedObjects.forEach(object => {
      if (gesture.direction) {
        object.position.add(gesture.direction.multiplyScalar(0.1));
      }
    });
  }

  private async handleScaleGesture(gesture: VRGesture): Promise<void> {
    // Scale objects based on gesture intensity
    const selectedObjects = this.getSelectedObjects();
    const scaleFactor = gesture.intensity || 1;
    
    selectedObjects.forEach(object => {
      object.scale.multiplyScalar(scaleFactor);
    });
  }

  private async handleRotateGesture(gesture: VRGesture): Promise<void> {
    // Rotate objects based on gesture direction
    const selectedObjects = this.getSelectedObjects();
    
    selectedObjects.forEach(object => {
      if (gesture.direction) {
        object.rotation.x += gesture.direction.x * 0.1;
        object.rotation.y += gesture.direction.y * 0.1;
        object.rotation.z += gesture.direction.z * 0.1;
      }
    });
  }

  private async handleDeleteGesture(gesture: VRGesture): Promise<void> {
    // Delete objects at gesture position
    const intersects = this.raycastAtPosition(gesture.position);
    
    intersects.forEach(intersection => {
      const object = intersection.object;
      const codeBlock = this.codeBlocks.get(object.userData?.id);
      
      if (codeBlock) {
        this.deleteCodeBlock(codeBlock.id);
      }
    });
  }

  private async handleCreateGesture(gesture: VRGesture): Promise<void> {
    // Create new code block at gesture position
    const defaultCode = `// New code block
function example() {
  console.log("Hello, VR World!");
}`;
    
    await this.createCodeBlock(defaultCode, 'javascript', gesture.position);
  }

  private raycastAtPosition(position: THREE.Vector3): THREE.Intersection[] {
    // Convert 3D position to raycast
    const direction = new THREE.Vector3();
    direction.subVectors(position, this.camera.position).normalize();
    
    this.raycaster.set(this.camera.position, direction);
    return this.raycaster.intersectObjects(this.scene.children, true);
  }

  private getSelectedObjects(): THREE.Object3D[] {
    // Return currently selected objects
    return this.scene.children.filter(child => 
      child.userData?.selected === true
    );
  }

  private highlightCodeBlock(blockId: string): void {
    // Remove previous highlights
    this.scene.children.forEach(child => {
      if (child.material) {
        child.material.emissive = new THREE.Color(0x000000);
      }
    });
    
    // Highlight selected block
    const blockMesh = this.scene.children.find(child => 
      child.userData?.id === blockId
    );
    
    if (blockMesh && blockMesh.material) {
      blockMesh.material.emissive = new THREE.Color(0x444444);
      blockMesh.userData.selected = true;
    }
  }

  private showCodeDetails(codeBlock: VRCodeBlock): void {
    // Create floating UI panel with code details
    const panel = this.createCodeDetailsPanel(codeBlock);
    this.scene.add(panel);
  }

  private createCodeDetailsPanel(codeBlock: VRCodeBlock): THREE.Group {
    const panel = new THREE.Group();
    
    // Create panel geometry
    const panelGeometry = new THREE.PlaneGeometry(3, 2);
    const panelMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x333333, 
      transparent: true, 
      opacity: 0.9 
    });
    const panelMesh = new THREE.Mesh(panelGeometry, panelMaterial);
    
    // Position panel near the code block
    panelMesh.position.copy(codeBlock.position);
    panelMesh.position.z += 1;
    
    panel.add(panelMesh);
    return panel;
  }

  private deleteCodeBlock(blockId: string): void {
    // Remove from scene
    const blockMesh = this.scene.children.find(child => 
      child.userData?.id === blockId
    );
    
    if (blockMesh) {
      this.scene.remove(blockMesh);
    }
    
    // Remove from data structures
    this.codeBlocks.delete(blockId);
  }

  async startVRSession(userId: string, projectId: string): Promise<VRDevelopmentSession> {
    const session: VRDevelopmentSession = {
      id: `vr_session_${Date.now()}`,
      userId,
      projectId,
      structures: Array.from(this.codeStructures.values()),
      gestures: this.gestures,
      settings: {
        codeScale: 1.0,
        gestureSensitivity: 0.5,
        autoSave: true,
        collaboration: false
      },
      createdAt: new Date(),
      lastModified: new Date()
    };

    this.session = session;
    this.isVRActive = true;
    
    return session;
  }

  async endVRSession(): Promise<void> {
    if (this.session) {
      this.session.lastModified = new Date();
      this.session.gestures = this.gestures;
      this.session.structures = Array.from(this.codeStructures.values());
    }
    
    this.isVRActive = false;
  }

  async exportCodeStructure(structureId: string): Promise<string> {
    const structure = this.codeStructures.get(structureId);
    if (!structure) {
      throw new Error('Code structure not found');
    }

    // Combine all code blocks into a single file
    const codeBlocks = structure.blocks.sort((a, b) => 
      a.position.x - b.position.x
    );

    return codeBlocks.map(block => block.content).join('\n\n');
  }

  async importCodeStructure(code: string, language: string, position: THREE.Vector3): Promise<VRCodeStructure> {
    // Split code into logical blocks
    const codeBlocks = this.splitCodeIntoBlocks(code);
    
    // Create VR code blocks
    const vrBlocks: VRCodeBlock[] = [];
    for (let i = 0; i < codeBlocks.length; i++) {
      const block = await this.createCodeBlock(
        codeBlocks[i],
        language,
        new THREE.Vector3(position.x + i * 2.5, position.y, position.z)
      );
      vrBlocks.push(block);
    }

    // Create code structure
    return await this.createCodeStructure('Imported Code', vrBlocks, position);
  }

  private splitCodeIntoBlocks(code: string): string[] {
    // Simple splitting by functions/classes
    const blocks: string[] = [];
    const lines = code.split('\n');
    let currentBlock = '';
    
    for (const line of lines) {
      if (line.trim().startsWith('function ') || 
          line.trim().startsWith('class ') ||
          line.trim().startsWith('const ') ||
          line.trim().startsWith('let ') ||
          line.trim().startsWith('var ')) {
        if (currentBlock.trim()) {
          blocks.push(currentBlock.trim());
          currentBlock = '';
        }
      }
      currentBlock += line + '\n';
    }
    
    if (currentBlock.trim()) {
      blocks.push(currentBlock.trim());
    }
    
    return blocks.length > 0 ? blocks : [code];
  }

  // Event handlers
  private onSessionStart(): void {
    this.isVRActive = true;
    console.log('VR session started');
  }

  private onSessionEnd(): void {
    this.isVRActive = false;
    console.log('VR session ended');
  }

  private onMouseDown(event: MouseEvent): void {
    // Handle mouse selection in non-VR mode
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    
    if (intersects.length > 0) {
      const object = intersects[0].object;
      const codeBlock = this.codeBlocks.get(object.userData?.id);
      
      if (codeBlock) {
        this.highlightCodeBlock(codeBlock.id);
      }
    }
  }

  private onMouseMove(event: MouseEvent): void {
    // Handle mouse movement
  }

  private onMouseUp(event: MouseEvent): void {
    // Handle mouse release
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private render(): void {
    // Update controller positions in VR
    if (this.isVRActive) {
      const session = this.renderer.xr.getSession();
      if (session) {
        session.inputSources.forEach((inputSource: any) => {
          if (inputSource.handedness === 'left') {
            this.controller1.position.copy(inputSource.gripSpace.getTransformTo(this.renderer.xr.getReferenceSpace()).position);
          } else if (inputSource.handedness === 'right') {
            this.controller2.position.copy(inputSource.gripSpace.getTransformTo(this.renderer.xr.getReferenceSpace()).position);
          }
        });
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Public methods for external access
  getCodeBlocks(): VRCodeBlock[] {
    return Array.from(this.codeBlocks.values());
  }

  getCodeStructures(): VRCodeStructure[] {
    return Array.from(this.codeStructures.values());
  }

  getGestures(): VRGesture[] {
    return this.gestures;
  }

  isVRMode(): boolean {
    return this.isVRActive;
  }

  getSession(): VRDevelopmentSession | null {
    return this.session;
  }
} 