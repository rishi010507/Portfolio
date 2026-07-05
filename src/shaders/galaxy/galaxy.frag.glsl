varying vec3 vColor;
varying float vTwinkle;
varying float vBright;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);

  // screen-space anti-aliased pinpoint core — crisp regardless of point size/distance
  float aa = max(fwidth(d), 0.0008) * 1.4;
  float core = 1.0 - smoothstep(0.06 - aa, 0.06 + aa, d);
  core = pow(core, 1.1);

  float halo = smoothstep(0.5, 0.1, d) * 0.2;

  float spike = 0.0;
  if (vBright > 0.5) {
    // thin four-point diffraction spike, like a bright star through a real lens
    float lineWidth = 0.03;
    float armX = (1.0 - smoothstep(0.0, lineWidth, abs(uv.y))) * smoothstep(0.5, 0.02, abs(uv.x));
    float armY = (1.0 - smoothstep(0.0, lineWidth, abs(uv.x))) * smoothstep(0.5, 0.02, abs(uv.y));
    spike = max(armX, armY) * 0.5;
  }

  float strength = clamp(core + halo + spike, 0.0, 1.0);
  gl_FragColor = vec4(vColor, strength * vTwinkle);
}
