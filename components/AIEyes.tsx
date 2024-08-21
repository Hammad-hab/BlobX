import * as THREE from 'three';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useFrame} from '@react-three/fiber';

interface AIEyesProps {
  emotion: 'Happy' | 'Angry' | 'Serious' | 'Interogative' | 'None';
  gesture?: 'Nod' | 'HeadShake' | 'None' | 'Wink' | 'ShakeAnger';
  eyeColor?: string;
  // setColorOnEmotion: () => void;
}

const AIEyes = (props: AIEyesProps) => {
  /** This file is not to be edited in any curcumstances. It includes precarious thresholds */
  const [browsShouldLerp, setLerpAccess] = useState(false);
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

  const EyeRefR = useRef<any>(null);
  const EyeRefL = useRef<any>(null);

  const EyeRefNormalL = useRef<any>(null);
  const EyeRefNormalR = useRef<any>(null);

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

  useFrame(() => {
    if (browsShouldLerp) {
      switch (props.emotion) {
        case 'Happy':
          unLerpAngerEyebrows();
          // resetPosition()
          // const oldVectorL_Hpy = EyeBrowRefL.current.position;
          // const oldVectorR_Hpy = EyeBrowRefR.current.position;
          // const newVectorR_Hpy = new THREE.Vector3(0.15, -0.06, -0.75);
          //  const newVectorL_Hpy = new THREE.Vector3(-0.15, -0.06, -0.75);
          //  oldVectorL_Hpy.copy(newVectorL_Hpy);
          //  oldVectorR_Hpy.copy(newVectorR_Hpy);
          EyeRefNormalL.current.scale.lerp(
            new THREE.Vector3(0.0, 0.0, 0.0),
            0.1,
          );
          EyeRefNormalR.current.scale.lerp(
            new THREE.Vector3(0.0, 0.0, 0.0),
            0.1,
          );
          EyeBrowRefL.current.scale.lerp(new THREE.Vector3(0.0, 0.1, 0.1), 0.1);
          EyeBrowRefR.current.scale.lerp(new THREE.Vector3(0.0, 0.1, 0.1), 0.1);
          EyeRefR.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeRefL.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeBrowRefLD.current.scale.lerp(new THREE.Vector3(0.7, 1, 1), 0.1);
          EyeBrowRefRD.current.scale.lerp(new THREE.Vector3(0.7, 1, 1), 0.1);
          AIState.current = 'Happy';

          break;
        case 'Interogative':
          unLerpAngerEyebrows();
          // resetPosition();
          EyeRefNormalL.current.scale.lerp(
            new THREE.Vector3(0.0, 0.0, 0.0),
            0.1,
          );
          EyeRefNormalR.current.scale.lerp(
            new THREE.Vector3(0.0, 0.0, 0.0),
            0.1,
          );
          EyeRefR.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeRefL.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeBrowRefLD.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
          EyeBrowRefRD.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
          EyeBrowRefL.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeBrowRefR.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          const oldVectorR_Ingv = EyeBrowRefR.current.position;
          const oldVectorL_Ingv = EyeBrowRefL.current.position;
          const newVectorR_Ingv = new THREE.Vector3(-0.15, 0.2, -0.75);
          const newVectorL_Ingv = new THREE.Vector3(0.15, 0.1, -0.75);
          oldVectorR_Ingv.lerp(newVectorR_Ingv, 0.1);
          oldVectorL_Ingv.lerp(newVectorL_Ingv, 0.1);
          AIState.current = 'Interogative';

          break;

        case 'Serious':
          unLerpAngerEyebrows();
          // resetPosition();
          EyeRefNormalL.current.scale.lerp(
            new THREE.Vector3(0.0, 0.0, 0.0),
            0.1,
          );
          EyeRefNormalR.current.scale.lerp(
            new THREE.Vector3(0.0, 0.0, 0.0),
            0.1,
          );
          EyeRefR.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeRefL.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeBrowRefLD.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
          EyeBrowRefRD.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
          EyeBrowRefL.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeBrowRefR.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          const oldVectorL_Srs = EyeBrowRefL.current.position;
          const oldVectorR_Srs = EyeBrowRefR.current.position;
          const newVectorR_Srs = new THREE.Vector3(0.15, 0.1, -0.75);
          const newVectorL_Srs = new THREE.Vector3(-0.15, 0.1, -0.75);
          oldVectorL_Srs.lerp(newVectorR_Srs, 0.1);
          oldVectorR_Srs.lerp(newVectorL_Srs, 0.1);
          AIState.current = 'Serious';

          break;

        case 'Angry':
          EyeRefNormalL.current.scale.lerp(
            new THREE.Vector3(0.0, 0.0, 0.0),
            0.1,
          );
          EyeRefNormalR.current.scale.lerp(
            new THREE.Vector3(0.0, 0.0, 0.0),
            0.1,
          );
          EyeRefR.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeRefL.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeBrowRefLD.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
          EyeBrowRefRD.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
          EyeBrowRefL.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          EyeBrowRefR.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          const oldVectorL_Pos = EyeBrowRefL.current.position;
          const oldVectorR_Pos = EyeBrowRefR.current.position;
          const newVectorR_Pos = new THREE.Vector3(0.15, 0.1, -0.75);
          const newVectorL_Pos = new THREE.Vector3(-0.15, 0.1, -0.75);
          oldVectorL_Pos.lerp(newVectorR_Pos, 0.1);
          oldVectorR_Pos.lerp(newVectorL_Pos, 0.1);
          LerpAngerEyebrows();
          AIState.current = 'Angry';
          break;

        case 'None':
          unLerpAngerEyebrows();
          EyeRefNormalL.current.scale.lerp(
            new THREE.Vector3(1.0, 1.0, 1.0),
            0.1,
          );
          EyeRefNormalR.current.scale.lerp(
            new THREE.Vector3(1.0, 1.0, 1.0),
            0.1,
          );
          EyeBrowRefL.current.scale.lerp(new THREE.Vector3(0.0, 0.1, 0.1), 0.1);
          EyeBrowRefR.current.scale.lerp(new THREE.Vector3(0.0, 0.1, 0.1), 0.1);
          EyeRefL.current.scale.lerp(new THREE.Vector3(0.0, 0.0, 0.0), 0.1);
          EyeRefR.current.scale.lerp(new THREE.Vector3(0.0, 0.0, 0.0), 0.1);
          EyeBrowRefLD.current.scale.lerp(new THREE.Vector3(0.7, 1, 1), 0.1);
          EyeBrowRefRD.current.scale.lerp(new THREE.Vector3(0.7, 1, 1), 0.1);
          AIState.current = 'None';
          // const oldVectorL_Pos = EyeBrowRefL.current.position;
          // const oldVectorR_Pos = EyeBrowRefR.current.position;
          // const newVectorR_Pos = new THREE.Vector3(0.15, 0.1, -0.75);
          // const newVectorL_Pos = new THREE.Vector3(-0.15, 0.1, -0.75);
          // oldVectorL_Pos.lerp(newVectorR_Pos, 0.1);
          // oldVectorR_Pos.lerp(newVectorL_Pos, 0.1);
          // LerpAngerEyebrows();
          //AIState.current = 'Angry';
          break;
      }
      // AIState.current = props.emotion;
    }
    // if (props.gesture === "HeadShake") {

    // }
    // if (props.gesture === "HeadShake") {
    // }
  });
  // const [isWinking, setIsWinking] = useState(false);
  // const [winkProgress, setWinkProgress] = useState(0);

  // useFrame((state, delta) => {
  //   if (EyeRefR.current) {
  //     if (isWinking) {
  //       setWinkProgress(prev => prev + delta);
  //       if (winkProgress >= 1) {
  //         setIsWinking(false);
  //         setWinkProgress(0);
  //       }
  //       EyeRefR.current.scale.lerp(new THREE.Vector3(1, 0, 1), winkProgress);
  //     } else {
  //       EyeRefR.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
  //     }
  //   }
  // });

  // const handleWink = () => {
  //   setIsWinking(true);
  // };
  // setInterval(() => {
  //   handleWink();
  // }, 6000);
  useFrame((state: any) => {
    const tm = state.clock.getElapsedTime();
    if (props.gesture !== 'HeadShake') {
      const targetScale = new THREE.Vector3(1.0, 1.0, 1.0);
      EyeRefR.current.scale.lerp(targetScale, 0.1);
      EyeRefL.current.scale.lerp(targetScale, 0.1);
    }

    if (props.gesture === 'HeadShake') {
      const targetScale = new THREE.Vector3(1.0, 0.5, 1.0);
      if (!EyeRefR.current.scale.equals(targetScale)) {
        EyeRefR.current.scale.lerp(targetScale, 0.1);
      }

      if (!EyeRefL.current.scale.equals(targetScale)) {
        EyeRefL.current.scale.lerp(targetScale, 0.1);
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
    <group ref={Face}>
      {/* Eye Brows */}
      <mesh
        material={EyeBrowMaterial}
        geometry={EyeBrowGeometry}
        position={[0.15, 0.1, -0.75]}
        ref={EyeBrowRefL}
      />
      <mesh
        material={EyeBrowMaterial}
        geometry={EyeBrowGeometry}
        position={[-0.15, 0.1, -0.75]}
        ref={EyeBrowRefR}
      />

      <mesh
        material={EyeBrowMaterial}
        geometry={EyeBrowGeometry}
        scale={[0, 1, 1]}
        rotation={[-0.6, 0.4, 0.0]}
        position={[0.15, 0.2, -0.75]}
        ref={EyeBrowRefLD}
      />

      <mesh
        material={EyeBrowMaterial}
        geometry={EyeBrowGeometry}
        scale={[0, 1, 1]}
        position={[-0.15, 0.2, -0.75]}
        ref={EyeBrowRefRD}
      />

      {/* General Eyes */}

      <mesh
        geometry={EyeGeometry}
        position={[0.15, 0, -0.75]}
        material={EyeMaterial}
        ref={EyeRefNormalL}
      />
      <mesh
        geometry={EyeGeometry}
        position={[-0.15, 0, -0.75]}
        material={EyeMaterial}
        ref={EyeRefNormalR}
      />
      <mesh
        //rotateX={Math.PI / 2}
        geometry={HappyEyeGeometry}
        position={[0.15, 0, -0.75]}
        scale={new THREE.Vector3(0.001, 0.001, 0.001)}
        material={EyeMaterial}
        ref={EyeRefL}
      />
      <mesh
        //rotateX={Math.PI / 2}
        geometry={HappyEyeGeometry}
        position={[-0.15, 0, -0.75]}
        scale={new THREE.Vector3(0.001, 0.001, 0.001)}
        material={EyeMaterial}
        ref={EyeRefR}
      />
    </group>
  );
};

export default AIEyes;
