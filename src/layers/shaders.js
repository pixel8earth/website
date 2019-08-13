const vert = `
  attribute vec4 ca;
  uniform float size;
  varying vec3 vUv;
  varying vec4 vColor;
  void main()
  {
      vColor = ca;
      vUv = position;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      gl_PointSize = min(max(size * vUv.z, 0.25), 1.75);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const frag = `
  varying vec4 vColor;
  precision mediump float;
  void main()
  {
      gl_FragColor = vec4(vColor);
      gl_FragColor.a = vColor[3];
  }
`

module.exports = { vert, frag }
