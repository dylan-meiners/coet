import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createEarth } from "./earth";
import { disposeScene } from "./util";

export function OrbitVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Setup

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Scene

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    // Camera

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.01,
      1000,
    );

    camera.position.set(2.5, -3, 1.8);

    // Renderer

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    // Earth

    async function setupEarth() {
      const earth = await createEarth();
      scene.add(earth);
    }
    setupEarth();

    // Light

    const ambientLight = new THREE.AmbientLight("white", 0.2);
    scene.add(ambientLight);

    // Controls

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    // Animation loop

    let animationId: number;

    function animate() {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Resizing

    function resize() {
      if (!container) {
        return;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    }

    window.addEventListener("resize", resize);

    // Cleanup

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      controls.dispose();
      disposeScene(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
