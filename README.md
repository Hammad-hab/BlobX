# BlobX

BlobX is a Pure React Native Project that creates an animated fluid-like character using Three.js and WebGL. The character can display various emotions and gestures based on user input. It uses `expo-gl` and some other Expo Polyfils in order to render graphics in react native. Despite using some expo polyfills, it is written in bare bones react-native

## Features

- Animated fluid-like character
- Ability to set text, rotation speed, emotion, and length of animation
- Supports emotions: Angry, Happy, Serious, Interrogative
- Supports gestures: Nod, HeadShake, ShakeAnger
- Eye movements in Nine different directions and Randomized natural Blinking.
- Customizable color settings

## Color Debug UI

```js
import React, {Suspense} from 'react';
import {Canvas} from '@react-three/fiber/native';
import Fluid from './components/WobbleFluid';
import Slider from '@react-native-community/slider';
import {useState} from 'react';
import { Text } from 'react-native';
```

Slider, Text, Canvas will be installed, all the dependencies are present in the **package.json file**. The rest of the imports point towards the components, which are present in the components folder,

There are five sets of states, each state is the setter of a color, five states in one pair are the Red BluGreen Values, Each pair will change the color of the sphere in the sphere there are in total fivsmoke animation spheres, you may uncoment the following code  in line 259

```js
 {/* {Sphere_One_Debugger}
   {Sphere_Two_Debugger}
   {Sphere_Three_Debugger}
   {Sphere_Four_Debugger}
   {Sphere_Five_Debugger}

 */}
```

when uncomented the sliders will appear.

> **NOTE: Don't Use more than two Debuggers at the same time, don't worry nothing will break, it is not recomended because a lot of sliders will appear at once and cover the whole screen**

in the comments you can see the there are the commented attributes these are the states that will be passed down to the Fluid component, just by commenting and uncommenting these parts you can controll the color values.

Turn the `isDebugging` prop to true in the Fluid component.

Turn the **testing** prop to true in the Fluid component.


---

***Setting the Colors :***

After choosing the right colors here is how to set them permanently :

1) Go to the WobbleFluid.tsx file in Components Folder.
2) Set the color in the vector  like so in the code chunk from line 335-339:
3) ```js
         const color_1 = new THREE.Vector3(0.13, 0.6, 0.89); // First Sphere
         const color_2 = new THREE.Vector3(0.86, 0.2, 0.27); // Second Sphere
         const color_3 = new THREE.Vector3(0, 0.42, 0.18); // Third Sphere
         const color_4 = new THREE.Vector3(0.97, 0.52, 0.15); // Fourth Sphere
         const color_5 = new THREE.Vector3(0.94, 0.6, 0.22); // Fifth Sphere
   ```

All the code at this point is thoroughly commented defining the number of the sphere each line writes to.

Next go to the useEffect at line 193 and set the colors in `createMatUniformVariation`, and change the Vector3 values to the corresponding GLSL RGB values selected above in `color_1`, `color_2` etc. if the  prevoius values still show up when you activate the debug ui, you can set the colors respectivly in the useEffect values in line 231. for a more deep setting, you can also set the same values in the color states in the App component starting from line 45 but that would not be significant.

> **NOTE: Colors should not be in standard RGB form, they should be in the form of GLSL RGB (i.e they range from 0-1 instead of 0-255). You can color pick in GLSL RGB [here](>https://keiwando.com/color-picker/)**

# Attributes and Properties of the `Fluid` Component :

* #### **filepath (`filepath`, Required):**

  This is the audio file that you have to provide, the animations that are wobble,radius fluctuations, color movements, are dependent on the audio that is provided through the props, this audio will be the audio that the your  AI voice component will use to speak. both the things may be played simultaneously to give the thought voice effect. This filepath must be in String format.
* #### **Rotation Speed ( `rotationSpeed`, Optional ):**

  Rotation speed is the value that will let you controll how agressively or how calmly do you want the animation to be. However the value set currently is the best, this statement was made on the basis of experimentation.
* #### Jitter ( `jitter`, Optional ) :

  Jitter is the prop that will let you controll the smoothness of the animation, this value is between 1 and 0. On either extreme, the animation will stop (That is the way the `lerp` function mathematically works), the lower the value the smoother the animation will be (it must not be 0). The default value is recomended one it was set on the basis of experimentation.
* #### **Length ( `length`, Required ) :**

  Length is the prop that specifies the time it takes to complete the text based animation, and the time taken for the text to be read, must be specified, this is how you can controll the phase of the text based animation and your text to AI voice over. this value is in ms (milliseconds).

  `prop.length` should never be zero since it is used in many mathematical operations throughout the component. Setting it to zero will raise errors while causing
* ### Blink Frequency (`blinkFreq`):

  This value input will allow you to controll how frequently the character will blink, the higer the blink value the more it.
* #### Minimum Frequency  (MinFreq):

  This is the minium frequency of the blink, the minimum time it will take to blink in the randomised function.
* ### maxSize (`maxSize`):

  The Maximum size that can be reached during the fluctuation Note: this is a sensitive value small changes will result in high changes. max value: 2.0, default: 1.25
* ### Gestures ( `gesture` ) :

  The gestures are the special effect that have been added: this prop is a string and can recive any of the folowing inputs :


  1. `None` will return to normal.
  2. `HeadShake`.
  3. `Nod`.
  4. `ShakeAnger`.
  5. `Hop`.

  Another attribtue associated with `Hop` is `hopContinious` which is a a boolean value that will make the character to jump without stoping unless the value is fliped to false.
* ### Emotions ( `emote` ):

  This prop allows you to set emotional states, the expression will remain permanent and the color will fade out elegently giving a nice smooth effect. Following are the values that can be set :


  1. `Angry`
  2. `Happy`
  3. `None` (will return to normal).
  4. `Serious`
  5. `Interogative`
* ### Stare At (`stareAt`):

  This prop allows you to move the eyes in Eight different directions. The values are :


  1. `Top`
  2. `TopLeft`
  3. `TopRight`
  4. `Bottom`
  5. `BottomLeft`
  6. `BottomRight`
  7. `Left`
  8. `Right`
  9. `None`
* ### Ignore Errors (`ignoreErrors`)

  If set to true, the `Fluid` component will ignore all errors from the Fluid. NOT RECOMMENDED.
* ### `dangerousMatStateAccessCallback`

  A function callback called once the MaterialContainer is created. It gives you first hand access to all
  the materials used by the program.
  **Type**: `(x: MaterialContainer) => void`
  It's called dangerous because it can introduce memory leaks since you are asserting a callback into the
  main material execution stream.
* ### `randMax`

  A numerical prop that describes the largest random number that can be generated or obtained by the voice
  animation. Basically it is used to immitate small voice imperfections which get smoothed out once you lower
  the `jitter`
* ### `emotionOverrideTime`

  The amount of time that the component should wait before overwritting any emotion's colour effects.
  **Default**: 1

## Files and Code

1. `MaterialContainer.ts`: Contains a simple data structure for handling and managing multiple `shaderMaterials` efficiently to ensure that the app remains performant and mantainably
2. `AIEyes.tsx`: Contains code for the Eyes of the Character. It is used by `WobbleFluid.tsx`
3. `perlin.daturi.ts`: Important file containing pre-calculated noise and mathematical output of `Perlin Noise`. It is used extensively for rendering the shadows and smoke. ***DO NOT DELETE***
4. `/shaders/`:
   1. `wobbleFragmentShader.glsl.ts`: Contains the main fragment shader that is run on the GPU in order to render the material of the Fluid.
   2. `wobbleVertexShader.glsl.ts`: Contains the main vertex shader run on the GPU for rendering the geometry of the Fluid.

#### Screen Buttons :

these buttons when enabled basically set the new uri of audio, don't press the button untill the audio has finished, if you do the state will rerender twice and play two sounds at the same time, this is not a bug, since in the app, when the second audio is set the first will have already finished, that is how you can observe how the component will behave when file path changes.
