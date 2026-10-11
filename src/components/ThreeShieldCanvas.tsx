import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeShieldCanvasProps {
  isAnalyzing?: boolean;
}

export const ThreeShieldCanvas: React.FC<ThreeShieldCanvasProps> = ({ isAnalyzing = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
    } catch {
      // Graceful fallback if WebGL is unavailable
      return;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x0f766e, 2.5); // Deep teal
    dirLight1.position.set(5, 8, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.5); // Soft cyan/sky
    dirLight2.position.set(-6, -4, 8);
    scene.add(dirLight2);

    // Group for the floating shield and its orbiting elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Create a 3D Shield Shape
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 3.2);
    shieldShape.bezierCurveTo(2.2, 3.2, 3.0, 2.2, 3.0, 0.5);
    shieldShape.bezierCurveTo(3.0, -1.8, 1.5, -3.2, 0, -4.2);
    shieldShape.bezierCurveTo(-1.5, -3.2, -3.0, -1.8, -3.0, 0.5);
    shieldShape.bezierCurveTo(-3.0, 2.2, -2.2, 3.2, 0, 3.2);

    const extrudeSettings = {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.2,
      bevelThickness: 0.2
    };

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeo.center();

    // Translucent glass teal material
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f766e,
      roughness: 0.25,
      transmission: 0.82, // Glass-like transparency
      thickness: 1.2,
      ior: 1.45,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.8,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1
    });

    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    mainGroup.add(shieldMesh);

    // Subtle inner glowing core / check emblem
    const coreGeo = new THREE.TorusGeometry(1.6, 0.08, 16, 64);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65
    });
    const coreRing = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreRing);

    // 2. Interconnected Verification Particles Network
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 70;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.015
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x5eead4,
      size: 0.16,
      transparent: true,
      opacity: 0.75
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Connecting Network Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x0f766e,
      transparent: true,
      opacity: 0.22
    });
    const lineGeo = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    // Mouse & Touch Parallax
    let targetRotX = 0;
    let targetRotY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;
      targetRotY = mouseX * 0.45;
      targetRotX = mouseY * 0.35;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = true;

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Smooth floating motion
      mainGroup.position.y = Math.sin(elapsed * 1.2) * 0.35;
      
      // Interpolate rotation toward mouse target
      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05 + 0.003;
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;

      coreRing.rotation.z = elapsed * 0.5;
      coreRing.rotation.x = Math.sin(elapsed * 0.7) * 0.2;

      // Pulse reaction when checking
      const pulseSpeed = isAnalyzing ? 6.0 : 1.0;
      const scaleMultiplier = isAnalyzing ? 1.0 + Math.sin(elapsed * pulseSpeed) * 0.06 : 1.0;
      mainGroup.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

      // Particle network animation
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      const linePositions: number[] = [];
      const maxDistance = 3.2;

      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += particleVelocities[i].x;
        posArr[i * 3 + 1] += particleVelocities[i].y;
        posArr[i * 3 + 2] += particleVelocities[i].z;

        // Bounce within boundaries
        if (Math.abs(posArr[i * 3]) > 8) particleVelocities[i].x *= -1;
        if (Math.abs(posArr[i * 3 + 1]) > 6) particleVelocities[i].y *= -1;
        if (Math.abs(posArr[i * 3 + 2]) > 5) particleVelocities[i].z *= -1;

        // Find neighbors for connection lines
        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArr[i * 3] - posArr[j * 3];
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            linePositions.push(
              posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2],
              posArr[j * 3], posArr[j * 3 + 1], posArr[j * 3 + 2]
            );
          }
        }
      }

      posAttr.needsUpdate = true;
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      shieldGeo.dispose();
      shieldMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, [isAnalyzing]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-85 dark:opacity-70 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
