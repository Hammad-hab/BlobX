/**
 * @module WobbleFluid.tsx
 * @tutorial README.md
 */
import React, {useState, useEffect, useRef, useMemo} from 'react';
import * as THREE from 'three';
import {useFrame, useLoader} from '@react-three/fiber';
import MaterialContainer from './MaterialContainer';
import wobbleVertexShader from './shaders/wobbleVertexShader.glsl';
import wobbleFragmentShader from './shaders/wobbleFragementShader.glsl';
import AIEyes from './AIEyes';

import {analyzeAudio, AmplitudeData} from 'react-native-audio-analyzer';
import uri from './perlin.daturi';

interface FluidProps {
  rotationSpeed?: number;
  emote?: 'Angry' | 'Happy' | 'Serious' | 'Interogative' | 'None';
  length: number;
  gesture?: 'Nod' | 'HeadShake' | 'None' | 'ShakeAnger' | 'Hop';
  maxSize?: number;
  sizeIncreaseDamp?: number /** The maximum size it gets to before damping out to a lower factor */;

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

  Red_Sphere_Four?: number;
  Green_Sphere_Four?: number;
  Blue_Sphere_Four?: number;

  Red_Sphere_Five?: number;
  Green_Sphere_Five?: number;
  Blue_Sphere_Five?: number;
  averageColorClearout?: number;

  jitter?: number;
  testing?: boolean;
  randMax?: number;
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
  MinFreq?: number;
  dangerousMatStateAccessCallback?: (x: MaterialContainer) => void;
  ignoreErrors?: boolean;
  filepath: string;
  emotionOverrideTime?: number;
  onAnimationStart?: () => void;
}
/**
 * Main Component for adding a character into an application. See documentation (README.md) for more information regarding
 * its usage. Based on R3F.
 */
export default function Fluid(props: FluidProps) {
  const [isSpeaking, setSpeaking] = useState(false);
  const [IncRadius, setIncRadius] = useState<boolean>(false);
  let damping = new THREE.Vector3(1, 1, 1);
  useEffect(() => {
    console.log(props.length);
  }, [props.length]);

  if (props.length === 0 && !props.ignoreErrors) {
    /** This is a safety check. Length of 0 can lead to division by
     * zero in other operations which might cause unexpected bugs */
    throw `[GL_EXCEPTION]: Unacceptable value, ${props.length} passed as length to Fluid component. props.length must be greater than 0. To fix this, set length to any unsigned integer greater than 1`;
  }
  const [result, setResult] = useState<AmplitudeData[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await analyzeAudio(props.filepath, 0.01);
        props.onAnimationStart ? props.onAnimationStart() : null;
        setResult(data);
      } catch (e) {
        /**This is just a precautionary try...catch */
        return;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.filepath, props.length]);

  const xtime = props.emotionOverrideTime ? props.emotionOverrideTime : 4000;
  useEffect(() => {
    setIncRadius(true); /* set to true if color is needed */
    const x = setTimeout(() => {
      /* Remove the colour changes once the emotion aggressiveness is over. */
      setIncRadius(false);
    }, xtime);
    return () => clearTimeout(x);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.emote]);

  const layerOuter =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const layerInner =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const layerInnerMost =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  let sampler = useRef(0);

  /**This is the sampler, i.e the read head that continuously reads from the audio stream after every 100ms */
  const read_head = useMemo(() => {
    if (result.length > 0) {
      return setInterval(() => {
        sampler.current += 1;
      }, 1 * 100);
    }
  }, [result]);

  useEffect(() => {
    setSpeaking(true);
  }, [props.filepath]);

  useEffect(() => {
    if (result.length > 0) {
      if (!isSpeaking) {
        /*Rewinding the damping factor if the animation has stopped running.*/
        damping.x = 1;
        damping.y = 1;
        damping.z = 1;
        setSpeaking(true);
      }
      const x = setTimeout(() => {
        setSpeaking(false);
        clearInterval(read_head!);
        console.log('Should Clear', props.length);
      }, props.length);
      return () => clearTimeout(x);
    } else {
      setSpeaking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.length, props, read_head]);

  const perlinTexture = useLoader(THREE.TextureLoader, uri);
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
          uBlobColor: new THREE.Uniform(new THREE.Vector3(0.13, 0.6, 0.89)), // Sphere Color One;
          uSmokeSize: new THREE.Uniform(1.0),
          Color_red: new THREE.Uniform(1.0),
          isAngry: new THREE.Uniform(1.0),
          opc: new THREE.Uniform(0.05),
          uSpeechDisplacement: new THREE.Uniform(
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
  useEffect(() => {
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
  }, [atmosphereMaterial, containerMat]);

  if (props.dangerousMatStateAccessCallback) {
    /**A dangerous callback called once the Material Container has been created */
    props.dangerousMatStateAccessCallback(containerMat);
  }

  /**
   * Debug UI useEffect. It is called everytime one of the RGB values of the debug spheres
   * change. See MaterialContainer for more information regarding setUniformAt and setUniformAtI
   *
   * @NOTE Refrain from opening/enabling all debug sliders at once, @see App.tsx
   */
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
      containerMat.setUniformAt(
        3,
        new THREE.Vector3(
          props.Red_Sphere_Four ? props.Red_Sphere_Four : 0.97,
          props.Green_Sphere_Four ? props.Green_Sphere_Four : 0.52,
          props.Blue_Sphere_Four ? props.Blue_Sphere_Four : 0.15,
        ),
        'uBlobColor',
      );
      containerMat.setUniformAt(
        3,
        new THREE.Vector3(
          props.Red_Sphere_Five ? props.Red_Sphere_Five : 0.94,
          props.Green_Sphere_Five ? props.Green_Sphere_Five : 0.6,
          props.Blue_Sphere_Five ? props.Blue_Sphere_Five : 0.22,
        ),
        'uBlobColor',
      );
    }
  }, [
    containerMat,
    props.Blue_Sphere_Five,
    props.Blue_Sphere_Four,
    props.Blue_Sphere_one,
    props.Blue_Sphere_three,
    props.Blue_Sphere_two,
    props.Green_Sphere_Five,
    props.Green_Sphere_Four,
    props.Green_Sphere_one,
    props.Green_Sphere_three,
    props.Green_Sphere_two,
    props.Red_Sphere_Five,
    props.Red_Sphere_Four,
    props.Red_Sphere_one,
    props.Red_Sphere_three,
    props.Red_Sphere_two,
    props.isDebugging,
  ]);

  useFrame(() => {
    if (IncRadius) {
      if (props.emote === 'Angry') {
        /**If the emotion is angry,  */
        containerMat.setNewColor(0, 'uBlobColor', 1.0, 0.0, 0.0);
        containerMat.setNewColor(1, 'uBlobColor', 1.0, 0.0, 0.0);
        containerMat.setNewColor(2, 'uBlobColor', 1.0, 0.0, 0.0);
        containerMat.setNewColor(3, 'uBlobColor', 1.0, 0.0, 0.0);
        containerMat.setNewColor(4, 'uBlobColor', 1.0, 0.0, 0.0);
      } else if (props.emote === 'Interogative') {
        containerMat.setNewColor(0, 'uBlobColor', 0.0, 0.0, 1.0);
        containerMat.setNewColor(1, 'uBlobColor', 0.0, 0.0, 1.0);
        containerMat.setNewColor(2, 'uBlobColor', 0.0, 0.0, 1.0);
        containerMat.setNewColor(3, 'uBlobColor', 0.0, 0.0, 1.0);
        containerMat.setNewColor(4, 'uBlobColor', 0.0, 0.0, 1.0);
      } else if (props.emote === 'Happy') {
        containerMat.setNewColor(0, 'uBlobColor', 1.0, 0.85, 0.0);
        containerMat.setNewColor(1, 'uBlobColor', 1.0, 0.85, 0.0);
        containerMat.setNewColor(2, 'uBlobColor', 1.0, 0.85, 0.0);
        containerMat.setNewColor(3, 'uBlobColor', 1.0, 0.85, 0.0);
        containerMat.setNewColor(4, 'uBlobColor', 1.0, 0.85, 0.0);
      } else if (props.emote === 'Serious') {
        containerMat.setNewColor(0, 'uBlobColor', 0.74, 0.0, 0.97);
        containerMat.setNewColor(1, 'uBlobColor', 0.74, 0.0, 0.97);
        containerMat.setNewColor(2, 'uBlobColor', 0.74, 0.0, 0.97);
        containerMat.setNewColor(3, 'uBlobColor', 0.74, 0.0, 0.97);
        containerMat.setNewColor(4, 'uBlobColor', 0.74, 0.0, 0.97);
      }
    } else {
      /**
       * If all the emotions have been removed, restore all the default respective
       * colors of the spheres.
       * @NOTE Change these colour values once you alter them via the debug UI. Otherwise
       * emotion change would resort to the default colours, not to the colours you have set.
       */
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

  let t = 0.0;

  useEffect(() => {
    sampler.current = 0;
  }, [props.filepath]);

  useFrame(() => {
    /** Checking if the rotation speed has been provided (@defaultValue 1) */
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
      /**If the speaking animation is not running, slowly reduce the damping factor  */
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

    const sz: AmplitudeData = result[sampler.current];

    containerMat.setUniformAtI(0, 0.2 * speed * damping.x, 'uTime');
    containerMat.setUniformAtI(1, 0.1 * speed * damping.x, 'uTime');
    containerMat.setUniformAtI(2, 0.3 * speed * damping.x, 'uTime');
    containerMat.setUniformAtI(3, 0.25 * speed * damping.x, 'uTime');
    containerMat.setUniformAtI(4, 0.35 * speed * damping.x, 'uTime');

    /**
     * @private
     * @description This is the main code resposible for audio fluctuations based on the.
     * amplitude of the waves that have been sampled @see Line:80, @function analyseAudio
     */
    if (sz !== undefined) {
      /**
       * @desription if the amplitude exceeds the minimum size tolerance (1.0)
       * reduce the effectiveness of the amplitude and also add a small bit of randomness
       */
      if (
        sz.amplitude / (props.sizeIncreaseDamp ? props.sizeIncreaseDamp : 100) <
        1.0
      ) {
        sz.amplitude += Math.random() * (props.randMax ? props.randMax : 50);
      }
      const size = Math.min(
        (sz.amplitude < 125 ? 125 : sz.amplitude) /
          (props.sizeIncreaseDamp ? props.sizeIncreaseDamp : 100),
        props.maxSize ? props.maxSize : 1.25,
      );
      const targetScale = new THREE.Vector3(size, size, size);
      Body.current?.scale.lerp(targetScale, props.jitter ? props.jitter : 0.05);
    }
  });

  /** Rendering R3F geometries */
  return (
    <>
      <group ref={Body}>
        <mesh
          ref={layerInner}
          material={containerMat.getMaterial(0)}
          position={[0, 0, 0]}
          rotation={[0, -4.84, -5.42]}>
          <icosahedronGeometry args={[0.675, 15]} />
        </mesh>

        <mesh
          ref={layerInner}
          material={containerMat.getMaterial(4)}
          position={[0, 0, 0]}
          rotation={[0, -4.84, -5.42]}>
          <icosahedronGeometry args={[0.575, 15]} />
        </mesh>

        <mesh
          ref={layerOuter}
          material={containerMat.getMaterial(1)}
          position={[0, 0, 0]}
          rotation={[0, -9.84, -2.42]}>
          <icosahedronGeometry args={[0.7, 15]} />
        </mesh>

        <mesh
          ref={layerOuter}
          material={containerMat.getMaterial(3)}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}>
          <icosahedronGeometry args={[0.6, 15]} />
        </mesh>

        <mesh
          ref={layerInnerMost}
          material={containerMat.getMaterial(2)}
          position={[0, 0, 0]}
          rotation={[0, -6.84, -9.42]}>
          <icosahedronGeometry args={[0.6, 15]} />
        </mesh>

        <AIEyes
          MinFreq={props.MinFreq ? props.MinFreq : 1.0}
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
