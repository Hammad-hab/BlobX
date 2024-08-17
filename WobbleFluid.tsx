import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import React, {useRef} from 'react';
// import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
// import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';
import {Environment, MeshTransmissionMaterial, OrbitControls} from '@react-three/drei';
import perlin from './perlin.png';
export default function Fluid() {
  const textureLoader = new THREE.TextureLoader();
  // const smokeGeometry = new THREE.SphereGeometry(2, 100, 100);
  const perlinTexture = textureLoader.load(perlin);
  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;
  const smokeMaterial_Second = new THREE.ShaderMaterial({
    vertexShader: `
    uniform float uTime;
    uniform sampler2D uPerlinTexture;

varying vec2 vUv;
vec2 rotate2D(vec2 value, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

void main()
{
    vec3 newPosition = position;

    // Twist
    float twistPerlin = texture(
        uPerlinTexture,
        vec2(0.5, uv.y * 0.2 - uTime * 0.005)
    ).r;
    float angle = twistPerlin * 10.0;
     newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
        texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 10.0;
  //  newPosition.xz += windOffset;

    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Varyings
    vUv = uv;
}
    `,
    fragmentShader: `
    uniform float uTime;
    uniform sampler2D uPerlinTexture;
    varying vec2 vUv;

void main()
{
    // Scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;

    // Smoke
    float smoke = texture(uPerlinTexture, smokeUv).r;

    // Remap
    smoke = smoothstep(0.4, 1.0, smoke);

    // Edges
    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= smoothstep(1.0, 0.9, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.4, vUv.y);

    // Final color
    gl_FragColor = vec4(0.0, 0.0, 1.0, smoke);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  // gl_FragColor = vec4(vUv,1.0,1.0);
  //  gl_FragColor = vec4(0.33, 0.48, 0.79, 1.0);
}
    `,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uPerlinTexture: new THREE.Uniform(perlinTexture),
    },
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    // wireframe: true
  });

  const smokeMaterial = new THREE.ShaderMaterial({
    vertexShader: `
    uniform float uTime;
    uniform sampler2D uPerlinTexture;

varying vec2 vUv;
vec2 rotate2D(vec2 value, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

void main()
{
    vec3 newPosition = position;

    // Twist
    float twistPerlin = texture(
        uPerlinTexture,
        vec2(0.5, uv.y * 0.2 - uTime * 0.005)
    ).r;
    float angle = twistPerlin * 10.0;
     newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
        texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 10.0;
  //  newPosition.xz += windOffset;

    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Varyings
    vUv = uv;
}
    `,
    fragmentShader: `
    uniform float uTime;
    uniform sampler2D uPerlinTexture;
    varying vec2 vUv;

void main()
{
    // Scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;

    // Smoke
    float smoke = texture(uPerlinTexture, smokeUv).r;

    // Remap
    smoke = smoothstep(0.4, 1.0, smoke);

    // Edges
    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= smoothstep(1.0, 0.9, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.4, vUv.y);

    // Final color
    gl_FragColor = vec4(1.0, 0.0, 0.0, smoke);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  // gl_FragColor = vec4(vUv,1.0,1.0);
  //  gl_FragColor = vec4(0.33, 0.48, 0.79, 1.0);
}
    `,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uPerlinTexture: new THREE.Uniform(perlinTexture),
    },
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    // wireframe: true
  });
  // const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial)
  const csmesh = useRef<any>(null);
  const csmesh_2 = useRef<any>(null);
  // const colorA = '#0000ff';
  // const colorB = '#00e1ff';
  // const Uniforms = {
  //   uTime: new THREE.Uniform(0),
  //   uPositionFrequency: new THREE.Uniform(0.8),
  //   uTimeFrequency: new THREE.Uniform(0.4),
  //   uStrength: new THREE.Uniform(0.3),
  //   uWarpPositionFrequency: new THREE.Uniform(0.38),
  //   uWarpTimeFrequency: new THREE.Uniform(0.12),
  //   uWarpStrength: new THREE.Uniform(1.7),
  //   uColorA: new THREE.Uniform(new THREE.Color(colorA)),
  //   uColorB: new THREE.Uniform(new THREE.Color(colorB)),
  // };

  useFrame(() => {
    smokeMaterial.uniforms.uTime.value += 0.1;
    smokeMaterial_Second.uniforms.uTime.value += 0.1;
  });
  let geometry = mergeVertices(new THREE.IcosahedronGeometry(1.5, 50));
  geometry.computeTangents();
  // const material = new CustomShaderMaterial({
  //   // CSM
  //   baseMaterial: THREE.MeshPhysicalMaterial,
  //   vertexShader: wobbleVertexShader,
  //   fragmentShader: wobbleFragmentShader,
  //   uniforms: Uniforms,
  //   silent: true,

  //   // MeshPhysicalMaterial
  //   metalness: 0,
  //   roughness: 0.5,
  //   color: '#ffffff',
  //   transmission: 1,
  //   ior: 0.0,
  //   thickness: 1.5,
  //   transparent: true,
  //   wireframe: false,
  // });
  // useFrame(state => {
  //   if (csmesh.current?.material.ior !== 5) {
  //     csmesh.current.material.uniforms.uTime.value =
  //       state.clock.getElapsedTime();
  //     csmesh.current.material.ior += 0.05;
  //   }
  // });
  return (
    <>
      <OrbitControls />
      {/* <Environment preset='sunset'/> */}
      <directionalLight intensity={1} position={[10, 10, 10]} />
      <ambientLight intensity={0.5} />
      {/* <mesh>
        <torusGeometry args={[1, 0.3, 15, 15]} />
        <meshStandardMaterial color={'white'} />
      </mesh> */}
      <mesh
        ref={csmesh}
        material={smokeMaterial}
        position={[0, 0, 0]}
        rotation={[0, -7.84, -9.42]}
        scale={1}>
          <MeshTransmissionMaterial />
        {/* <meshBasicMaterial color="white" /> */}
        <icosahedronGeometry args={[0.9, 50]} />
      </mesh>
      <mesh
        ref={csmesh}
        material={smokeMaterial}
        position={[0, 0, 0]}
        rotation={[0, -7.84, -9.42]}
        scale={1}>
        {/* <meshBasicMaterial color="white" /> */}
        <icosahedronGeometry args={[1, 50]} />
      </mesh>

      <mesh
        ref={csmesh_2}
        material={smokeMaterial_Second}
        position={[0, 0, 0]}
        rotation={[0, -7.84, -9.42]}
        scale={1}>
        {/* <meshBasicMaterial color="white" /> */}
        <icosahedronGeometry args={[1.1, 50]} />
      </mesh>
    </>
  );
}
