import * as THREE from 'three'
import pako from 'pako'
import { llPixel } from '../lib/utils'

class GeoJSON {
  type = 'GeoJSON'
  loaded = false

  constructor(name, url, color=0xffff00, size=65024) {
    this.name = name
    this.url = url
    this.color = color
    this.size = size
    this.group = new THREE.Group()
    this.group.name = 'mapillary'
  }

  update = ({ tiles, offsets, render }) => {
    if (!this.loaded) {
      const mat = new THREE.PointsMaterial({
        color: this.color,
        size: 0.005
      })

      this.fetchData(this.url, offsets)
        .then(vertices => {
          this.loaded = true
          const geom = new THREE.BufferGeometry()
          geom.addAttribute( 'position', vertices )
          const points = new THREE.Points( geom, mat)
          this.group.add(points)
          render()
        })
    }
  }

  fetchData(url, offsets) {
    return new Promise( (resolve, reject) => {
      fetch(url)
        .then( async res => {
          if (!res.ok) {
            return reject('not found')
          }
          const parts = url.split('.')
          const ext = parts[parts.length - 1]
          if (ext === 'gz') {
            return JSON.parse(pako.inflate(await res.arrayBuffer(), {to: 'string'}))
          }
          return res.json()
        })
        .then(geojson => {
          // create an array of vertices
          const data = []
          geojson.features.forEach((f,i) => {
            let px = llPixel(f.geometry.coordinates, 0, this.size)
            px = {x: px[0] - this.size / 2, y: px[1] - this.size / 2, z: 0}
            data.push(px.x - offsets.x)
            data.push(px.y - offsets.y)
            data.push(0.0025)
          })
          resolve(new THREE.Float32BufferAttribute( data, 3 ))
        })
        .catch(reject)
    })
  }

  getGroup() {
    return this.group;
  }
}

export default GeoJSON
