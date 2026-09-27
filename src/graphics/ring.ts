import * as THREE from "three";

class EquatorialCircleCurve extends THREE.Curve<THREE.Vector3> {
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

    target.set(x, z, y);

    return target;
  }
}

export function createRing(
  radius: number,
  thickness: number,
  color: THREE.Color,
): THREE.Mesh {
  const path = new EquatorialCircleCurve(radius);
  const geometry = new THREE.TubeGeometry(path, 256, thickness, 8, true);
  const material = new THREE.MeshBasicMaterial({
    color: color,
  });
  const tube = new THREE.Mesh(geometry, material);
  return tube;
}
