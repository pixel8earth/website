import * as THREE from 'three'
import Base from './base'

class PointTiles extends Base {
  vert = `
    uniform float size;
    varying vec3 vUv;
    void main()
    {
        vUv = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        gl_PointSize = min(max(size * vUv.z, 0.5), 2.0);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `

  frag = `
    uniform vec3 colorA;
    uniform vec3 colorB;
    varying vec3 vUv;
    precision mediump float;
    void main()
    {
        gl_FragColor = vec4(mix(colorA, colorB, (vUv.z*100.0)), 1.0);
        gl_FragColor.a = 1.0;
    }
  `
  material = new THREE.ShaderMaterial( {
    uniforms: {
      size: { type: 'f', value: 100.0 },
      colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
      colorA: {type: 'vec3', value: new THREE.Color(0xACE6EE)}
    },
    depthTest: false,
    depthWrite: false,
    transparent:  true,
    vertexShader: this.vert,
    fragmentShader: this.frag,
  })

  receiveMessage = async (e) => {
    const { result, job, error, url, coords } = e.data;
    if (job === 'fetchTileComplete' && !error) {
      const fetchIndex = this.fetchingUrls.indexOf(url);
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1);
      const vertices = new THREE.Float32BufferAttribute( result, 3 );
      this.cachedTiles[coords] = vertices;
      this.addTile(coords, vertices);
    } else if (error) {
      console.log('Error fetching tile: ', error)
    }
  }

  fetchHandler = (raw, offsets, size) => {
    const llPixel = (ll, zoom, _size) => {
      var size = _size * Math.pow(2, zoom);
      var d = size / 2;
      var bc = (size / 360);
      var cc = (size / (2 * Math.PI));
      var ac = size;
      var f = Math.min(Math.max(Math.sin((Math.PI / 180) * ll[1]), -0.9999), 0.9999);
      var x = d + ll[0] * bc;
      var y = d + 0.5 * Math.log((1 + f) / (1 - f)) * -cc;
      (x > ac) && (x = ac);
      (y > ac) && (y = ac);
      return [x, y];
    }

    const rows = raw.split('\n')
    const data = []
    rows.forEach((row, idx) => {
      if (idx > 0) {
        const rData = row.split(",").map(v => parseFloat(v))
        if (rData.length > 1) {
          // taken from sphericalmercator.js - including here cuz the imports are funky
          const ll =  [
            (rData[0] * (180 / Math.PI) / 6378137.0),
            ((Math.PI*0.5) - 2.0 * Math.atan(Math.exp(-rData[1] / 6378137.0))) * (180 / Math.PI)
          ]
          let px = llPixel(ll, 0, size)
          px = {x: px[0] - size / 2, y: px[1] - size / 2, z: rData[2] / 343}
          data.push(px.x - offsets.x)
          data.push(-px.y + offsets.y)
          data.push(px.z - offsets.z)
        }
      }
    });
    return data
  }

  addTile(coords, vertices) {
    if (vertices && vertices.count) {
      const geom = new THREE.BufferGeometry()
      geom.addAttribute('position', vertices)
      const points = new THREE.Points(geom, this.material);
      const tileName = `${coords}-${points.uuid}`;
      points.name = tileName;
      this.loadedTiles.push(tileName);
      this.group.add(points);
      this.renderScene();
    }
  }

}

export default PointTiles
