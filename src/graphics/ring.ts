import * as THREE from "three";

export class CircleCurve extends THREE.Curve<THREE.Vector3> {
  private radius: number;

  constructor(radius: number) {
    super();
    this.radius = radius;
  }

  getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const angle = t * Math.PI * 2;
    const x = Math.cos(angle) * this.radius;
    const y = Math.sin(angle) * this.radius;
    const z = 0;

    target.set(x, y, z);

    return target;
  }
}

export function createRing(radius: number, thickness = 0.005): THREE.Mesh {
  const path = new CircleCurve(radius);
  const geometry = new THREE.TubeGeometry(path, 256, thickness, 8, true);
  const material = new THREE.MeshBasicMaterial({
    color: "white",
  });
  const tube = new THREE.Mesh(geometry, material);
  return tube;
}
