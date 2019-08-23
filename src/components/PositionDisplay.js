import React from 'react';

function PositionDisplay(props) {
  const { center } = props;
  let coords = '';
  if (center) {
    const latDir = center[1] > 0 ? 'N' : 'S';
    const longDir = center[0] > 0 ? 'E' : 'W';
    coords = `${Math.abs(props.center[1]).toFixed(5)} ${latDir}, ${Math.abs(props.center[0]).toFixed(5)} ${longDir}`;
  }
  return (
    <div style={styles.main}>{coords}</div>
  );
}

const styles = {
  main: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '5px',
    position: 'absolute',
    bottom: 5,
    right: 5,
    textAlign: 'center',
    color: '#fff'
  }
};

export default PositionDisplay;
