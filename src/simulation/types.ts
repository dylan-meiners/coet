export type COEs = {
  a: number;
  e: number;
  i: number;
  o: number;
  w: number;
  v: number;
};

export interface SimulationState {
  time: number;
  timeScale: number;
  paused: boolean;
  orbit: COEs;
  showEquatorialPlane: boolean;
  showOrbitalPlane: boolean;
  showAxes: boolean;
}
