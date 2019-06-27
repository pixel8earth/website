import * as THREE from 'three'
import SphericalMercator from 'sphericalmercator'

const basePlaneDimension = 65024;
const mercator = new SphericalMercator({size: basePlaneDimension});

function generateSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 40;
  canvas.height = 40;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
  gradient.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

class GeoJSON {
  type = 'GeoJSON'
  loaded = false

  constructor(name, url, color=0xffff00) {
    this.name = name
    this.url = url
    this.color = color
  }

  update = (tiles, scene, offsets, render) => {
    if (!this.loaded) {
      const mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 4.0,
        transparent: true,
        blending: THREE.AdditiveBlending,
        map: generateSprite()
      })
  
      this.fetchData(this.url, offsets)
        .then(vertices => {
          this.loaded = true
          const geom = new THREE.BufferGeometry()
          geom.addAttribute( 'position', vertices )
          const points = new THREE.Points( geom, mat) //new THREE.PointsMaterial( { color: 0x00ff55, size: 2.0 } ) )
          scene.add(points)
          render()
        })
    }
  }

  fetchData(url, offsets) {
    return new Promise( (resolve, reject) => {
      fetch(url)
        .then( res => {
          if (!res.ok) {
            return reject('not found')
          }
          return res.json()
        })
        .then(geojson => {
          // create an array of vertices 
          const data = []
          geojson.features.forEach(f => {
            const xy = mercator.forward([f.geometry.coordinates[0], f.geometry.coordinates[1]])
            data.push(xy[0] - offsets[0]) // x
            data.push(20) // z //TODO what to do about elevation
            data.push(-1 * (xy[1] - offsets[1])) // y
          })
          resolve(new THREE.Float32BufferAttribute( data, 3 ))
        })
        .catch(reject)
    })
  }
}

export default GeoJSON
