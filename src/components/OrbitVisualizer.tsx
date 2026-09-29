import { useEffect, useRef } from "react";
import { Earth } from "../graphics/earth";
import { SceneManager } from "../scene/SceneManger";
import "./OrbitVisualizer.css";

export function OrbitVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const sceneManager = new SceneManager(canvas);

    const earth = new Earth();

    sceneManager.addComponent(earth);

    sceneManager.start();

    return () => {
      sceneManager.dispose();
    };
  }, []);

  return (
    <div className="OrbitVisualizer">
      <canvas ref={canvasRef} className="OrbitVisualizer-canvas" />
    </div>
  );
}
