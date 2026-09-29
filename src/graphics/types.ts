import * as THREE from "three";
import type { SimulationState } from "../simulation/types";

export interface VisualComponent {
  readonly object: THREE.Object3D;

  update(context: FrameContext): void;
  dispose(): void;
}

export interface FrameContext {
  delta: number;
  state: SimulationState;
}
