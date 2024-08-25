const SHADER = /*glsl*/ `
    float rand(vec2 p){return fract(cos(dot(p,vec2(23.,2.)))*12345.);}

      #define BLACK vec3(0.0, 0.0, 0.0)
      uniform float uTime;
      uniform sampler2D uPerlinTexture;
      varying vec2 vUv;
      uniform vec3 uBlobColor;
      uniform float uSmokeSize;
      uniform float isAngry;
      uniform float opc;
      uniform vec3 uSpeachDisplacement;


      void main()
      {
          // Scale and animate
          vec2 smokeUv = vUv;
          smokeUv.x *= 0.5;
          smokeUv.y *= 0.3;
          smokeUv.y -= uTime * 0.03;

          // Smoke
          vec4 smpl = texture(uPerlinTexture, smokeUv);
          float smoke = smpl.r;
          smoke *= uSmokeSize;
          // Remap
          smoke = smoothstep(0.4, 1.0, smoke);

          // Edges
          smoke *= smoothstep(0.0, 0.1, vUv.x);
          smoke *= smoothstep(1.0, 0.9, vUv.x);
          smoke *= smoothstep(0.0, 0.1, vUv.y);
          smoke *= smoothstep(1.0, 0.4, vUv.y);
          
          float dist = distance(vUv, vec2(0.5)); // Calculate distance from center
          vec3 finalColor = mix(uBlobColor, uBlobColor* 2.0,  dist);
          vec3 oblivion = BLACK;

          finalColor.rgb *= 2.0;
          
          gl_FragColor = vec4(finalColor, (smoke*2.0) - opc);
      }
    `;

export default SHADER;
