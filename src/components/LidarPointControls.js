
import React from 'react';
import * as THREE from 'three';
import MaterialColorPicker from 'react-material-color-picker';
import Visible from '@material-ui/icons/Visibility';
import NotVisible from '@material-ui/icons/VisibilityOff';

class LidarPointControls extends React.Component {
  constructor() {
    super();
    this.mounted = false;
    this.state = {
      colors: null,
      changingColor: null
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  changePointColor = (event, group, oldColor, key, updateColorMap) => {
    const newColor = this.hexToRGB(event.target.value, key);
    updateColorMap(key, newColor);
    this.updateGeometry(group, oldColor, newColor);
    this.props.renderScene();
    this.setState({ changingColor: null });
  }

  updateGeometry(group, oldColor, newColor) {
    group.children.forEach((pointsGroup, i) => {
      const colorsPerPoint = [];
      const colors = pointsGroup.geometry.getAttribute('ca').array;
      if (colors) {
         colors.forEach((n, i) => {
          if ((i + 1) % 4 === 0) {
            colorsPerPoint.push([colors[i - 3], colors[i - 2], colors[i - 1], n]);
          }
        });
        const newColors = colorsPerPoint.map(color => {
          if (color[0] === oldColor[0] && color[1] === oldColor[1] && color[2] === oldColor[2] && color[3] === oldColor[3]) {
            return newColor;
          } else return color;
        }).flat();
        group.children[i].geometry.attributes.ca.needsUpdate = true;
        group.children[i].geometry.addAttribute('ca', new THREE.Float32BufferAttribute(newColors, 4));
      }
    });
  }

  toggleClass(group, oldColor, key, updateColorMap) {
    const alpha = oldColor[3] === 1.0 ? 0.0 : 1.0;
    const newColor = [ oldColor[0], oldColor[1], oldColor[2], alpha ];
    updateColorMap(key, newColor);
    this.updateGeometry(group, oldColor, newColor);
    this.props.renderScene();
    this.forceUpdate();
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

  hexToRGB(h, key) {
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

    r = Number(r);
    g = Number(g);
    b = Number(b);

    this.setState({ colors: { [key]: { r, g, b } } });

    r = r / 256;
    g = g / 256;
    b = b / 256;

    return [r, g, b, 1.0];
  }


  render() {
    const { group, colors, updateColorMap } = this.props.groupInfo;

    return (
      <React.Fragment>
        <div style={styles.column}>
          {colors && Object.values(colors).map((rgba, i) => {
            const key = Object.keys(colors)[i];
            let r = rgba[0], g = rgba[1], b = rgba[2], classification;
            if (this.state.colors && this.state.colors[key]) {
              r = this.state.colors[key].r;
              g = this.state.colors[key].g;
              b = this.state.colors[key].b;
            } else {
              r = Number.isInteger(r) ? (r === 0 ? 0 : 256 - r) : 256 * r;
              g = Number.isInteger(g) ? (g === 0 ? 0 : 256 - g) : 256 * g;
              b = Number.isInteger(b) ? (b === 0 ? 0 : 256 - b) : 256 * b;
            }

            if (key === '2') classification = 'ground';
            if (key === '3') classification = 'low veg';
            if (key === '4') classification = 'med veg';
            if (key === '5') classification = 'tall veg';
            if (key === '6') classification = 'building';

            const showColorPicker = this.state.changingColor === group.uuid + key;

            return (
              <div style={styles.row} key={key}>
                <div
                  style={{ ...styles.colorSwatch, backgroundColor: `${this.RGBToHex(r,g,b)}`}}
                  onClick={() => this.setState({ changingColor: group.uuid + key })}
                >
                </div>
                { showColorPicker &&
                  <div style={styles.colorPicker}>
                    <MaterialColorPicker
                      initColor={this.RGBToHex(r,g,b)}
                      onSubmit={(e) => this.changePointColor(e, group, rgba, key, updateColorMap)}
                      onReset={() => this.setState({ changingColor: null })}
                      style={{ fontWeight: 'bold' }}
                      submitLabel="Apply"
                      resetLabel="Cancel"
                    />
                  </div>
                }
                <div style={styles.classification}>{classification}</div>
                <div style={styles.iconWrap} onClick={() => this.toggleClass(group, rgba, key, updateColorMap)}>
                  { rgba[3] === 1.0 ? <NotVisible style={styles.icon} /> : <Visible style={styles.icon} /> }
                </div>
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
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  colorSwatch: {
    width: '36px',
    height: '18px',
    marginLeft: '6px',
    cursor: 'pointer',
  },
  btn: {
    color: '#fff',
    backgroundColor: '#63ADF2',
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 1,
    fontWeight: 'bold'
  },
  classification: {
    margin: '0 6px'
  },
  iconWrap: {
    marginRight: '6px'
  },
  icon: {
    color: "#63ADF2",
    cursor: 'pointer'
  },
  colorPicker: {
    position: 'absolute',
    bottom: '6px',
    left: '6px',
    padding: '2px',
    borderRadius: '6px',
    backgroundColor: '#fff'
  }
};

export default LidarPointControls;
