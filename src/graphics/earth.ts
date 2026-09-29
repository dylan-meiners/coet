import * as THREE from "three";
import { createRing } from "./ring";
import { createAxis } from "./axis";
import { createEquatorialPlane } from "./plane";
import type { FrameContext, VisualComponent } from "./types";
// import { EciVector } from "./coordinates";

console.log(import.meta.url);

export class Earth implements VisualComponent {
  readonly object = new THREE.Group();

  private geometry: THREE.SphereGeometry;
  private landMask: THREE.Texture;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private equatorRing: THREE.Mesh;

  private xAxis: THREE.Mesh;
  private yAxis: THREE.Mesh;
  private zAxis: THREE.Mesh;

  constructor() {
    this.geometry = new THREE.SphereGeometry(1, 96, 96);

    this.landMask = new THREE.TextureLoader().load("/land_mask.png");
    this.landMask.colorSpace = THREE.NoColorSpace;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        landMask: {
          value: this.landMask,
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

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = "earth-mesh";
    this.object.add(this.mesh);

    this.equatorRing = createRing(1, 0.005, new THREE.Color("#00e5ff"));
    this.equatorRing.name = "equator-ring";
    this.object.add(this.equatorRing);

    // const equatorialPlane = createEquatorialPlane(10, new THREE.Color("#00e5ff"));
    // equatorialPlane.name = "equatorial-plane";
    // this.object.add(equatorialPlane);

    this.xAxis = createAxis(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 2),
      0.02,
      new THREE.Color("red"),
    );
    this.xAxis.name = "axis-x";
    this.object.add(this.xAxis);

    this.yAxis = createAxis(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2, 0, 0),
      0.02,
      new THREE.Color("green"),
    );
    this.yAxis.name = "axis-y";
    this.object.add(this.yAxis);

    this.zAxis = createAxis(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 2, 0),
      0.02,
      new THREE.Color("blue"),
    );
    this.zAxis.name = "axis-z";
    this.object.add(this.zAxis);

    // const coastlines = await createCoastlines();
    // group.add(coastlines);
  }

  dispose() {}

  update(context: FrameContext) {
    this.object.rotation.y += 0.1 * context.delta;
  }
}
