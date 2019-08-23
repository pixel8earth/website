
import React from 'react';
import { Slider, Dialog, Button, ButtonGroup } from '@material-ui/core';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import Refresh from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';

const PIN = 'dialogPin';
const REFINE = 'dialogRefine';
const POST_PROCESS = 'dialogPostProcessing';
const REBUILD = 'dialogRebuild';
const ICP = 'dialogICP';

const UP = 'up';
const DOWN = 'down';

const S = 's';
const X = 'x';
const Y = 'y';
const Z = 'z';
const RX = 'rX';
const RY = 'rY';
const RZ = 'rZ';


class Pixel8PointCloudControls extends React.Component {
  constructor() {
    super();
    this.mounted = false;
    this.timeout = undefined;
    this.timeoutVal = 100;

    this.state = {
      positions: null,
      dialogRefine: null,
      dialogPostProcessing: null,
      dialogRebuild: null,
      dialogPin: null,
      dialogICP: null,
      refreshing: false
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  changePosition = (group, axis, updateSFMPosition, value) => {
    let positions = this.state.positions;
    if (!positions) {
      const sfmGroup = group.children && group.children[0];
      // initial state for a given group
      positions = {
        s: sfmGroup.scale.x,
        x: sfmGroup.position.x,
        y: sfmGroup.position.y,
        z: sfmGroup.position.z,
        rX: sfmGroup.rotation.x,
        rY: 0, // start at 0 degrees
        rZ: sfmGroup.rotation.z
      };
    }

    const val = parseFloat(value);
    const prevDegrees = positions[axis];
    let updates;
    if (axis === RY || axis === RX || axis === RZ) {
      updates = { [axis]: val - prevDegrees };
    } else updates = { [axis]: val };

    positions[axis] = val;
    this.setState({ positions });
    updateSFMPosition(updates);
  }

  beginScaleChange = (group, direction, updateSFMPosition) => {
    let func;
    if (direction === UP) {
      func = (s) => this.changePosition(group, S, updateSFMPosition, s + 0.01);
    } else if (direction === DOWN) {
      func = (s) => this.changePosition(group, S, updateSFMPosition, s - 0.01);
    }
    this.repeatChange(func, group, S);
  }

  beginPositionChange = (group, axis, direction, updateSFMPosition) => {
    let func;
    if (direction === UP) {
      func = (value) => this.changePosition(group, axis, updateSFMPosition, value + 0.1);
    } else if (direction === DOWN) {
      func = (value) => this.changePosition(group, axis, updateSFMPosition, value - 0.1);
    }
    this.repeatChange(func, group, axis);
  }

  repeatChange = (func, group, axis) => {
    let currentValue;
    if (axis === S) {
      currentValue = this.state.positions
        ? this.state.positions.s
        : (group.children && group.children.length > 0 ? group.children[0].scale : {}).x;
    }
    if (axis === X || axis === Y || axis === Z) {
      currentValue = this.state.positions
        ? this.state.positions[axis]
        : (group.children && group.children.length > 0 ? group.children[0].position : {})[axis];
    }
    if (axis === RY || axis === RX || axis === RZ) {
      currentValue = this.state.positions
        ? this.state.positions.rY
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

  openDialog = (group, key) => this.setState({ [key]: group.uuid })

  cancelDialog = (key) => this.setState({ [key]: null })

  confirmRefine = (refine) => {
    refine();
    this.setState({ dialogRefine: null });
  }

  confirmPin = (pin) => {
    pin();
    this.setState({ dialogPin: null });
  }

  confirmRebuild = (stream) => {
    // TODO move action to redux
    fetch(`https://api2.pixel8.earth/clouds/${stream}/build`, { method: 'POST' })
      .then( r => r.json())
      .then( r => console.log('response for build of ', stream, ' is ', r, '\npost processing kicked off if no error in build') )
      .catch( err => console.log('BUILD ERROR: ', err));
    this.setState({ dialogRebuild: null });
  }

  confirmPostProcessing = (stream) => {
    // TODO move action to redux
    fetch(`https://api2.pixel8.earth/clouds/${stream}/postProcess`, { method: 'POST' })
      .then( r => r.json())
      .then( r => console.log('response for post processing of ', stream, ' is ', r) )
      .catch( err => console.log('POST PROCESSING ERROR: ', err));
    this.setState({ dialogPostProcessing: null });
  }

  confirmICP = (icp) => {
    icp();
    this.setState({ dialogICP: null });
  }

  reset = (group, resetSFMPosition) => {
    resetSFMPosition();
    this.setState({ positions: null });
  }

  refresh = (group) => {
    this.setState({ refreshing: true, positions: null },
      () => this.props.groupInfo.refresh(group, () => this.setState({ refreshing: false }))
    );
  }

  render() {
    const { group, updateSFMPosition, resetSFMPosition, refine, stream, pin, icp } = this.props.groupInfo;
    const { positions, dialogRefine, dialogRebuild, dialogPin, dialogPostProcessing, dialogICP, refreshing } = this.state;

    return (
      <React.Fragment>
        <div style={styles.groupShownBorder}>
          <div style={styles.scaleCenter}>
            Scale
              <ArrowLeft
                style={styles.arrowIcons}
                onMouseDown={() => this.beginScaleChange(group, DOWN, updateSFMPosition)}
                onMouseUp={this.endChange}
              />
              <ArrowRight
                style={styles.arrowIcons}
                onMouseDown={() => this.beginScaleChange(group, UP, updateSFMPosition)}
                onMouseUp={this.endChange}
              />
              { !refreshing ?
                <Refresh
                  onClick={() => this.refresh(group)}
                  style={{ ...styles.arrowIcons, marginLeft: '60px' }}
                />
                :
                <CircularProgress size={16} style={styles.spinner} variant="indeterminate" disableShrink={true} />
              }
          </div>
          <br/>
          Position
          <br/>
          <div style={styles.positionRow}>
            &nbsp;&nbsp;&nbsp;X
            <ArrowLeft
              style={styles.arrowIcons}
              onMouseDown={() => this.beginPositionChange(group, X, DOWN, updateSFMPosition)}
              onMouseUp={this.endChange}
            />
            <ArrowRight
              style={styles.arrowIcons}
              onMouseDown={() => this.beginPositionChange(group, X, UP, updateSFMPosition)}
              onMouseUp={this.endChange}
            />
          </div>
          <div style={styles.positionRow}>
            &nbsp;&nbsp;&nbsp;Y
            <ArrowLeft
              style={styles.arrowIcons}
              onMouseDown={() => this.beginPositionChange(group, Y, DOWN, updateSFMPosition)}
              onMouseUp={this.endChange}
            />
            <ArrowRight
              style={styles.arrowIcons}
              onMouseDown={() => this.beginPositionChange(group, Y, UP, updateSFMPosition)}
              onMouseUp={this.endChange}
            />
          </div>
          <div style={styles.positionRow}>
            &nbsp;&nbsp;&nbsp;Z
            <ArrowLeft
              style={styles.arrowIcons}
              onMouseDown={() => this.beginPositionChange(group, Z, DOWN, updateSFMPosition)}
              onMouseUp={this.endChange}
            />
            <ArrowRight
              style={styles.arrowIcons}
              onMouseDown={() => this.beginPositionChange(group, Z, UP, updateSFMPosition)}
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
            value={(positions || {}).rY || 0}
            step={0.1}
            onChange={(e, value) => this.changePosition(group, RY, updateSFMPosition, value)}
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
              value={(positions || {}).rX || 0}
              step={0.1}
              onChange={(e, value) => this.changePosition(group, RX, updateSFMPosition, value)}
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
              value={(positions || {}).rZ || 0}
              step={0.1}
              onChange={(e, value) => this.changePosition(group, RZ, updateSFMPosition, value)}
              style={styles.tiltSlider}
            />
          </div>
          <div style={styles.centeredRow}>
            <ButtonGroup size="small" style={styles.buttonGroup}>
              <Button
                style={styles.buttonGroupBtn}
                onClick={() => this.reset(group, resetSFMPosition)}
              >Reset</Button>
              <Button
                style={styles.buttonGroupBtn}
                onClick={() => this.openDialog(group, REFINE)}
              >Refine</Button>
              <Button
                onClick={() => this.openDialog(group, PIN)}
                style={styles.buttonGroupBtn}
              >Pin</Button>
            </ButtonGroup>
          </div>
          <div style={styles.centeredRow}>
            <ButtonGroup size="small" style={styles.buttonGroup}>
              <Button
                style={styles.buttonGroupBtn}
                onClick={() => this.openDialog(group, REBUILD)}
              >Rebuild</Button>
              <Button
                onClick={() => this.openDialog(group, POST_PROCESS)}
                style={styles.buttonGroupBtn}
              >Process</Button>
              <Button
                onClick={() => this.openDialog(group, ICP)}
                style={styles.buttonGroupBtn}
              >ICP</Button>
            </ButtonGroup>
          </div>
        </div>
        <Dialog onClose={() => this.cancelDialog(REFINE)} open={dialogRefine === group.uuid}>
          <div style={styles.padTwenty}>
            {`Are you sure you'd like to refine collect ${group.name} with your adjustments to position, rotation, and scale?`}
            <div style={styles.flexEndContainer}>
              <button style={styles.cancelBtn} onClick={() => this.cancelDialog(REFINE)}>Cancel</button>
              <button style={styles.btn} onClick={() => this.confirmRefine(refine)}>Continue</button>
            </div>
          </div>
        </Dialog>
        <Dialog onClose={() => this.cancelDialog(POST_PROCESS)} open={dialogPostProcessing === group.uuid}>
          <div style={styles.padTwenty}>
            {`Are you sure you'd like to run post processing for collect ${group.name}?`}
            <div style={styles.flexEndContainer}>
              <button style={styles.cancelBtn} onClick={() => this.cancelDialog(POST_PROCESS)}>Cancel</button>
              <button style={styles.btn} onClick={() => this.confirmPostProcessing(stream)}>Continue</button>
            </div>
          </div>
        </Dialog>
        <Dialog onClose={() => this.cancelDialog(REBUILD)} open={dialogRebuild === group.uuid}>
          <div style={styles.padTwenty}>
            {`Are you sure you'd like to run build and post processing for collect ${group.name}?`}
            <div style={styles.flexEndContainer}>
              <button style={styles.cancelBtn} onClick={() => this.cancelDialog(REBUILD)}>Cancel</button>
              <button style={styles.btn} onClick={() => this.confirmRebuild(stream)}>Continue</button>
            </div>
          </div>
        </Dialog>
        <Dialog onClose={() => this.cancelDialog(PIN)} open={dialogPin === group.uuid}>
          <div style={styles.padTwenty}>
            {`Are you sure you'd like to pin the positioning for collect ${group.name}?`}
            <div style={styles.flexEndContainer}>
              <button style={styles.cancelBtn} onClick={() => this.cancelDialog(PIN)}>Cancel</button>
              <button style={styles.btn} onClick={() => this.confirmPin(pin)}>Continue</button>
            </div>
          </div>
        </Dialog>
        <Dialog onClose={() => this.cancelDialog(ICP)} open={dialogICP === group.uuid}>
          <div style={styles.padTwenty}>
            {`Are you sure you'd like run ICP for collect ${group.name}?`}
            <div style={styles.flexEndContainer}>
              <button style={styles.cancelBtn} onClick={() => this.cancelDialog(ICP)}>Cancel</button>
              <button style={styles.btn} onClick={() => this.confirmICP(icp)}>Continue</button>
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}

// TODO: cleanup unused styles
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
  buttonGroup: {
    marginTop: '6px',
    color:'#fff',
    backgroundColor: '#63ADF2'
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  positionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  padTwenty: {
    padding: '20px'
  },
  scaleCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  spinner: {
    color: "#fff",
    marginLeft: '60px'
  }
};

export default Pixel8PointCloudControls;
