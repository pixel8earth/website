import React from 'react';
import Map from './Map';
import Layers from '../layers'
//import shaders from '../layers/shaders'

// minz, maxz, scale factor
const scales = [1620, 1840, .5]

const basemap = new Layers.ImageTiles('basemap', 
  'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png', 
  {
    domains: ['a', 'b', 'c', 'd']
  }
)

const opts = {proj: 'EPSG:32613', visible: true, scales}

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
  /*if (i === 0) {
    return new Layers.PointCloud(s, `https://pixel8austin.storage.googleapis.com/collects/${s}/geo-model.csv`, {...opts, visible: false})
  }
  return new Layers.PointCloud(s, `https://pixel8austin.storage.googleapis.com/collects/${s}/geo-model.csv`, opts)*/
  return new Layers.PointCloud(s, `http://localhost/~chelm/pixel8_streams/streams/${s}/geo.ply`, opts)
})

const props = {
  center: [-105.266097, 40.009416],
  layers: [basemap, ...layers],
  zOffset: scales[0],
  camZoom: .5
}

function Austin() {
  return (<Map {...props} />)
}

export default Austin;
