uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;

attribute float aScale;
attribute float aSeed;
attribute float aBright;
attribute vec3 aColor;
attribute vec3 aRandomness;

varying vec3 vColor;
varying float vTwinkle;
varying float vBright;

void main() {
  vec3 pos = position;

  // differential rotation — inner stars orbit faster, arms wind over time
  float distanceToCenter = length(pos.xz);
  float angle = atan(pos.x, pos.z);
  angle += (1.0 / max(distanceToCenter, 0.5)) * uTime * 0.18;
  pos.x = sin(angle) * distanceToCenter;
  pos.z = cos(angle) * distanceToCenter;

  pos += aRandomness;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  float twinkle = 0.78 + 0.22 * sin(uTime * (0.6 + aSeed * 1.4) + aSeed * 31.4);
  vTwinkle = twinkle;
  vBright = aBright;

  float sizeBoost = 1.0 + aBright * 1.4;
  float ps = uSize * aScale * uPixelRatio * (320.0 / max(-mvPosition.z, 0.5)) * twinkle * sizeBoost;
  gl_PointSize = clamp(ps, 1.0, 26.0 * uPixelRatio);
  gl_Position = projectionMatrix * mvPosition;

  vColor = aColor;
}
