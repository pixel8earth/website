import * as THREE from 'three'
import pako from 'pako'
import Base from './base'

class GeoJSON extends Base {
  loaded = false

  constructor(name, url, options={}) {
    super(name, url, options)
    this.name = name
    this.url = url
    this.feature_size = options.feature_size || 0.5
  }

  update = ({ tiles, offsets, render, project}) => {
    if (!this.loaded) {
      const mat = new THREE.PointsMaterial({
        color: this.color,
        size: this.feature_size
      })

      this.fetchData(this.url, offsets, project)
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

  fetchData(url, offsets, project) {
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
            const utm = project(f.geometry.coordinates)
            data.push(utm[1])
            data.push(offsets.z)
            data.push(utm[0])
          })
          resolve(new THREE.Float32BufferAttribute( data, 3 ))
        })
        .catch(reject)
    })
  }
}

export default GeoJSON
