/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Suspense} from 'react';
import {Canvas} from '@react-three/fiber/native';
import Fluid from './components/WobbleFluid';
//import Slider from '@react-native-community/slider';
//import {useState} from 'react';
//import { Text,Button,Alert } from 'react-native';
import { OrbitControls } from '@react-three/drei';

const App = () => {
 // const [sliderValue, setSliderValue] = useState(1.0);
  // const [Red_Sphere_one,set_Red_Sphere_one] = useState(1.0);
  // const [Green_Sphere_one,set_Green_Sphere_one] = useState(0.0);
  // const [Blue_Sphere_one,set_Blue_Sphere_one] = useState(0.0);


  //  const [Red_Sphere_two,set_Red_Sphere_two] = useState(0.0);
  //  const [Green_Sphere_two,set_Green_Sphere_two] = useState(0.1);
  //  const [Blue_Sphere_two,set_Blue_Sphere_two] = useState(0.0);


 // const [Red_Sphere_three,set_Red_Sphere_three] = useState(0.0);
 // const [Green_Sphere_three,set_Green_Sphere_three] = useState(0.0);
 // const [Blue_Sphere_three,set_Blue_Sphere_three] = useState(0.1);

  //const [colorValue, setColorValue] = useState(0.0);
  //const [emotion, setEmotion] = useState('Angry');
  //const [gesture, setGesture] = useState('None');


  return (
    <>
    {/* <Text style={{fontSize: 20, fontWeight: 'bold'}}>{Red_Sphere_one}</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Red_Sphere_one} onValueChange={set_Red_Sphere_one}/>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{Green_Sphere_one}</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Green_Sphere_one} onValueChange={set_Green_Sphere_one}/>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{Blue_Sphere_one}</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Blue_Sphere_one} onValueChange={set_Blue_Sphere_one}/> */}

    {/* <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Three Red : ' +  Red_Sphere_two }</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Red_Sphere_two} onValueChange={set_Red_Sphere_two}/>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Three Green : ' +  Green_Sphere_two }</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Blue_Sphere_two} onValueChange={set_Blue_Sphere_two}/>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Three Blue : ' +  Blue_Sphere_two }</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Green_Sphere_two} onValueChange={set_Green_Sphere_two}/> */}

{/* 
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Three Red : ' +  Red_Sphere_three }</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Red_Sphere_three} onValueChange={set_Red_Sphere_three}/>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Three Green: ' +Green_Sphere_three}</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Blue_Sphere_three} onValueChange={set_Blue_Sphere_three}/> 
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Three Blue : ' +  Blue_Sphere_three}</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Green_Sphere_three} onValueChange={set_Green_Sphere_three}/>
     */}


     {/* <Slider
  // eslint-disable-next-line react-native/no-inline-styles
  style={{width: 300, height: 50, zIndex: 10}}
  step={0.01}
  minimumValue={0.0}
  maximumValue={1.0}
  value={sliderValue}
  onValueChange={setSliderValue}
/> */}
{/* <Button
        title="Happy"
        onPress={() =>{
          Alert.alert(emotion);
          setEmotion('Happy');
        }}
      />


<Button
        title="Angry"
        onPress={() =>{
          Alert.alert(emotion);
          setEmotion('Angry');
        }}
      /> */}

{/* <Slider
  // eslint-disable-next-line react-native/no-inline-styles
  style={{width: 300, height: 50, zIndex: 10}}
  step={0.01}
  minimumValue={0.0}
  maximumValue={1.0}
  value={colorValue}
  onValueChange={setColorValue}
/> */}


      <Canvas
        camera={{position: [0, 0, -5]}}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{backgroundColor: 'black'}}>
          {/* <OrbitControls/> */}
        <Suspense>
          <Fluid
           // Red_Sphere_one={Red_Sphere_one ? Red_Sphere_one : 1.0}
           // Green_Sphere_one={Green_Sphere_one ? Green_Sphere_one : 0.0}
           //  Blue_Sphere_one={Blue_Sphere_one ? Blue_Sphere_one : 0.0}

          //  Red_Sphere_two={Red_Sphere_two ? Red_Sphere_two : 1.0}
          //  Green_Sphere_two={Green_Sphere_two ? Green_Sphere_two : 0.0}
          //  Blue_Sphere_two={Blue_Sphere_two ? Blue_Sphere_two : 0.0}
          //gesture={'None'}

          gesture={'Hop'}
        // gesture={'hopContinious'}
        // gesture={'HeadShake'}
          // gesture={'Nod'}
         // gesture={'ShakeAnger'}
        // emote={'Happy'}
      //  hopContinious
      // emote={'None'}
      // hopContinious
      // emote={'Angry'}
     emote={'Serious'}
          //  emote={'Interogative'}
          //  Red_Sphere_three={Red_Sphere_three ? Red_Sphere_three : 0.0}
          //  Green_Sphere_three={Green_Sphere_three ? Green_Sphere_three : 1.0}
          // Blue_Sphere_three={Blue_Sphere_three ? Blue_Sphere_three : 0.0}

            text="Lorem dolor amet, adipiscing elit, sed do ei4usmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            rotationSpeed={0.75}
           // color={colorValue}
           enableRandomness
           jitter={0.025}
            length={34000}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
