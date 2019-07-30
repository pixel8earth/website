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
      rX: state.rX || sfmGroup.rotation.x,
      rY: state.rY || sfmGroup.rotation.y,
      rZ: state.rZ || sfmGroup.rotation.z,
    };
    allPositions[group.name][axis] = parseFloat(event.target.value || value);

    this.setState({ positions: allPositions });
    updateSFMPosition(allPositions[group.name]);
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
              const shown = ~(this.props.showing || []).indexOf(group.name);
              const showToggle = !!shown && group.children.length > 0 && updateSFMPosition;
              const showControls = controlsShowing.indexOf(group.uuid) > -1;
              const positionState = positions[group.name];
              const groupPosition = group.children.length > 0 ? group.children[0].position : {};
              const groupRotation = group.children.length > 0 ? group.children[0].rotation : {};
              const groupScale = group.children.length > 0 ? group.children[0].scale : {};

              const xVal = positionState ? positionState.x : groupPosition.x;
              const yVal = positionState ? positionState.y : groupPosition.y;
              const zVal = positionState ? positionState.z : groupPosition.z;

              const rXVal = positionState ? positionState.rX : groupRotation._x;
              const rYVal = positionState ? positionState.rY : groupRotation._y;
              const rZVal = positionState ? positionState.rZ : groupRotation._z;

              const scaleVal = positionState ? positionState.s : groupScale.x;

              return (
                <React.Fragment key={i}>
                  <div onClick={() => this.props.toggle(group)} style={shown ? (!showToggle ? styles.groupShownBorder : styles.groupShown) : styles.group}>
                    {group.name}
                  </div>
                  { showToggle && shown &&
                    <div onClick={() => this.toggleControls(group.uuid)} style={showControls ? styles.groupShown : styles.groupShownBorder}>
                      { showControls ? ' - ' : ' + ' }
                    </div>
                  }
                  { showControls && !!shown &&
                    <div style={styles.groupShownBorder}>
                      Scale
                      <div><input step={0.01} value={scaleVal} type="number" onChange={(e) => this.changePosition(e, group, 's', updateSFMPosition)} /></div>
                      <br/>
                      Position
                      <div>X <input step={0.5} value={xVal} type="number" onChange={(e) => this.changePosition(e, group, 'x', updateSFMPosition)} /></div>
                      <div>Y <input step={0.5} value={yVal} type="number" onChange={(e) => this.changePosition(e, group, 'y', updateSFMPosition)} /></div>
                      <div>Z <input step={0.5} value={zVal} type="number" onChange={(e) => this.changePosition(e, group, 'z', updateSFMPosition)} /></div>
                      <br/>
                      Rotation
                      <br/>
                      <br/>
                      <br/>
                      X <Slider
                          valueLabelDisplay="on"
                          valueLabelFormat={val => `${val}`}
                          min={-365}
                          max={360}
                          value={rXVal}
                          step={0.01}
                          onChange={(e, value) => this.changePosition(e, group, 'rX', updateSFMPosition, value)}
                        />
                        <br/>
                        <br/>
                        <br/>
                      Y <Slider
                          valueLabelDisplay="on"
                          valueLabelFormat={val => `${val}`}
                          min={-10}
                          max={10}
                          value={rYVal}
                          step={0.01}
                          onChange={(e, value) => this.changePosition(e, group, 'rY', updateSFMPosition, value)}
                        />
                        <br/>
                        <br/>
                        <br/>
                      Z <Slider
                          valueLabelDisplay="on"
                          valueLabelFormat={val => `${val}`}
                          min={-365}
                          max={360}
                          value={rZVal}
                          step={0.01}
                          onChange={(e, value) => this.changePosition(e, group, 'rZ', updateSFMPosition, value)}
                        />
                      {/*
                        <div>X <input step={0.1} value={rXVal} type="number" onChange={(e) => this.changePosition(e, group, 'rX', updateSFMPosition)} /></div>
                        <div>Y <input step={0.1} value={rYVal} type="number" onChange={(e) => this.changePosition(e, group, 'rY', updateSFMPosition)} /></div>
                        <div>Z <input step={0.1} value={rZVal} type="number" onChange={(e) => this.changePosition(e, group, 'rZ', updateSFMPosition)} /></div>
                      */}
                      <br/>
                      <button onClick={() => {
                        resetSFMPosition();
                        const newPositions = { ...positions };
                        newPositions[group.name] = undefined;
                        this.setState({ positions: newPositions });
                      }}>reset</button>
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
  }
};


export default Sidebar;
