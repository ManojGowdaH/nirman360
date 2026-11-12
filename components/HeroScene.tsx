"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, MathUtils, Vector3, ACESFilmicToneMapping } from "three";

const lookAt = new Vector3(1.7, 1.05, 0.2);
const desired = new Vector3();

function Box({
  position,
  size,
  color,
  rotation,
  roughness = 0.48,
  metalness = 0.32,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  roughness?: number;
  metalness?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.26, 0.26, 0.2, 18]} />
      <meshStandardMaterial color="#1c2024" roughness={0.85} metalness={0.08} />
    </mesh>
  );
}

function Backhoe() {
  const arm = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (arm.current) arm.current.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.06;
  });
  return (
    <group position={[0.15, 0, 1.35]} rotation={[0, 0.4, 0]}>
      <Box position={[-0.55, 0.26, 0.42]} size={[0.22, 0.52, 0.22]} color="#202428" roughness={0.8} metalness={0.15} />
      <Box position={[0.5, 0.26, 0.42]} size={[0.22, 0.52, 0.22]} color="#202428" roughness={0.8} metalness={0.15} />
      <Box position={[-0.55, 0.26, -0.42]} size={[0.22, 0.52, 0.22]} color="#202428" roughness={0.8} metalness={0.15} />
      <Box position={[0.5, 0.26, -0.42]} size={[0.22, 0.52, 0.22]} color="#202428" roughness={0.8} metalness={0.15} />
      <Box position={[0, 0.62, 0]} size={[1.7, 0.42, 0.95]} color="#f0b429" />
      <Box position={[-0.15, 1.05, 0]} size={[0.72, 0.58, 0.82]} color="#e2a31a" />
      <Box position={[-0.15, 1.1, 0.42]} size={[0.46, 0.28, 0.04]} color="#b7e4f2" metalness={0.55} roughness={0.18} />
      <Box position={[0.95, 0.72, 0]} size={[0.7, 0.12, 0.12]} color="#d89a16" />
      <Box position={[1.35, 0.5, 0]} size={[0.42, 0.28, 0.7]} color="#3a4046" roughness={0.6} />
      <group ref={arm} position={[-0.85, 0.78, 0]}>
        <Box position={[-0.45, -0.15, 0]} size={[0.8, 0.12, 0.12]} color="#f0b429" rotation={[0, 0, 0.7]} />
        <Box position={[-0.95, -0.55, 0]} size={[0.55, 0.1, 0.1]} color="#c98412" rotation={[0, 0, -0.5]} />
        <Box position={[-1.15, -0.82, 0]} size={[0.34, 0.24, 0.42]} color="#2f3439" roughness={0.55} />
      </group>
    </group>
  );
}

function Excavator() {
  const boom = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (boom.current) boom.current.rotation.z = -0.15 + Math.sin(clock.elapsedTime * 0.35 + 1) * 0.07;
  });
  return (
    <group position={[2.35, 0, 0.15]} rotation={[0, -0.55, 0]}>
      <Box position={[0, 0.22, 0.38]} size={[1.25, 0.28, 0.32]} color="#2a2f34" roughness={0.75} metalness={0.2} />
      <Box position={[0, 0.22, -0.38]} size={[1.25, 0.28, 0.32]} color="#2a2f34" roughness={0.75} metalness={0.2} />
      <Box position={[0, 0.55, 0]} size={[1.45, 0.38, 1.05]} color="#ff6b24" />
      <Box position={[-0.15, 1.02, 0]} size={[0.78, 0.55, 0.78]} color="#e85d1b" />
      <Box position={[-0.15, 1.08, 0.4]} size={[0.5, 0.28, 0.04]} color="#c5e8f2" metalness={0.5} roughness={0.16} />
      <group ref={boom} position={[0.55, 0.9, 0]}>
        <Box position={[0.55, 0.28, 0]} size={[1.05, 0.14, 0.16]} color="#ff6b24" rotation={[0, 0, 0.45]} />
        <Box position={[1.15, -0.05, 0]} size={[0.7, 0.12, 0.14]} color="#d45316" rotation={[0, 0, -0.35]} />
        <Box position={[1.48, -0.32, 0]} size={[0.38, 0.26, 0.46]} color="#30363b" roughness={0.58} />
      </group>
    </group>
  );
}

function DumpTruck() {
  return (
    <group position={[1.15, 0, 2.55]} rotation={[0, -0.35, 0]}>
      <Box position={[0.15, 0.38, 0]} size={[2.5, 0.28, 1]} color="#3a4147" roughness={0.62} />
      <Box position={[-0.85, 0.78, 0]} size={[0.78, 0.62, 0.92]} color="#f28a45" />
      <Box position={[-0.95, 0.84, 0.47]} size={[0.4, 0.26, 0.04]} color="#d5f1f8" metalness={0.45} roughness={0.15} />
      <Box position={[0.55, 0.92, 0]} size={[1.45, 0.62, 0.98]} color="#c4551a" />
      {[-0.75, 0.45, 0.9].map((x) => (
        <group key={x}>
          <Wheel position={[x, 0.28, 0.52]} />
          <Wheel position={[x, 0.28, -0.52]} />
        </group>
      ))}
    </group>
  );
}

function Crane() {
  const jib = useRef<Group>(null);
  useFrame((_, delta) => {
    if (jib.current) jib.current.rotation.y += delta * 0.15;
  });
  return (
    <group position={[4.3, 0, -1.8]}>
      <Box position={[0, 2.2, 0]} size={[0.28, 4.4, 0.28]} color="#d5dde3" metalness={0.62} roughness={0.32} />
      <Box position={[0.18, 2.2, 0]} size={[0.08, 4.4, 0.08]} color="#ff6b24" />
      <group ref={jib} position={[0, 4.45, 0]}>
        <Box position={[1.55, 0, 0]} size={[3.3, 0.1, 0.12]} color="#e7eef3" metalness={0.55} roughness={0.3} />
        <Box position={[-0.75, 0.02, 0]} size={[1.3, 0.08, 0.08]} color="#c5ced6" metalness={0.5} />
        <Box position={[2.5, -0.7, 0]} size={[0.025, 1.4, 0.025]} color="#22282c" roughness={0.4} metalness={0.2} />
        <Box position={[2.5, -1.45, 0]} size={[0.16, 0.16, 0.16]} color="#ff6b24" />
      </group>
    </group>
  );
}

function Building() {
  const columns = [-1.35, -0.45, 0.45, 1.35];
  const depths = [-0.8, 0.8];
  return (
    <group position={[5.15, 0, 0.35]}>
      {[0.12, 1.05, 1.95, 2.85].map((y) => (
        <Box key={y} position={[0, y, 0]} size={[3.3, 0.14, 2.3]} color="#c9c3b8" roughness={0.9} metalness={0.04} />
      ))}
      {columns.flatMap((x) =>
        depths.map((z) => (
          <Box key={`${x}${z}`} position={[x, 1.5, z]} size={[0.18, 3.05, 0.18]} color="#b7b1a7" roughness={0.86} metalness={0.05} />
        )),
      )}
      {[-0.5, 0, 0.5].map((x) => (
        <mesh key={x} position={[x, 3.2, 0.2]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.7, 6]} />
          <meshStandardMaterial color="#8a5a42" roughness={0.55} metalness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function Materials() {
  return (
    <group position={[0.2, 0, -0.85]}>
      <Box position={[0, 0.28, 0]} size={[0.7, 0.5, 0.42]} color="#b5523a" roughness={0.92} metalness={0.02} />
      <Box position={[0.72, 0.18, 0.05]} size={[0.5, 0.32, 0.36]} color="#9c4633" roughness={0.92} metalness={0.02} />
      <mesh position={[-0.55, 0.22, 0.35]} castShadow receiveShadow>
        <coneGeometry args={[0.42, 0.46, 18]} />
        <meshStandardMaterial color="#c6a56d" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  const scroll = useRef(0);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const onScroll = () => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      scroll.current = MathUtils.clamp(-rect.top / (rect.height || 1), 0, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame(() => {
    desired.set(
      -0.8 + pointer.x * 0.4 + scroll.current * 1.2,
      3.15 - pointer.y * 0.18 + scroll.current * 1.5,
      8.6 - scroll.current * 0.4,
    );
    camera.position.lerp(desired, 0.05);
    camera.lookAt(lookAt);
  });

  return null;
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#14181c"]} />
      <fog attach="fog" args={["#14181c", 14, 28]} />
      <hemisphereLight args={["#f3d2b0", "#2a241f", 0.55]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[7, 11, 6]}
        intensity={2.4}
        color="#ffe0c2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={28}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-6, 4, -3]} intensity={0.35} color="#9eb4c6" />
      <pointLight position={[1.5, 1.4, 1.2]} intensity={0.6} distance={8} color="#ff6b24" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0, 0]} receiveShadow>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color="#2a2724" roughness={0.95} metalness={0.04} />
      </mesh>
      <Backhoe />
      <Excavator />
      <DumpTruck />
      <Crane />
      <Building />
      <Materials />
      <CameraRig />
    </>
  );
}

export default function HeroScene({ onFail }: { onFail: () => void }) {
  const [active, setActive] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && document.visibilityState === "visible"),
      { threshold: 0.08 },
    );
    observer.observe(node);
    const onVisibility = () => {
      const visible = document.visibilityState === "visible";
      setActive(visible && node.getBoundingClientRect().bottom > 0 && node.getBoundingClientRect().top < window.innerHeight);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [-0.8, 3.15, 8.6], fov: 32, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            onFail();
          });
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
