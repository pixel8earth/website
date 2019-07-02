import * as THREE from 'three'
//import pako from 'pako'
import SphericalMercator from 'sphericalmercator'
import PointTiles from './point_tiles'
import { llPixel } from '../lib/utils'

class ImageTiles extends PointTiles {
  type = 'ImageTiles'
  mercator = new SphericalMercator({size: 65024})

  update = (tiles, scene, offsets, render) => {
    console.log('Update Image Tile Layer', this.name, this.urlTemplate)
    var coordsList = []
    tiles.forEach( async (t,i) => {
      const coords = [t.x, t.y, t.z].join('-')
      coordsList.push(coords)
      if (!this.loadedTiles[coords]) {
        if (this.cachedTiles[coords]) {
          this.addTile(coords, this.cachedTiles[coords], scene, render)
        } else {
          const url = this.urlTemplate.replace(/{[^{}]+}/g, key => t[key.replace(/[{}]+/g, "")] || "")
          const tileSize = this.size/(Math.pow(2,18));

          const grid = new THREE.Mesh(
            new THREE.PlaneGeometry(tileSize, tileSize, 10, 10),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(url)})
          );

          // Set the position
          const bbox = this.mercator.bbox(t.x, t.y, t.z)
          const ll = [bbox[0] + (bbox[2] - bbox[0])/2, bbox[1] + (bbox[3] - bbox[1])/2]
          let px = llPixel(ll, 0, this.size)
          px = {x: px[0] - this.size / 2, y: 0, z: px[1] - this.size / 2}
        
          grid.position.x = px.x - offsets.x
          grid.position.z = px.z - offsets.z
          grid.rotation.x = -0.5 * Math.PI;

          this.cachedTiles[coords] = grid;
          this.addTile(coords, grid, scene, render)
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
        render()
      }
    })
  }

  addTile(coords, obj, scene, render) {
    this.loadedTiles[coords] = coords
    obj.name = this.name + coords
    scene.add(obj)
    render()
  }
}

export default ImageTiles
