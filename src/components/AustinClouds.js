import React from 'react';
import Map from './Map';
import Layers from '../layers'
import shaders from '../layers/shaders'

// minz, maxz, scale factor
const scales = [138, 350, .5]

const basemap = new Layers.ImageTiles('basemap', 
  'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png', 
  {
    domains: ['a', 'b', 'c', 'd'],
    visible: true
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

const opts = {proj: 'EPSG:32614', visible: true, scales}

const collects = [
  '1562869030524',
  '1562869429612',
  '1562869106351', 
  '1562869503401', 
  /*'1562869165006', 
  '1562868948939',
  '1562869326666',
  '1562869606715',*/
]

//const layers = collects.map((s,i) => {
  //return new Layers.PointCloud(s, `https://pixel8austin.storage.googleapis.com/collects/${s}/geo.ply`, opts)
//  return new Layers.PointCloud(s, `http://localhost/~chelm/pixel8_streams/streams/${s}/geo.ply`, opts)
//})


const layers = [
  new Layers.PointCloud('1562869030524', `http://localhost/~chelm/pixel8_streams/streams/1562869030524/geo.ply`, {...opts, color: 0x00ff00}),
  new Layers.PointCloud('1562869429612', `http://localhost/~chelm/pixel8_streams/streams/1562869429612/geo.ply`, {...opts, color: 0x00ff00}),
  new Layers.PointCloud('1562869106351', `http://localhost/~chelm/pixel8_streams/streams/1562869106351/geo.ply`, {...opts, color: 0x00ffff}),
  new Layers.PointCloud('1562869503401', `http://localhost/~chelm/pixel8_streams/streams/1562869503401/geo.ply`, {...opts, color: 0x00ffff}),
]

const geojsonLayers = collects.map((s,i) => {
  return new Layers.GeoJSON(`${s}-gps`,
    `http://localhost/~chelm/hdiz/wrld_expo/notebooks/georef-theory/austin_cams/${s}.geojson`,
    {
      color: 0xfff000,
      feature_size: 0.0025,
      visible: false
    }
  )
})

const props = {
  center: [-97.739677,30.257936],
  layers: [...layers, ...geojsonLayers, basemap],
  zOffset: scales[0],
  camZoom: .5,
  showSidebar: true
}

function Austin() {
  return (<Map {...props} />)
}

export default Austin;
