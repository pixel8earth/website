import * as THREE from 'three'
import SphericalMercator from 'sphericalmercator'
import Base from './base'
import { llPixel } from '../lib/utils'

class ImageTiles extends Base {
  type = 'ImageTiles'
  mercator = new SphericalMercator({size: 65024})
  loader = new THREE.TextureLoader()

  update = ({tiles, offsets, render}) => {
    var coordsList = []
    const key = Date.now().toString();

    tiles.forEach( async (t,i) => {
      const coords = [t.x, t.y, t.z].join('-')
      coordsList.push(coords)

      const url = this.urlTemplate.replace(/{[^{}]+}/g, key => t[key.replace(/[{}]+/g, "")] || "");
      const currentlyFetching = this.fetchingUrls.indexOf(url) > -1; 
      const lt = this.loadedTiles.map(item => item.split('-').slice(0, 3).join('-'));
      const loaded = lt.indexOf(coords) > 0;
      if (!loaded) {
        if (this.cachedTiles[coords]) {
          this.addTile(coords, this.cachedTiles[coords]);
        } else if (!currentlyFetching) {
          try {
            this.fetchingUrls.push(url);
            if (!this.renderScene) this.renderScene = render;
            const tileSize = this.size/(Math.pow(2,18));

            this.loader.load(url, map => {
              const grid = new THREE.Mesh(
                new THREE.PlaneGeometry(tileSize, tileSize, 10, 10),
                new THREE.MeshBasicMaterial({ map })
              );

              const bbox = this.mercator.bbox(t.x, t.y, t.z)
              const ll = [bbox[0] + (bbox[2] - bbox[0])/2, bbox[1] + (bbox[3] - bbox[1])/2]

              let px = llPixel(ll, 0, this.size)
              px = {x: px[0] - this.size / 2, y: px[1] - this.size / 2, z: 0}

              grid.position.x = px.x - offsets.x
              grid.position.y = -px.y + offsets.y
              grid.position.z = 0

              this.cachedTiles[coords] = grid;
              this.addTile(coords, grid)
              render()
            })
            
          } catch (err) {
            console.log('Error fetching tile: ', err)
          }
        }
      }

      /*if (!this.loadedTiles[coords]) {
        if (this.cachedTiles[coords]) {
          this.addTile(coords, this.cachedTiles[coords], render)
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
          px = {x: px[0] - this.size / 2, y: px[1] - this.size / 2, z: 0}
          console.log(px.x - offsets.x, px.y - offsets.y) 
          grid.position.x = px.x - offsets.x
          grid.position.y = px.y - offsets.y
          grid.position.z = 0
          //grid.rotation.x = -0.5 * Math.PI;

          this.cachedTiles[coords] = grid;
          this.addTile(coords, grid, render)
        }
      }*/
      if (i === (tiles.length - 1)) {
        this.removeOldTiles(tiles, key);
      }

    })
    
    //for each loaded tile, if not in coordsList (added tiles), remove
    // TODO - this removal of tiles needs to wait until the tiles have been loaded
    /*Object.keys(this.loadedTiles).forEach( coords => {
      if (coordsList.indexOf(coords) === -1) {
        var selectedObject = this.group.getObjectByName(this.name + coords)
        this.group.remove(selectedObject)
        delete this.loadedTiles[coords]
        render()
      }
    })*/
  }

  addTile(coords, obj) {
    const tileName = `${coords}-${obj.uuid}`;
    obj.name = tileName;
    this.loadedTiles.push(tileName);
    this.group.add(obj);
    this.renderScene();
  }
}

export default ImageTiles
