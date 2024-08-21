const SHADER = /*glsl*/ `
      uniform float uTime;
      uniform sampler2D uPerlinTexture;
      varying vec2 vUv;
      uniform vec3 uBlobColor;
      uniform float uSmokeSize;
      uniform float isAngry;

      void main()
      {
          // Scale and animate
          vec2 smokeUv = vUv;
          smokeUv.x *= 0.5;
          smokeUv.y *= 0.3;
          smokeUv.y -= uTime * 0.03;

          // Smoke
          float smoke = texture(uPerlinTexture, smokeUv).r;
          smoke *= uSmokeSize;
          // Remap
          smoke = smoothstep(0.4, 1.0, smoke);

          // Edges
          smoke *= smoothstep(0.0, 0.1, vUv.x);
          smoke *= smoothstep(1.0, 0.9, vUv.x);
          smoke *= smoothstep(0.0, 0.1, vUv.y);
          smoke *= smoothstep(1.0, 0.4, vUv.y);

          // Final color
            gl_FragColor = vec4(uBlobColor , smoke);
          
          // #include <tonemapping_fragment>
          // #include <colorspace_fragment>
        // gl_FragColor = vec4(vUv,1.0,1.0);
        //  gl_FragColor = vec4(0.33, 0.48, 0.79, 1.0);
      }
    `;

export default SHADER;
