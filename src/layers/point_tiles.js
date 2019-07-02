import * as THREE from 'three'
import { llPixel } from '../lib/utils'
import SphericalMercator from 'sphericalmercator'
import worker from '../lib/worker';
import WebWorker from '../lib/WebWorker';

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
    this.worker = new WebWorker(worker, { type: "module" });
    this.worker.addEventListener('message', this.receiveMessage, false);
    this.updateContext = null;
    this.coordsList = [];
    this.fetchingUrls = [];
  }

  receiveMessage = async (e) => {
    const { result, job, error, url } = e.data;
    if (job === 'fetchTileComplete' && !error) {
      const { render, scene, coords } = this.updateContext;
      const fetchIndex = this.fetchingUrls.indexOf(url);
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1);
      const vertices = new THREE.Float32BufferAttribute( result, 3 );
      this.cachedTiles[coords] = vertices;
      this.addTile(coords, vertices, scene, render);
    } else if (error) {
      console.log('Error fetching tile: ', error)
    }
  }

  removeOldTiles = (tiles, key) => {
    const { scene } = this.updateContext;
    const stringTiles = tiles.map( t => `${t.x}-${t.y}-${t.z}`);
    const toRemove = this.loadedTiles.reduce((acc, item) => {
      // remove uuid from tile name to compare to tiles coming in on update
      const i = item.split('-').slice(0, 3).join('-');
      if (stringTiles.indexOf(i) === -1) acc.push(item);
      return acc;
    }, []);
    toRemove.forEach(item => {
      let selectedObject = scene.getObjectByName(item);
      if (selectedObject) {
        scene.remove(selectedObject);
        const index = this.loadedTiles.indexOf(item);
        if (index > -1) this.loadedTiles.splice(index, 1);
      }
    });
  }

  update = async (tiles, scene, offsets, render) => {
    this.coordsList = [];
    const key = Date.now().toString();

    tiles.forEach((t, i) => {
      const coords = [t.x, t.y, t.z].join('-')
      this.coordsList.push(coords);
      const url = this.urlTemplate.replace(/{[^{}]+}/g, key => t[key.replace(/[{}]+/g, "")] || "");
      const currentlyFetching = this.fetchingUrls.indexOf(url) > -1;

      // if a tile is cached, use the cache, else if another update is NOT
      // ALREADY FETCHING the same url, fetch it via web worker
      if (!this.loadedTiles.indexOf(coords) > -1) {
        if (this.cachedTiles[coords]) {
          this.addTile(coords, this.cachedTiles[coords], scene, render, key);
        } else if (!currentlyFetching) {
          try {
            this.fetchingUrls.push(url);
            this.updateContext = { coords, scene, render };
            this.worker.postMessage({ job: 'fetchTile', url: url, key, offsets, size: this.size });
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

  async addTile(coords, vertices, scene, render) {
    await new Promise((resolve, reject) => {
      if (vertices && vertices.count) {
        const geom = new THREE.BufferGeometry()
        geom.addAttribute('position', vertices)
        const points = new THREE.Points(geom, this.material);
        const tileName = `${coords}-${points.uuid}`;
        points.name = tileName;
        this.loadedTiles.push(tileName);
        scene.add(points);
        render();
        resolve();
      } else resolve();
    });
  }
}

export default PointTiles
