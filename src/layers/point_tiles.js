import * as THREE from 'three'
import Base from './base'

class PointTiles extends Base {
  vert = `
    attribute vec3 ca;
    uniform float size;
    varying vec3 vUv;
    varying vec3 vColor;
    void main()
    {
        vColor = ca;
        vUv = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        gl_PointSize = min(max(size * vUv.z, 0.5), 2.0);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `

  frag = `
    varying vec3 vColor;
    precision mediump float;
    void main()
    {
        gl_FragColor = vec4(vColor, 1.0);
        gl_FragColor.a = 1.0;
    }
  `
  material = new THREE.ShaderMaterial( {
    uniforms: {
      size: { type: 'f', value: 100.0 },
      color:  {type: 'vec3',  value: new THREE.Color( 0xffffff ) }
    },
    depthTest: false,
    depthWrite: false,
    transparent:  true,
    vertexShader: this.vert,
    fragmentShader: this.frag,
  })

  colorMap = {
    2: [0.0, 1.0, 1.0],
    3: [0.0, 1.0, 0.0],
    6: [0.5, 0.75, 0.3]
  }

  receiveMessage = async (e) => {
    const { result, job, error, url, coords } = e.data;
    if (job === 'fetchTileComplete' && !error) {
      const fetchIndex = this.fetchingUrls.indexOf(url);
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1);
      const vertices = new THREE.Float32BufferAttribute( result[0], 3 );
      const colors = new THREE.Float32BufferAttribute( result[1], 3 );
      const geom = new THREE.BufferGeometry()
      geom.addAttribute('position', vertices)
      geom.addAttribute('ca', colors)
      this.cachedTiles[coords] = geom;
      this.addTile(coords, geom);
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
    const colors = []
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
          // TODO must completely refactor all styling to be a bit more robust for different data
          if (rData[3] === 2) {
            colors.push(0.0, 1.0 , 1.0)
          } else if (rData[3] === 6) {
            colors.push(.5, .5, 1)
          } else {
            colors.push(0.0, .9, 0.0)
          }
        }
      }
    });
    return [data,colors]
  }

  addTile(coords, geom) {
      const points = new THREE.Points(geom, this.material);
      const tileName = `${coords}-${points.uuid}`;
      points.name = tileName;
      this.loadedTiles.push(tileName);
      this.group.add(points);
      this.renderScene();
  }

}

export default PointTiles
