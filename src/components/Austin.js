import React from 'react';
import * as THREE from 'three'
import Map from './Map';
import Layers from '../layers'

const vert = `
  attribute vec3 ca;
  uniform float size;
  varying vec3 vUv;
  varying vec3 vColor;
  void main()
  {
      vColor = ca;
      vUv = position;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      gl_PointSize = min(max(size * vUv.z, 0.25), 1.25);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const frag = `
  varying vec3 vColor;
  precision mediump float;
  void main()
  {
      gl_FragColor = vec4(vColor, 1.0);
      gl_FragColor.a = 1.0;
  }
`

const points = new Layers.PointTiles('lidar', 
  'https://pixel8austin.storage.googleapis.com/lidar/tiles_classified/{z}/{x}/{y}.csv.gz',
  {
    style: {
      shaders: { vert, frag },
      size: 1.25,
      colorMap: {
        2: [0.0, 1.0, 1.0],
        3: [0.0, 1.0, 0.0],
        4: [0.0, 1.0, 0.0],
        5: [0.0, 1.0, 0.0],
        6: [0.5, 0.5, 1.0]
      }
    },
    visible: false,
    scales: [130, 350, .5] // min,max,scale
  }
)

const tracks = new Layers.GeoJSON('mapillary', 
  'https://pixel8austin.storage.googleapis.com/mapillary/points.json.gz',
  { color: 0xfff000 }
)

const images = new Layers.ImageTiles('basemap', 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png', {domains: ['a', 'b', 'c', 'd']})
//const mesh = new Layers.PlyTiles('ground-mesh', 'https://pixel8austin.storage.googleapis.com/mesh/ground/{z}/{x}/{y}.ply.gz')
//const pc1 = new Layers.PointCloud('cloud', 'https://pixel8austin.storage.googleapis.com/collects/1561994294655/geo.ply', {proj: 'EPSG:32614'})
//const pc2 = new Layers.PointCloud('cloud', 'https://pixel8austin.storage.googleapis.com/collects/1561993727406/geo.ply', {proj: 'EPSG:32614'})
//const pc3 = new Layers.PointCloud('cloud', 'https://pixel8austin.storage.googleapis.com/collects/1562091554229/geo.ply', {proj: 'EPSG:32614'})

const config = {
  center: [-97.739677,30.257936],
  layers: [ images, points, tracks ],
  zOffset: 130
}


function Austin() {
  return (<Map {...config} />)
}

export default Austin;
