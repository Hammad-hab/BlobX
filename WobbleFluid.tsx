import {Environment} from '@react-three/drei';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import React, {useRef} from 'react';
import CustomShaderMaterial from 'three-custom-shader-material';
import {useFrame} from '@react-three/fiber';
import {extend} from '@react-three/fiber';
import * as THREE from 'three';
import wobbleVertexShader from './Wobble/vertex.glsl.js';
import wobbleFragmentShader from './Wobble/fragment.glsl.js';

export default function Fluid() {
  const csmesh = useRef<any>(null);
  const colorA = '#0000ff';
  const colorB = '#00e1ff';
  const Uniforms = {
    uTime: new THREE.Uniform(0),
    uPositionFrequency: new THREE.Uniform(0.8),
    uTimeFrequency: new THREE.Uniform(0.4),
    uStrength: new THREE.Uniform(0.3),
    uWarpPositionFrequency: new THREE.Uniform(0.38),
    uWarpTimeFrequency: new THREE.Uniform(0.12),
    uWarpStrength: new THREE.Uniform(1.7),
    uColorA: new THREE.Uniform(new THREE.Color(colorA)),
    uColorB: new THREE.Uniform(new THREE.Color(colorB)),
  };

  let geometry = new THREE.IcosahedronGeometry(1.5, 50);
  geometry = mergeVertices(geometry);
  geometry.computeTangents();
  useFrame(state => {
    if (csmesh.current?.material.ior !== 5) {
      csmesh.current.material.uniforms.uTime.value =
        state.clock.getElapsedTime();
      csmesh.current.material.ior += 0.05;
    }
  });
  return (
    <>
      <directionalLight intensity={1} position={[10, 10, 10]} />
      <Environment
        preset="sunset"
        backgroundBlurriness={10}
        backgroundIntensity={0.5}
      />
      <mesh>
        <torusGeometry args={[1, 0.3, 15, 15]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
      <mesh
        ref={csmesh}
        geometry={geometry}
        // material={material}
        position={[0, 0, 0]}
        rotation={[0, -7.84, -9.42]}
        scale={1}>
        <CustomShaderMaterial
          attach="material"
          baseMaterial={THREE.MeshPhysicalMaterial}
          vertexShader={wobbleVertexShader}
          fragmentShader={wobbleFragmentShader}
          uniforms={Uniforms}
          silent={true}
          metalness={0.0}
          roughness={1.5}
          color={'#ffffff'}
          transmission={1}
          ior={0.0}
          thickness={1.5}
          transparent={true}
          wireframe={false}
        />
      </mesh>
    </>
  );
}
