import * as THREE from "three";
import { createCoastlines } from "./coastlines";
import { createRing } from "./ring";

export function createEarth(): Promise<THREE.Group> {
  const group = new THREE.Group();

  const earthGeometry = new THREE.SphereGeometry(1, 96, 96);

  const landMask = new THREE.TextureLoader().load("/land_mask.png");
  landMask.colorSpace = THREE.NoColorSpace;

  const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
      landMask: {
        value: landMask,
      },
      oceanColor: {
        value: new THREE.Color("#004f57"),
      },
      landColor: {
        value: new THREE.Color("#00e5ff"),
      },
    },

    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;

        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D landMask;
      uniform vec3 oceanColor;
      uniform vec3 landColor;

      varying vec2 vUv;

      void main() {
        float mask = texture2D(landMask, vUv).r;
        vec3 color = mix(oceanColor, landColor, mask);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  // const earthMaterial = new THREE.MeshStandardMaterial({
  //   color: "#303030",
  // });

  const mesh = new THREE.Mesh(earthGeometry, earthMaterial);
  mesh.name = "earth-mesh";
  group.add(mesh);

  const equatorRing = createRing(1.2, 0.02);
  equatorRing.name = "equator-ring";
  group.add(equatorRing);

  // const coastlines = await createCoastlines();
  // group.add(coastlines);

  return group;
}
