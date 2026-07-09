"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ParticleField — champ de particules blanches lumineuses sur fond #011C40.
 * Rotation lente + parallaxe subtile pilotée par la souris.
 * Le nombre de particules s'adapte à la largeur d'écran (optimisation mobile).
 */

interface ParticleSceneProps {
  count: number;
}

function ParticleScene({ count }: ParticleSceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size, gl } = useThree();

  // Génération des positions des particules (sphère écrasée pour un effet spatial)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribution dans un volume large
      arr[i3] = (Math.random() - 0.5) * 18;
      arr[i3 + 1] = (Math.random() - 0.5) * 12;
      arr[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  // Couleurs légèrement variables (blanc cassé -> bleuté)
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const tint = Math.random();
      arr[i3] = 0.85 + tint * 0.15;     // R
      arr[i3 + 1] = 0.9 + tint * 0.1;   // G
      arr[i3 + 2] = 1.0;                // B
    }
    return arr;
  }, [count]);

  // Suivi souris (parallaxe) + pause sur onglet inactif + reduced-motion
  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    // Pause sur onglet inactif (économise batterie/CPU)
    if (document.hidden) return;

    // Rotation lente continue
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.008;

    // Parallaxe doux vers la position souris
    const targetX = (mouseRef.current.x - 0.5) * 0.6;
    const targetY = (mouseRef.current.y - 0.5) * 0.4;
    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.04;
    pointsRef.current.position.y += (-targetY - pointsRef.current.position.y) * 0.04;
  });

  // Écouteur souris sur le canvas
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
  // Nombre de particules adaptatif : moins sur mobile pour la perf
  const count = useMemo(() => {
    if (typeof window === "undefined") return 1200;
    const w = window.innerWidth;
    if (w < 640) return 600;
    if (w < 1024) return 1000;
    return 1600;
  }, []);

  // Respect de prefers-reduced-motion : pas de canvas 3D pour les utilisateurs
  // ayant demandé une réduction des animations (audit accessibilité).
  // setState différé dans rAF pour éviter le setState synchrone en effect.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  if (reducedMotion) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ParticleScene count={count} />
    </Canvas>
  );
}
