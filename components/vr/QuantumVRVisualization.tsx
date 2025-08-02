import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Hand, 
  Users, 
  Zap, 
  RotateCcw, 
  Play, 
  Pause,
  Maximize,
  Minimize,
  Share2,
  Settings
} from 'lucide-react';

// VR Scene Configuration
interface VRSceneConfig {
  width: number;
  height: number;
  backgroundColor: string;
  enableShadows: boolean;
  enablePostProcessing: boolean;
}

// Quantum State Visualization
interface QuantumState {
  id: string;
  name: string;
  qubits: number;
  amplitudes: number[];
  phases: number[];
  entanglement: number[][];
  position: THREE.Vector3;
  color: THREE.Color;
}

// Gesture Control Interface
interface GestureControl {
  type: 'grab' | 'point' | 'wave' | 'pinch' | 'rotate';
  position: THREE.Vector3;
  rotation: THREE.Euler;
  intensity: number;
  timestamp: Date;
}

// Multi-User Collaboration
interface VRUser {
  id: string;
  name: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  avatar: string;
  isActive: boolean;
  lastSeen: Date;
}

// Quantum VR Visualization Component
export default function QuantumVRVisualization() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  const [isVRMode, setIsVRMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quantumStates, setQuantumStates] = useState<QuantumState[]>([]);
  const [activeUsers, setActiveUsers] = useState<VRUser[]>([]);
  const [gestureControls, setGestureControls] = useState<GestureControl[]>([]);
  const [sceneConfig, setSceneConfig] = useState<VRSceneConfig>({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000011',
    enableShadows: true,
    enablePostProcessing: true
  });

  // Initialize VR scene
  useEffect(() => {
    if (mountRef.current) {
      initializeVRScene();
      setupGestureControls();
      setupMultiUserCollaboration();
      animate();
      
      return () => cleanup();
    }
  }, []);

  // Initialize VR scene
  const initializeVRScene = () => {
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneConfig.backgroundColor);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sceneConfig.width / sceneConfig.height,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sceneConfig.width, sceneConfig.height);
    renderer.shadowMap.enabled = sceneConfig.enableShadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.xr.enabled = true;
    rendererRef.current = renderer;

    // Add VR button
    mountRef.current!.appendChild(renderer.domElement);
    mountRef.current!.appendChild(VRButton.createButton(renderer));

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Add lighting
    setupLighting(scene);

    // Add quantum state visualizations
    createQuantumStateVisualizations(scene);

    // Add collaborative elements
    createCollaborativeElements(scene);
  };

  // Setup lighting
  const setupLighting = (scene: THREE.Scene) => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Point lights for quantum states
    const pointLight1 = new THREE.PointLight(0x00ff00, 1, 100);
    pointLight1.position.set(-5, 0, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff0000, 1, 100);
    pointLight2.position.set(5, 0, 0);
    scene.add(pointLight2);
  };

  // Create quantum state visualizations
  const createQuantumStateVisualizations = (scene: THREE.Scene) => {
    // Bell State visualization
    const bellState = createBellStateVisualization();
    scene.add(bellState);

    // Quantum Circuit visualization
    const quantumCircuit = createQuantumCircuitVisualization();
    scene.add(quantumCircuit);

    // Entanglement visualization
    const entanglement = createEntanglementVisualization();
    scene.add(entanglement);

    // Bloch Sphere visualization
    const blochSphere = createBlochSphereVisualization();
    scene.add(blochSphere);
  };

  // Create Bell State visualization
  const createBellStateVisualization = (): THREE.Group => {
    const group = new THREE.Group();

    // Create two qubits
    const qubit1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhongMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.8 
      })
    );
    qubit1.position.set(-2, 0, 0);
    qubit1.castShadow = true;
    group.add(qubit1);

    const qubit2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhongMaterial({ 
        color: 0xff0000, 
        transparent: true, 
        opacity: 0.8 
      })
    );
    qubit2.position.set(2, 0, 0);
    qubit2.castShadow = true;
    group.add(qubit2);

    // Create entanglement line
    const entanglementLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1.5, 0, 0),
        new THREE.Vector3(1.5, 0, 0)
      ]),
      new THREE.LineBasicMaterial({ 
        color: 0xffff00, 
        linewidth: 3 
      })
    );
    group.add(entanglementLine);

    // Add labels
    const label1 = createTextLabel('|0⟩', -2, 1, 0);
    group.add(label1);

    const label2 = createTextLabel('|1⟩', 2, 1, 0);
    group.add(label2);

    return group;
  };

  // Create quantum circuit visualization
  const createQuantumCircuitVisualization = (): THREE.Group => {
    const group = new THREE.Group();

    // Create circuit grid
    const gridGeometry = new THREE.PlaneGeometry(10, 6);
    const gridMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x333333, 
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -2;
    group.add(grid);

    // Create quantum gates
    const gates = [
      { type: 'H', position: new THREE.Vector3(-3, -1, 0) },
      { type: 'X', position: new THREE.Vector3(-1, -1, 0) },
      { type: 'CNOT', position: new THREE.Vector3(1, -1, 0) },
      { type: 'Z', position: new THREE.Vector3(3, -1, 0) }
    ];

    gates.forEach(gate => {
      const gateMesh = createQuantumGate(gate.type);
      gateMesh.position.copy(gate.position);
      group.add(gateMesh);
    });

    return group;
  };

  // Create quantum gate
  const createQuantumGate = (type: string): THREE.Mesh => {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    switch (type) {
      case 'H':
        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
        material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        break;
      case 'X':
        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
        material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        break;
      case 'CNOT':
        geometry = new THREE.BoxGeometry(0.8, 0.5, 0.1);
        material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        break;
      case 'Z':
        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
        material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
        break;
      default:
        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
        material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    }

    const gate = new THREE.Mesh(geometry, material);
    gate.castShadow = true;
    return gate;
  };

  // Create entanglement visualization
  const createEntanglementVisualization = (): THREE.Group => {
    const group = new THREE.Group();

    // Create multiple entangled qubits
    const numQubits = 4;
    const radius = 3;

    for (let i = 0; i < numQubits; i++) {
      const angle = (i / numQubits) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const qubit = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshPhongMaterial({ 
          color: new THREE.Color().setHSL(i / numQubits, 1, 0.5),
          transparent: true,
          opacity: 0.7
        })
      );
      qubit.position.set(x, 0, z);
      qubit.castShadow = true;
      group.add(qubit);

      // Connect to next qubit
      const nextAngle = ((i + 1) / numQubits) * Math.PI * 2;
      const nextX = Math.cos(nextAngle) * radius;
      const nextZ = Math.sin(nextAngle) * radius;

      const connection = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, 0, z),
          new THREE.Vector3(nextX, 0, nextZ)
        ]),
        new THREE.LineBasicMaterial({ 
          color: 0xffff00,
          transparent: true,
          opacity: 0.5
        })
      );
      group.add(connection);
    }

    return group;
  };

  // Create Bloch Sphere visualization
  const createBlochSphereVisualization = (): THREE.Group => {
    const group = new THREE.Group();

    // Create Bloch sphere
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x444444,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);

    // Create coordinate axes
    const axesHelper = new THREE.AxesHelper(3);
    group.add(axesHelper);

    // Create quantum state vector
    const stateVector = new THREE.ArrowHelper(
      new THREE.Vector3(1, 1, 1).normalize(),
      new THREE.Vector3(0, 0, 0),
      1.5,
      0xffff00
    );
    group.add(stateVector);

    group.position.set(0, 3, 0);
    return group;
  };

  // Create text label
  const createTextLabel = (text: string, x: number, y: number, z: number): THREE.Mesh => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = 'white';
    context.font = '24px Arial';
    context.fillText(text, 10, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(2, 0.5);
    const label = new THREE.Mesh(geometry, material);
    
    label.position.set(x, y, z);
    return label;
  };

  // Create collaborative elements
  const createCollaborativeElements = (scene: THREE.Scene) => {
    // Create shared workspace
    const workspace = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({ 
        color: 0x222222,
        transparent: true,
        opacity: 0.1
      })
    );
    workspace.rotation.x = -Math.PI / 2;
    workspace.position.y = -5;
    scene.add(workspace);

    // Create user avatars
    createUserAvatars(scene);
  };

  // Create user avatars
  const createUserAvatars = (scene: THREE.Scene) => {
    const mockUsers: VRUser[] = [
      {
        id: 'user1',
        name: 'Alice',
        position: new THREE.Vector3(-3, 0, -3),
        rotation: new THREE.Euler(0, 0, 0),
        avatar: '👩‍💻',
        isActive: true,
        lastSeen: new Date()
      },
      {
        id: 'user2',
        name: 'Bob',
        position: new THREE.Vector3(3, 0, -3),
        rotation: new THREE.Euler(0, Math.PI, 0),
        avatar: '👨‍💻',
        isActive: true,
        lastSeen: new Date()
      }
    ];

    setActiveUsers(mockUsers);

    mockUsers.forEach(user => {
      const avatar = createUserAvatar(user);
      scene.add(avatar);
    });
  };

  // Create user avatar
  const createUserAvatar = (user: VRUser): THREE.Group => {
    const group = new THREE.Group();

    // Create avatar body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
    );
    body.position.y = 0.75;
    group.add(body);

    // Create avatar head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshPhongMaterial({ color: 0xffdbac })
    );
    head.position.y = 1.5;
    group.add(head);

    // Create name label
    const nameLabel = createTextLabel(user.name, 0, 2, 0);
    group.add(nameLabel);

    group.position.copy(user.position);
    group.rotation.copy(user.rotation);

    return group;
  };

  // Setup gesture controls
  const setupGestureControls = () => {
    // Simulate gesture detection
    const gestures: GestureControl[] = [
      {
        type: 'grab',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0),
        intensity: 0.8,
        timestamp: new Date()
      },
      {
        type: 'point',
        position: new THREE.Vector3(1, 1, 1),
        rotation: new THREE.Euler(0, 0, 0),
        intensity: 0.6,
        timestamp: new Date()
      }
    ];

    setGestureControls(gestures);
  };

  // Setup multi-user collaboration
  const setupMultiUserCollaboration = () => {
    // Simulate WebSocket connection for real-time collaboration
    console.log('Setting up multi-user collaboration...');
  };

  // Handle gesture input
  const handleGesture = (gesture: GestureControl) => {
    console.log('Gesture detected:', gesture);
    
    switch (gesture.type) {
      case 'grab':
        handleGrabGesture(gesture);
        break;
      case 'point':
        handlePointGesture(gesture);
        break;
      case 'wave':
        handleWaveGesture(gesture);
        break;
      case 'pinch':
        handlePinchGesture(gesture);
        break;
      case 'rotate':
        handleRotateGesture(gesture);
        break;
    }
  };

  // Handle grab gesture
  const handleGrabGesture = (gesture: GestureControl) => {
    // Move quantum states
    if (sceneRef.current) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      // Simulate raycasting
      const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
      
      if (intersects.length > 0) {
        const object = intersects[0].object;
        object.position.copy(gesture.position);
      }
    }
  };

  // Handle point gesture
  const handlePointGesture = (gesture: GestureControl) => {
    // Select quantum states
    console.log('Pointing at:', gesture.position);
  };

  // Handle wave gesture
  const handleWaveGesture = (gesture: GestureControl) => {
    // Trigger animations
    if (sceneRef.current) {
      sceneRef.current.children.forEach(child => {
        if (child.type === 'Group') {
          child.rotation.y += 0.1;
        }
      });
    }
  };

  // Handle pinch gesture
  const handlePinchGesture = (gesture: GestureControl) => {
    // Scale quantum states
    console.log('Pinch gesture:', gesture.intensity);
  };

  // Handle rotate gesture
  const handleRotateGesture = (gesture: GestureControl) => {
    // Rotate quantum states
    if (sceneRef.current) {
      sceneRef.current.rotation.copy(gesture.rotation);
    }
  };

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    if (controlsRef.current) {
      controlsRef.current.update();
    }

    // Animate quantum states
    animateQuantumStates();

    // Animate user avatars
    animateUserAvatars();

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // Animate quantum states
  const animateQuantumStates = () => {
    if (sceneRef.current) {
      sceneRef.current.children.forEach(child => {
        if (child.type === 'Group') {
          child.rotation.y += 0.005;
        }
      });
    }
  };

  // Animate user avatars
  const animateUserAvatars = () => {
    // Simulate user movement
    setActiveUsers(prev => prev.map(user => ({
      ...user,
      position: user.position.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        0,
        (Math.random() - 0.5) * 0.01
      ))
    })));
  };

  // Cleanup
  const cleanup = () => {
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
  };

  // Toggle VR mode
  const toggleVRMode = () => {
    setIsVRMode(!isVRMode);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    if (mountRef.current) {
      if (!isFullscreen) {
        mountRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Share quantum state
  const shareQuantumState = () => {
    console.log('Sharing quantum state with collaborators...');
  };

  // Reset scene
  const resetScene = () => {
    if (sceneRef.current) {
      sceneRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quantum VR Visualization</h1>
          <p className="text-gray-600 mt-2">
            Immersive quantum computing visualization with gesture controls and collaboration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isVRMode ? "default" : "secondary"}>
            <Eye className="w-4 h-4 mr-2" />
            {isVRMode ? 'VR Active' : 'VR Ready'}
          </Badge>
          <Badge variant="outline">
            <Users className="w-4 h-4 mr-2" />
            {activeUsers.length} Users
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* VR Scene */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Quantum VR Scene</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={mountRef} 
                className={`w-full h-96 rounded-lg overflow-hidden ${
                  isFullscreen ? 'fixed inset-0 z-50' : ''
                }`}
              />
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VR Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={toggleVRMode}
                className="w-full"
                variant={isVRMode ? "default" : "outline"}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isVRMode ? 'Exit VR' : 'Enter VR'}
              </Button>

              <Button 
                onClick={toggleFullscreen}
                className="w-full"
                variant="outline"
              >
                {isFullscreen ? (
                  <>
                    <Minimize className="w-4 h-4 mr-2" />
                    Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize className="w-4 h-4 mr-2" />
                    Fullscreen
                  </>
                )}
              </Button>

              <Button 
                onClick={resetScene}
                className="w-full"
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Scene
              </Button>

              <Button 
                onClick={shareQuantumState}
                className="w-full"
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share State
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gesture Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Grab</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Point</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Wave</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pinch</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rotate</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{user.avatar}</span>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quantum States Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Quantum States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quantumStates.map(state => (
              <div key={state.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{state.name}</h3>
                <p className="text-sm text-gray-600">{state.qubits} qubits</p>
                <div className="mt-2">
                  <Badge variant="outline">{state.qubits}-qubit</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 