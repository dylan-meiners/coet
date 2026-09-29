import type { SimulationState } from "./types";

export class Simulation {
  private state: SimulationState;

  constructor() {
    this.state = {
      time: 0,
      timeScale: 1,
      paused: false,
      orbit: {
        a: 0,
        e: 0,
        i: 0,
        o: 0,
        w: 0,
        v: 0,
      },
      showEquatorialPlane: false,
      showOrbitalPlane: false,
      showAxes: false,
    };
  }

  getState() {
    return this.state;
  }

  setState(state: SimulationState) {
    this.state = state;
  }

  update(delta: number) {
    if (this.state.paused) {
      return;
    }

    const simulationDelta = delta * this.state.timeScale;

    this.state.time += simulationDelta;
  }
}
