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
  rotationSpeed?: number;
  emote?: 'Angry' | 'Happy' | 'Serious' | 'Interogative' | 'None';
  length: number;
  gesture?: 'Nod' | 'HeadShake' | 'None' | 'ShakeAnger' | 'Hop';

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
  jitter?: number;
  testing?: boolean;
  stareAt?:
    | 'Top'
    | 'TopLeft'
    | 'TopRight'
    | 'Bottom'
    | 'BottomLeft'
    | 'BottomRight'
    | 'Left'
    | 'Right'
    | 'None';
  isDebugging?: boolean;
  hopContinious?: boolean;
  blinkFreq?: number;
  dangerousMatStateAccessCallback?: (x: MaterialContainer) => void;
  ignoreErrors?: boolean;
}
/**
 * Main Component for adding a character into an application. See documentation (README.md) for more information regarding
 * its usage. Based on R3F
 */
export default function Fluid(props: FluidProps) {
  const [isSpeaking, setSpeaking] = useState(true);
  const [IncRadius, setIncRadius] = useState<boolean>(false);
  if (props.length === 0 && !props.ignoreErrors) {
    /** This is a safety check. Length of 0 can lead to division by
     * zero in other operations which might cause unexpected bugs */
    throw `[GL_EXCEPTION]: Unacceptable value, ${props.length} passed as length to Fluid component. props.length must be greater than 0. To fix this, set length to any unsigned integer greater than 1`;
  }
  const xtime = 4000;
  useEffect(() => {
    setIncRadius(true); // set to true if color is needed
    const x = setTimeout(() => {
      setIncRadius(false);
    }, xtime);
    return () => clearTimeout(x);
  }, [props.emote]);

  const layerOuter =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const layerInner =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const layerInnerMost =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  let sampler = useRef(0);
  const wordsPerSecond =
    props.text.split(' ').length /
    ((props.length === 0 ? 1000 : props.length) / 1000);
  const read_head = useMemo(
    () =>
      setInterval(() => {
        sampler.current += 1;
      }, wordsPerSecond * 100),
    [wordsPerSecond],
  );
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
          uBlobColor: new THREE.Uniform(new THREE.Vector3(0.13, 0.6, 0.89)), // Sphere One;
          uSmokeSize: new THREE.Uniform(1.0),
          Color_red: new THREE.Uniform(1.0),
          isAngry: new THREE.Uniform(1.0),
          opc: new THREE.Uniform(0.05),
          uSpeachDisplacement: new THREE.Uniform(
            new THREE.Vector3(1.0, 1.0, 1.0),
          ),
        },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
      }),
    [perlinTexture],
  );
  /*Creating Variations of the Same material to reduce redundancy. See MaterialContainer.ts */
  containerMat.addMaterials(atmosphereMaterial);
  containerMat.createMatUniformVariation(
    0,
    new THREE.Vector3(0.86, 0.2, 0.27), //Sphere Two;
    'uBlobColor',
  );
  containerMat.createMatUniformVariation(
    //Sphere Three;
    0,
    new THREE.Vector3(0, 0.42, 0.18),
    'uBlobColor',
  );
  containerMat.createMatUniformVariation(
    //Sphere Four
    0,
    new THREE.Vector3(0.97, 0.52, 0.15),
    'uBlobColor',
  );
  containerMat.createMatUniformVariation(
    //Sphere Five
    0,
    new THREE.Vector3(0.94, 0.6, 0.22),
    'uBlobColor',
  );

  if (props.dangerousMatStateAccessCallback) {
    props.dangerousMatStateAccessCallback(containerMat);
  }
  useEffect(() => {
    /**Only run if isDebugging is on */
    if (props.isDebugging) {
      containerMat.setUniformAt(
        0,
        new THREE.Vector3(
          props.Red_Sphere_one ? props.Red_Sphere_one : 0.86,
          props.Green_Sphere_one ? props.Green_Sphere_one : 0.2,
          props.Blue_Sphere_one ? props.Blue_Sphere_one : 0.27,
        ),
        'uBlobColor',
      );
      containerMat.setUniformAt(
        1,
        new THREE.Vector3(
          props.Red_Sphere_two ? props.Red_Sphere_two : 0.86,
          props.Green_Sphere_two ? props.Green_Sphere_two : 0.2,
          props.Blue_Sphere_two ? props.Blue_Sphere_two : 0.27,
        ),
        'uBlobColor',
      );
      containerMat.setUniformAt(
        2,
        new THREE.Vector3(
          props.Red_Sphere_three ? props.Red_Sphere_three : 0.86,
          props.Green_Sphere_three ? props.Green_Sphere_three : 0.2,
          props.Blue_Sphere_three ? props.Blue_Sphere_three : 0.27,
        ),
        'uBlobColor',
      );
    }
  }, [
    containerMat,
    props.Blue_Sphere_one,
    props.Blue_Sphere_three,
    props.Blue_Sphere_two,
    props.Green_Sphere_one,
    props.Green_Sphere_three,
    props.Green_Sphere_two,
    props.Red_Sphere_one,
    props.Red_Sphere_three,
    props.Red_Sphere_two,
    props.isDebugging,
  ]);
  useFrame(() => {
    if (IncRadius) {
      if (props.emote === 'Angry') {
        //    IncScale();
        containerMat.setNewColor(0, 'uBlobColor', 1.0, 0.0, 0.0);
        containerMat.setNewColor(1, 'uBlobColor', 1.0, 0.0, 0.0);
        containerMat.setNewColor(2, 'uBlobColor', 1.0, 0.0, 0.0);
        containerMat.setNewColor(3, 'uBlobColor', 1.0, 0.0, 0.0);
        containerMat.setNewColor(4, 'uBlobColor', 1.0, 0.0, 0.0);
      } else if (props.emote === 'Interogative') {
        //   IncScale();
        containerMat.setNewColor(0, 'uBlobColor', 0.0, 0.0, 1.0);
        containerMat.setNewColor(1, 'uBlobColor', 0.0, 0.0, 1.0);
        containerMat.setNewColor(2, 'uBlobColor', 0.0, 0.0, 1.0);
        containerMat.setNewColor(3, 'uBlobColor', 0.0, 0.0, 1.0);
        containerMat.setNewColor(4, 'uBlobColor', 0.0, 0.0, 1.0);
      } else if (props.emote === 'Happy') {
        //   IncScale();
        containerMat.setNewColor(0, 'uBlobColor', 1.0, 0.85, 0.0);
        containerMat.setNewColor(1, 'uBlobColor', 1.0, 0.85, 0.0);
        containerMat.setNewColor(2, 'uBlobColor', 1.0, 0.85, 0.0);
        containerMat.setNewColor(4, 'uBlobColor', 1.0, 0.85, 0.0);
      }
      //   DecScale();
    } else {
      const color_1 = new THREE.Vector3(0.13, 0.6, 0.89); // RETURN COLOR
      const color_2 = new THREE.Vector3(0.86, 0.2, 0.27); // RETURN COLOR
      const color_3 = new THREE.Vector3(0, 0.42, 0.18); // RETURN COLOR
      const color_4 = new THREE.Vector3(0.97, 0.52, 0.15); // RETURN COLOR
      const color_5 = new THREE.Vector3(0.94, 0.6, 0.22); // RETURN COLOR
      if (!props.testing) {
        containerMat.setNewColor(
          0,
          'uBlobColor',
          color_1.x,
          color_1.y,
          color_1.z,
        );
        containerMat.setNewColor(
          1,
          'uBlobColor',
          color_2.x,
          color_2.y,
          color_2.z,
        );
        containerMat.setNewColor(
          2,
          'uBlobColor',
          color_3.x,
          color_3.y,
          color_3.z,
        );
        containerMat.setNewColor(
          3,
          'uBlobColor',
          color_4.x,
          color_4.y,
          color_4.z,
        );
        containerMat.setNewColor(
          3,
          'uBlobColor',
          color_5.x,
          color_5.y,
          color_5.z,
        );
      }
    }
  });

  let damping = new THREE.Vector3(1, 1, 1);
  let t = 0.0;

  useEffect(() => {
    sampler.current = 0;
  }, [props.text]);

  useFrame(() => {
    const speed = props.rotationSpeed ? props.rotationSpeed : 1;
    /**Render loop */
    if (props.gesture === 'Hop') {
      // Equation: max(9.81^-t x |sin(2πt)|, 0.05) - 0.05
      const vl =
        Math.max(
          Math.pow(9.81, -t) * Math.abs(Math.sin(Math.PI * 2 * t)),
          0.05,
        ) - 0.05;
      Body.current!.position.y = vl;
      t += 0.01;
      if (props.hopContinious && t > 0.5) {
        t = 0;
      }
    }
    if (!isSpeaking) {
      const target = new THREE.Vector3(0.2, 0.2, 0.2);
      const targetScale = new THREE.Vector3(1, 1, 1);
      damping.lerp(target, 0.01);
      containerMat.setUniformAtI(0, 0.2 * speed * damping.x, 'uTime');
      containerMat.setUniformAtI(1, 0.1 * speed * damping.x, 'uTime');
      containerMat.setUniformAtI(2, 0.3 * speed * damping.x, 'uTime');
      containerMat.setUniformAtI(3, 0.25 * speed * damping.x, 'uTime');
      containerMat.setUniformAtI(4, 0.35 * speed * damping.x, 'uTime');
      Body.current?.scale.lerp(targetScale, 0.01);
      return;
    }

    const sz = kframes[sampler.current];
    if (sz === undefined && isSpeaking) {
      sampler.current = 0;
    }
    containerMat.setUniformAtI(0, 0.2 * speed * damping.x, 'uTime');
    containerMat.setUniformAtI(1, 0.1 * speed * damping.x, 'uTime');
    containerMat.setUniformAtI(2, 0.3 * speed * damping.x, 'uTime');

    containerMat.setUniformAtI(3, 0.25 * speed * damping.x, 'uTime');
    containerMat.setUniformAtI(4, 0.35 * speed * damping.x, 'uTime');
    // Don't touch, these are precise mathematical calculations
    const rnd =
      props.enableRandomness === undefined || props.enableRandomness
        ? Math.random() - 0.5
        : 0.0;
    const alpha = props.jitter ? props.jitter : 0.05;
    if (sz === 0) {
      const targetScale = new THREE.Vector3(0.5 + rnd, 0.5 + rnd, 0.5 + rnd);
      Body.current?.scale.lerp(targetScale, alpha);
    }
    if (sz === '0.2') {
      const targetScale = new THREE.Vector3(1, 1, 1);
      Body.current?.scale.lerp(targetScale, alpha);
    } else if (sz === 0.25) {
      const targetScale = new THREE.Vector3(1.25 + rnd, 1.25 + rnd, 1.25 + rnd);
      Body.current?.scale.lerp(targetScale, alpha);
    } else if (sz === 0.5) {
      const targetScale = new THREE.Vector3(1.5 + rnd, 1.5 + rnd, 1.5 + rnd);
      Body.current?.scale.lerp(targetScale, alpha);
    } else if (sz === 0.75) {
      const targetScale = new THREE.Vector3(1.75 + rnd, 1.75 + rnd, 1.75 + rnd);
      Body.current?.scale.lerp(targetScale, alpha);
    }
  });

  return (
    <>
      <group ref={Body}>
        <mesh
          ref={layerInner}
          material={containerMat.getMaterial(0)}
          position={[0, 0, 0]}
          rotation={[0, -4.84, -5.42]}>
          <icosahedronGeometry args={[0.675, 50]} />
        </mesh>

        <mesh
          ref={layerInner}
          material={containerMat.getMaterial(4)}
          position={[0, 0, 0]}
          rotation={[0, -4.84, -5.42]}>
          <icosahedronGeometry args={[0.575, 50]} />
        </mesh>

        <mesh
          ref={layerOuter}
          material={containerMat.getMaterial(1)}
          position={[0, 0, 0]}
          rotation={[0, -9.84, -2.42]}>
          <icosahedronGeometry args={[0.7, 50]} />
        </mesh>

        <mesh
          ref={layerOuter}
          material={containerMat.getMaterial(3)}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}>
          <icosahedronGeometry args={[0.6, 50]} />
        </mesh>

        <mesh
          ref={layerInnerMost}
          material={containerMat.getMaterial(2)}
          position={[0, 0, 0]}
          rotation={[0, -6.84, -9.42]}>
          <icosahedronGeometry args={[0.6, 50]} />
        </mesh>

        <AIEyes
          BlinkFreq={props.blinkFreq ? props.blinkFreq : 2.0}
          emotion={props.emote ? props.emote : 'None'}
          gesture={
            props.gesture && props.gesture !== 'Hop' ? props.gesture : 'None'
          }
          stareAt={props.stareAt ? props.stareAt : 'None'}
        />
      </group>
    </>
  );
}
