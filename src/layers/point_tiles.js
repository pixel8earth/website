import * as THREE from 'three'
//import { llPixel } from '../lib/utils'
import SphericalMercator from 'sphericalmercator'

class PointTiles {
  type = 'PointTiles'
  loadedTiles = []
  cachedTiles = {}

  vert = `
    uniform float size;
    varying vec3 vUv;
    void main()
    {
        vUv = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        gl_PointSize = min(max(size * vUv.y, 0.5), 2.0);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `

  frag = `
    uniform vec3 colorA;
    uniform vec3 colorB;
    varying vec3 vUv;
    precision mediump float;
    void main()
    {
        gl_FragColor = vec4(mix(colorA, colorB, (vUv.y*100.0)), 1.0);
        gl_FragColor.a = 1.0;
    }
  `
  material = new THREE.ShaderMaterial( {
    uniforms: {
      size: { type: 'f', value: 100.0 },
      colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
      colorA: {type: 'vec3', value: new THREE.Color(0xACE6EE)}
    },
    depthTest: false,
    depthWrite: false,
    transparent:  true,
    vertexShader: this.vert,
    fragmentShader: this.frag,
  })

  constructor(name, url, color=0xffff00, size=65024) {
    this.name = name
    this.urlTemplate = url
    this.color = color
    this.size = size
    this.coordsList = [];
    this.fetchingUrls = [];
    this.group = new THREE.Group();
    this.group.name = 'lidar';
  }

  receiveMessage = async (e) => {
    const { result, job, error, url, coords } = e.data;
    if (job === 'fetchTileComplete' && !error) {
      const fetchIndex = this.fetchingUrls.indexOf(url);
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1);
      const vertices = new THREE.Float32BufferAttribute( result, 3 );
      this.cachedTiles[coords] = vertices;
      this.addTile(coords, vertices);
    } else if (error) {
      console.log('Error fetching tile: ', error)
    }
  }

  removeOldTiles = (tiles, key) => {
    const stringTiles = tiles.map( t => `${t.x}-${t.y}-${t.z}`);
    const toRemove = this.loadedTiles.reduce((acc, item) => {
      // remove uuid from tile name to compare to tiles coming in on update
      const i = item.split('-').slice(0, 3).join('-');
      if (stringTiles.indexOf(i) === -1) acc.push(item);
      return acc;
    }, []);
    toRemove.forEach(item => {
      let selectedObject = this.group.getObjectByName(item);
      if (selectedObject) {
        this.group.remove(selectedObject);
        this.renderScene();
        const index = this.loadedTiles.indexOf(item);
        if (index > -1) this.loadedTiles.splice(index, 1);
      }
    });
  }

  fetchHandler = (raw, offsets, size) => {
    const llPixel = (ll, zoom, _size) => {
      var size = _size * Math.pow(2, zoom);
      var d = size / 2;
      var bc = (size / 360);
      var cc = (size / (2 * Math.PI));
      var ac = size;
      var f = Math.min(Math.max(Math.sin((Math.PI / 180) * ll[1]), -0.9999), 0.9999);
      var x = d + ll[0] * bc;
      var y = d + 0.5 * Math.log((1 + f) / (1 - f)) * -cc;
      (x > ac) && (x = ac);
      (y > ac) && (y = ac);
      return [x, y];
    }

    const rows = raw.split('\n')
    const data = []
    rows.forEach((row, idx) => {
      if (idx > 0) {
        const rData = row.split(",").map(v => parseFloat(v))
        if (rData.length > 1) {
          // taken from sphericalmercator.js - including here cuz the imports are funky
          const ll =  [
            (rData[0] * (180 / Math.PI) / 6378137.0),
            ((Math.PI*0.5) - 2.0 * Math.atan(Math.exp(-rData[1] / 6378137.0))) * (180 / Math.PI)
          ]
          let px = llPixel(ll, 0, size)
          px = {x: px[0] - size / 2, y: 0, z: px[1] - size / 2}
          data.push(px.x - offsets.x)
          data.push((rData[2] * 0.5 / 686) - 0.1) // umm ok... some z level scaling gonna need to be figured out
          data.push(px.z - offsets.z)
        }
      }
    });
    return data
  }

  update = async ({ tiles, offsets, render, workerPool }) => {
    this.coordsList = [];
    const key = Date.now().toString();

    tiles.forEach((t, i) => {
      const coords = [t.x, t.y, t.z].join('-')
      this.coordsList.push(coords);
      const url = this.urlTemplate.replace(/{[^{}]+}/g, key => t[key.replace(/[{}]+/g, "")] || "");
      const currentlyFetching = this.fetchingUrls.indexOf(url) > -1;

      // if a tile is cached, use the cache, else if another update is NOT
      // ALREADY FETCHING the same url, fetch it via web worker
      const lt = this.loadedTiles.map(item => item.split('-').slice(0, 3).join('-'));
      const loaded = lt.indexOf(coords) > 0;
      if (!loaded) {
        if (this.cachedTiles[coords]) {
          this.addTile(coords, this.cachedTiles[coords]);
        } else if (!currentlyFetching) {
          try {
            this.fetchingUrls.push(url);
            if (!this.renderScene) this.renderScene = render;
            var workerIndex = 2 * (t.x % 2) + t.z % 2
            workerPool[workerIndex].postMessage({ name: this.name, job: 'fetchTile', url: url, key, offsets, coords, size: this.size, handler: this.fetchHandler.toString() });
          } catch (err) {
            console.log('Error fetching tile: ', err)
          }
        }
      }
      if (i === (tiles.length - 1)) {
        this.removeOldTiles(tiles, key);
      }
    });
  }

  addTile(coords, vertices) {
    if (vertices && vertices.count) {
      const geom = new THREE.BufferGeometry()
      geom.addAttribute('position', vertices)
      const points = new THREE.Points(geom, this.material);
      const tileName = `${coords}-${points.uuid}`;
      points.name = tileName;
      this.loadedTiles.push(tileName);
      this.group.add(points);
      this.renderScene();
    }
  }

  getGroup() {
    return this.group;
  }
}

export default PointTiles
