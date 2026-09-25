import * as THREE from "three";
import { createCoastlines } from "./coastlines";

export async function createEarth(): Promise<THREE.Group> {
  const group = new THREE.Group();

  const earthGeometry = new THREE.SphereGeometry(1, 96, 96);
  const earthMaterial = new THREE.MeshStandardMaterial({
    color: "#303030",
  });

  const mesh = new THREE.Mesh(earthGeometry, earthMaterial);

  group.add(mesh);

  const coastlines = await createCoastlines();

  group.add(coastlines);

  return group;
}
