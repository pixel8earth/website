
import React from 'react';
import icon from '../images/icon.png';
import { Slider } from '@material-ui/core';

class Sidebar extends React.Component {
  constructor() {
    super();
    this.mounted = false;

    this.state = {
      groups: [],
      expanded: false,
      positions: {},
      controlsShowing: []
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.setState({ groups: this.props.groups, expanded: this.props.expanded });
  }

  toggleExpansion = () => {
    this.setState({ expanded: !this.state.expanded });
    setTimeout(this.props.toggleSidebarCallback, 0);
  }

  toggleControls(id) {
    let updated  = [ ...this.state.controlsShowing ];
    const index = updated.indexOf(id);
    if (index > -1) {
      updated.splice(index, 1);
    } else updated.push(id);
    this.setState({ controlsShowing: updated });
  }

  changePosition = (event, group, axis, updateSFMPosition, value) => {
    event.preventDefault();
    const allPositions = this.state.positions;
    const sfmGroup = group.children[0];
    const state = (allPositions[group.name] || {});
    allPositions[group.name] = {
      s: state.s || sfmGroup.scale.x,
      x: state.x || sfmGroup.position.x,
      y: state.y || sfmGroup.position.y,
      z: state.z || sfmGroup.position.z,
      rY: state.rY || sfmGroup.rotation.y,
    };
    const val = parseFloat(event.target.value || value);
    allPositions[group.name][axis] = val;
    this.setState({ positions: allPositions });
    const degrees = parseFloat(value || 0);
    const prevDegrees = state.rY || 0;
    const updates = axis === 'rY' && value !== undefined
      ? { rY: degrees - prevDegrees }
      : { [axis]: val };
    updateSFMPosition(updates);
  }

  render() {
    const { groups, expanded, positions, controlsShowing } = this.state;
    return (
      !expanded ?
        <div style={styles.collapsed} onClick={this.toggleExpansion}>
          <img src={icon} style={styles.pixel8IconSmall} alt="pixel8 logo" />
        </div>
        :
        <div id="sidebar" style={styles.main}>
          <div style={styles.imgWrap} onClick={this.toggleExpansion}>
            <img src={icon} style={styles.pixel8Icon} alt="pixel8 logo" />
          </div>
          <div style={ styles.layersWrap }>
            { groups.map( ({ group, updateSFMPosition, resetSFMPosition }, i) => {
              const shown = group.visible;
              const showToggle = !!shown && updateSFMPosition;
              const showControls = controlsShowing.indexOf(group.uuid) > -1;
              const positionState = positions[group.name];
              const groupPosition = group.children.length > 0 ? group.children[0].position : {};
              const groupScale = group.children.length > 0 ? group.children[0].scale : {};

              const x = positionState ? positionState.x : groupPosition.x;
              const y = positionState ? positionState.y : groupPosition.y;
              const z = positionState ? positionState.z : groupPosition.z;
              const rY = positionState ? positionState.rY : 0;
              const scale = positionState ? positionState.s : groupScale.x;

              return (
                <React.Fragment key={i}>
                  { showToggle ?
                    (<div style={{ display: 'inline-flex' }}>
                      <div onClick={() => this.props.toggle(group)} style={shown ? styles.groupShown : styles.group}>
                        {group.name}
                      </div>
                      <div onClick={() => this.toggleControls(group.uuid)} style={styles.expandGroup}>
                        { showControls ? ' - ' : ' + ' }
                      </div>
                    </div>)
                    :
                    <div onClick={() => this.props.toggle(group)} style={shown ? styles.groupShown : styles.group}>
                      {group.name}
                    </div>
                  }
                  { showControls && !!shown &&
                    <div style={styles.groupShownBorder}>
                      Scale
                      <div><input style={styles.scaleInput} step={0.01} value={scale} type="number" onChange={(e) => this.changePosition(e, group, 's', updateSFMPosition)} /></div>
                      <br/>
                      Position
                      <div>X <input style={styles.positionInput} step={0.5} value={x} type="number" onChange={(e) => this.changePosition(e, group, 'x', updateSFMPosition)} /></div>
                      <div>Y <input style={styles.positionInput} step={0.5} value={y} type="number" onChange={(e) => this.changePosition(e, group, 'y', updateSFMPosition)} /></div>
                      <div>Z <input style={styles.positionInput} step={0.5} value={z} type="number" onChange={(e) => this.changePosition(e, group, 'z', updateSFMPosition)} /></div>
                      <br/>
                      <br/>
                      <br/>
                      <Slider
                        valueLabelDisplay="on"
                        valueLabelFormat={val => `${val}°`}
                        min={0}
                        max={360}
                        value={rY}
                        step={0.1}
                        onChange={(e, value) => this.changePosition(e, group, 'rY', updateSFMPosition, value)}
                        style={styles.rotationSlider}
                      />
                      Rotation
                      <br/>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => {
                            resetSFMPosition();
                            const newPositions = { ...positions };
                            newPositions[group.name] = undefined;
                            this.setState({ positions: newPositions });
                          }}
                          style={styles.resetBtn}
                        >Reset</button>
                        </div>
                    </div>
                  }
                </React.Fragment>
              );
            })}
          </div>
        </div>
    );
  }
}

const styles = {
  collapsed: {
    backgroundColor: 'transparent',
    width: '60px',
    height: '60px',
    position: 'absolute',
    top: 0,
    left: 0,
    cursor: 'pointer',
  },
  main: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    overflow: 'auto',
    backgroundColor: '#304D6D',
    color: '#fff',
  },
  group: {
    padding: '10px',
    cursor: 'pointer',
    color: '#A9A9A9',
    fontWeight: 'bold',
    borderBottom: '2px solid #2f4d6a'
  },
  groupShownBorder: {
    padding: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#263f59',
    borderBottom: '2px solid #2f4d6a'
  },
  groupShown: {
    padding: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#263f59'
  },
  expandGroup: {
    padding: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#263f59'
  },
  imgWrap: {
    textAlign: 'center',
    marginTop: '2px',
    cursor: 'pointer'
  },
  pixel8Icon: {
    width: '75px',
    padding: '5px'
  },
  pixel8IconSmall: {
    width: '50px',
    padding: '5px'
  },
  hr: {
    margin: 0,
    color: '#808080'
  },
  layersWrap: {
    // flex: 1
  },
  resetBtn: {
    padding: 5,
    margin: 5,
    backgroundColor: '#63ADF2',
    color: '#fff',
    fontWeight: 'bold',
    border: '1px transparent',
    borderRadius: '10%',
    cursor: 'pointer'
  },
  positionInput: {
    margin: '3px 6px'
  },
  scaleInput: {
    margin: '3px 6px 3px 21px'
  },
  rotationSlider: {
    color: '#63ADF2',
    width: '150px',
    margin: '0 8px'
  }
};


export default Sidebar;
