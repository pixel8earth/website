import React from 'react';
import icon from '../images/icon.png';

class Sidebar extends React.Component {
  constructor() {
    super();
    this.mounted = false;

    this.state = {
      groups: [],
      expanded: false,
      positions: {}
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

  changePosition = (event, group, vertex) => {
    event.preventDefault();
    const allPositions = this.state.positions;
    if (allPositions[group.name]) {
      allPositions[group.name][vertex] = parseFloat(event.target.value);
    } else {
      allPositions[group.name] = {};
      allPositions[group.name][vertex] = parseFloat(event.target.value);
    }

    if (vertex !== 'x' && !allPositions[group.name].x) {
      allPositions[group.name].x = group.children[0].position.x;
    }
    if (vertex !== 'y' && !allPositions[group.name].y) {
      allPositions[group.name].y = group.children[0].position.y;
    }
    if (vertex !== 'z' && !allPositions[group.name].z) {
      allPositions[group.name].z = group.children[0].position.z;
    }

    this.setState({ positions: allPositions });
  }

  render() {
    const { groups, expanded, positions } = this.state;
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
              const positionState = positions[group.name];
              const groupPosition = group.children.length > 0 ? group.children[0].position : {};
              const xVal = positionState ? positionState.x : groupPosition.x;
              const yVal = positionState ? positionState.y : groupPosition.y;
              const zVal = positionState ? positionState.z : groupPosition.z;

              return (
                <React.Fragment key={i}>
                  <div onClick={() => this.props.toggle(group)} style={shown ? styles.groupShown : styles.group}>
                    {group.name}
                  </div>
                  { !!shown && group.children.length > 0 &&
                    <div style={{ position: 'absolute', left: 200 }}>
                      Position
                      <div>X <input value={xVal} type="number" onChange={(e) => this.changePosition(e, group, 'x')} /></div>
                      <div>Y <input value={yVal} type="number" onChange={(e) => this.changePosition(e, group, 'y')} /></div>
                      <div>Z <input value={zVal} type="number" onChange={(e) => this.changePosition(e, group, 'z')} /></div>
                      <button onClick={() => updateSFMPosition({ x: xVal, y: yVal, z: zVal })}>apply</button>
                      <button onClick={() => {
                        resetSFMPosition();
                        const newPositions = { ...positions };
                        newPositions[group.name] = undefined;
                        this.setState({ positions });
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
  groupShown: {
    padding: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#263f59',
    borderBottom: '2px solid #2f4d6a'
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
