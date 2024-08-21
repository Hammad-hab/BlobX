/* eslint-disable prettier/prettier */

import React, {useState, useEffect, useRef, useMemo} from 'react';
import * as THREE from 'three';
import {useFrame, useLoader} from '@react-three/fiber';
import perlin from './perlin.png';

import {TextureLoader} from 'expo-three';
import MaterialContainer from './MaterialContainer';
import wobbleVertexShader from './shaders/wobbleVertexShader.glsl';
import wobbleFragmentShader from './shaders/wobbleFragementShader.glsl';
import AIEyes from './AIEyes';
import animateText from './TextAnimation';

interface FluidProps {
  text: string;
  rotationSpeed: number;
  emote: 'Angry' | 'Happy' | 'Serious' | 'Interogative'|'None';
  length: number;
  gesture?: 'Nod' | 'HeadShake' | 'None' | 'Wink' | 'ShakeAnger';
  // Debug Parameters
  Red_Sphere_one?: number;
  Green_Sphere_one?: number;
  Blue_Sphere_one?: number;

  Red_Sphere_two?: number;
  Green_Sphere_two?: number;
  Blue_Sphere_two?: number;

  Red_Sphere_three?: number;
  Green_Sphere_three?: number;
  Blue_Sphere_three?: number;
  averageColorClearout?: number;
  enableRandomness?: boolean;

  dangerousEmotionStateAccessCallback?: (
    x: React.Dispatch<
      React.SetStateAction<'Angry' | 'Happy' | 'Serious' | 'Interogative'|'None'>
    >,
  ) => void;
  dangerousMatStateAccessCallback?: (x: MaterialContainer) => void;
}

export default function Fluid(props: FluidProps) {
  const [isSpeaking, setSpeaking] = useState(true);
  const [IncRadius, setIncRadius] = useState<boolean>(false);
  const xtime = 4000;
  useEffect(() => {
    setIncRadius(true); // set to true if color is needed
    const x = setTimeout(() => {
      setIncRadius(false);
    }, xtime);
    return () => clearTimeout(x);
  }, [props.emote]);

  const layerOuter = useRef<
    THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
  >(null);
  const layerInner = useRef<
    THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
  >(null);
  const layerInnerMost = useRef<
    THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
  >(null);
  let sampler = useRef(0);
  const wordsPerSecond = props.text.split(' ').length / (props.length / 1000);
  const read_head = setInterval(() => {
    sampler.current += 1;
  }, wordsPerSecond * 100);
  useEffect(() => {
    setSpeaking(true);
  }, [props.text, props.length]);

  useEffect(() => {
    const x = setTimeout(() => {
      setSpeaking(false);

      clearInterval(read_head);
    }, props.length);
    return () => clearTimeout(x);
  }, [props.length, props, read_head]);

  const perlinTexture = useLoader(TextureLoader, perlin);
  const kframes = animateText(props.text);
  const Body = useRef<THREE.Group | null>(null);
  // const avgWordPerSecond = props.text.split(' ').length / (props.length / 1000); IMPORTANT

  if (perlinTexture instanceof THREE.Texture) {
    /** Use loader can return two types: Texture and Texture[], this is just a type precaution */
    perlinTexture.wrapS = THREE.RepeatWrapping; // Allow the texture to repeat on X
    perlinTexture.wrapT = THREE.RepeatWrapping; // Allow the texture to repeat on Y
  }

  /**See MaterialContainer.ts */
  const containerMat = useMemo(() => new MaterialContainer(), []);

  // This is a sample material for controlling all
  // the rotating smoke around the sphere
  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: wobbleVertexShader,
        fragmentShader: wobbleFragmentShader,
        uniforms: {
          /*Data passed to the shader from the CPU, is a uniform */
          uTime: new THREE.Uniform(0),
          uPerlinTexture: new THREE.Uniform(perlinTexture),
          uBlobColor: new THREE.Uniform(new THREE.Vector3(0.0, 0.0, 1.0)),
          uSmokeSize: new THREE.Uniform(1.0),
          Color_red: new THREE.Uniform(1.0),
          isAngry: new THREE.Uniform(1.0),
        },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
      }),
    [perlinTexture],
  );

  containerMat.addMaterials(atmosphereMaterial);
  containerMat.createMatUniformVariation(
    0,
    new THREE.Vector3(0.8, 0.0, 0.0),
    'uBlobColor',
  );
  containerMat.createMatUniformVariation(
    0,
    new THREE.Vector3(0.0, 1.0, 0.0),
    'uBlobColor',
  );
  containerMat.setUniformAt(1, 1.015, 'uSmokeSize');

  if (props.dangerousMatStateAccessCallback) {
    props.dangerousMatStateAccessCallback(containerMat);
  }

  useFrame(() => {
    if (IncRadius) {
      if (props.emote === 'Angry') {
        //    IncScale();
        containerMat.setNewRed(0, 'uBlobColor', 1.0, 0.0, 0.0);
        containerMat.setNewRed(1, 'uBlobColor', 1.0, 0.0, 0.0);
        containerMat.setNewRed(2, 'uBlobColor', 1.0, 0.0, 0.0);
      } else if (props.emote === 'Interogative') {
        //   IncScale();
        containerMat.setNewRed(0, 'uBlobColor', 0.0, 0.0, 1.0);
        containerMat.setNewRed(1, 'uBlobColor', 0.0, 0.0, 1.0);
        containerMat.setNewRed(2, 'uBlobColor', 0.0, 0.0, 1.0);
      } else if (props.emote === 'Happy') {
        //   IncScale();
        containerMat.setNewRed(0, 'uBlobColor', 1.00, 0.85, 0.00);
        containerMat.setNewRed(1, 'uBlobColor', 1.00, 0.85, 0.00);
        containerMat.setNewRed(2, 'uBlobColor', 1.00, 0.85, 0.00);
      }
      //   DecScale();
    } else {
      const color_1 = new THREE.Vector3(0.0, 0.0, 1.0);
      const color_2 = new THREE.Vector3(0.8, 0.0, 0.0);
      const color_3 = new THREE.Vector3(0.0, 1.0, 0.0);
      containerMat.setNewRed(0, 'uBlobColor', color_1.x, color_1.y, color_1.z);
      containerMat.setNewRed(1, 'uBlobColor', color_2.x, color_2.y, color_2.z);
      containerMat.setNewRed(2, 'uBlobColor', color_3.x, color_3.y, color_3.z);
    }
  });


  let damping = new THREE.Vector3(1, 1, 1);

  useEffect(() => {
    sampler.current = 0;
  }, [props.text]);

  useFrame(() => {
    /**Render loop */
    if (!isSpeaking) {
      const target = new THREE.Vector3(0, 0, 0);
      const targetScale = new THREE.Vector3(1, 1, 1);
      damping.lerp(target, 0.01);
      containerMat.setUniformAtI(
        0,
        0.2 * props.rotationSpeed * damping.x,
        'uTime',
      );
      containerMat.setUniformAtI(
        1,
        0.1 * props.rotationSpeed * damping.x,
        'uTime',
      );
      containerMat.setUniformAtI(
        2,
        0.3 * props.rotationSpeed * damping.x,
        'uTime',
      );
      Body.current?.scale.lerp(targetScale, 0.01);
      return;
    }

    const sz = kframes[sampler.current];
    if (sz === undefined && isSpeaking) {
      sampler.current = 0;
    }
    containerMat.setUniformAtI(
      0,
      0.2 * props.rotationSpeed * damping.x,
      'uTime',
    );
    containerMat.setUniformAtI(
      1,
      0.1 * props.rotationSpeed * damping.x,
      'uTime',
    );
    containerMat.setUniformAtI(
      2,
      0.3 * props.rotationSpeed * damping.x,
      'uTime',
    );

    // Don't touch
    const rnd = props.enableRandomness ? Math.random() - 0.5 : 0.0;
    const alpha = 0.05;
    if (sz === 0) {
      const targetScale = new THREE.Vector3(0.5 + rnd, 0.5 + rnd, 0.5 + rnd);
      Body.current?.scale.lerp(targetScale, alpha);
    }
    if (sz === 0.2) {
      const targetScale = new THREE.Vector3(0.75 + rnd, 0.75 + rnd, 0.75 + rnd);
      Body.current?.scale.lerp(targetScale, alpha);
    } else if (sz === 0.5) {
      const targetScale = new THREE.Vector3(1 + rnd, 1 + rnd, 1 + rnd);
      Body.current?.scale.lerp(targetScale, alpha);
    } else if (sz === 1) {
      const targetScale = new THREE.Vector3(1.25 + rnd, 1.25 + rnd, 1.25 + rnd);
      Body.current?.scale.lerp(targetScale, alpha);
    }
  });

  return (
    <>
      <directionalLight intensity={1} position={[10, 10, 10]} />
      <ambientLight intensity={0.5} />
      <group ref={Body}>
        <mesh
          ref={layerInner}
          material={containerMat.getMaterial(0)}
          position={[0, 0, 0]}
          rotation={[0, -7.84, -9.42]}
        >
          <icosahedronGeometry args={[0.4, 50]} />
        </mesh>

        <mesh
          ref={layerOuter}
          material={containerMat.getMaterial(1)}
          position={[0, 0, 0]}
          rotation={[0, -7.84, -9.42]}
        >
          <icosahedronGeometry args={[0.7, 50]} />
        </mesh>

        <mesh
          ref={layerInnerMost}
          material={containerMat.getMaterial(2)}
          position={[0, 0, 0]}
          rotation={[0, -7.84, -9.42]}
        >
          <icosahedronGeometry args={[0.6, 50]} />
        </mesh>

        <AIEyes
          emotion={props.emote}
          gesture={props.gesture}
        />
      </group>
    </>
  );
}
