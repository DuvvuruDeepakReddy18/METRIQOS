import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Instrument } from '../../types/metrology';
import { Layers, RotateCcw, Eye, ZoomIn, ZoomOut, CheckCircle2, Info, Cpu, Activity } from 'lucide-react';

interface DigitalTwin3DProps {
  instrument: Instrument;
  liveReadingKg?: number;
  onPartClick?: (partKey: string, details: any) => void;
}

interface ComponentPartMeta {
  name: string;
  category: string;
  spec: string;
  status: string;
  details: string;
}

const PART_METADATA: Record<string, ComponentPartMeta> = {
  platform: {
    name: 'Stainless Steel Load Receptor Deck',
    category: 'Mechanical Load Receptor',
    spec: '800 × 800 mm Grade 304 Stainless Steel (5mm bevel)',
    status: 'OPTIMAL (Deflection < 0.02mm)',
    details: 'Pattern approved load plate distributing force uniformly across the 4 perimeter shear beam load points. Configuration ID: LR-8080-SS-042.',
  },
  loadcells: {
    name: '4-Point Shear Beam Load Cell Assembly',
    category: 'Force Transducer Matrix',
    spec: '4 × HBM HLCB1D1 100kg IP68 hermetically sealed cells',
    status: 'BALANCED (Summation error < 0.001%)',
    details: 'Combined output sensitivity 2.0 mV/V ± 0.1%. Dual bridge strain gauge configuration with integrated corner balancing potentiometer box.',
  },
  indicator: {
    name: 'Digital Metrology Indicator Terminal',
    category: 'Electronic Processing & Display',
    spec: 'OIML R76 Class III Approved 24-bit Sigma-Delta ADC',
    status: 'DIGITAL ACQUISITION ACTIVE',
    details: 'Internal resolution 1:1,000,000 counts. High-contrast transflective LCD with backlit metrology scale markings and legal audit memory lock.',
  },
  autoport: {
    name: 'AutoPort RS-232 Communication Interface',
    category: 'Physical Telemetry Channel',
    spec: 'Opto-isolated RS-232 DB9 @ 9600 Baud, 8-N-1 Continuous Stream',
    status: 'RX STREAM CONNECTED',
    details: 'Hardware-verified hardware loopback with zero-tamper packet serialization for METRIQOS direct acquisition layer.',
  },
  environment: {
    name: 'Ambient Micro-Environment Sensor Node',
    category: 'Context Monitoring',
    spec: 'Integrated PT100 4-wire RTD + Capacitive RH sensor',
    status: 'LOCKED (20.4°C / 51.2% RH)',
    details: 'Provides continuous environmental telemetry to ensure test conditions satisfy OIML R76 Clause A.5.3 ambient stability thresholds.',
  },
  baseframe: {
    name: 'Structural Rigid Chassis & Leveling Feet',
    category: 'Support Structure',
    spec: 'Tubular cold-rolled steel with self-aligning elastomer feet',
    status: 'LEVEL VERIFIED (Spirit bubble centered)',
    details: 'Damps ambient high-frequency vibration and provides rigid anchoring for mechanical force transfer to the ground plane.',
  },
};

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({
  instrument,
  liveReadingKg = 100.012,
  onPartClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [selectedPartKey, setSelectedPartKey] = useState<string>('indicator');
  const [autoRotate, setAutoRotate] = useState(false);

  // References for Three.js animations
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const partsGroupRef = useRef<{
    platform?: THREE.Mesh;
    loadcells?: THREE.Group;
    indicator?: THREE.Group;
    autoport?: THREE.Mesh;
    environment?: THREE.Mesh;
    baseframe?: THREE.Group;
  }>({});
  const isExplodedRef = useRef(false);
  isExplodedRef.current = isExploded;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x07111f);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(2.8, 2.2, 3.2);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x19c7c8, 1.4);
    dirLight.position.set(4, 6, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const blueLight = new THREE.DirectionalLight(0x5b8cff, 1.0);
    blueLight.position.set(-4, 3, -3);
    scene.add(blueLight);

    // Technical Blueprint Grid Floor
    const gridHelper = new THREE.GridHelper(6, 24, 0x19c7c8, 0x26384d);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Materials
    const steelBaseMat = new THREE.MeshStandardMaterial({
      color: 0x142438,
      metalness: 0.8,
      roughness: 0.3,
    });

    const platformPlateMat = new THREE.MeshStandardMaterial({
      color: 0x3d546f,
      metalness: 0.9,
      roughness: 0.2,
    });

    const loadCellMat = new THREE.MeshStandardMaterial({
      color: 0xf4b740, // Amber/Gold load cell transducer alloy
      metalness: 0.85,
      roughness: 0.25,
    });

    const indicatorHousingMat = new THREE.MeshStandardMaterial({
      color: 0x101d2d,
      metalness: 0.6,
      roughness: 0.4,
    });

    const lcdScreenMat = new THREE.MeshBasicMaterial({
      color: 0x052e2b, // Dark digital LCD bezel
    });

    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x19c7c8,
    });

    const portMat = new THREE.MeshStandardMaterial({
      color: 0x5b8cff,
      metalness: 0.9,
      roughness: 0.2,
    });

    // 1. BASE FRAME
    const baseGroup = new THREE.Group();
    (baseGroup as any).partKey = 'baseframe';

    const baseChassisGeo = new THREE.BoxGeometry(1.6, 0.08, 1.6);
    const baseChassis = new THREE.Mesh(baseChassisGeo, steelBaseMat);
    baseChassis.position.y = 0.04;
    baseChassis.castShadow = true;
    baseChassis.receiveShadow = true;
    baseGroup.add(baseChassis);

    // 4 Leveling feet
    const footGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.06, 16);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5 });
    const footPositions = [
      [-0.7, -0.01, -0.7],
      [0.7, -0.01, -0.7],
      [-0.7, -0.01, 0.7],
      [0.7, -0.01, 0.7],
    ];
    footPositions.forEach(([x, y, z]) => {
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(x, y, z);
      baseGroup.add(foot);
    });
    scene.add(baseGroup);

    // 2. LOAD CELLS (4 Shear beams)
    const loadCellsGroup = new THREE.Group();
    (loadCellsGroup as any).partKey = 'loadcells';

    const cellGeo = new THREE.BoxGeometry(0.18, 0.08, 0.1);
    const cellPositions = [
      [-0.55, 0.12, -0.55],
      [0.55, 0.12, -0.55],
      [-0.55, 0.12, 0.55],
      [0.55, 0.12, 0.55],
    ];
    cellPositions.forEach(([x, y, z]) => {
      const cell = new THREE.Mesh(cellGeo, loadCellMat);
      cell.position.set(x, y, z);
      cell.castShadow = true;
      loadCellsGroup.add(cell);

      // Small wire junction
      const wireGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.2);
      const wire = new THREE.Mesh(wireGeo, cyanGlowMat);
      wire.rotation.z = Math.PI / 2;
      wire.position.set(x * 0.8, y, z * 0.8);
      loadCellsGroup.add(wire);
    });
    scene.add(loadCellsGroup);

    // 3. WEIGHING PLATFORM (Top receptor deck)
    const platformGeo = new THREE.BoxGeometry(1.65, 0.05, 1.65);
    const platformMesh = new THREE.Mesh(platformGeo, platformPlateMat);
    (platformMesh as any).partKey = 'platform';
    platformMesh.position.y = 0.2;
    platformMesh.castShadow = true;
    platformMesh.receiveShadow = true;
    scene.add(platformMesh);

    // Add stainless cross markings on platform
    const markGeo = new THREE.PlaneGeometry(1.4, 0.01);
    const markMat = new THREE.MeshBasicMaterial({ color: 0x19c7c8, opacity: 0.6, transparent: true });
    const markX = new THREE.Mesh(markGeo, markMat);
    markX.rotation.x = -Math.PI / 2;
    markX.position.set(0, 0.23, 0);
    scene.add(markX);

    // 4. INDICATOR PILLAR & HEAD
    const indicatorGroup = new THREE.Group();
    (indicatorGroup as any).partKey = 'indicator';

    // Stainless steel mounting column
    const columnGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1, 16);
    const columnMesh = new THREE.Mesh(columnGeo, steelBaseMat);
    columnMesh.position.set(-0.75, 0.55, -0.75);
    indicatorGroup.add(columnMesh);

    // Indicator head box
    const headGeo = new THREE.BoxGeometry(0.42, 0.26, 0.12);
    const headMesh = new THREE.Mesh(headGeo, indicatorHousingMat);
    headMesh.position.set(-0.75, 1.15, -0.75);
    headMesh.rotation.y = Math.PI / 4;
    headMesh.castShadow = true;
    indicatorGroup.add(headMesh);

    // Indicator LCD Bezel
    const screenGeo = new THREE.PlaneGeometry(0.32, 0.14);
    const screenMesh = new THREE.Mesh(screenGeo, lcdScreenMat);
    screenMesh.position.set(0, 0.02, 0.062);
    headMesh.add(screenMesh);

    // Indicator live glowing readout representation
    const textGlowGeo = new THREE.PlaneGeometry(0.24, 0.05);
    const textGlowMat = new THREE.MeshBasicMaterial({ color: 0x20c997 });
    const textGlowMesh = new THREE.Mesh(textGlowGeo, textGlowMat);
    textGlowMesh.position.set(0, 0.02, 0.064);
    headMesh.add(textGlowMesh);

    scene.add(indicatorGroup);

    // 5. AUTOPORT RS-232 CONNECTOR & MODULE
    const autoPortGeo = new THREE.BoxGeometry(0.12, 0.08, 0.08);
    const autoPortMesh = new THREE.Mesh(autoPortGeo, portMat);
    (autoPortMesh as any).partKey = 'autoport';
    autoPortMesh.position.set(-0.75, 0.95, -0.75);
    autoPortMesh.castShadow = true;
    scene.add(autoPortMesh);

    // Cable to base
    const cableGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.9);
    const cableMesh = new THREE.Mesh(cableGeo, cyanGlowMat);
    cableMesh.position.set(-0.73, 0.45, -0.73);
    scene.add(cableMesh);

    // 6. ENVIRONMENT SENSOR PROBE
    const envGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.18, 12);
    const envMat = new THREE.MeshStandardMaterial({ color: 0x19c7c8, metalness: 0.7 });
    const envMesh = new THREE.Mesh(envGeo, envMat);
    (envMesh as any).partKey = 'environment';
    envMesh.position.set(0.78, 0.25, -0.75);
    envMesh.castShadow = true;
    scene.add(envMesh);

    // Store references for exploded view animation
    partsGroupRef.current = {
      platform: platformMesh,
      loadcells: loadCellsGroup,
      indicator: indicatorGroup,
      autoport: autoPortMesh,
      environment: envMesh,
      baseframe: baseGroup,
    };

    // RAYCASTING FOR INTERACTION
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Find topmost object with partKey
        let cur: THREE.Object3D | null = intersects[0].object;
        let foundKey: string | null = null;
        while (cur && cur !== scene) {
          if ((cur as any).partKey) {
            foundKey = (cur as any).partKey;
            break;
          }
          cur = cur.parent;
        }

        if (foundKey && PART_METADATA[foundKey]) {
          setSelectedPartKey(foundKey);
          if (onPartClick) {
            onPartClick(foundKey, PART_METADATA[foundKey]);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // MOUSE ORBIT CONTROLS (Manual Smooth Arcball)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = Math.PI / 4;
    let sphericalPhi = Math.PI / 3;
    let cameraRadius = 4.2;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= deltaX * 0.007;
      sphericalPhi = Math.max(0.1, Math.min(Math.PI / 2.05, sphericalPhi - deltaY * 0.007));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraRadius = Math.max(2.0, Math.min(8.0, cameraRadius + e.deltaY * 0.003));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // ANIMATION LOOP
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto rotation if toggled
      if (autoRotate && !isDragging) {
        sphericalTheta += 0.004;
      }

      // Smooth camera position
      camera.position.x = cameraRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      camera.position.y = cameraRadius * Math.cos(sphericalPhi) + 0.3;
      camera.position.z = cameraRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
      camera.lookAt(0, 0.4, 0);

      // Exploded View target positions interpolation
      const exploded = isExplodedRef.current;
      const targetPlatformY = exploded ? 0.85 : 0.2;
      const targetLoadCellY = exploded ? 0.35 : 0.12;
      const targetIndicatorOffset = exploded ? -0.4 : 0;
      const targetAutoPortOffset = exploded ? -0.3 : 0;

      if (partsGroupRef.current.platform) {
        partsGroupRef.current.platform.position.y += (targetPlatformY - partsGroupRef.current.platform.position.y) * 0.1;
      }
      if (partsGroupRef.current.loadcells) {
        partsGroupRef.current.loadcells.position.y += (targetLoadCellY - partsGroupRef.current.loadcells.position.y) * 0.1;
      }
      if (partsGroupRef.current.indicator) {
        partsGroupRef.current.indicator.position.x += (targetIndicatorOffset - partsGroupRef.current.indicator.position.x) * 0.1;
      }
      if (partsGroupRef.current.autoport) {
        partsGroupRef.current.autoport.position.x += (targetAutoPortOffset - partsGroupRef.current.autoport.position.x) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [autoRotate]);

  const activeMeta = PART_METADATA[selectedPartKey] || PART_METADATA.indicator;

  return (
    <div className="relative w-full h-[540px] bg-[#07111F] rounded-xl border border-[#26384D] overflow-hidden flex flex-col shadow-2xl">
      {/* 3D Viewport Header */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-[#0B1726]/80 backdrop-blur-md border-b border-[#26384D] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#19C7C8] animate-pulse" />
          <div>
            <div className="text-xs font-mono tracking-wider text-[#19C7C8] uppercase">
              NAWI Digital Twin • {instrument.id}
            </div>
            <div className="text-sm font-semibold text-[#F4F7FA]">
              {instrument.name}
            </div>
          </div>
        </div>

        {/* Live LCD Telemetry readout pill */}
        <div className="flex items-center gap-2 bg-[#07111F] px-3 py-1.5 rounded-lg border border-[#26384D]">
          <Activity className="w-3.5 h-3.5 text-[#20C997]" />
          <span className="text-xs text-[#9AAABD] font-mono">LIVE RX:</span>
          <span className="text-sm font-mono font-bold text-[#20C997] tabular-nums">
            {liveReadingKg.toFixed(3)} {instrument.unit}
          </span>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive Controls Overlay Bar */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-[#0B1726]/90 backdrop-blur-md p-1.5 rounded-lg border border-[#26384D] shadow-lg">
        <button
          onClick={() => setIsExploded(!isExploded)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            isExploded
              ? 'bg-[#19C7C8] text-[#07111F] font-semibold'
              : 'text-[#9AAABD] hover:text-[#F4F7FA] hover:bg-[#142438]'
          }`}
          title="Toggle Exploded Assembly View"
        >
          <Layers className="w-3.5 h-3.5" />
          {isExploded ? 'Collapse Assembly' : 'Exploded View'}
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            autoRotate
              ? 'bg-[#5B8CFF] text-[#F4F7FA]'
              : 'text-[#9AAABD] hover:text-[#F4F7FA] hover:bg-[#142438]'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {autoRotate ? 'Rotating' : 'Auto Rotate'}
        </button>

        <div className="h-4 w-px bg-[#26384D] mx-1" />

        <div className="text-[11px] font-mono text-[#64748B] px-1 hidden sm:block">
          Click components to inspect
        </div>
      </div>

      {/* Part Metadata Inspector Overlay (Right Drawer) */}
      <div className="absolute top-16 right-4 z-10 w-80 bg-[#101D2D]/95 backdrop-blur-lg rounded-lg border border-[#26384D] p-3.5 shadow-2xl transition-all">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#26384D]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#19C7C8]" />
            <span className="text-xs font-mono font-semibold text-[#19C7C8] uppercase tracking-wide">
              Selected Subsystem
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#20C997]/10 text-[#20C997] border border-[#20C997]/30">
            {activeMeta.status}
          </span>
        </div>

        <h4 className="text-sm font-semibold text-[#F4F7FA] mb-1">
          {activeMeta.name}
        </h4>
        <div className="text-xs text-[#5B8CFF] font-mono mb-2">
          {activeMeta.category}
        </div>

        <div className="space-y-2 text-xs">
          <div className="bg-[#07111F]/70 p-2 rounded border border-[#26384D]/60">
            <div className="text-[10px] uppercase font-mono text-[#64748B] mb-0.5">Specification</div>
            <div className="text-[#F4F7FA] font-mono">{activeMeta.spec}</div>
          </div>

          <div className="text-[#9AAABD] leading-relaxed text-[11px]">
            {activeMeta.details}
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="mt-3 pt-2 border-t border-[#26384D] flex flex-wrap gap-1">
          {Object.keys(PART_METADATA).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedPartKey(key)}
              className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                selectedPartKey === key
                  ? 'bg-[#19C7C8]/20 text-[#19C7C8] border border-[#19C7C8]/50'
                  : 'bg-[#142438] text-[#9AAABD] hover:text-[#F4F7FA]'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
