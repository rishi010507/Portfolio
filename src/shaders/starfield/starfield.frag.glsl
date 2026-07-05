uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vTwinkle;
varying float vMix;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);

  // screen-space anti-aliased pinpoint core — crisp at any size/distance
  float aa = max(fwidth(d), 0.0008) * 1.4;
  float core = 1.0 - smoothstep(0.09 - aa, 0.09 + aa, d);

  vec3 color = mix(uColorA, uColorB, vMix);
  gl_FragColor = vec4(color, core * vTwinkle);
}
