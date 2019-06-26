import * as THREE from 'three'
import SphericalMercator from 'sphericalmercator'

const basePlaneDimension = 65024;
const mercator = new SphericalMercator({size: basePlaneDimension});
//const merc = new SphericalMercator({size: 256});

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
      this.fetchData(this.url, offsets)
        .then(vertices => {
          console.log(vertices)
          this.loaded = true
          const geom = new THREE.BufferGeometry()
          geom.addAttribute( 'position', vertices )
          const points = new THREE.Points( geom, new THREE.PointsMaterial( { color: 0xff5500, size: 0.25 } ) )
          scene.add(points)
          render()
        })
    }
  }

  fetchData(url) {
    const offsets = [-10880062.91641766, 3535633.056643746]
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
          console.log('Fetched', geojson)
          geojson.features.forEach(f => {
            const xy = mercator.forward(f.geometry.coordinates)//[lng + basePlaneDimension / 2, lat + basePlaneDimension / 2], 0)
            //console.log(xy[0] - offsets[0])
            data.push(xy[0] - offsets[0]) // x
            data.push(140) // z
            data.push(xy[1] - offsets[1]) // y
            resolve(new THREE.Float32BufferAttribute( data, 3 ))
          })
        })
        .catch(reject)
    })
  }
}

export default GeoJSON
