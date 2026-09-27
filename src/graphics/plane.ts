import * as THREE from "three";

export function createEquatorialPlane(
  size: number,
  color: THREE.Color,
): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);

  const edgeGeometry = new THREE.EdgesGeometry(geometry);
  const edgeMaterial = new THREE.LineBasicMaterial({ color: color });
  const edge = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  plane.add(edge);

  // Add a grid of equally spaced lines
  const gridHelper = new THREE.GridHelper(size, size / 1, color, color);
  gridHelper.rotation.x = Math.PI / 2;
  plane.add(gridHelper);

  plane.rotation.x = Math.PI / 2;
  return plane;
}
