import * as THREE from 'three'
import pako from 'pako'
import { llPixel } from '../lib/utils'
import proj4 from 'proj4'
import Base from './base'

proj4.defs([
  [
    'EPSG:4326',
    '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  [
    'EPSG:32614',
    '+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs'
  ]
]);

class PointCloud extends Base {
  loaded = false

  constructor(name, url, options) {
    super(name, url, options)
    this.proj = options.proj || "EPSG:4326"
  }

  update = ({tiles, offsets, render}) => {
    if (!this.loaded) {
      const mat = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 0.00015
      })
  
      this.fetchData(this.url, offsets)
        .then(geom => {
          this.loaded = true
          const points = new THREE.Points( geom, mat)
          points.position.y = 0
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
            return pako.inflate(await res.arrayBuffer(), {to: 'string'})
          }
          return res.text()
        })
        .then(raw => {
          // create an array of vertices
          const points = new THREE.Geometry();
          raw.split('\n').forEach( (line, i) => {
            const p = line.trim().split(',').map( j => parseFloat(j))
            if (!isNaN(p[0])) {
              const ll = proj4('EPSG:32614', 'EPSG:4326').forward([p[0], p[1]])
              let px = llPixel(ll, 0, this.size)
              const pt = {x: px[0] - this.size / 2, y: px[1] - this.size / 2, z: 0}
              const color = new THREE.Color();
              color.setRGB(p[3] / 255.0, p[4] / 255.0, p[5] / 255.0)
              points.vertices.push(new THREE.Vector3(pt.x - offsets.x, pt.y - offsets.y, (p[2] / 343) - offsets.z));
              points.colors.push(color);
            }
          })
          resolve(points)
        })
        .catch(reject)
    })
  }

}

export default PointCloud 
