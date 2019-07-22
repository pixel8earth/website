import React from 'react';
import Map from './Map';
import Layers from '../layers'
import shaders from '../layers/shaders'

// minz, maxz, scale factor
const scales = [160, 350, .5]

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
    visible: true,
    scales
  }
)

const tracks = new Layers.GeoJSON('mapillary',
  'https://pixel8austin.storage.googleapis.com/mapillary/points.json.gz',
  {
    color: 0xfff000,
    visible: false
  }
)

const images = new Layers.ImageTiles('basemap',
  'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
  {
    domains: ['a', 'b', 'c', 'd']
  }
)

const mesh = new Layers.PlyTiles('ground-mesh',
  'https://pixel8austin.storage.googleapis.com/lidar/mesh/ground_buildings/{z}/{x}/{y}.ply.gz',
  {
    wireframe: true,
    opacity: .9,
    color: 0x333888,
    scales,
    visible: false
  }
)

const opts = {proj: 'EPSG:32614', visible: false, scales}
const pc1 = new Layers.PointCloud('cloud1', 'http://54.91.27.23/clouds/1562869429612/model.ply', opts)
const pc2 = new Layers.PointCloud('cloud2', 'http://54.91.27.23/clouds/1562869503401/model.ply', opts)

const props = {
  center: [-97.739677,30.257936],
  layers: [ pc1, pc2 ],
  zOffset: scales[0],
  camZoom: .5
}

function Austin() {
  return (<Map {...props} />)
}

export default Austin;
