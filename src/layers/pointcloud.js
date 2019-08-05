import * as THREE from 'three'
import proj4 from 'proj4'
import Base from './base'

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

class PointCloud extends Base {
  loaded = false

  constructor(name, url, options) {
    super(name, url, options)
    this.url = url;
    this.group = new THREE.Group();
    this.sfm = new THREE.Group();
    this.sfm.name = 'sfm';
    this.com = new THREE.Group();
    this.com.name = 'com';
    this.proj = options.proj || "EPSG:4326"
    this.sfmModel = false;
    this.stream = options.stream;
  }

  update = ({tiles, offsets, render}) => {
    if (!this.loaded) {
      const mat = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 0.25
      })
      this.render = render;
      this.fetchData(this.url, offsets)
        .then(({ data, poses }) => {
          if (poses) {
            const { com_i, com_f, rmat, scale } = poses.transforms;
            this.com_i = com_i;
            const r = [rmat[0], rmat[1], rmat[2], 0,
                      rmat[3], rmat[4], rmat[5], 0,
                      rmat[6], rmat[7], rmat[8], 0,
                      0,       0,       0,       1];

            const rot = new THREE.Matrix4()
            rot.fromArray(r);

            this.com.position.x = -com_i[0];
            this.com.position.y = -com_i[1];
            this.com.position.z = -com_i[2];
            this.com.updateMatrix();

            const q = new THREE.Quaternion();
            q.setFromRotationMatrix(rot)
            this.sfm.applyQuaternion(q);

            this.sfm.scale.x = scale;
            this.sfm.scale.y = scale;
            this.sfm.scale.z = scale;
            this.sfm.updateMatrix();

            this.sfm.position.x = com_f[0] + this.sfm.position.x;
            this.sfm.position.y = com_f[1] + this.sfm.position.y;
            this.sfm.position.z = com_f[2] + this.sfm.position.z;
            this.sfm.updateMatrix();
            this.originalSFMScale = this.sfm.scale.clone();
            this.originalSFMPosition = this.sfm.position.clone();
            this.originalSFMRotation = this.sfm.rotation.clone();

            this.sfm.add(this.com);
            this.group.add(this.sfm);
            this.group.updateMatrixWorld();
          }

          const points = this.createPoints(data);
          const model = new THREE.Points(points, mat);
          if (this.sfmModel) {
            this.sfm.add(model);
          } else this.group.add(model);
          this.loaded = true;
          render();
        })
    }
  }

  splitLine(ext, line) {
    return line.trim().split(ext === 'ply' ? ' ' : ',').map( j => parseFloat(j))
  }

  createPoints = cloudData => {
    const points = new THREE.Geometry();
    cloudData.forEach( (p, i) => {
      const color = new THREE.Color();
      color.setRGB(p[3] / 255.0, p[4] / 255.0, p[5] / 255.0)
      const point = new THREE.Vector3(p[0], p[1], p[2]);
      points.vertices.push(point);
      points.colors.push(color);
    });
    return points;
  }

  fetchData(url, offsets) {
    return new Promise(async (resolve, reject) => {
      const urlObj = new URL(url)
      const parts = url.split('/');
      const streamId = parts[parts.length - 2];
      const sfmModel = url.indexOf('sfm') > -1;
      const ply = url.indexOf('ply') > -1;
      if (sfmModel) this.sfmModel = true;

      if (ply) {
        let poses = null;
        if (sfmModel && ply) {
          poses = await fetch(`${urlObj.origin}/clouds/${streamId}/poses`)
            .then( async res => {
              if (!res.ok) {
                return reject('not found');
              }
              return res.json();
            })
        }

        fetch(url)
          .then( async res => {
            if (!res.ok) {
              return reject('not found')
            }
            return res.text()
          })
          .then(raw => {
            const data = []
            raw.split('\n').forEach( (line, i) => {
              if (sfmModel && i >= 10) {
                const p = line.trim().replace(/ +/g, ' ').split(' ').map( j => parseFloat(j));
                data.push(p);
              } else if (!sfmModel) {

                const vals = line.split(' ').map( j => parseFloat(j))
                if (!isNaN(vals[0])) {
                  data.push(vals)
                }
              }
            });
            resolve({ data, poses })
          })
          .catch(reject)
      } else {
        this.fetchRawSFM(url, urlObj, streamId)
          .then( ({ points, poses }) => resolve({ data: points, poses }))
          .catch(reject)
      }
    })
  }

  async fetchRawSFM(url, urlObj, streamId) {
    const { points, poses } = await fetch(url)
      .then( async res => {
        if (!res.ok) {
          return new Error('raw sfm not found')
        }
        return res.json()
      })
      .then(raw => {
        const { structure, poses, views, intrinsics } = raw;
        const points = structure.map(item => {
          const [ x, y, z ] = item.X;
          const [ r, g, b ] = item.color;
          return [ parseFloat(x), parseFloat(y), parseFloat(z), parseInt(r), parseInt(g), parseInt(b) ];
        });
        const data = {
          intrinsics,
          poses: poses.map(p => {
            const view = views.find((v,i) => v.poseId === p.poseId )
            return {
              image: view.path.split('/').reverse()[0],
              rotation: p.pose.transform.rotation.map(r => parseFloat(r)),
              center: p.pose.transform.center.map(r => parseFloat(r))
            }
          })
        };

        return { points, poses: data };
      });

      const transforms = await fetch(`${urlObj.origin}/clouds/${streamId}/transforms`)
        .then( async res => {
          if (!res.ok) {
            return new Error('transforms.json not found')
          }
          return res.json();
        });

    return { points, poses: { ...poses, transforms } };
  }

  rotateAroundWorldAxis(object, axis, radians) {
    // taken from https://stackoverflow.com/questions/11119753/how-to-rotate-a-object-on-axis-world-three-js
    // Rotate an object around an arbitrary axis in world space
    const rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
  }

  updateSFMPosition({ x, y, z, rY, s }) {
    if (this.sfmModel) {
      if (x) this.sfm.position.x = x;
      if (y) this.sfm.position.y = y;
      if (z) this.sfm.position.z = z;

      if (rY) {
        this.rotateAroundWorldAxis(this.sfm, new THREE.Vector3(0,1,0), THREE.Math.degToRad(rY));
        // TODO: figure out how we would get and store this new value for refine purposes.
      }

      if (s) {
        this.sfm.scale.x = s;
        this.sfm.scale.y = s;
        this.sfm.scale.z = s;
      }

      this.sfm.updateMatrix();
      this.group.updateMatrixWorld();
      this.render();
    }
  }

  resetSFMPosition() {
    if (this.sfmModel) {
      this.sfm.scale.x = this.originalSFMScale.x;
      this.sfm.scale.y = this.originalSFMScale.y;
      this.sfm.scale.z = this.originalSFMScale.z;

      this.sfm.position.x = this.originalSFMPosition.x;
      this.sfm.position.y = this.originalSFMPosition.y;
      this.sfm.position.z = this.originalSFMPosition.z;

      this.sfm.rotation.x = this.originalSFMRotation.x;
      this.sfm.rotation.y = this.originalSFMRotation.y;
      this.sfm.rotation.z = this.originalSFMRotation.z;
      this.sfm.updateMatrix();

      this.group.updateMatrixWorld();
      this.render();
    }
  }

  refine() {
    const stream = this.stream || this.name;
    const m = this.sfm.matrix;
    const rotM = [
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10]
    ];
    const { x, y, z } = this.sfm.position;
    const transforms = {
      com_i: this.com_i,
      rmat:  rotM,
      scale: this.sfm.scale.x,
      com_f: [x, y, z]
    }
    fetch(`https://api.pixel8.earth/clouds/${stream}/refine`, { method: 'POST', body: transforms })
      .then(r => r.json)
      .then(r => {
        console.log(`Refine finished for ${stream}.\nResults are: ${r}`);
        return r;
      })
      .catch(err => console.log(`Refine error for ${stream}.\nERROR: ${err}`))
  }

  getGroup() {
    this.group.name = this.name;
    return {
      group: this.group,
      stream: this.stream,
      updateSFMPosition: this.updateSFMPosition.bind(this),
      resetSFMPosition: this.resetSFMPosition.bind(this),
      refine: this.refine.bind(this)
    };
  }

}

export default PointCloud
