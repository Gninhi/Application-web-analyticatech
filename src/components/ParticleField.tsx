"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ParticleField — champ de particules lumineuses.
 * - Thème sombre : particules blanches sur fond #011C40
 * - Thème clair : particules bleu foncé sur fond #f5f7fa
 * Rotation lente + parallaxe subtile pilotée par la souris.
 * Le nombre de particules s'adapte à la largeur d'écran (optimisation mobile).
 */

interface ParticleSceneProps {
  count: number;
  isDark: boolean;
}

function ParticleScene({ count, isDark }: ParticleSceneProps) {
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

  // Couleurs légèrement variables selon le thème
  // Sombre : blanc cassé → bleuté (0.85-1.0)
  // Clair : bleu foncé (0.1-0.25) pour contraste sur fond clair
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const tint = Math.random();
      if (isDark) {
        arr[i3] = 0.85 + tint * 0.15;     // R
        arr[i3 + 1] = 0.9 + tint * 0.1;   // G
        arr[i3 + 2] = 1.0;                // B
      } else {
        arr[i3] = 0.1 + tint * 0.1;       // R (bleu foncé)
        arr[i3 + 1] = 0.15 + tint * 0.1;  // G
        arr[i3 + 2] = 0.25 + tint * 0.1;  // B
      }
    }
    return arr;
  }, [count, isDark]);

  // Suivi souris (parallaxe)
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

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
  const [isDark, setIsDark] = useState(true);

  // Détecte le thème via la classe sur <html> (posée par next-themes)
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    // Observer les changements de classe sur <html>
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Nombre de particules adaptatif : moins sur mobile pour la perf Lighthouse
  const count = useMemo(() => {
    if (typeof window === "undefined") return 800;
    const w = window.innerWidth;
    if (w < 640) return 350;   // Réduit pour mobile (perf)
    if (w < 1024) return 600;
    return 900;                // Réduit pour desktop (était 1600)
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 1.5]}            // Cap DPR à 1.5 (était 1.8) — gain perf GPU
      gl={{
        antialias: false,        // Désactivé (particules = points, pas besoin)
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
