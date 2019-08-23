import React from 'react';

class ZoomControl extends React.Component {
  constructor() {
    super();
    this.timeout = undefined;
    this.timeoutVal = 100;

    // this.state = {
    //   zoomInDisabled: false,
    //   zoomOutDisabled: false
    // };
  }

  beginZoom = (direction) => {
    this.repeatZoom(direction);
  }

  repeatZoom = (direction) => {
    this.props.changeZoom(direction);
    this.timeout = setTimeout(() => this.repeatZoom(direction), this.timeoutVal);
    this.timeoutVal = this.timeoutVal - 5;
  }

  endZoom = () => {
    clearTimeout(this.timeout);
    this.timeoutVal = 100;
  }

  render() {
    // const { zoomInDisabled, zoomOutDisabled } = this.state;

    return (
      <div style={styles.main}>
        <div style={styles.controls} onMouseDown={() => this.beginZoom('in')} onMouseUp={this.endZoom}>+</div>
        <hr style={{ margin: 0 }}/>
        <div style={styles.controls} onMouseDown={() => this.beginZoom('out')} onMouseUp={this.endZoom}>-</div>
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
    right: 5,
    border: '1px solid #fff'
  },
  controls: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    cursor: 'pointer',
    padding: '5px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
