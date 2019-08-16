import React, {Component} from 'react';
import ThreeMap from '../lib/threemap';

export default class Map extends Component {
  render() {
    return (<ThreeMap {...this.props} />);
  }
}
