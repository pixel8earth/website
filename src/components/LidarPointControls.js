
import React from 'react';
import Input from '@material-ui/core/Input';
import * as THREE from 'three';

class LidarPointControls extends React.Component {
  constructor() {
    super();
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true;
  }

  changePointColor = (event, group, oldColor, renderScene) => {
    event.preventDefault();
    group.children.forEach((pointsGroup, i) => {
      const colorsPerPoint = [];
      const colors = (pointsGroup.geometry.attributes.ca.array || []);
      colors.forEach((n, i) => {
        if ((i + 1) % 3 === 0) {
          colorsPerPoint.push([colors[i - 2], colors[i - 1], n]);
        }
      });
      const newColor = this.hexToRGB(event.target.value);
      const newColors = colorsPerPoint.map(color => {
        if (color[0] === oldColor[0] && color[1] === oldColor[1] && color[2] === oldColor[2]) {
          return newColor;
        } else return color;
      }).flat();
      group.children[i].geometry.attributes.ca.array = new THREE.Float32BufferAttribute(newColors, 3);
    });
    renderScene();
  }

  RGBToHex(red, green, blue) {
   let r = red.toString(16);
   let g = green.toString(16);
   let b = blue.toString(16);

   if (r.length === 1)
     r = "0" + r;
   if (g.length === 1)
     g = "0" + g;
   if (b.length === 1)
     b = "0" + b;

   return "#" + r + g + b;
  }

  hexToRGB(h) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (h.length === 4) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length === 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
    }

    // return "rgb("+ +r + "," + +g + "," + +b + ")";
    return [256 - Number(r), 256 - Number(g), 256 - Number(b)];
  }


  render() {
    const { group, colors, renderScene } = this.props.groupInfo;


    return (
      <React.Fragment>
        <div style={styles.column}>
          {Object.values(colors).map((rgb, i) => {
            const r = Number.isInteger(rgb[0] % 1) ? (rgb[0] === 0 ? 0 : 256 - rgb[0]) : 256 * rgb[0];
            const g = Number.isInteger(rgb[1] % 1) ? (rgb[1] === 0 ? 0 : 256 - rgb[1]) : 256 * rgb[1];
            const b = Number.isInteger(rgb[2] % 1) ? (rgb[2] === 0 ? 0 : 256 - rgb[2]) : 256 * rgb[2];

            return (
              <div style={styles.row} key={i}>
                <Input type="color" value={this.RGBToHex(r,g,b)} style={styles.colorInput} onChange={(e) => this.changePointColor(e, group, rgb, renderScene)} />
                { i === 0 && <span>&nbsp;ground</span> }
                { i !== 0 && i !== 4 && <span>&nbsp;vegetation?</span> }
                { i === 4 && <span>&nbsp;buildings</span> }
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

const styles = {
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  colorInput: {
    width: '50px'
  }
};

export default LidarPointControls;
