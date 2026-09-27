import * as THREE from "three";
// import { EciVector } from "./coordinates";

// Use cylinder geometry to create an axis centered at the origin

export function createAxis(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  color: THREE.Color,
): THREE.Mesh {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    length,
    32,
    1,
    false,
  );
  const material = new THREE.MeshBasicMaterial({ color: color });
  const axis = new THREE.Mesh(geometry, material);

  const midpoint = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5);
  axis.position.copy(midpoint);

  axis.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );

  return axis;
}
