import * as THREE from 'three'
import SphericalMercator from 'sphericalmercator'
import Base from './base'

class ImageTiles extends Base {
  type = 'ImageTiles'
  mercator = new SphericalMercator({size: 256})
  loader = new THREE.TextureLoader()

  makeGeometry = (bbox, project, z) => {
    const ll = project([bbox[0], bbox[1]])
    const ul = project([bbox[0], bbox[3]])
    const ur = project([bbox[2], bbox[3]])
    const lr = project([bbox[2], bbox[1]])

    var geometry = new THREE.Geometry();
    [ll, lr, ur, ul, ll].forEach( c => geometry.vertices.push(new THREE.Vector3( c[1], z, c[0] )))

    geometry.faces.push(
      new THREE.Face3(0, 1, 2),
      new THREE.Face3(0, 2, 3),
    );
            
    geometry.faceVertexUvs[0] = [];
    geometry.faceVertexUvs[0].push([new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(1,1)])
    geometry.faceVertexUvs[0].push([new THREE.Vector2(0,0), new THREE.Vector2(1,1), new THREE.Vector2(0,1)])
    return geometry;    
  }

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
            const bbox = this.mercator.bbox(t.x, t.y, t.z)

            this.loader.load(url, texture => {
              const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture })

              const geometry = this.makeGeometry(bbox, project, offsets.z)
              const grid = new THREE.Mesh( geometry, mat );

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
