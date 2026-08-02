"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * PRNG déterministe (Mulberry32) pour garantir la pureté des fonctions de calcul.
 * Conforme aux règles de pureté React 19 (react-hooks/purity).
 */
function pseudoRandom(seed: number): number {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

interface ParticleSceneProps {
  count: number;
  isDark: boolean;
}

function ParticleScene({ count, isDark }: ParticleSceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  // Génération déterministe des positions
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] = (pseudoRandom(i * 3) - 0.5) * 18;
      arr[i3 + 1] = (pseudoRandom(i * 3 + 1) - 0.5) * 12;
      arr[i3 + 2] = (pseudoRandom(i * 3 + 2) - 0.5) * 10;
    }
    return arr;
  }, [count]);

  // Couleurs des particules déterministes
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const tint = pseudoRandom(i * 7 + 100);
      const isOrange = tint > 0.7;

      if (isOrange) {
        const brightness = isDark ? 0.85 + tint * 0.15 : 0.95;
        arr[i3] = 0.95 * brightness;
        arr[i3 + 1] = 0.43 * brightness;
        arr[i3 + 2] = 0.24 * brightness;
      } else {
        const brightness = isDark ? 0.5 + tint * 0.3 : 0.4 + tint * 0.3;
        arr[i3] = 0.01 * brightness;
        arr[i3 + 1] = 0.19 * brightness;
        arr[i3 + 2] = 0.55 * brightness;
      }
    }
    return arr;
  }, [count, isDark]);

  // Suivi souris (parallaxe)
  useFrame((_state, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.008;

    const targetX = (mouseRef.current.x - 0.5) * 0.6;
    const targetY = (mouseRef.current.y - 0.5) * 0.4;
    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.04;
    pointsRef.current.position.y += (-targetY - pointsRef.current.position.y) * 0.04;
  });

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.x = (e.clientX - rect.left) / rect.width;
    mouseRef.current.y = (e.clientY - rect.top) / rect.height;
  };

  return (
    <points ref={pointsRef} onPointerMove={handlePointerMove}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ParticleField() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const count = useMemo(() => {
    if (typeof window === "undefined") return 800;
    const w = window.innerWidth;
    if (w < 640) return 350;
    if (w < 1024) return 600;
    return 900;
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ width: "100%", height: "100%" }}
      frameloop="always"
    >
      <ParticleScene count={count} isDark={isDark} />
    </Canvas>
  );
}
