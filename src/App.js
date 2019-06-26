import React, {Component} from 'react';

import ThreeMap from './lib/threemap';
import PointTiles from './layers/point_tiles'
import GeoJSON from './layers/geojson'

import './App.css';

const template = 'https://pixel8austin.storage.googleapis.com/lidar/tiles/{z}/{x}/{y}.csv'
const pointTiles = new PointTiles('lidar', template)
const mapillaryTracks = new GeoJSON('mapillary', 'https://pixel8austin.storage.googleapis.com/mapillary/points.json')

export default class App extends Component {
  render() {
    return (<ThreeMap center={[-97.739310,30.257733]} cam_zoom={150} layers={[pointTiles, mapillaryTracks]}/>);
  }
}

