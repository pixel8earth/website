import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Base from './base'

class GLTF extends Base {
  loaded = false

  constructor(name, url, options) {
    super(name, url, options)
    this.url = url;
    this.loader = new GLTFLoader();
  }

  onLoad = async ({ result, job, error, url, coords }) => {
    if (job === 'fetchTileComplete' && !error) {
      const fetchIndex = this.fetchingUrls.indexOf(url)
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1)
      this.cachedTiles[coords] = result
      this.addTile(coords, result)
    } else if (error) {
      console.log('Error fetching tile: ', error)
    }
  }

  update = async ({ tiles, offsets, render }) => {
    this.coordsList = [];
    tiles.forEach((t, i) => {
      const coords = [t.x, t.y, t.z].join('-');
      this.coordsList.push(coords);
      const url = this.urlTemplate.replace(/{[^{}]+}/g, key => t[key.replace(/[{}]+/g, "")] || "")
      const currentlyFetching = this.fetchingUrls.indexOf(url) > -1
      const lt = this.loadedTiles.map(item => item.split('-').slice(0, 3).join('-'))
      const loaded = lt.indexOf(coords) > 0
      if (!loaded) {
        if (this.cachedTiles[coords]) {
          this.addTile(coords, this.cachedTiles[coords])
        } else if (!currentlyFetching) {
          try {
            this.fetchingUrls.push(url);
            if (!this.renderScene) this.renderScene = render
            this.fetchTile({
              name: this.name,
              job: 'fetchTile',
              url,
              coords
            })
          } catch (err) {
            console.log('Error fetching tile: ', err)
          }
        }
      }
      if (i === (tiles.length - 1)) {
        this.removeOldTiles(tiles)
      }
    });
  }

  fetchTile = ({name, url, coords, options}) => {
    try {
      this.loader.load(url, gltf => {
        const geometry = gltf.scene.children[0].children[1].geometry
        const vertices = new Float32Array(geometry.attributes.position.array)
        geometry.attributes.position.array.forEach( (val,i) => {
          const mod = i % 3
          if ( mod === 2) {
            const x = vertices[i-2]
            const y = vertices[i-1]
            const z = val
            vertices[i-2] = y
            vertices[i-1] = z
            vertices[i] = x
          }
        })
        geometry.attributes.position.array = vertices
        this.onLoad({ job: 'fetchTileComplete', result: gltf.scene, url: url, coords: coords, name })

      })
    } catch (err) {
      postMessage({ error: err.message })
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

export default GLTF
