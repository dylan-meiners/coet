import * as THREE from "three";
import { latLonToXYZ } from "../lib/coordinates";

export async function createCoastlines(
  radius: number = 1.003,
): Promise<THREE.Group> {
  const response = await fetch("/data/ne_110m_coastline.json");
  if (!response.ok) {
    throw new Error(`Failed to fetch coastline data: ${response.status}`);
  }

  const geojson = await response.json();

  const group = new THREE.Group();
  group.name = "coastlines";

  const material = new THREE.LineBasicMaterial({
    color: "red",
  });

  for (const feature of geojson.features) {
    const geometry = feature.geometry;
    if (!geometry) {
      continue;
    }

    if (geometry.type === "LineString") {
      addLine(group, geometry.coordinates, material, radius);
    }

    if (geometry.type === "MultiLineString") {
      for (const coordinates of geometry.coordinates) {
        addLine(group, coordinates, material, radius);
      }
    }
  }

  return group;
}

function addLine(
  group: THREE.Group,
  coordinates: [number, number][],
  material: THREE.Material,
  radius: number,
) {
  const points = coordinates.map((coordinate) =>
    latLonToXYZ(coordinate[1], coordinate[0], radius),
  );
  if (points.length < 2) {
    return;
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(geometry, material);

  group.add(line);
}
