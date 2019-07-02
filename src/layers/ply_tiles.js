import * as THREE from 'three'
import pako from 'pako'
import SphericalMercator from 'sphericalmercator'
import PointTiles from './point_tiles'
import { llPixel } from '../lib/utils'
import PLYLoader from '../lib/plyloader'

class PlyTiles extends PointTiles {
  type = 'PlyTiles'
  loader = new PLYLoader()
  mercator = new SphericalMercator({size: 65024})

  update = (tiles, scene, offsets, render) => {
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
            .then(geom => { 
              this.cachedTiles[coords] = geom
              this.addTile(coords, geom, scene, render)
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

  addTile(coords, geom, scene, render) {
    if (geom) {
      geom.computeVertexNormals();
      geom.computeBoundingSphere();
      const material = new THREE.MeshStandardMaterial({color: 0x888888, wireframe: true});
      const mesh = new THREE.Mesh(geom, material);
      mesh.name = this.name + coords
      this.loadedTiles[coords] = coords
      scene.add(mesh);
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
          //return res.text()
          return res.arrayBuffer()
        })
        //.then(byteArray => {
        //  return pako.inflate(byteArray, {})
        //})
        .then(raw => {
          const geom = this.loader.parse(raw)
          const pos = new Float32Array(geom.attributes.position.array)
          geom.attributes.position.array.forEach( (val,i) => {
            const mod = i % 3
            if (mod === 0) {

              // TODO: YIKES make this less insane..., possibly change the ply loader to just return vertices in order
              // in x pos 
              const ll = this.mercator.inverse([val, geom.attributes.position.array[i+2]])
              let px = llPixel(ll, 0, this.size)
              px = {x: px[0] - this.size / 2, y: 0, z: px[1] - this.size / 2}
              pos[i] = px.x - offsets.x
            } else if (mod === 1) {
              pos[i] = (val * 0.5 / 686) - 0.1
            } else if ( mod === 2) {
              const ll = this.mercator.inverse([geom.attributes.position.array[i-2], val])
              let px = llPixel(ll, 0, this.size)
              px = {x: px[0] - this.size / 2, y: 0, z: px[1] - this.size / 2}
              pos[i] = px.z - offsets.z
            }
          })
          geom.attributes.position.array = pos
          resolve(geom)
        })
        .catch(reject)
    })
  }
}

export default PlyTiles
