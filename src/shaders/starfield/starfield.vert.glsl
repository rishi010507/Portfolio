uniform float uTime;
uniform float uPixelRatio;
uniform float uSizeScale;
attribute float aSize;
attribute float aSeed;
varying float vTwinkle;
varying float vMix;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float twinkle = 0.65 + 0.35 * sin(uTime * (0.5 + aSeed * 1.6) + aSeed * 21.0);
  vTwinkle = twinkle;
  vMix = fract(aSeed * 7.31);
  float ps = aSize * uSizeScale * uPixelRatio * (130.0 / max(-mvPosition.z, 0.5));
  gl_PointSize = clamp(ps, 0.5, 10.0 * uPixelRatio);
  gl_Position = projectionMatrix * mvPosition;
}
