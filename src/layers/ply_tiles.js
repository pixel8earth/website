import * as THREE from 'three'
import Base from './base'
import worker from '../lib/mesh_worker';
import WebWorker from '../lib/WebWorker';

class PlyTiles extends Base {
  loader = new THREE.TextureLoader()

  constructor(name, url, options={}) {
    super(name, url, options)
    this.workerPool = [];
    for (let i = 0; i < 4; i++) {
      const w = new WebWorker(worker, { type: "module" });
      w.addEventListener('message', this.receiveMessage, false)
      this.workerPool.push(w)
    }
  }

  receiveMessage = async (e) => {
    const { result, job, error, url, coords } = e.data
    if (job === 'fetchTileComplete' && !error) {
      const geometry = new THREE.BufferGeometry()
      if ( result.indices.length > 0 ) {
        geometry.setIndex( result.indices )
      }
      geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( result.vertices, 3 ) )
      geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( result.normals, 3 ) )

      const material = new THREE.MeshPhongMaterial({
        color: this.options.color || 0x666666, 
        wireframe: this.options.wireframe || true, 
        transparent: true, 
        opacity: this.options.opacity || 0.5
      })
      material.side = THREE.DoubleSide // Fixes lighting issues on meshes 
      const mesh = new THREE.Mesh(geometry, material)
      mesh.doubleSided = true;

      const fetchIndex = this.fetchingUrls.indexOf(url)
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1)

      this.cachedTiles[coords] = mesh
      this.addTile(coords, mesh)
    } else if (error) {
      console.log('Error fetching tile: ', error)
    }
  }

  addTile(coords, mesh) {
    if (mesh) {
      const tileName = `${coords}-${mesh.uuid}`
      mesh.name = tileName
      this.loadedTiles.push(tileName)
      this.group.add(mesh)
      this.renderScene()
    }  
  }
}

export default PlyTiles
