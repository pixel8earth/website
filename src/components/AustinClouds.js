import React from 'react';
import Map from './Map';
import Layers from '../layers'
import shaders from '../layers/shaders'

const basemap = new Layers.ImageTiles('basemap', 
  'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png', 
  {
    domains: ['a', 'b', 'c', 'd'],
    visible: true
  }
)

const points = new Layers.PointTiles('lidar',
  'https://pixel8austin.storage.googleapis.com/lidar/tiles_utm/{z}/{x}/{y}.csv.gz',
  {
    style: {
      shaders,
      size: 1.25,
      colorMap: { // RGB
        2: [0.0, 1.0, 1.0],
        3: [0.0, 1.0, 0.0],
        4: [0.0, 1.0, 0.0],
        5: [0.0, 1.0, 0.0],
        6: [0.5, 0.5, 1.0]
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

const layers = collects.map((s,i) => {
  return new Layers.PointCloud(s, `https://api.pixel8.earth/clouds/${s}/model.ply`, opts)
  //return new Layers.PointCloud(s, `http://localhost:3000/clouds/${s}/model.ply`, opts)
})

const mesh = new Layers.Mesh('ground', 'https://pixel8austin.storage.googleapis.com/austin_ground.ply', {visible: false})

const props = {
  center: [-97.739124,30.257862],
  layers: [...layers, points, basemap, mesh],
  zOffset: 136,
  camZoom: 75,
  proj: 'EPSG:32614',
  showSidebar: true
}

function Austin() {
  return (<Map {...props} />)
}

export default Austin;
