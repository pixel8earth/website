import * as THREE from 'three'
import SphericalMercator from 'sphericalmercator'
import Base from './base'
import { llPixel } from '../lib/utils'

class ImageTiles extends Base {
  type = 'ImageTiles'
  mercator = new SphericalMercator({size: 65024})
  loader = new THREE.TextureLoader()

  update = ({tiles, offsets, render, project}) => {
    var coordsList = []
    const key = Date.now().toString();

    tiles.forEach( async (t,i) => {
      const coords = [t.x, t.y, t.z].join('-')
      coordsList.push(coords)
      const { domains } = this.options
      if (domains) {
        t['s'] = domains[i % domains.length]
      }
      const url = this.urlTemplate.replace(/{[^{}]+}/g, key => t[key.replace(/[{}]+/g, "")] || "a");
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
            const tileSize = 131 ; //this.size/(Math.pow(2,18));

            this.loader.load(url, map => {
              const mat = new THREE.MeshBasicMaterial({ map })
              mat.side = THREE.DoubleSide
              const grid = new THREE.Mesh(
                new THREE.PlaneGeometry(tileSize, tileSize, 10, 10),
                mat
              );

              const bbox = this.mercator.bbox(t.x, t.y, t.z)
              const lnglat = [bbox[0] + (bbox[2] - bbox[0])/2, bbox[1] + (bbox[3] - bbox[1])/2]

              const utm = project(lnglat)

              grid.position.x = utm[1]
              grid.position.y = offsets.z
              grid.position.z = utm[0]

              grid.rotateX(Math.PI / 2);

              this.cachedTiles[coords] = grid;
              this.addTile(coords, grid)
              render()
            })

          } catch (err) {
            console.log('Error fetching tile: ', err)
          }
        }
      }
      if (i === (tiles.length - 1)) {
        this.removeOldTiles(tiles, key);
      }
    })
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
