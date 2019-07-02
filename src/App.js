import React, {Component} from 'react';

import ThreeMap from './lib/threemap';
import PointTiles from './layers/point_tiles'
import PlyTiles from './layers/ply_tiles'
import ImageTiles from './layers/image_tiles'
import GeoJSON from './layers/geojson'
import PointCloud from './layers/pointcloud'

import './App.css';

/**
  TODO List 

  1. For hosting purposes we probably want to have this App.js render the Pixel8 home page but support loading the visualizations via a route so we need some sort of routing
     ie: pixel8.earth/austin and pixel8.earth/boulder
  2. The point tiles have issues with tiles loading out of sync. Like if we're in the middle of fetching a chunk of tiles and the user moves, sometimes tiles that are not fetched yet will show up 
      that are supposed to be hidden, or at least are not in the current view. 
      To solve this i think we need to have some sort of state on the point tile component that either (1) prevent tiles from rendering that are invalid or (2) the promises on the fetches need to be cancelled 

  3. Render meshes 
  4. aerial imagery 
  5. source all data providers 

  6. animate ground level things... move along a path etc  
 
 
*/
//const template = 'http://localhost/~chelm/hdiz/austin/lidar_tiles/{z}/{x}/{y}.csv.gz'
//const template = 'https://pixel8austin.storage.googleapis.com/lidar/tiles/{z}/{x}/{y}.csv.gz'
const points = new PointTiles('lidar', 'https://pixel8austin.storage.googleapis.com/lidar/tiles/{z}/{x}/{y}.csv.gz')
const mapillaryTracks = new GeoJSON('mapillary', 'https://pixel8austin.storage.googleapis.com/mapillary/points.json.gz')
const images = new ImageTiles('aerial', 'http://localhost/~chelm/hdiz/austin/imagery/image_tiles/{z}/{x}/{y}.jpg')
const mesh = new PlyTiles('mesh', 'http://localhost/~chelm/hdiz/austin/meshes/{z}/{x}/{y}.ply')
const pc = new PointCloud('cloud', 'http://localhost/~chelm/hdiz/austin/collects/1561993727406-raw.csv', {proj: 'EPSG:32614'})

export default class App extends Component {
  render() {
    return (<ThreeMap center={[-97.739677,30.257936]} cam_zoom={1} layers={[mapillaryTracks, pc, points]}/>);
  }
}

