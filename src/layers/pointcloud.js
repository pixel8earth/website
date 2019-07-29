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
    this.com = new THREE.Group();
    this.proj = options.proj || "EPSG:4326"
    this.sfmModel = false;
  }

  update = ({tiles, offsets, render}) => {
    if (!this.loaded) {
      const mat = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 0.25
      })

      this.fetchData(this.url, offsets)
        .then(({ data, poses }) => {
          if (poses) {
            const { com_i, com_f, rmat, scale } = poses.transforms;
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
      if (sfmModel) this.sfmModel = true;

      let poses = null;
      if (sfmModel) {
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
    })
  }

}

export default PointCloud
