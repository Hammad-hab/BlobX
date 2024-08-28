# BlobX

BlobX is a Pure React Native Project that creates an animated fluid-like character using Three.js and WebGL. The character can display various emotions and gestures based on user input. It uses `expo-gl` and some other Expo Polyfils in order to render graphics in react native. Despite using some expo polyfills, it is written in bare bones react-native

## Features

- Animated fluid-like character
- Ability to set text, rotation speed, emotion, and length of animation
- Supports emotions: Angry, Happy, Serious, Interrogative
- Supports gestures: Nod, HeadShake, ShakeAnger
- Eye movements and Blinking.
- Customizable color settings
- Randomness option for added variation

## Installation

1. Clone the repository:
   ```bash
    git clone https://github.com/your-username/blobby.git
   ```

## Debug UI

```js
import React, {Suspense} from 'react';
import {Canvas} from '@react-three/fiber/native';
import Fluid from './components/WobbleFluid';
import Slider from '@react-native-community/slider';
import {useState} from 'react';
import { Text } from 'react-native';
```

Slider, Text, Canvas will be installed, all the dependencies are present in the **package.json file**. The rest of the imports point towards the components, which are present in the components folder,

    There are five sets of states, each state is the setter of a color, five states in one pair are the Red Blue Green Values, Each pair will change the     					color of the sphere in the sphere there are in total five smoke animation spheres, you may uncoment the following code  in line 91

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

---

***Setting the Colors :***

After choosing the right colors here is how to set them permanently :

1) Go to the WobbleFluid.tsx file in Components Folder.
2) Set the color in the vector  like so in the code chunk from line 281-285:
3) ```js
         const color_1 = new THREE.Vector3(0.13, 0.6, 0.89); // First Sphere
         const color_2 = new THREE.Vector3(0.86, 0.2, 0.27); // Second Sphere
         const color_3 = new THREE.Vector3(0, 0.42, 0.18); // Third Sphere
         const color_4 = new THREE.Vector3(0.97, 0.52, 0.15); // Fourth Sphere
         const color_5 = new THREE.Vector3(0.94, 0.6, 0.22); // Fifth Sphere
   ```

All the code at this point is thoroughly commented defining the number of the sphere each line writes to.

Next go to the useEffect at line 151 and set the colors in `createMatUniformVariation`, and change the Vector3 values to the corresponding GLSL RGB values selected above in `color_1`, `color_2` etc.
> **NOTE: Colors should not be in standard RGB form, they should be in the form of GLSL RGB (i.e they range from 0-1 instead of 0-255). You can color pick in GLSL RGB [here](>https://keiwando.com/color-picker/)**

# Attributes and Properties of the `Fluid` Component :

* #### **Text (`text`, Required):**

  This is the text that you have to provide, the animations that are wobble,radius fluctuations, color movements, are dependent on the text that is provided through the props, this text will be the text that the your  AI voice component will use to generate voice both the things may be played simultaneously to give the thought voice effect. This text must be in String format.
* #### **Rotation Speed ( `rotationSpeed`, Optional ):**

  Rotation speed is the value that will let you controll how agressively or how calmly do you want the animation to be. However the value set currently is the best, this statement was made on the basis of experimentation.
* #### Jitter ( `jitter`, Optional ) :

  Jitter is the prop that will let you controll the smoothness of the animation, this value is between 1 and 0. On either extreme, the animation will stop (That is the way the `lerp` function mathematically works), the lower the value the smoother the animation will be (it must not be 0). The default value is recomended one it was set on the basis of experimentation.
* #### **Length ( `length`, Required ) :**

  Length is the prop that specifies the time it takes to complete the text based animation, and the time taken for the text to be read, must be specified, this is how you can controll the phase of the text based animation and your text to AI voice over. this value is in ms (milliseconds).

  `prop.length` should never be zero since it is used in many mathematical operations throughout the component. Setting it to zero will raise errors while causing
* ### Blink Frequency (`blinkFreq`):

  This value input will allow you to controll how frequently the character will blink, the higer the blink value the more it
* ### Gestures ( `gesture` ) :

  The gestures are the special effect that have been added: this prop is a string and can recive any of the folowing inputs :


  1. `None` will return to normal.
  2. `HeadShake`.
  3. `Nod`.
  4. ` ShakeAnger`.
  5. `Hop`.

  Another attribtue associated with `Hop` is `hopContinious` which is a a boolean value that will make the character to jump without stoping unless the value is fliped to false.
* ### Emotions ( `emote` ):

  This prop allows you to set emotional states, the expression will remain permanent and the color will fade out elegently giving a nice smooth effect. Following are the values that can be set :


  1. `Angry`
  2. `Happy`
  3. `None` will return to normal.
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

## Files and Code

1. `MaterialContainer.ts`: Contains a simple data structure for handling and managing multiple `shaderMaterials` efficiently to ensure that the app remains performant and mantainably
2. `AIEyes.tsx`: Contains code for the Eyes of the Character. It is used by `WobbleFluid.tsx`
3. `TextAnimation.ts`: Contains a function `animateText` which is used for generating animation keyframes
4. `perlin.png`: Important image containing pre-calculated noise and mathematical output of `Perlin Noise`. It is used extensively for rendering the shadows and smoke. ***DO NOT DELETE***
5. `/shaders/`:
   1. `wobbleFragmentShader.glsl.ts`: Contains the main fragment shader that is run on the GPU in order to render the material of the Fluid.
   2. `wobbleVertexShader.glsl.ts`: Contains the main vertex shader run on the GPU for rendering the geometry of the Fluid.
