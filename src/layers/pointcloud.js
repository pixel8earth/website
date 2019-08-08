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
    this.proj = options.proj || "EPSG:4326"
  }

  update = ({tiles, offsets, render}) => {
    if (!this.loaded) {
      const mat = new THREE.PointsMaterial({
        //vertexColors: THREE.VertexColors,
        color: this.color,
        size: 0.25
      })
      this.render = render;
      this.fetchData(this.url, offsets)
        .then(({ data }) => {
          const points = this.createPoints(data);
          console.log(points.vertices[0])
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

  createPoints = cloudData => {
    const points = new THREE.Geometry();
    cloudData.forEach( (p, i) => {
      const color = new THREE.Color();
      color.setRGB(p[3] / 255.0, p[4] / 255.0, p[5] / 255.0)
      const point = new THREE.Vector3(p[1], p[2], p[0]);
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
      const ply = url.indexOf('ply') > -1;

      if (ply) {
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
              if (i >= 10) {
                const p = line.trim().replace(/ +/g, ' ').split(' ').map( j => parseFloat(j));
                data.push(p);
              }
            });
            resolve({ data })
          })
          .catch(reject)
      } else {
        this.fetchRawSFM(url, urlObj, streamId)
          .then( ({ points, poses }) => resolve({ data: points, poses }))
          .catch(reject)
      }
    })
  }

  getGroup() {
    this.group.name = this.name;
    return {
      group: this.group
    };
  }

}

export default PointCloud
