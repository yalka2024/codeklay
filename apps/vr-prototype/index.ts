// apps/vr-prototype/index.ts
// Entry point for AR/VR coding environment prototype

import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js';

interface CodeNode {
  id: string;
  type: 'function' | 'class' | 'variable' | 'import' | 'comment';
  name: string;
  code: string;
  position: THREE.Vector3;
  connections: string[];
  color: THREE.Color;
}

interface VRCodeEnvironment {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controllers: THREE.Group[];
  codeNodes: Map<string, CodeNode>;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
}

class VRCodeVisualizer {
  private environment: VRCodeEnvironment;
  private isVRSupported: boolean = false;
  private currentSession: any = null;

  constructor() {
    this.environment = {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
      renderer: new THREE.WebGLRenderer({ antialias: true, alpha: true }),
      controllers: [],
      codeNodes: new Map(),
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2()
    };

    this.init();
  }

  private init(): void {
    this.setupRenderer();
    this.setupScene();
    this.setupLighting();
    this.setupControllers();
    this.setupEventListeners();
    this.checkVRSupport();
    this.animate();
  }

  private setupRenderer(): void {
    const { renderer } = this.environment;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.xr.enabled = true;
    
    document.body.appendChild(renderer.domElement);
  }

  private setupScene(): void {
    const { scene, camera } = this.environment;
    
    // Set up camera position
    camera.position.set(0, 1.6, 3);
    
    // Add background
    scene.background = new THREE.Color(0x000011);
    
    // Add fog for depth
    scene.fog = new THREE.Fog(0x000011, 10, 100);
    
    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x1a1a1a,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  private setupLighting(): void {
    const { scene } = this.environment;
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Point lights for code nodes
    const pointLight1 = new THREE.PointLight(0x00ff00, 0.5, 10);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x0000ff, 0.5, 10);
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);
  }

  private setupControllers(): void {
    const { renderer, scene } = this.environment;
    
    const controllerModelFactory = new XRControllerModelFactory();
    const handModelFactory = new XRHandModelFactory();
    
    // Controller 1
    const controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', this.onSelectStart.bind(this));
    controller1.addEventListener('selectend', this.onSelectEnd.bind(this));
    scene.add(controller1);
    
    const controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);
    
    // Controller 2
    const controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', this.onSelectStart.bind(this));
    controller2.addEventListener('selectend', this.onSelectEnd.bind(this));
    scene.add(controller2);
    
    const controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);
    
    this.environment.controllers = [controller1, controller2];
  }

  private setupEventListeners(): void {
    // Window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Mouse events for non-VR interaction
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('click', this.onMouseClick.bind(this));
    
    // VR session events
    this.environment.renderer.xr.addEventListener('sessionstart', this.onSessionStart.bind(this));
    this.environment.renderer.xr.addEventListener('sessionend', this.onSessionEnd.bind(this));
  }

  private checkVRSupport(): void {
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-vr').then((supported) => {
        this.isVRSupported = supported;
        if (supported) {
          this.addVRButton();
        } else {
          console.log('VR not supported, using desktop mode');
        }
      });
    } else {
      console.log('WebXR not supported');
    }
  }

  private addVRButton(): void {
    const button = document.createElement('button');
    button.textContent = 'ENTER VR';
    button.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      z-index: 1000;
    `;
    
    button.addEventListener('click', () => {
      this.environment.renderer.xr.getSession()?.end();
    });
    
    document.body.appendChild(button);
  }

  // Code visualization methods
  public visualizeCode(code: string, language: string): void {
    const codeNodes = this.parseCodeToNodes(code, language);
    this.createCodeNodeMeshes(codeNodes);
    this.createConnections(codeNodes);
  }

  private parseCodeToNodes(code: string, language: string): CodeNode[] {
    const nodes: CodeNode[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('//')) return;
      
      let node: CodeNode | null = null;
      
      // Parse different code elements
      if (trimmedLine.includes('function') || trimmedLine.includes('=>')) {
        node = this.createFunctionNode(trimmedLine, index);
      } else if (trimmedLine.includes('class')) {
        node = this.createClassNode(trimmedLine, index);
      } else if (trimmedLine.includes('const') || trimmedLine.includes('let') || trimmedLine.includes('var')) {
        node = this.createVariableNode(trimmedLine, index);
      } else if (trimmedLine.includes('import') || trimmedLine.includes('require')) {
        node = this.createImportNode(trimmedLine, index);
      }
      
      if (node) {
        nodes.push(node);
      }
    });
    
    return nodes;
  }

  private createFunctionNode(line: string, index: number): CodeNode {
    const nameMatch = line.match(/(?:function\s+)?(\w+)\s*\(/);
    const name = nameMatch ? nameMatch[1] : `function_${index}`;
    
    return {
      id: `func_${index}`,
      type: 'function',
      name,
      code: line,
      position: new THREE.Vector3(
        Math.sin(index * 0.5) * 3,
        index * 0.5,
        Math.cos(index * 0.5) * 3
      ),
      connections: [],
      color: new THREE.Color(0x00ff00)
    };
  }

  private createClassNode(line: string, index: number): CodeNode {
    const nameMatch = line.match(/class\s+(\w+)/);
    const name = nameMatch ? nameMatch[1] : `class_${index}`;
    
    return {
      id: `class_${index}`,
      type: 'class',
      name,
      code: line,
      position: new THREE.Vector3(
        Math.sin(index * 0.5) * 4,
        index * 0.5,
        Math.cos(index * 0.5) * 4
      ),
      connections: [],
      color: new THREE.Color(0x0000ff)
    };
  }

  private createVariableNode(line: string, index: number): CodeNode {
    const nameMatch = line.match(/(?:const|let|var)\s+(\w+)/);
    const name = nameMatch ? nameMatch[1] : `var_${index}`;
    
    return {
      id: `var_${index}`,
      type: 'variable',
      name,
      code: line,
      position: new THREE.Vector3(
        Math.sin(index * 0.5) * 2,
        index * 0.5,
        Math.cos(index * 0.5) * 2
      ),
      connections: [],
      color: new THREE.Color(0xffff00)
    };
  }

  private createImportNode(line: string, index: number): CodeNode {
    const nameMatch = line.match(/from\s+['"]([^'"]+)['"]/);
    const name = nameMatch ? nameMatch[1] : `import_${index}`;
    
    return {
      id: `import_${index}`,
      type: 'import',
      name,
      code: line,
      position: new THREE.Vector3(
        Math.sin(index * 0.5) * 5,
        index * 0.5,
        Math.cos(index * 0.5) * 5
      ),
      connections: [],
      color: new THREE.Color(0xff00ff)
    };
  }

  private createCodeNodeMeshes(nodes: CodeNode[]): void {
    const { scene } = this.environment;
    
    nodes.forEach(node => {
      // Create geometry based on node type
      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;
      
      switch (node.type) {
        case 'function':
          geometry = new THREE.SphereGeometry(0.3, 16, 16);
          break;
        case 'class':
          geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
          break;
        case 'variable':
          geometry = new THREE.ConeGeometry(0.2, 0.4, 8);
          break;
        case 'import':
          geometry = new THREE.TorusGeometry(0.2, 0.1, 8, 16);
          break;
        default:
          geometry = new THREE.SphereGeometry(0.2, 8, 8);
      }
      
      material = new THREE.MeshLambertMaterial({ 
        color: node.color,
        transparent: true,
        opacity: 0.8
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(node.position);
      mesh.castShadow = true;
      mesh.userData = { nodeId: node.id, nodeType: node.type, nodeName: node.name };
      
      // Add text label
      const textGeometry = new THREE.PlaneGeometry(1, 0.3);
      const textMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(0, 0.5, 0);
      textMesh.userData = { text: node.name };
      mesh.add(textMesh);
      
      scene.add(mesh);
      this.environment.codeNodes.set(node.id, node);
    });
  }

  private createConnections(nodes: CodeNode[]): void {
    const { scene } = this.environment;
    
    // Create connections between related nodes
    nodes.forEach(node => {
      nodes.forEach(otherNode => {
        if (node.id !== otherNode.id && this.shouldConnect(node, otherNode)) {
          const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
            node.position,
            otherNode.position
          ]);
          
          const connectionMaterial = new THREE.LineBasicMaterial({ 
            color: 0x666666,
            transparent: true,
            opacity: 0.5
          });
          
          const connection = new THREE.Line(connectionGeometry, connectionMaterial);
          scene.add(connection);
        }
      });
    });
  }

  private shouldConnect(node1: CodeNode, node2: CodeNode): boolean {
    // Simple connection logic - can be enhanced
    return node1.type === node2.type || 
           (node1.type === 'function' && node2.type === 'class') ||
           (node1.type === 'variable' && node2.type === 'function');
  }

  // Event handlers
  private onSelectStart(event: any): void {
    const controller = event.target;
    const intersections = this.getIntersections(controller);
    
    if (intersections.length > 0) {
      const intersection = intersections[0];
      const mesh = intersection.object;
      
      if (mesh.userData.nodeId) {
        this.selectCodeNode(mesh.userData.nodeId);
      }
    }
  }

  private onSelectEnd(event: any): void {
    // Handle selection end
  }

  private onMouseMove(event: MouseEvent): void {
    this.environment.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.environment.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private onMouseClick(event: MouseEvent): void {
    this.environment.raycaster.setFromCamera(this.environment.mouse, this.environment.camera);
    const intersects = this.environment.raycaster.intersectObjects(this.environment.scene.children, true);
    
    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      if (mesh.userData.nodeId) {
        this.selectCodeNode(mesh.userData.nodeId);
      }
    }
  }

  private onWindowResize(): void {
    const { camera, renderer } = this.environment;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onSessionStart(): void {
    console.log('VR session started');
    this.currentSession = this.environment.renderer.xr.getSession();
  }

  private onSessionEnd(): void {
    console.log('VR session ended');
    this.currentSession = null;
  }

  private getIntersections(controller: THREE.Group): THREE.Intersection[] {
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    
    this.environment.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.environment.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    
    return this.environment.raycaster.intersectObjects(this.environment.scene.children, true);
  }

  private selectCodeNode(nodeId: string): void {
    const node = this.environment.codeNodes.get(nodeId);
    if (node) {
      console.log(`Selected ${node.type}: ${node.name}`);
      // TODO: Show code details in VR UI
      this.showCodeDetails(node);
    }
  }

  private showCodeDetails(node: CodeNode): void {
    // Create floating code panel
    const panelGeometry = new THREE.PlaneGeometry(2, 1.5);
    const panelMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      transparent: true,
      opacity: 0.9
    });
    
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.copy(node.position);
    panel.position.y += 1;
    panel.lookAt(this.environment.camera.position);
    
    this.environment.scene.add(panel);
    
    // Remove panel after 5 seconds
    setTimeout(() => {
      this.environment.scene.remove(panel);
    }, 5000);
  }

  private animate(): void {
    this.environment.renderer.setAnimationLoop(() => {
      this.update();
      this.environment.renderer.render(this.environment.scene, this.environment.camera);
    });
  }

  private update(): void {
    // Animate code nodes
    this.environment.codeNodes.forEach((node, id) => {
      const mesh = this.environment.scene.children.find(child => 
        child.userData.nodeId === id
      ) as THREE.Mesh;
      
      if (mesh) {
        mesh.rotation.y += 0.01;
        mesh.position.y += Math.sin(Date.now() * 0.001 + id.length) * 0.001;
      }
    });
  }

  // Public API
  public loadCodeFromFile(fileContent: string, language: string): void {
    this.visualizeCode(fileContent, language);
  }

  public clearVisualization(): void {
    const { scene } = this.environment;
    this.environment.codeNodes.clear();
    
    // Remove all code-related meshes
    const meshesToRemove = scene.children.filter(child => 
      child.userData.nodeId || child instanceof THREE.Line
    );
    
    meshesToRemove.forEach(mesh => scene.remove(mesh));
  }

  public enableCollaboration(): void {
    // TODO: Implement real-time collaboration features
    console.log('Collaboration mode enabled');
  }
}

// Initialize the VR code visualizer
export function startVRPrototype(): VRCodeVisualizer {
  const visualizer = new VRCodeVisualizer();
  
  // Example code visualization
  const exampleCode = `
function calculateSum(a, b) {
  return a + b;
}

class Calculator {
  constructor() {
    this.result = 0;
  }
  
  add(value) {
    this.result += value;
  }
}

const PI = 3.14159;
const calculator = new Calculator();
  `;
  
  visualizer.loadCodeFromFile(exampleCode, 'javascript');
  
  return visualizer;
}

// Export for use in other modules
export { VRCodeVisualizer, CodeNode }; 