import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Map from './components/Map';
import Home from './components/Home';
import Layers from './layers'
import './App.css';

const points = new Layers.PointTiles('lidar', 'https://pixel8austin.storage.googleapis.com/lidar/tiles/{z}/{x}/{y}.csv.gz')
//const points = new Layers.PointTiles('lidar', 'http://localhost/~chelm/hdiz/austin/mesh_src/{z}/{x}/{y}.csv.gz')
//const mapillaryTracks = new Layers.GeoJSON('mapillary', 'https://pixel8austin.storage.googleapis.com/mapillary/points.json.gz')
//const images = new Layers.ImageTiles('aerial', 'https://pixel8austin.storage.googleapis.com/imagery/{z}/{x}/{y}.jpg')
const images = new Layers.ImageTiles('basemap', 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png', {domains: ['a', 'b', 'c', 'd']})
//const mesh = new Layers.PlyTiles('ground-mesh', 'http://localhost/~chelm/hdiz/austin/meshes/ground/{z}/{x}/{y}.ply.gz')
//const mesh = new Layers.PlyTiles('ground-mesh', 'https://pixel8austin.storage.googleapis.com/mesh/ground/{z}/{x}/{y}.ply.gz')
//const pc = new Layers.PointCloud('cloud', 'http://localhost/~chelm/hdiz/austin/collects/1561993727406/geo-model.csv', {proj: 'EPSG:32614'})

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/austin" component={() => <Map center={[-97.739677,30.257936]} layers={[ images, points ]} />} />
        <Route path="/boulder" component={() => <Map center={[-105.2705, 40.0150]} layers={[ images ]} />} />
      </div>
    </Router>
  );
}

export default App;
