/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Suspense} from 'react';
import {Canvas} from '@react-three/fiber/native';
import Fluid from './components/WobbleFluid';
import Slider from '@react-native-community/slider';
import {useState} from 'react';
import { Text } from 'react-native';


const App = () => {

  const [Red_Sphere_one,set_Red_Sphere_one] = useState(1.0);
  const [Green_Sphere_one,set_Green_Sphere_one] = useState(0.0);
  const [Blue_Sphere_one,set_Blue_Sphere_one] = useState(0.0);


  const [Red_Sphere_two,set_Red_Sphere_two] = useState(0.0);
  const [Green_Sphere_two,set_Green_Sphere_two] = useState(0.1);
  const [Blue_Sphere_two,set_Blue_Sphere_two] = useState(0.0);


  const [Red_Sphere_three,set_Red_Sphere_three] = useState(0.0);
  const [Green_Sphere_three,set_Green_Sphere_three] = useState(0.0);
  const [Blue_Sphere_three,set_Blue_Sphere_three] = useState(0.1);


  // const [Red_Sphere_three,set_Red_Sphere_Four] = useState(0.0);
  // const [Green_Sphere_three,set_Green_Sphere_Four] = useState(0.0);
  // const [Blue_Sphere_three,set_Blue_Sphere_Four] = useState(0.1);



 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const Sphere_One_Debugger = <>
  <Text style={{fontSize: 20, fontWeight: 'bold'}}>{' Sphere One Red ' + Red_Sphere_one}</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0}    value={Red_Sphere_one}       onValueChange={set_Red_Sphere_one}/>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'Sphere One Green ' + Green_Sphere_one}</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0}    value={Green_Sphere_one}     onValueChange={set_Green_Sphere_one}/>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'Sphere One Blue' + Blue_Sphere_one}</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0}    value={Blue_Sphere_one}      onValueChange={set_Blue_Sphere_one}/>
 </>;

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const Sphere_Two_Debugger = <>
 
 <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Two Red : ' +  Red_Sphere_two }</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0}    value={Red_Sphere_two}       onValueChange={set_Red_Sphere_two}/>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Two Green : ' +  Green_Sphere_two }</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0}    value={Blue_Sphere_two}      onValueChange={set_Blue_Sphere_two}/>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Two Blue : ' +  Blue_Sphere_two }</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0}     value={Green_Sphere_two}     onValueChange={set_Green_Sphere_two}/>
 </>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Sphere_Three_Debugger = <>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Three Red : ' +  Red_Sphere_three }</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Red_Sphere_three}     onValueChange={set_Red_Sphere_three}/>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Three Green: ' +Green_Sphere_three}</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Blue_Sphere_three}    onValueChange={set_Blue_Sphere_three}/> 
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{'  Sphere Three Blue : ' +  Blue_Sphere_three}</Text>
    <Slider style={{width: 300, height: 50, zIndex: 10}} step={0.01} minimumValue={0.0}  maximumValue={1.0} value={Green_Sphere_three}   onValueChange={set_Green_Sphere_three}/>
</>;
  return (
    <>
   {/* {Sphere_One_Debugger}
   {Sphere_Two_Debugger}
   {Sphere_Three_Debugger} */}


      <Canvas
        camera={{position: [0, 0, -5]}}
        style={{backgroundColor: 'black'}}>
        <Suspense>
          <Fluid
          //  Red_Sphere_one={Red_Sphere_one ? Red_Sphere_one : 1.0}
          //  Green_Sphere_one={Green_Sphere_one ? Green_Sphere_one : 0.0}
          //  Blue_Sphere_one={Blue_Sphere_one ? Blue_Sphere_one : 0.0}

          //  Red_Sphere_two={Red_Sphere_two ? Red_Sphere_two : 1.0}
          //  Green_Sphere_two={Green_Sphere_two ? Green_Sphere_two : 0.0}
          //  Blue_Sphere_two={Blue_Sphere_two ? Blue_Sphere_two : 0.0}

          // Red_Sphere_three={Red_Sphere_three ? Red_Sphere_three : 0.0}
          // Green_Sphere_three={Green_Sphere_three ? Green_Sphere_three : 1.0}
          // Blue_Sphere_three={Blue_Sphere_three ? Blue_Sphere_three : 0.0}

        // isDebugging
        gesture={'None'}
        //  gesture={'Hop'}
        //hopContinious
         // gesture={'hopContinious'}
        // gesture={'HeadShake'}
                              // gesture={'Nod'}
        // gesture={'ShakeAnger'}

      emote={'None'}
       // emote={'Happy'}
        // emote={'Angry'}
        // emote={'Serious'}
        // emote={'Interogative'}


          text="Ever felt lost in a sea of words??? Or struggled to find your next great read???
Meet WordsWorth, your AI reading companion
WordsWorth makes understanding difficult texts a breeze. It breaks down complex ideas into simple language, so you can focus on what matters
But that's not all. WordsWorth knows your taste better than you do. It finds your next favorite book, saving you from endless searching.
WordsWorth. Understand more. Read better. Download now and transform your reading experience."
          rotationSpeed={0.75}
          enableRandomness
          //testing
          jitter={0.025}
          length={33000}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
