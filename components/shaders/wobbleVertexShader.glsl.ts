/**
 * The given file contains a GPU Vertex Shader written in GLSL.
 * Do not change unless you know what you're doing. Operations
 * in this shader are based on mathematical equations.
 * @NOTE This is NOT JavaScript
 */
const SHADER = /*glsl*/ `
/* @DECLARE VERTEX SHADER */
uniform float uTime;
uniform sampler2D uPerlinTexture;
uniform float uSmokeSpeed;
uniform vec3 uSpeechDisplacement;
varying vec2 vUv;
vec2 rotate2D(vec2 value, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

void main() {
    vec3 newPosition = position;
	vec4 perlinTxt = texture(uPerlinTexture, uv);
    // Twist
    float twistPerlin = texture(
        uPerlinTexture,
        vec2(0.5, uv.y * 0.2 - uTime * 0.005)
    ).r;
    float angle = twistPerlin * 10.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
        texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 10.;
    newPosition.y += abs(sin(uTime*(uSpeechDisplacement.x ))) * 0.025;
    newPosition.z += abs(sin(uTime*(uSpeechDisplacement.x ))) * 0.025;
    newPosition.x += abs(sin(uTime*(uSpeechDisplacement.x ))) * 0.025;

    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Varyings
    vUv = uv;
}
/* @END VERTEX SHADER */
`;

export default SHADER;
