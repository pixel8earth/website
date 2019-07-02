import * as THREE from 'three'
import pako from 'pako'
import { llPixel } from '../lib/utils'
import SphericalMercator from 'sphericalmercator'

class PointTiles {
  type = 'PointTiles'
  loadedTiles = []
  cachedTiles = {}

  vert = `
    uniform float size;
    //varying vec3 vColor;
    varying vec3 vUv;
    void main()
    {
        vUv = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        //vColor = normalize(abs(worldPosition.xyz));
        gl_PointSize = min(max(size * vUv.y, 0.5), 2.0);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `

  frag = `
    uniform vec3 colorA; 
    uniform vec3 colorB; 
    varying vec3 vUv;
    precision mediump float;
    varying vec3 vColor;
    void main()
    {
        //gl_FragColor = vec4(vColor, 1.0);
        gl_FragColor = vec4(mix(colorA, colorB, (vUv.y*100.0)), 1.0);
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

  constructor(name, url, color=0xffff00, size=65024) {
    this.name = name
    this.urlTemplate = url
    this.color = color
    this.size = size
    this.mercator = new SphericalMercator({size: this.size});
  }

  update = (tiles, scene, offsets, render) => {
    // takes a list of tiles, fetches, adds to map, then removes uneeded tiles
    // TODO - the fetchTile promise needs some logic around cancelation i think
    // TODO - we may need some state on this component that keeps track of the 
    //        tiles we are loading and then used to cancel loading of tiles we no longer need
    console.log('Update Tile Layer', this.name, this.urlTemplate)
    var coordsList = []
    tiles.forEach( async (t,i) => {
      const coords = [t.x, t.y, t.z].join('-')
      coordsList.push(coords)
      if (!this.loadedTiles[coords]) {
        if (this.cachedTiles[coords]) {
          this.addTile(coords, this.cachedTiles[coords], scene, render)
        } else {
          const url = this.urlTemplate.replace(/{[^{}]+}/g, key => t[key.replace(/[{}]+/g, "")] || "")
          this.fetchTile(url, offsets)
            .then(vertices => { 
              this.cachedTiles[coords] = vertices
              this.addTile(coords, vertices, scene, render)
            })
            .catch(e => console.log('Error fetching tile', e))
        }
      }
    })
    
    //for each loaded tile, if not in coordsList (added tiles), remove
    // TODO - this removal of tiles needs to wait until the tiles have been loaded
    Object.keys(this.loadedTiles).forEach( coords => {
      if (coordsList.indexOf(coords) === -1) {
        var selectedObject = scene.getObjectByName(this.name + coords)
        scene.remove(selectedObject)
        delete this.loadedTiles[coords]
      }
    })
  }

  addTile(coords, vertices, scene, render) {
    if (vertices && vertices.count) {
      const geom = new THREE.BufferGeometry()
      geom.addAttribute( 'position', vertices )
      const points = new THREE.Points( geom, this.material)
      points.name = this.name + coords
      this.loadedTiles[coords] = coords
      scene.add(points)
      render()
    }  
  }

  fetchTile(url, offsets) {
    return new Promise( (resolve, reject) => {
      fetch(url)
        .then( res => {
          if (!res.ok) {
            return reject('not found')
          }
          return res.arrayBuffer()
        })
        .then(byteArray => {
          return pako.inflate(byteArray, {to: 'string'})
        })
        .then(raw => {
          const rows = raw.split('\n')
          const data = []
          rows.forEach((row, idx) => {
            if (idx > 0) {
              try {
                const rData = row.split(",").map(v => parseFloat(v))
                if (rData.length > 1) { 
                  const ll = this.mercator.inverse([rData[0], rData[1]])
                  let px = llPixel(ll, 0, this.size)
                  px = {x: px[0] - this.size / 2, y: 0, z: px[1] - this.size / 2}
                  data.push(px.x - offsets.x)
                  data.push((rData[2] * 0.5 / 686) - 0.1) // umm ok... some z level scaling gonna need to be figured out 
                  data.push(px.z - offsets.z)
                }
              } catch(e) {}
            }
          })
          resolve(new THREE.Float32BufferAttribute( data, 3 ))
        })
        .catch(reject)
    })
  }
}

export default PointTiles
