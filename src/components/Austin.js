import React, {Component} from 'react';

import Map from './Map';
import Layers from '../layers'

const points = new Layers.PointTiles('lidar', 'https://pixel8austin.storage.googleapis.com/lidar/tile_classified/{z}/{x}/{y}.csv.gz')
//const points = new Layers.PointTiles('lidar', 'https://pixel8austin.storage.googleapis.com/lidar/tiles/{z}/{x}/{y}.csv.gz')
//const mapillaryTracks = new Layers.GeoJSON('mapillary', 'https://pixel8austin.storage.googleapis.com/mapillary/points.json.gz')
//const images = new Layers.ImageTiles('aerial', 'https://pixel8austin.storage.googleapis.com/imagery/{z}/{x}/{y}.jpg')
const images = new Layers.ImageTiles('basemap', 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png', {domains: ['a', 'b', 'c', 'd']})
//const pc1 = new Layers.PointCloud('cloud', 'https://pixel8austin.storage.googleapis.com/collects/1561994294655/geo.ply', {proj: 'EPSG:32614'})
//const pc2 = new Layers.PointCloud('cloud', 'https://pixel8austin.storage.googleapis.com/collects/1561993727406/geo.ply', {proj: 'EPSG:32614'})
//const pc3 = new Layers.PointCloud('cloud', 'https://pixel8austin.storage.googleapis.com/collects/1562091554229/geo.ply', {proj: 'EPSG:32614'})
//const mesh = new Layers.PlyTiles('ground-mesh', 'https://pixel8austin.storage.googleapis.com/mesh/ground/{z}/{x}/{y}.ply.gz')

function Austin() {
  return (<Map center={[-97.739677,30.257936]} layers={[ images, points ]} />)
}

export default Austin;
