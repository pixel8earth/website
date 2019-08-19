import * as THREE from 'three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';
import Base from './base';

const P8Mesh = 'Pixel8Mesh';

class OBJ extends Base {
  loaded = false

  constructor(name, url, options) {
    super(name, url, options)
    this.url = url;
    this.sfm = new THREE.Group();
    this.sfm.name = 'sfm';
    this.stream = options.stream;
    this.type = P8Mesh;
    this.loaded = false;
  }

  onLoad = async ({ result, job, error, url }) => {
    if (job === 'fetchTileComplete' && !error) {
      this.mesh = result;
      const transforms = await fetch(`https://api2.pixel8.earth/clouds/${this.stream}/transforms`)
        .then( async res => {
          if (!res.ok) {
            return new Error('transforms.json not found')
          }
          return res.json();
        });

      const { com_f, rmat, scale } = transforms;
      const r = [rmat[0], rmat[1], rmat[2], 0,
                rmat[3], rmat[4], rmat[5], 0,
                rmat[6], rmat[7], rmat[8], 0,
                0,       0,       0,       1];

      const rot = new THREE.Matrix4()
      rot.fromArray(r);

      this.sfm.setRotationFromMatrix(rot);
      this.sfm.updateMatrix();

      this.sfm.scale.x = scale;
      this.sfm.scale.y = scale;
      this.sfm.scale.z = scale;
      this.sfm.updateMatrix();

      this.sfm.position.x = com_f[0] + this.sfm.position.x;
      this.sfm.position.y = com_f[1] + this.sfm.position.y;
      this.sfm.position.z = com_f[2] + this.sfm.position.z;
      this.sfm.updateMatrix();

      this.group.add(this.sfm);
      this.group.updateMatrixWorld();

      const fetchIndex = this.fetchingUrls.indexOf(url)
      if (fetchIndex > -1) this.fetchingUrls.splice(fetchIndex, 1)
      this.addMesh(result);
    } else if (error) {
      console.log('Error fetching tile: ', error)
    }
  }

  update = async ({ tiles, offsets, render }) => {
    if (!this.loaded) {
      try {
        if (!this.renderScene) this.renderScene = render;
        this.fetchMesh({
          name: this.name,
          job: 'fetchTile',
          url: this.url
        });
      } catch (err) {
        console.log('Error loading texturedMesh.obj: ', err)
      }
    }
  }

  fetchMesh = ({name, url, options}) => {
    try {
      const objLoader2 = new OBJLoader2();
      const mtlLoader = new MTLLoader();
      mtlLoader.load(url.replace('.obj', '.mtl'), mtlParseResult => {
				objLoader2.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ) );
				objLoader2.load( url, obj => {
          this.onLoad({ job: 'fetchTileComplete', result: obj.children[0], url: url, name });
        });
      })
    } catch (err) {
      postMessage({ error: err.message })
    }
  }

  addMesh(mesh) {
    if (mesh) {
      this.sfm.add(mesh)
      this.renderScene()
      this.loaded = true;
    }
  }

  getGroup() {
    this.group.name = this.name;

    return {
      group: this.group,
      stream: this.stream
    };
  }

}

export default OBJ
