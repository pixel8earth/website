import * as THREE from 'three'
import proj4 from 'proj4'
import Base from './base'
import PLYLoader from '../lib/plyloader'

proj4.defs([
  [
    'EPSG:4326',
    '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
  ],[
    'EPSG:32614',
    '+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs'
  ],[
    'EPSG:32613',
    '+proj=utm +zone=13 +datum=WGS84 +units=m +no_defs'
  ]
]);

class Mesh extends Base {
  loaded = false
  loader = new PLYLoader();

  constructor(name, url, options) {
    super(name, url, options)
    this.url = url;
    this.group = new THREE.Group();
  }

  update = async ({render}) => {
    if (!this.loaded) {
      const geometry = await this.loader.load(this.url)
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      var material = new THREE.MeshPhongMaterial({color: 0x00ffff, wireframe: false, side: THREE.DoubleSide});
      var mesh = new THREE.Mesh(geometry, material);
      this.group.add(mesh);
      this.loaded = true;
      render()
    }
  }

}

export default Mesh
