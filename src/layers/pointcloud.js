import * as THREE from 'three'
import { llPixel } from '../lib/utils'
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
    this.geo = new THREE.Group();
    this.sfm = new THREE.Group();
    this.com = new THREE.Group();
    this.proj = options.proj || "EPSG:4326"
  }

  update = ({tiles, offsets, render}) => {
    if (!this.loaded) {
      const mat = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 0.001
      })

      this.fetchData(this.url, offsets)
        .then(({ data, transforms, poses }) => {
          const { com_i, com_f, rmat, scale } = transforms;
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
          console.log('sfm pos', this.sfm.position);

          this.sfm.add(this.com);
          this.group.add(this.sfm);
          this.group.updateMatrixWorld();

          const points = this.createPoints(data);
          console.log('points ', points)
          const model = new THREE.Points(points, mat);
          this.group.add(model);
          this.loaded = true;
          render();
        })
    }
  }

  splitLine(ext, line) {
    return line.trim().split(ext === 'ply' ? ' ' : ',').map( j => parseFloat(j))
  }

  mean = values => {
    const sum = parseInt(values.reduce((previous, current) => current + parseFloat(previous, 0), 0), 0)
    return parseInt(sum / values.length, 0)
  };

  computeOffsets = rawModel => {
    const x = [rawModel[0]], y = [rawModel[1]], z = [rawModel[2]];
    return [this.mean(x), this.mean(y), this.mean(z)]
  }

  createPoints = cloudData => {
    // const posesLength = poses.map(p => p.image).length;
    // const data = cloudData; // remove camera poses from data -> cloudData.slice(this.poses.length);
    // // use the avg as the offsets for the first cloud
    // // where the arg passed to _computeOffsets is NOT a camera pose
    // const offsets = this.computeOffsets(data[posesLength]);
    // // add offsets to the geo group so they are applied to any children
    // this.geo.position.x = -offsets[0];
    // this.geo.position.y = -offsets[1];
    // this.geo.position.z = -offsets[2];
    // this.geo.updateMatrix();

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
      const parts = url.split('.');
      const ext = parts[parts.length - 1];
      const parts2 = url.split('/');
      const streamId = parts2[parts2.length - 2];
      const transforms = await fetch(`https://pixel8austin.storage.googleapis.com/collects/${streamId}/transforms.json`)
        .then( async res => {
          if (!res.ok) {
            return reject('not found');
          }
          return res.json();
        });

      const poses = await fetch(`https://pixel8austin.storage.googleapis.com/collects/${streamId}/sfm.sfm`)
        .then( async res => {
          if (!res.ok) {
            return reject('not found');
          }
          return res.json();
        })
        .then(data => {
          const poses = data.poses.reduce((acc, pose) => {
            const view = data.views.find(view => view.poseId === pose.poseId);
            const splitPath = view.path.split('/');
            const imageName = splitPath[splitPath.length - 1];
            acc.push({
              image: imageName,
              rotation: pose.pose.transform.rotation.map(r => parseFloat(r)),
              center: pose.pose.transform.center.map(r => parseFloat(r))
            });
            return acc;
          }, [])
          return poses;
        });

      this.geo.position.set(-offsets.x, -offsets.y, -offsets.z);
      this.geo.updateMatrix();

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
            const vals = line.split(' ').map( j => parseFloat(j))
            if (!isNaN(vals[0])) {
              data.push(vals)
            }
          });

          // create an array of vertices
          // const points = new THREE.Geometry();
          // raw.split('\n').forEach( (line, i) => {
          //   if (i >= 10) {
          //     const p = this.splitLine(ext, line)
          //     if (!isNaN(p[0])) {
          //       // NOTE: corrects for order of X/Y/Z in source data
          //       const xyz = ext === 'ply' ? [p[2], p[0], p[1]] : [p[0], p[1], p[2]]
          //       // go to LatLng
          //       const ll = proj4(this.proj, 'EPSG:4326').forward([xyz[0], xyz[1]])
          //       // go to pixels
          //       let px = llPixel(ll, 0, this.size)
          //       // go to world coords in three.js
          //       const pt = {x: px[0] - this.size / 2, y: px[1] - this.size / 2, z: xyz[2]}
          //       // scale the z coord
          //       const zMin = this.options.scales[0] || 130;
          //       const zMax = this.options.scales[1] || 350;
          //       const scaledZ = ((pt.z - zMin) / (zMax - zMin)) * (this.options.scales[2] || 0.5) + zMin;
          //       // apply offsets to x/y
          //       points.vertices.push(new THREE.Vector3(pt.x - offsets.x, -pt.y + offsets.y, scaledZ));
          //       this.geo.position.set(pt.x - offsets.x, -pt.y + offsets.y, scaledZ);
          //
          //       this.geo.position.set(-offsets.x, -offsets.y, -offsets.z);
          //       this.geo.updateMatrix();
          //
          //       // points.vertices.push(new THREE.Vector3(p[0], p[1], p[2]));
          //       const color = new THREE.Color();
          //       color.setRGB(p[3] / 255.0, p[4] / 255.0, p[5] / 255.0)
          //       points.colors.push(color);
          //     }
          //   }
          // })

          resolve({ data, transforms, poses })
        })
        .catch(reject)
    })
  }

}

export default PointCloud
