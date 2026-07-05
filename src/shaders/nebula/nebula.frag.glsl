#include ../shared/noise.glsl

uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  float dist = length(uv);

  vec3 p = vec3(uv * 2.6, uTime * 0.015);
  vec3 warp = vec3(fbm(p + 4.0, 4), fbm(p + 9.0, 4), 0.0) * 0.85;
  float n = fbm(p + warp, 5);
  n = n * 0.5 + 0.5;

  // high-contrast wisps: most of the plane stays near-transparent black,
  // only the noise ridges light up
  float wisp = pow(smoothstep(0.42, 0.92, n), 2.1);

  vec3 color = mix(uColorA, uColorB, smoothstep(0.3, 0.75, n));
  color = mix(color, uColorC, smoothstep(0.7, 0.98, n) * 0.7);

  float edgeFade = smoothstep(0.68, 0.08, dist);
  float density = wisp * edgeFade;

  gl_FragColor = vec4(color, density * uOpacity);
}
