import * as THREE from 'three'
import pako from 'pako'
import { llPixel } from '../lib/utils'
import proj4 from 'proj4'
import Base from './base'

proj4.defs([
  [
    'EPSG:4326',
    '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
  ],[
    'EPSG:32614',
    '+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs'
  ],[
    'EPSG:32613',
    '+proj=utm +zone=13 +datum=WGS84 +units=m +no_defs'
  ]
]);

class PointCloud extends Base {
  loaded = false

  constructor(name, url, options) {
    super(name, url, options)
    this.url = url
    this.proj = options.proj || "EPSG:4326"
  }

  update = ({tiles, offsets, render}) => {
    if (!this.loaded) {
      const mat = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 0.001
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

  splitLine(ext, line) {
    return line.trim().split(ext === 'ply' ? ' ' : ',').map( j => parseFloat(j))
  }

  fetchData(url, offsets) {
    return new Promise( (resolve, reject) => {
      const parts = url.split('.')
      const ext = parts[parts.length - 1]
      fetch(url)
        .then( async res => {
          if (!res.ok) {
            return reject('not found')
          }
          if (ext === 'gz') {
            return pako.inflate(await res.arrayBuffer(), {to: 'string'})
          }
          return res.text()
        })
        .then(raw => {
          // create an array of vertices
          const points = new THREE.Geometry();
          raw.split('\n').forEach( (line, i) => {
            if (i >= 10) {
              const p = this.splitLine(ext, line)
              if (!isNaN(p[0])) {
                const xyz = ext === 'ply' ? [p[2], p[0], p[1]] : [p[0], p[1], p[2]]
                const ll = proj4(this.proj, 'EPSG:4326').forward([xyz[0], xyz[1]])
                let px = llPixel(ll, 0, this.size)
                const pt = {x: px[0] - this.size / 2, y: px[1] - this.size / 2, z: xyz[2]}
                const color = new THREE.Color();
                color.setRGB(p[3] / 255.0, p[4] / 255.0, p[5] / 255.0)
                const zMin = this.options.scales[0] || 130;
                const zMax = this.options.scales[1] || 350;
                const scaledZ = ((pt.z - zMin) / (zMax - zMin)) * (this.options.scales[2] || 0.5) + zMin;
                points.vertices.push(new THREE.Vector3(pt.x - offsets.x, -pt.y + offsets.y, scaledZ));
                points.colors.push(color);
              }
            }
          })
          resolve(points)
        })
        .catch(reject)
    })
  }

}

export default PointCloud 
