import React from 'react';
import Map from './Map';
import Layers from '../layers'
import shaders from '../layers/shaders'

const basemap = new Layers.ImageTiles('basemap',
  'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}@2x.png',
  {
    domains: ['a', 'b', 'c', 'd'],
    visible: true
  }
)

const imagery = new Layers.ImageTiles('imagery',
  'https://pixel8austin.storage.googleapis.com/imagery/{z}/{x}/{y}.jpg',
  { visible: false }
)

const points = new Layers.PointTiles('lidar',
  'https://pixel8austin.storage.googleapis.com/lidar/tiles_utm/{z}/{x}/{y}.csv.gz',
  {
    style: {
      shaders,
      size: 3.25,
      colorMap: { // RGB
        2: [0.0, 1.0, 1.0], // ground
        3: [0.0, 1.0, 0.0],
        4: [0.0, 1.0, 0.0],
        5: [0.0, 1.0, 0.0],
        6: [0.5, 0.5, 1.0] // building
      }
    },
    visible: false,
  }
)

const opts = {proj: 'EPSG:32614', visible: true}

const collects = [
  '1562868948939',
  '1562869030524',
  '1562869106351',
  '1562869165006',
  '1562869326666',
  '1562869429612',
  '1562869503401',
  '1562869606715',
]

// // geo.ply rendered
// const layers = collects.map((s,i) => {
//   return new Layers.PointCloud(s, `https://api.pixel8.earth/clouds/${s}/model.ply`, opts)
//   //return new Layers.PointCloud(s, `http://localhost:3000/clouds/${s}/model.ply`, opts)
// })

// // sfm.ply rendered
// const layers2 = collects.map((s,i) => {
//   return new Layers.PointCloud(`${s}-SFM`, `https://api.pixel8.earth/clouds/${s}/sfm.ply`, {proj: opts.proj, visible: false})
// })

// sfm rendered via sfm.sfm info
const layers3 = collects.map((s,i) => {
  return new Layers.Pixel8PointCloud(`${s}`, `https://api.pixel8.earth/clouds/${s}/sfm.json`, { proj: opts.proj, visible: false, stream: s })
})

const buildings = new Layers.Mesh('buildings', 'https://pixel8austin.storage.googleapis.com/buildings.ply', { visible: false, mapping: {x: 'y', y: 'x'}})
const ground = new Layers.Mesh('ground', 'https://pixel8austin.storage.googleapis.com/ground.ply', { visible: false, mapping: {x: 'y', y: 'x'}})

const props = {
  center: [-97.739124,30.257862],
  layers: [...layers3, points, basemap, imagery, buildings, ground],
  zOffset: 136,
  camZoom: 75,
  proj: 'EPSG:32614',
  showSidebar: true
}

function Austin() {
  return (<Map {...props} />)
}

export default Austin;
