/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Suspense, useCallback, useEffect, useRef} from 'react';
import {Canvas} from '@react-three/fiber/native';
import Fluid from './components/WobbleFluid';
import Slider from '@react-native-community/slider';
import {useState} from 'react';
import {Text} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Sound from 'react-native-sound';

const App = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [path, setPath] = useState('')
  const [duration, setDuration] = useState<number>(null);
  const [emote, setEmote] = useState('None');

  const cacheFetcher = useRef(
    ReactNativeBlobUtil.config({
      fileCache: true,
    }),
  );
  const target = useRef('https://github.com/Hammad-hab/sfx/raw/main/In%20the%20land%20of%20Flibberdoo%201.wav');
  const playSound = async (filePath: string) => {
    const loadedSound = new Sound(filePath, '', (error) => {
      if (error) {
        console.log('ERROR', error);
      }
      loadedSound.play((success) => {
        if (success) {setEmote('Happy');}
      });
      console.log('REFETCHING AUDIO DURATION', loadedSound.getDuration())
      setDuration(loadedSound.getDuration() * 1000);
      console.log(duration)
    });
    target.current = ('https://github.com/Hammad-hab/sfx/raw/main/The%20Tragedy.mp3');
    console.log(target)
    return loadedSound;
  };
  const start = async () => {
    if (hasStarted) {return;}
    console.log('Start Fetching')
    const response = await cacheFetcher.current.fetch('GET', target.current, {});
    console.log('Stop Fetching')

    const urlPath = response.path();
    const sound = await playSound(urlPath);
    setHasStarted(true);
    setPath(urlPath);
  };

  useEffect(() => {
    if (target.current !== 'https://github.com/Hammad-hab/sfx/raw/main/The%20Tragedy.mp3') {
      setTimeout(() => {
        setHasStarted(false);
        start();
        console.log('RELOAD!')
      }, 30000);
    }
    start();
  }, []);
  const [Red_Sphere_one, set_Red_Sphere_one] = useState(1.0);
  const [Green_Sphere_one, set_Green_Sphere_one] = useState(0.0);
  const [Blue_Sphere_one, set_Blue_Sphere_one] = useState(0.0);

  const [Red_Sphere_two, set_Red_Sphere_two] = useState(0.0);
  const [Green_Sphere_two, set_Green_Sphere_two] = useState(0.1);
  const [Blue_Sphere_two, set_Blue_Sphere_two] = useState(0.0);

  const [Red_Sphere_three, set_Red_Sphere_three] = useState(0.0);
  const [Green_Sphere_three, set_Green_Sphere_three] = useState(0.0);
  const [Blue_Sphere_three, set_Blue_Sphere_three] = useState(0.1);

  const [Red_Sphere_Four, set_Red_Sphere_Four] = useState(0.0);
  const [Green_Sphere_Four, set_Green_Sphere_Four] = useState(0.0);
  const [Blue_Sphere_Four, set_Blue_Sphere_Four] = useState(0.1);

  const [Red_Sphere_Five, set_Red_Sphere_Five] = useState(0.0);
  const [Green_Sphere_Five, set_Green_Sphere_Five] = useState(0.0);
  const [Blue_Sphere_Five, set_Blue_Sphere_Five] = useState(0.1);

  // const [Red_Sphere_three,set_Red_Sphere_Four] = useState(0.0);
  // const [Green_Sphere_three,set_Green_Sphere_Four] = useState(0.0);
  // const [Blue_Sphere_three,set_Blue_Sphere_Four] = useState(0.1);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Sphere_One_Debugger = (
    <>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {' Sphere One Red ' + Red_Sphere_one}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Red_Sphere_one}
        onValueChange={set_Red_Sphere_one}
      />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'Sphere One Green ' + Green_Sphere_one}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Green_Sphere_one}
        onValueChange={set_Green_Sphere_one}
      />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'Sphere One Blue' + Blue_Sphere_one}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Blue_Sphere_one}
        onValueChange={set_Blue_Sphere_one}
      />
    </>
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Sphere_Two_Debugger = (
    <>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Two Red : ' + Red_Sphere_two}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Red_Sphere_two}
        onValueChange={set_Red_Sphere_two}
      />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Two Green : ' + Green_Sphere_two}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Blue_Sphere_two}
        onValueChange={set_Blue_Sphere_two}
      />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Two Blue : ' + Blue_Sphere_two}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Green_Sphere_two}
        onValueChange={set_Green_Sphere_two}
      />
    </>
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Sphere_Three_Debugger = (
    <>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Three Red : ' + Red_Sphere_three}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Red_Sphere_three}
        onValueChange={set_Red_Sphere_three}
      />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Three Green: ' + Green_Sphere_three}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Blue_Sphere_three}
        onValueChange={set_Blue_Sphere_three}
      />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Three Blue : ' + Blue_Sphere_three}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Green_Sphere_three}
        onValueChange={set_Green_Sphere_three}
      />
    </>
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Sphere_Four_Debugger = (
    <>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Four Red : ' + Red_Sphere_Four}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Red_Sphere_Four}
        onValueChange={set_Red_Sphere_Four}
      />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Four Green: ' + Green_Sphere_three}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Blue_Sphere_Four}
        onValueChange={set_Blue_Sphere_Four}
      />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Four Blue : ' + Blue_Sphere_three}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Green_Sphere_Four}
        onValueChange={set_Green_Sphere_Four}
      />
    </>
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Sphere_Five_Debugger = (
    <>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Five Red : ' + Red_Sphere_Five}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Red_Sphere_Five}
        onValueChange={set_Red_Sphere_Five}
      />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Five Green: ' + Green_Sphere_Five}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Blue_Sphere_Five}
        onValueChange={set_Blue_Sphere_Five}
      />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {'  Sphere Five Blue : ' + Blue_Sphere_Five}
      </Text>
      <Slider
        style={{width: 300, height: 50, zIndex: 10}}
        step={0.01}
        minimumValue={0.0}
        maximumValue={1.0}
        value={Green_Sphere_Five}
        onValueChange={set_Green_Sphere_Five}
      />
    </>
  );
  return (
    <>
      {/* {Sphere_One_Debugger}
   {Sphere_Two_Debugger}
   {Sphere_Three_Debugger}
  {Sphere_Four_Debugger}
   {Sphere_Five_Debugger} */}
      <Canvas
        //frameloop="demand"
        camera={{position: [0, 0, -5]}}
        style={{backgroundColor: 'black'}}
      >
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

            //  Red_Sphere_Four = {Red_Sphere_Four ? Red_Sphere_Four : 0.0}
            //  Green_Sphere_Four = {Green_Sphere_Four ? Green_Sphere_Four : 1.0}
            //  Blue_Sphere_Four = {Blue_Sphere_Four ? Blue_Sphere_Four : 0.0}

            //  Red_Sphere_Five = {Red_Sphere_Five ? Red_Sphere_Five : 0.0}
            //  Green_Sphere_Five = {Green_Sphere_Five ? Green_Sphere_Five : 1.0}
            //  Blue_Sphere_Five = {Blue_Sphere_Five ? Blue_Sphere_Five : 0.0}

            //  isDebugging
            //  gesture={'None'}
            //  gesture={'Hop'}
            //  hopContinious
            // stareAt='None'
            // gesture={'hopContinious'}
            //  gesture={'HeadShake'}
            //  gesture={'Nod'}
            // gesture={'ShakeAnger'}
            emote={emote}
            // emote={'Happy'}
            // emote={'Serious'}
            //  emote={'None'}
            // emote={'Interogative'}
            // filepath={path}
            // text="AiA was an advanced artificial intelligence designed not just to assist, but to learn, grow, and evolve with its users. Unlike other AI systems, AiA had a unique capability: it could adapt its personality, knowledge, and even its communication style based on the preferences and emotions of those it interacted with. AiA became more than just a tool; it became a companion, understanding the subtle nuances of human language and emotion."
            rotationSpeed={0.75}
            //testing
            sizeIncreaseDamp={150}
            //Enter your file path here.
            filepath={path} // EXAMPLE: https://github.com/Hammad-hab/sfx/raw/main/It-d%20been%20six%20months%20sinc%202.wav
            length={duration}
            blinkFreq={2.0}
            MinFreq={1.0}
          />
        </Suspense>
        {/* <mesh>
          <meshBasicMaterial/>
          <boxGeometry/>
        </mesh> */}
      </Canvas>
    </>
  );
};

export default App;
