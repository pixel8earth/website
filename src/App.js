import React, {Component} from 'react';

import ThreeMap from './lib/threemap';
import PointTiles from './layers/point_tiles'
import GeoJSON from './layers/geojson'

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
const template = 'https://pixel8austin.storage.googleapis.com/lidar/tiles/{z}/{x}/{y}.csv.gz'
const pointTiles = new PointTiles('lidar', template)
const mapillaryTracks = new GeoJSON('mapillary', 'https://pixel8austin.storage.googleapis.com/mapillary/points.json.gz')

export default class App extends Component {
  render() {
    return (<ThreeMap center={[-97.739310, 30.257733]} cam_zoom={150} layers={[pointTiles, mapillaryTracks]}/>);
  }
}

