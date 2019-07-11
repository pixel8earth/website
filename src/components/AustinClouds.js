import React from 'react';
import Map from './Map';
import Layers from '../layers'
import shaders from '../layers/shaders'

// minz, maxz, scale factor
const scales = [160, 350, .5]

const basemap = new Layers.ImageTiles('basemap', 
  'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png', 
  {
    domains: ['a', 'b', 'c', 'd']
  }
)

const points = new Layers.PointTiles('lidar',
  'https://pixel8austin.storage.googleapis.com/lidar/tiles_classified/{z}/{x}/{y}.csv.gz',
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
    scales
  }
)

const opts = {proj: 'EPSG:32614', visible: false, scales}

const collects = [
  '1561993539276',
  '1561993323744',
  '1561993935331',
  '1562091866831',
  '1561993985425',
  '1561993019219',
  '1562091122579',
  '1561993911215',
  '1562091031534',
  '1561993577452',
  '1561993502445',
  '1561993764361',
  '1562090922948',
  '1561994036550',
  '1561994012859',
  '1561993871722',
  '1561993637518',
  '1561994294655',
  '1561993727406'
]

const layers = collects.map((s,i) => {
  if (i === 0) {
    return new Layers.PointCloud(s, `https://pixel8austin.storage.googleapis.com/collects/${s}/geo.ply`, {...opts, visible: true})
  }
  return new Layers.PointCloud(s, `https://pixel8austin.storage.googleapis.com/collects/${s}/geo.ply`, opts)
})

const props = {
  center: [-97.739677,30.257936],
  layers: [basemap, points, ...layers],
  zOffset: scales[0],
  camZoom: .5
}

function Austin() {
  return (<Map {...props} />)
}

export default Austin;
