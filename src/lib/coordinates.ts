import * as THREE from "three";

export function latLonToXYZ(
  latitudeDegrees: number,
  longitudeDegrees: number,
  radius: number = 1,
) {
  const latitudeRadians = THREE.MathUtils.degToRad(latitudeDegrees);
  const longitudeRadians = THREE.MathUtils.degToRad(longitudeDegrees);

  return new THREE.Vector3(
    radius * Math.cos(latitudeRadians) * Math.cos(longitudeRadians),
    radius * Math.cos(latitudeRadians) * Math.sin(longitudeRadians),
    radius * Math.sin(latitudeRadians),
  );
}
