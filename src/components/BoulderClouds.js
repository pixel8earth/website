import React from 'react';
import Map from './Map';
import Layers from '../layers'
import shaders from '../layers/shaders'


const basemap = new Layers.ImageTiles('basemap', 
  'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}@2x.png', 
  {
    domains: ['a', 'b', 'c', 'd']
  }
)

const opts = {proj: 'EPSG:32613', visible: true}

const collects = [
  '1562101740201',
  '1562101473991',
  /*'1562012147258',
  '1562011755515',
  '1562103745032',
  '1562104208726',
  '1562102186502',
  '1562104065444',
  '1562103560377',
  '1561658241590',
  '1562103428621',
  '1562011945622',
  '1562013477645',
  '1562012681645',
  '1562012848970',
  '1562102428742',
  '1562101997373',
  '1562011562651',
  '1562013107244',
  '1562102673451',
  '1562103915303',
  '1562103029453',
  '1562102834122',
  '1562012390878',
  '1562011376554'*/
]

const layers = collects.map((s,i) => {
  return new Layers.Pixel8PointCloud(`${s}`, `https://api.pixel8.earth/clouds/${s}/sfm.json`, { proj: opts.proj, visible: false, stream: s })
})

//const mesh = new Layers.Mesh('ground', 'https://pixel8boulder.storage.googleapis.com/boulder_ground.ply', {visible: false})

const points = new Layers.PointTiles('lidar',
  //'http://localhost/~chelm/hdiz/boulder/lidar/tiles_utm/{z}/{x}/{y}.csv.gz',
  'https://pixel8boulder.storage.googleapis.com/lidar/tiles_utm/{z}/{x}/{y}.csv.gz',
  {
    style: {
      shaders,
      size: 3.25,
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

const props = {
  center: [-105.266097, 40.009416],
  layers: [...layers, points, basemap],
  zOffset: 1635,
  camZoom: 125,
  proj: "EPSG:32613",
  showSidebar: true
}

function Boulder() {
  return (<Map {...props} />)
}

export default Boulder;
