import React from 'react';

class ZoomControl extends React.Component {
  constructor() {
    super();
    this.state = {
      zoomInDisabled: false,
      zoomOutDisabled: false
    };
  }

  zoomIn = () => {
    const { camera, controls } = this.props;
    if (!this.state.zoomInDisabled) {
      camera.zoom = camera.position.z = camera.position.z - 0.1;
      controls.update();
      if (camera && camera.position.z < 0.1) {
        this.setState({ zoomInDisabled: true });
      }
    }
    if (this.state.zoomOutDisabled) {
      this.setState({ zoomOutDisabled: false });
    }
  }

  zoomOut = () => {
    const { camera, controls } = this.props;
    if (!this.state.zoomOutDisabled) {
      camera.zoom = camera.position.z = camera.position.z + 0.1;
      controls.update();
      if (camera && camera.position.z >= 2) {
        this.setState({ zoomOutDisabled: true });
      }
    }
    if (this.state.zoomInDisabled) {
      this.setState({ zoomInDisabled: false });
    }
  }

  render() {
    const { camera, controls } = this.props;
    const { zoomInDisabled, zoomOutDisabled } = this.state;

    return (
      <div style={styles.main}>
        <div style={zoomInDisabled ? styles.controlsDisabled : styles.controls} onClick={this.zoomIn}>+</div>
        <hr style={{ margin: 0 }}/>
        <div style={zoomOutDisabled ? styles.controlsDisabled : styles.controls} onClick={this.zoomOut}>-</div>
      </div>
    );
  }
}

const styles= {
  main: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 5,
    right: 0,
    color: 'red'
  },
  controls: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    cursor: 'pointer',
    padding: '5px',
    backgroundColor: '#000',
  },
  controlsDisabled: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    cursor: 'not-allowed',
    padding: '5px',
    backgroundColor: 'gray'
  }
};

export default ZoomControl;
