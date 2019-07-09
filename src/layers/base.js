import * as THREE from 'three'

const defaultOptions = {
  color: 0xffffff,
  size: 65024,
  visible: true,
  scales: []
}

class Base {
  loadedTiles = []
  cachedTiles = {}

  constructor(name, url, options={}) {
    this.name = name
    this.urlTemplate = url
    this.options = { ...defaultOptions, ...options }
    this.color = this.options.color
    this.size = this.options.size
    this.coordsList = []
    this.fetchingUrls = []
    this.group = new THREE.Group()
  }

  receiveMessage = async (e) => {
    const { result, job, error, url, coords } = e.data
    if (job === 'fetchTileComplete' && !error) {
      const fetchIndex = this.fetchingUrls.indexOf(url)
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1)
    } else if (error) {
      console.log('Error fetching tile: ', error)
    }
  }

  removeOldTiles = (tiles, key) => {
    const stringTiles = tiles.map( t => `${t.x}-${t.y}-${t.z}`)
    const toRemove = this.loadedTiles.reduce((acc, item) => {
      // remove uuid from tile name to compare to tiles coming in on update
      const i = item.split('-').slice(0, 3).join('-')
      if (stringTiles.indexOf(i) === -1) acc.push(item)
      return acc
    }, [])
    toRemove.forEach(item => {
      let selectedObject = this.group.getObjectByName(item)
      if (selectedObject) {
        this.group.remove(selectedObject)
        this.renderScene()
        const index = this.loadedTiles.indexOf(item)
        if (index > -1) this.loadedTiles.splice(index, 1)
      }
    });
  }


  update = async ({ tiles, offsets, render, workerPool }) => {
    this.coordsList = [];
    const key = Date.now().toString()

    tiles.forEach((t, i) => {
      const coords = [t.x, t.y, t.z].join('-')
      this.coordsList.push(coords)
      const url = this.urlTemplate.replace(/{[^{}]+}/g, key => t[key.replace(/[{}]+/g, "")] || "")
      const currentlyFetching = this.fetchingUrls.indexOf(url) > -1

      // if a tile is cached, use the cache, else if another update is NOT
      // ALREADY FETCHING the same url, fetch it via web worker
      const lt = this.loadedTiles.map(item => item.split('-').slice(0, 3).join('-'))
      const loaded = lt.indexOf(coords) > 0
      if (!loaded) {
        if (this.cachedTiles[coords]) {
          this.addTile(coords, this.cachedTiles[coords])
        } else if (!currentlyFetching) {
          try {
            this.fetchingUrls.push(url);
            if (!this.renderScene) this.renderScene = render
            const wIndex = i % workerPool.length
            workerPool[wIndex].postMessage({
              name: this.name,
              job: 'fetchTile',
              size: this.size,
              handler: this.fetchHandler.toString(),
              options: this.options,
              url,
              key,
              offsets,
              coords
            })
          } catch (err) {
            console.log('Error fetching tile: ', err)
          }
        }
      }
      if (i === (tiles.length - 1)) {
        this.removeOldTiles(tiles, key)
      }
    });
  }

  addTile(coords, vertices) {}
  fetchHandler = (raw, offsets, size) => {}

  getGroup() {
    this.group.name = this.name;
    return this.group;
  }
}

export default Base
