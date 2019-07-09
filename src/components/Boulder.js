import React, {Component} from 'react';

import Map from './Map';
import Layers from '../layers'

const images = new Layers.ImageTiles('basemap', 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png', {domains: ['a', 'b', 'c', 'd']})

function Boulder() {
  return (<Map center={[-105.2705, 40.0150]} layers={[ images ]} />)
}

export default Boulder;
