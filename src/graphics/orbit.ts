import * as THREE from "three";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

export type COEs = {
  a: number;
  e: number;
  i: number;
  o: number;
  w: number;
  v: number;
};

export function createOrbit(coes: COEs, color: THREE.Color): THREE.Group {
  const group = new THREE.Group();

  const curve = new OrbitCurve(coes);
  const geometry = new THREE.TubeGeometry(curve, 256, 0.01, 8, true);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  const surface = (u: number, v: number, target: THREE.Vector3) => {
    const orbitEdge = curve.getPoint(u);
    target.lerpVectors(new THREE.Vector3(0, 0, 0), orbitEdge, v);
  };
  const surfaceGeometry = new ParametricGeometry(surface, 256, 16);
  const surfaceMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  const surfaceMesh = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  group.add(surfaceMesh);

  // Add lines from the origin to each point on curve
  const points = curve.getPoints(16);
  for (const point of points) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      point,
    ]);
    const line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: color }),
    );
    group.add(line);
  }

  return group;
}

class OrbitCurve extends THREE.Curve<THREE.Vector3> {
  private coes: COEs;

  constructor(coes: COEs) {
    super();
    this.coes = coes;
  }

  getPoint(t: number): THREE.Vector3 {
    const { a, e, i, o, w, v } = this.coes;
    const theta = 2 * Math.PI * t;
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
    const x =
      r *
      (Math.cos(o) * Math.cos(theta + w) -
        Math.sin(o) * Math.sin(theta + w) * Math.cos(i));
    const y =
      r *
      (Math.sin(o) * Math.cos(theta + w) +
        Math.cos(o) * Math.sin(theta + w) * Math.cos(i));
    const z = r * (Math.sin(theta + w) * Math.sin(i));
    return new THREE.Vector3(y, z, x);
  }
}
