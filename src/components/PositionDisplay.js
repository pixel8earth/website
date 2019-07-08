import React from 'react';

function PositionDisplay(props) {
  const { center } = props;
  let coords = '';
  if (center) {
    const latDir = center[1] > 0 ? 'N' : 'S';
    const longDir = center[0] > 0 ? 'E' : 'W';
    coords = `${Math.abs(props.center[1])}˚ ${latDir}, ${Math.abs(props.center[0])}˚ ${longDir}`;
  }
  return (
    <div style={styles.main}>{coords}</div>
  );
}

const styles = {
  main: {
    backgroundColor: '#000',
    padding: '5px',
    position: 'absolute',
    bottom: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff'
  }
};

export default PositionDisplay;
