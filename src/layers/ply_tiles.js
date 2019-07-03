import * as THREE from 'three'
import SphericalMercator from 'sphericalmercator'
import PointTiles from './point_tiles'
import { llPixel } from '../lib/utils'
import PLYLoader from '../lib/plyloader'

class PlyTiles extends PointTiles {
  type = 'PlyTiles'
  loader = new PLYLoader()
  mercator = new SphericalMercator({size: 65024})

  receiveMessage = async (e) => {
    const { result, job, error, url, coords } = e.data;
    if (job === 'fetchTileComplete' && !error) {
      const { render, scene } = this.updateContext;
      const fetchIndex = this.fetchingUrls.indexOf(url);
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1);
      const vertices = new THREE.Float32BufferAttribute( result, 3 );
      this.cachedTiles[coords] = vertices;
      this.addTile(coords, vertices, scene, render);
    } else if (error) {
      console.log('Error fetching tile: ', error)
    }
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

  fetchHandler = (raw, offsets, size) => {
    console.log('PLY fetch handler, must be pure')
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
  }
}

export default PlyTiles
