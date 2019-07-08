import React from 'react';

class ZoomControl extends React.Component {
  constructor() {
    super();
    this.state = {
      zoomInDisabled: false,
      zoomOutDisabled: false
    };
  }

  zoomIn = () => this.props.changeZoom('in')

  zoomOut = () => this.props.changeZoom('out')

  render() {
    const { zoomInDisabled, zoomOutDisabled } = this.state;

    return (
      <div style={styles.main}>
        <div style={styles.controls} onClick={this.zoomIn}>+</div>
        <hr style={{ margin: 0 }}/>
        <div style={styles.controls} onClick={this.zoomOut}>-</div>
      </div>
    );
  }
}

// TODO: disable zoom controls at certain values???

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
