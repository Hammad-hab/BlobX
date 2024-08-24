/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from 'three';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useFrame} from '@react-three/fiber';

interface AIEyesProps {
  emotion: 'Happy' | 'Angry' | 'Serious' | 'Interogative' | 'None';
  gesture?: 'Nod' | 'HeadShake' | 'None' | 'Wink' | 'ShakeAnger';
  eyeColor?: string;
  shouldEnableEyeBrows?: boolean;
  stareAt:
    | 'Top'
    | 'TopLeft'
    | 'TopRight'
    | 'Bottom'
    | 'BottomLeft'
    | 'BottomRight'
    | 'Left'
    | 'Right'
    | 'None';
  // setColorOnEmotion: () => void;
}

const AIEyes = (props: AIEyesProps) => {
  /** This file is not to be edited in any curcumstances. It includes precarious thresholds */
  const [browsShouldLerp, setLerpAccess] = useState(false);
  const [EyePosition, setEyePosition] = useState<typeof props.stareAt>('None');
  const AIState = useRef('Serious');

  useEffect(() => {
    if (AIState.current !== props.emotion) {
      setLerpAccess(true);
      console.log('[AIEyes]: Allowing State Update', props.emotion);
    }
  }, [props.emotion, AIState]);

  const Face: any = useRef(null);
  const HeadShakeDir = useRef(1);
  const NodDir = useRef(1);
  const EyeGeometry = useMemo(
    () => new THREE.CapsuleGeometry(0.035, 0.07, 32),
    [],
  );
  const HappyEyeGeometry = useMemo(
    () => new THREE.CircleGeometry(0.06, 32, 0, 3),
    [],
  );
  //3.2 ser
  const SeriousEyeGeometry = useMemo(
    () => new THREE.CircleGeometry(0.06, 32, 3.2, 3),
    [],
  );
  const AnrgyEyeGeometry_L = useMemo(
    () => new THREE.CircleGeometry(0.06, 32, 2.7, 3),
    [],
  );
  const Circle = useMemo(() => new THREE.CircleGeometry(0.1, 32, 0, 3), []);

  const AnrgyEyeGeometry_R = useMemo(
    () => new THREE.CircleGeometry(0.06, 32, 4, 3),
    [],
  );
  const EyeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({color: props.eyeColor ?? 'white', side: 2}),
    [props.eyeColor],
  );

  const EyeBrowGeometry = useMemo(
    () => new THREE.PlaneGeometry(0.15, 0.01, 1),
    [],
  );

  const EyeBrowMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({color: 'white', side: 2}),
    [],
  );

  const EyeBrowRefL = useRef<any>(null);
  const EyeBrowRefR = useRef<any>(null);

  const EyeBrowRefLD = useRef<any>(null);
  const EyeBrowRefRD = useRef<any>(null);

  const EyeRefR_Happy = useRef<any>(null);
  const EyeRefL_Happy = useRef<any>(null);

  const EyeRefR_Serious = useRef<any>(null);
  const EyeRefL_Serious = useRef<any>(null);

  const EyeRefNormalL = useRef<any>(null);
  const EyeRefNormalR = useRef<any>(null);
  const EyeRefR_Angry = useRef<any>(null);
  const EyeRefL_Angry = useRef<any>(null);

  const LerpAngerEyebrows = () => {
    const oldVectorL_Ang: THREE.Quaternion = EyeBrowRefL.current.quaternion;
    const oldVectorR_Ang: THREE.Quaternion = EyeBrowRefR.current.quaternion;
    const newVectorR_Ang = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      Math.PI * 0.125,
    );
    const newVectorL_Ang = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      -Math.PI * 0.125,
    );
    oldVectorL_Ang.slerp(newVectorR_Ang, 0.1);
    oldVectorR_Ang.slerp(newVectorL_Ang, 0.1);
  };

  const unLerpAngerEyebrows = () => {
    if (AIState.current === 'Angry') {
      const oldVectorL_Ang: THREE.Quaternion = EyeBrowRefL.current.quaternion;
      const oldVectorR_Ang: THREE.Quaternion = EyeBrowRefR.current.quaternion;
      const newVectorR_Ang = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        -Math.PI * 0.25,
      );
      const newVectorL_Ang = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        Math.PI * 0.25,
      );
      oldVectorL_Ang.slerp(newVectorL_Ang, 0.1);
      oldVectorR_Ang.slerp(newVectorR_Ang, 0.1);
    } else {
      // Reset the rotation to the original position
      EyeBrowRefL.current.quaternion.slerp(
        new THREE.Quaternion(0, 0, 0, 1),
        0.1,
      );
      EyeBrowRefR.current.quaternion.slerp(
        new THREE.Quaternion(0, 0, 0, 1),
        0.1,
      );
    }
  };
  const moveQuaterion = (axis: [number, number, number], angle: number) => {
    if (angle !== 0) {
      return new THREE.Quaternion(0, 0, 0, 1).setFromAxisAngle(
        new THREE.Vector3(axis[0], axis[1], axis[2]),
        angle,
      );
    } else {
      return new THREE.Quaternion(0, 0, 0, 1);
    }
  };

  const neutralise = () => {
    if (EyePosition === 'None') {
      return;
    }
    const targetNorm = moveQuaterion([1, 1, 1], 0);
    Face.current.quaternion.slerp(targetNorm, 0.1);
    setEyePosition(props.stareAt);
  };

  useEffect(() => {
    neutralise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.stareAt]);

  useFrame(() => {
    const pos = props.stareAt;
    switch (pos) {
      case 'None':
        const targetNn = moveQuaterion([1, 1, 0], 0);
        Face.current.quaternion.slerp(targetNn, 0.1);
        break;
      case 'Bottom':
        // neutralise();
        const targetBtm = moveQuaterion([-1, 0, 0], Math.PI * 0.075);
        Face.current.quaternion.slerp(targetBtm, 0.1);
        break;
      case 'BottomRight':
        const targetBtmLeft = moveQuaterion(
          [-Math.SQRT1_2, Math.SQRT1_2, 0],
          Math.PI * 0.15,
        );
        // neutralise();
        Face.current.quaternion.slerp(targetBtmLeft, 0.075);
        break;
      case 'BottomLeft':
        const targetBtmRt = moveQuaterion(
          [-Math.SQRT1_2, -Math.SQRT1_2, 0],
          Math.PI * 0.15,
        );
        // neutralise();
        Face.current.quaternion.slerp(targetBtmRt, 0.075);
        break;
      case 'Top':
        const targetTp = moveQuaterion([1, 0, 0], Math.PI * 0.075);
        Face.current.quaternion.slerp(targetTp, 0.1);
        break;
      case 'TopRight':
        const targetTpLt = moveQuaterion(
          [Math.SQRT1_2, Math.SQRT1_2, 0],
          Math.PI * 0.1,
        );
        Face.current.quaternion.slerp(targetTpLt, 0.1);
        break;
      case 'TopLeft':
        const targetTpRt = moveQuaterion(
          [Math.SQRT1_2, -Math.SQRT1_2, 0],
          Math.PI * 0.1,
        );
        Face.current.quaternion.slerp(targetTpRt, 0.1);
        break;
      case 'Right':
        const targetLt = moveQuaterion([0, Math.SQRT1_2, 0], Math.PI * 0.1);
        Face.current.quaternion.slerp(targetLt, 0.1);
        break;
      case 'Left':
        const targetRt = moveQuaterion([0, -Math.SQRT1_2, 0], Math.PI * 0.1);
        Face.current.quaternion.slerp(targetRt, 0.1);
        break;
      // default:
      //   const targetNorm = moveQuaterion([1, 1, 1], 0);
      //   Face.current.quaternion.slerp(targetNorm, 0.1);
      //   break;
    }
  });
  function BeAngry() {
    EyeRefR_Angry.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
    EyeRefL_Angry.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
  }
  function DontBeAngry() {
    EyeRefR_Angry.current.scale.lerp(new THREE.Vector3(1.0, 0.0, 1.0), 0.1);
    EyeRefL_Angry.current.scale.lerp(new THREE.Vector3(1.0, 0.0, 1.0), 0.1);
  }
  function BeHappy() {
    EyeRefR_Happy.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
    EyeRefL_Happy.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
  }
  function DontBeHappy() {
    EyeRefR_Happy.current.scale.lerp(new THREE.Vector3(1.0, 0.0, 1.0), 0.1);
    EyeRefL_Happy.current.scale.lerp(new THREE.Vector3(1.0, 0.0, 1.0), 0.1);
  }
  function BeSerious() {
    EyeRefR_Serious.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
    EyeRefL_Serious.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
  }
  function DontBeSerious() {
    EyeRefR_Serious.current.scale.lerp(new THREE.Vector3(1.0, 0.0, 1.0), 0.1);
    EyeRefL_Serious.current.scale.lerp(new THREE.Vector3(1.0, 0.0, 1.0), 0.1);
  }
  function BeNormal() {
    EyeRefNormalL.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
    EyeRefNormalR.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
  }
  function DontBeNormal() {
    EyeRefNormalL.current.scale.lerp(new THREE.Vector3(1.0, 0.0, 1.0), 0.1);
    EyeRefNormalR.current.scale.lerp(new THREE.Vector3(1.0, 0.0, 1.0), 0.1);
  }
  //const [blink, setBlink] = useState(false);
  // setInterval(() => {
  //   // setBlink(!blink);
  //   console.log('blink');
  // }, 2000);

  const Fx = 50;
  const a = 4.7;
  const blinkTimeGap = 2;
  const f = 9.1;
  const q = 24.5;
  const obPerformBlnk = (
    object: [THREE.Object3D, THREE.Object3D],
    elp: number,
  ) => {
    object[0].scale.lerp(
      new THREE.Vector3(
        1.0,
        // eslint-disable-next-line prettier/prettier
        Fx - Math.max( Math.abs(a * Math.sin(elp * blinkTimeGap) * a - f) - a,  q, ) - q,
        1.0,
      ),
      0.1,
    );
    object[1].scale.lerp(
      new THREE.Vector3(
        1.0,
        // eslint-disable-next-line prettier/prettier
        Fx - Math.max(  Math.abs(a * Math.sin(elp * blinkTimeGap) * a - f) -  a, q,) - q,
        1.0,
      ),
      0.1,
    );
  };

  useFrame(state => {
    if (browsShouldLerp) {
      switch (props.emotion) {
        case 'Happy':
          // unLerpAngerEyebrows();
          //resetPosition()
          DontBeAngry();
          DontBeNormal();
          DontBeSerious();
          BeHappy();

          AIState.current = 'Happy';
          obPerformBlnk(
            [EyeRefL_Happy.current, EyeRefR_Happy.current],
            state.clock.getElapsedTime(),
          );

          break;
        case 'Interogative':
          unLerpAngerEyebrows();
          // resetPosition();
          DontBeAngry();
          DontBeNormal();
          DontBeSerious();
          DontBeHappy();
          AIState.current = 'Interogative';
          break;

        case 'Serious':
          DontBeAngry();
          DontBeNormal();
          BeSerious();
          DontBeHappy();
          unLerpAngerEyebrows();
          AIState.current = 'Serious';
          obPerformBlnk(
            [EyeRefL_Serious.current, EyeRefR_Serious.current],
            state.clock.getElapsedTime(),
          );
          break;

        case 'Angry':
          BeAngry();
          DontBeNormal();
          DontBeSerious();
          DontBeHappy();
          LerpAngerEyebrows();
          AIState.current = 'Angry';
          obPerformBlnk(
            [EyeRefL_Angry.current, EyeRefR_Angry.current],
            state.clock.getElapsedTime(),
          );
          break;

        case 'None':
          DontBeAngry();
          BeNormal();
          DontBeSerious();
          DontBeHappy();
          unLerpAngerEyebrows();
          obPerformBlnk(
            [EyeRefNormalL.current, EyeRefNormalR.current],
            state.clock.getElapsedTime(),
          );
          AIState.current = 'None';
          break;
      }
    }
  });
  useFrame((state: any) => {
    const tm = state.clock.getElapsedTime();

    if (props.gesture === 'HeadShake') {
      const targetScale = new THREE.Vector3(1.0, 0.5, 1.0);
      if (!EyeRefR_Happy.current.scale.equals(targetScale)) {
        EyeRefR_Happy.current.scale.lerp(targetScale, 0.1);
      }

      if (!EyeRefL_Happy.current.scale.equals(targetScale)) {
        EyeRefL_Happy.current.scale.lerp(targetScale, 0.1);
      }
      // Ensure Face.current is defined
      // Check the current rotation and set the direction
      if (Face.current.rotation.y >= 0.1) {
        HeadShakeDir.current = 0; // Change direction to left
      } else if (Face.current.rotation.y <= -0.1) {
        HeadShakeDir.current = 1; // Change direction to right
      }
      // Apply rotation based on the current direction
      if (HeadShakeDir.current === 0) {
        Face.current.rotation.y -= 0.02; // Rotate left
      } else if (HeadShakeDir.current === 1) {
        Face.current.rotation.y += 0.02; // Rotate right
      }
    }

    if (props.gesture === 'Nod') {
      // Ensure Face.current is defined
      // Check the current rotation and set the direction
      if (Face.current.rotation.x >= 0.1) {
        NodDir.current = 0; // Change direction to left
      } else if (Face.current.rotation.x <= -0.1) {
        NodDir.current = 1; // Change direction to right
      }

      // Apply rotation based on the current direction
      if (NodDir.current === 0) {
        Face.current.rotation.x -= 0.01; // Rotate left
      } else if (NodDir.current === 1) {
        Face.current.rotation.x += 0.02; // Rotate right
      }
    }

    if (props.gesture === 'ShakeAnger') {
      // props.setColorOnEmotion();
      Face.current.position.x = Math.sin(tm * 10.0) * -0.1;
    }
  });

  return (
    <>
      <group ref={Face} position={[0, 0.0, 0]}>
        {/* Eye Brows */}
        <mesh
          material={EyeBrowMaterial}
          geometry={EyeBrowGeometry}
          position={[0.15, 0.1, -0.75]}
          ref={EyeBrowRefL}
          //visible={props.shouldEnableEyeBrows}
          visible={false}
        />
        <mesh
          material={EyeBrowMaterial}
          geometry={EyeBrowGeometry}
          position={[-0.15, 0.1, -0.75]}
          ref={EyeBrowRefR}
          visible={false}
        />

        <mesh
          material={EyeBrowMaterial}
          geometry={EyeBrowGeometry}
          visible={false}
          scale={[0, 1, 1]}
          rotation={[-0.6, 0.4, 0.0]}
          position={[0.15, 0.2, -0.75]}
          ref={EyeBrowRefLD}
        />

        <mesh
          material={EyeBrowMaterial}
          visible={false}
          geometry={EyeBrowGeometry}
          scale={[0, 1, 1]}
          position={[-0.15, 0.2, -0.75]}
          ref={EyeBrowRefRD}
        />

        {/* General Eyes */}

        <mesh
          geometry={EyeGeometry}
          position={[0.15, 0.06, -0.7]}
          material={EyeMaterial}
          ref={EyeRefNormalL}
        />
        <mesh
          geometry={EyeGeometry}
          position={[-0.15, 0.06, -0.7]}
          material={EyeMaterial}
          ref={EyeRefNormalR}
        />
        <mesh
          //rotateX={Math.PI / 2}
          geometry={HappyEyeGeometry}
          //visible={props.shouldEnableEyeBrows}
          position={[0.15, 0, -0.7]}
          scale={new THREE.Vector3(0.001, 0.001, 0.001)}
          material={EyeMaterial}
          ref={EyeRefL_Happy}
        />
        <mesh
          //rotateX={Math.PI / 2}
          geometry={HappyEyeGeometry}
          //visible={props.shouldEnableEyeBrows}
          position={[-0.15, 0, -0.7]}
          scale={new THREE.Vector3(0.001, 0.001, 0.001)}
          material={EyeMaterial}
          ref={EyeRefR_Happy}
        />
        <mesh
          //rotateX={Math.PI / 2}
          geometry={SeriousEyeGeometry}
          //visible={props.shouldEnableEyeBrows}
          position={[-0.15, 0.06, -0.7]}
          scale={new THREE.Vector3(0.01, 0.01, 0.01)}
          material={EyeMaterial}
          ref={EyeRefL_Serious}
          //visible={false}
        />
        <mesh
          //rotateX={Math.PI / 2}
          geometry={SeriousEyeGeometry}
          //visible={props.shouldEnableEyeBrows}
          position={[0.15, 0.06, -0.7]}
          scale={new THREE.Vector3(0.01, 0.01, 0.01)}
          material={EyeMaterial}
          ref={EyeRefR_Serious}
          //visible={false}
        />

        <mesh
          //rotateX={Math.PI / 2}
          geometry={AnrgyEyeGeometry_R}
          //visible={props.shouldEnableEyeBrows}
          position={[0.15, 0.06, -0.7]}
          scale={new THREE.Vector3(0.01, 0.01, 0.01)}
          material={EyeMaterial}
          ref={EyeRefR_Angry}
        />

        <mesh
          //rotateX={Math.PI / 2}
          geometry={AnrgyEyeGeometry_L}
          //visible={props.shouldEnableEyeBrows}
          position={[-0.15, 0.06, -0.7]}
          scale={new THREE.Vector3(0.01, 0.01, 0.01)}
          material={EyeMaterial}
          ref={EyeRefL_Angry}
          // ref={EyeRef _Angry}
        />
      </group>
      <mesh
        //geometry={Circle}  AnrgyEyeGeometry_L
        material={
          new THREE.ShaderMaterial({
            transparent: true,
            vertexShader: `
          varying vec2 vUv;
          void main() {
           vUv = uv;
           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
            fragmentShader: `

            varying vec2 vUv;
            void main() {
              // Define the center and radius of the circle
              vec2 center = vec2(0.5, 0.5); // Center of the circle in UV space
              float radius = 0.4;           // Radius of the circle

              // Calculate the distance from the current fragment to the center
              float dist = distance(vUv, center);

              // Define a fade-out factor based on the distance from the center
              float fade = smoothstep(radius, radius + 0.1, dist);

              // Set the color of the circle
              vec3 color = vec3(0.0, 0.0, 0.0); // Example color (orange)

              // Apply the fade effect
              gl_FragColor = vec4(color, 0.65 - fade);
          }
      `,
            side: 2,
          })
        }
        position={[0, 0, -0.1]}>
        {/* <sphereGeometry args={[0.5, 15]} /> */}
        <planeGeometry args={[1.125, 1.125]} />
        {/* <boxGeometry /> */}
        {/* <circleGeometry /> */}
      </mesh>
    </>
  );
};

export default AIEyes;
