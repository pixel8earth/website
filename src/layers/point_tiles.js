import * as THREE from 'three'
import Base from './base'

class PointTiles extends Base {

  constructor(name, url, options={}) {
    super(name, url, options)
    if (options.style && options.style.shaders ) {
      const { vert, frag } = options.style.shaders
      this.material = new THREE.ShaderMaterial( {
        uniforms: {
          size: { type: 'f', value: options.style.size || 1.0 }
        },
        depthTest: false,
        depthWrite: false,
        transparent:  true,
        vertexShader: vert,
        fragmentShader: frag,
      })
    } else {
      this.material = new THREE.PointsMaterial({color: this.color, size: options.style.size || 1.0 })
    }
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

  fetchHandler = (raw, offsets, size, coords, options) => {
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
          px = {x: px[0] - size / 2, y: px[1] - size / 2, z: rData[2]}
          data.push(px.x - offsets.x)
          data.push(-px.y + offsets.y)

          const yMin = options.scales[0] || 0;
          const yMax = options.scales[1] || 100;
          const scaledZ = ((px.z - yMin) / (yMax - yMin)) * (options.scales[2] || 0.5) + yMin;
          data.push(scaledZ)

          if (options.style && options.style.colorMap && options.style.colorMap[rData[3]]) {
            colors.push(...options.style.colorMap[rData[3]])
          } else {
            colors.push(0.0, 0.0, 0.0)
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
