import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Simulation } from "../simulation/Simulation";
import type { VisualComponent } from "../graphics/types";
import { disposeScene } from "../graphics/util";

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly controls: OrbitControls;
  readonly simulation: Simulation;
  private components: VisualComponent[];
  private animationFrameId: number | null;
  private previousTime: number | null;
  private running: boolean;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.components = [];
    this.animationFrameId = null;
    this.previousTime = null;
    this.running = false;

    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("black");

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.getAspectRatio(),
      0.01,
      1000,
    );

    const direction = new THREE.Vector3(1, 1, 1);
    direction.normalize();
    direction.multiplyScalar(4);
    this.camera.position.copy(direction);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    const ambientLight = new THREE.AmbientLight("white", 0.2);
    this.scene.add(ambientLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;

    this.simulation = new Simulation();

    this.resize();
    window.addEventListener("resize", this.handleResize);
  }

  addComponent(component: VisualComponent) {
    if (this.components.includes(component)) {
      return;
    }
    this.components.push(component);
    this.scene.add(component.object);
  }

  removeComponent(component: VisualComponent) {
    const index = this.components.indexOf(component);
    if (index === -1) {
      return;
    }

    this.components.splice(index, 1);
    this.scene.remove(component.object);
    component.dispose();
  }

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;

    this.previousTime = null;

    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  stop(): void {
    if (!this.running) {
      return;
    }

    this.running = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.previousTime = null;
  }

  private animate = (time: number) => {
    if (!this.running) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta =
      this.previousTime === null ? 0 : (time - this.previousTime) / 1000;
    this.previousTime = time;

    this.simulation.update(delta);

    const context = {
      delta: delta,
      state: this.simulation.getState(),
    };

    for (const component of this.components) {
      component.update(context);
    }

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  };

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private resize(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
  }

  private handleResize = () => {
    this.resize();
  };

  dispose(): void {
    this.stop();

    for (const component of this.components) {
      component.dispose();
    }

    window.removeEventListener("resize", this.handleResize);

    disposeScene(this.scene);

    this.controls.dispose();
    this.renderer.dispose();
    this.scene.clear();
  }
}
