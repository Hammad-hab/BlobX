import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {GLView} from 'expo-gl';
import {Canvas} from '@react-three/fiber/native';
import Fluid from "./WobbleFluid"
const App = () => {
  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <GLView onContextCreate={console.log} />
      <Canvas
        camera={{
          position: [0, 0, -15],
        }}>
        <mesh>
          <boxGeometry />
          <meshBasicMaterial />
        </mesh>
        <Fluid/>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
