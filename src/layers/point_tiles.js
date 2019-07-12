import * as THREE from 'three'
import Base from './base'
import worker from '../lib/lidar_worker';
import WebWorker from '../lib/WebWorker';

class PointTiles extends Base {

  constructor(name, url, options={}) {
    super(name, url, options)
    if (options.style && options.style.shaders ) {
      const { vert, frag } = options.style.shaders
      this.material = new THREE.ShaderMaterial( {
        uniforms: {
          size: { type: 'f', value: options.style.size || 1.0 }
        },
        depthTest: false,
        depthWrite: false,
        transparent:  true,
        vertexShader: vert,
        fragmentShader: frag,
      })
    } else {
      this.material = new THREE.PointsMaterial({color: this.color, size: options.style.size || 1.0 })
    }

    this.workerPool = [];
    for (let i = 0; i < 4; i++) {
      const w = new WebWorker(worker, { type: "module" });
      w.addEventListener('message', this.receiveMessage, false)
      this.workerPool.push(w)
    }
  }

  receiveMessage = async (e) => {
    const { result, job, error, url, coords } = e.data;
    if (job === 'fetchTileComplete' && !error) {
      const fetchIndex = this.fetchingUrls.indexOf(url);
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1);
      const vertices = new THREE.Float32BufferAttribute( result[0], 3 );
      const colors = new THREE.Float32BufferAttribute( result[1], 3 );
      const geom = new THREE.BufferGeometry()
      geom.addAttribute('position', vertices)
      geom.addAttribute('ca', colors)
      this.cachedTiles[coords] = geom;
      this.addTile(coords, geom);
    } else if (error) {
      console.log('Error fetching tile: ', error)
    }
  }

  addTile(coords, geom) {
      const points = new THREE.Points(geom, this.material);
      const tileName = `${coords}-${points.uuid}`;
      points.name = tileName;
      this.loadedTiles.push(tileName);
      this.group.add(points);
      this.renderScene();
  }

}

export default PointTiles
