import React from 'react';
import {Canvas} from '@react-three/fiber/native';
import Fluid from './WobbleFluid';

const App = () => {
  return (
    <Canvas camera={{position: [0, 0, -5]}} style={{backgroundColor: "white"}}>
      <Fluid />
    </Canvas>
  );
};

export default App;
