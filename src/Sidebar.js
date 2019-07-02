import React from 'react';

class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    return (
      <div id="sidebar" style={styles.main}>TEST</div>
    );
  }
}

const styles = {
  main: {
    backgroundColor: 'blue',
    color: '#fff',
    flex: 1,
    flexDirection: 'column',
    alignContent: 'left'
  }
};


export default Sidebar;
