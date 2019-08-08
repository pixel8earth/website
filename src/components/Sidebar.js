
import React from 'react';
import { connect } from 'react-redux';
import icon from '../images/icon.png';
import { Slider, Dialog, Button, ButtonGroup } from '@material-ui/core';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

const mapStateToProps = state => ({
  user: state.creds.user
});
const mappedActions = {};

class Sidebar extends React.Component {
  constructor() {
    super();
    this.mounted = false;
    this.timeout = undefined;
    this.timeoutVal = 100;

    this.state = {
      groups: [],
      expanded: false,
      positions: {},
      controlsShowing: [],
      dialog: null,
      dialogPostProcessing: null
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

  changePosition = (group, axis, updateSFMPosition, value) => {
    debugger;
    let positions = this.state.positions;
    if (!positions[group.name]) {
      const sfmGroup = group.children && group.children[0];
      // initial state for a given group
      const data = {
        s: sfmGroup.scale.x,
        x: sfmGroup.position.x,
        y: sfmGroup.position.y,
        z: sfmGroup.position.z,
        rX: sfmGroup.rotation.x,
        rY: 0, // start at 0 degrees
        rZ: sfmGroup.rotation.z
      };
      positions[group.name] = data;
    }

    const val = parseFloat(value);
    const prevDegrees = positions[group.name][axis];
    let updates;
    if (axis === 'rY' || axis === 'rX' || axis === 'rZ') {
      updates = { [axis]: val - prevDegrees };
    } else updates = { [axis]: val };

    positions[group.name][axis] = val;
    this.setState({ positions: positions });
    updateSFMPosition(updates);
  }

  beginScaleChange = (group, direction, updateSFMPosition) => {
    let func;
    if (direction === 'up') {
      func = (s) => this.changePosition(group, 's', updateSFMPosition, s + 0.01);
    } else if (direction === 'down') {
      func = (s) => this.changePosition(group, 's', updateSFMPosition, s - 0.01);
    }
    this.repeatChange(func, group, 's');
  }

  beginPositionChange = (group, axis, direction, updateSFMPosition) => {
    let func;
    if (direction === 'up') {
      func = (value) => this.changePosition(group, axis, updateSFMPosition, value + 0.5);
    } else if (direction === 'down') {
      func = (value) => this.changePosition(group, axis, updateSFMPosition, value - 0.5);
    }
    this.repeatChange(func, group, axis);
  }

  repeatChange = (func, group, axis) => {
    let currentValue;
    if (axis === 's') {
      currentValue = this.state.positions[group.name]
        ? this.state.positions[group.name].s
        : (group.children && group.children.length > 0 ? group.children[0].scale : {}).x;
    }
    if (axis === 'x' || axis === 'y' || axis === 'z') {
      currentValue = this.state.positions[group.name]
        ? this.state.positions[group.name][axis]
        : (group.children && group.children.length > 0 ? group.children[0].position : {})[axis];
    }
    if (axis === 'rY' || axis === 'rX' || axis === 'rZ') {
      currentValue = this.state.positions[group.name]
        ? this.state.positions[group.name].rY
        : 0;
    }

    func(currentValue);
    this.timeout = setTimeout(() => this.repeatChange(func, group, axis), this.timeoutVal);
    this.timeoutVal = this.timeoutVal / 2;
  }

  endChange = () => {
    clearTimeout(this.timeout)
    this.timeoutVal = 100;
  }

  openRefineDialog = (group) => this.setState({ dialog: group.uuid })

  confirmRefine = (refine) => {
    refine();
    this.setState({ dialog: null });
  }

  cancelRefine = () => this.setState({ dialog: null })

  openPostProcessingDialog = (group) => this.setState({ dialogPostProcessing: group.uuid });

  confirmPostProcessing = (stream) => {
    fetch(`https://api.pixel8.earth/clouds/${stream}/postProcess`, { method: 'POST' })
      .then( r => r.json())
      .then( r => console.log('response for post processing of ', stream, ' is ', r) );
    this.setState({ dialogPostProcessing: null });
  }

  cancelPostProcessing = () => this.setState({ dialogPostProcessing: null })

  reset = (group, resetSFMPosition) => {
    resetSFMPosition();
    const newPositions = { ...this.state.positions };
    newPositions[group.name] = undefined;
    this.setState({ positions: newPositions });
  }

  render() {
    const { groups, expanded, positions, controlsShowing, dialog, dialogPostProcessing } = this.state;
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
          <div>
            { groups.map( ({ group, updateSFMPosition, resetSFMPosition, refine, stream }, i) => {
              const shown = group.visible;
              const showToggle = !!shown && updateSFMPosition;
              const showControls = controlsShowing.indexOf(group.uuid) > -1 && this.props.user;
              const showRefineDialog = dialog === group.uuid;
              const showPostProcessingDialog = dialogPostProcessing === group.uuid;

              return (
                <React.Fragment key={i}>
                  { showToggle ?
                    (<div style={styles.groupWithControlsToggle}>
                      <div onClick={() => this.props.toggle(group)} style={shown ? styles.groupShown : styles.group}>
                        {group.name}
                      </div>
                      { this.props.user &&
                        <div onClick={() => this.toggleControls(group.uuid)} style={styles.expandGroup}>
                          { showControls ? ' - ' : ' + ' }
                        </div>
                      }
                    </div>)
                    :
                    <div onClick={() => this.props.toggle(group)} style={shown ? styles.groupShown : styles.group}>
                      {group.name}
                    </div>
                  }
                  { showControls && !!shown &&
                    <div style={styles.groupShownBorder}>
                      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        Scale
                          <ArrowLeft
                            style={styles.arrowIcons}
                            onMouseDown={() => this.beginScaleChange(group, 'down', updateSFMPosition)}
                            onMouseUp={this.endChange}
                          />
                          <ArrowRight
                            style={styles.arrowIcons}
                            onMouseDown={() => this.beginScaleChange(group, 'up', updateSFMPosition)}
                            onMouseUp={this.endChange}
                          />
                      </div>
                      <br/>
                      Position
                      <br/>
                      <div style={styles.centeredRow}>
                        &nbsp;&nbsp;&nbsp;X
                        <ArrowLeft
                          style={styles.arrowIcons}
                          onMouseDown={() => this.beginPositionChange(group, 'x', 'down', updateSFMPosition)}
                          onMouseUp={this.endChange}
                        />
                        <ArrowRight
                          style={styles.arrowIcons}
                          onMouseDown={() => this.beginPositionChange(group, 'x', 'up', updateSFMPosition)}
                          onMouseUp={this.endChange}
                        />
                      </div>
                      <div style={styles.centeredRow}>
                        &nbsp;&nbsp;&nbsp;Y
                        <ArrowLeft
                          style={styles.arrowIcons}
                          onMouseDown={() => this.beginPositionChange(group, 'y', 'down', updateSFMPosition)}
                          onMouseUp={this.endChange}
                        />
                        <ArrowRight
                          style={styles.arrowIcons}
                          onMouseDown={() => this.beginPositionChange(group, 'y', 'up', updateSFMPosition)}
                          onMouseUp={this.endChange}
                        />
                      </div>
                      <div style={styles.centeredRow}>
                        &nbsp;&nbsp;&nbsp;Z
                        <ArrowLeft
                          style={styles.arrowIcons}
                          onMouseDown={() => this.beginPositionChange(group, 'z', 'down', updateSFMPosition)}
                          onMouseUp={this.endChange}
                        />
                        <ArrowRight
                          style={styles.arrowIcons}
                          onMouseDown={() => this.beginPositionChange(group, 'z', 'up', updateSFMPosition)}
                          onMouseUp={this.endChange}
                        />
                      </div>
                      <br/>
                      Rotation
                      <Slider
                        valueLabelDisplay="auto"
                        valueLabelFormat={val => `${val}°`}
                        min={0}
                        max={360}
                        value={(positions[group.name] || {}).rY || 0}
                        step={0.1}
                        onChange={(e, value) => this.changePosition(group, 'rY', updateSFMPosition, value)}
                        style={styles.rotationSlider}
                      />
                      <br/><br/>
                      Tilt
                      <div style={styles.centeredRow}>
                        X
                        <Slider
                          valueLabelDisplay="auto"
                          valueLabelFormat={val => `${val}°`}
                          min={0}
                          max={360}
                          value={(positions[group.name] || {}).rX || 0}
                          step={0.1}
                          onChange={(e, value) => this.changePosition(group, 'rX', updateSFMPosition, value)}
                          style={styles.tiltSlider}
                        />
                      </div>
                      <br/>
                      <div style={styles.centeredRow}>
                        Z
                        <Slider
                          valueLabelDisplay="auto"
                          valueLabelFormat={val => `${val}°`}
                          min={0}
                          max={360}
                          value={(positions[group.name] || {}).rZ || 0}
                          step={0.1}
                          onChange={(e, value) => this.changePosition(group, 'rZ', updateSFMPosition, value)}
                          style={styles.tiltSlider}
                        />
                      </div>
                      <ButtonGroup size="small" style={{ marginTop: '6px', color:'#fff', backgroundColor: '#63ADF2' }}>
                        <Button
                          style={styles.buttonGroupBtn}
                          onClick={() => this.reset(group, resetSFMPosition)}
                        >Reset</Button>
                        <Button
                          onClick={() => this.openPostProcessingDialog(group)}
                          style={styles.buttonGroupBtn}
                        >Process</Button>
                        <Button
                          style={styles.buttonGroupBtn}
                          onClick={() => this.openRefineDialog(group)}
                        >Refine</Button>
                      </ButtonGroup>
                    </div>
                  }
                  { showRefineDialog &&
                    <Dialog onClose={this.cancelRefine} open={showRefineDialog}>
                      <div style={{ padding: '20px' }}>
                        {`Are you sure you'd like to refine collect ${group.name} with your adjustments to position, rotation, and scale?`}
                        <div style={styles.flexEndContainer}>
                          <button style={styles.cancelBtn} onClick={this.cancelRefine}>Cancel</button>
                          <button style={styles.btn} onClick={() => this.confirmRefine(refine)}>Continue</button>
                        </div>
                      </div>
                    </Dialog>
                  }
                  { showPostProcessingDialog &&
                    <Dialog onClose={this.cancelPostProcessing} open={showPostProcessingDialog}>
                      <div style={{ padding: '20px' }}>
                        {`Are you sure you'd like to run post processing for collect ${group.name}?`}
                        <div style={styles.flexEndContainer}>
                          <button style={styles.cancelBtn} onClick={this.cancelPostProcessing}>Cancel</button>
                          <button style={styles.btn} onClick={() => this.confirmPostProcessing(stream)}>Continue</button>
                        </div>
                      </div>
                    </Dialog>
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
    color: '#63ADF2',
    backgroundColor: '#263f59',
    borderRight: 'none'
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
  btn: {
    padding: 5,
    margin: 5,
    backgroundColor: '#63ADF2',
    color: '#fff',
    fontWeight: 'bold',
    border: '1px transparent',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  cancelBtn: {
    padding: 5,
    margin: 5,
    backgroundColor: '#AF4141',
    color: '#fff',
    fontWeight: 'bold',
    border: '1px transparent',
    borderRadius: '3px',
    cursor: 'pointer',
    marginRight: '6px'
  },
  positionInput: {
    margin: '3px 6px'
  },
  rotationSlider: {
    color: '#63ADF2',
    width: '162px',
    margin: '0 8px'
  },
  tiltSlider: {
    color: '#63ADF2',
    width: '150px',
    margin: '0 8px'
  },
  groupWithControlsToggle: {
    display: 'flex',
    backgroundColor: '#263f59',
  },
  flexEndContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '6px'
  },
  buttonGroupBtn: {
    color: '#fff',
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 1,
    fontWeight: 'bold'
  },
  arrowIcons: {
    color: "#63ADF2",
    cursor: 'pointer'
  },
  centeredRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
};


export default connect(mapStateToProps, mappedActions)(Sidebar);
