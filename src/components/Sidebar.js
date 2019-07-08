import React from 'react';
import icon from '../images/icon.png';

class Sidebar extends React.Component {
  constructor() {
    super();
    this.mounted = false;

    this.state = {
      showing: null,
      groups: [],
      expanded: false
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.setState({ groups: this.props.groups });
  }

  componentDidUpdate() {
    if (this.mounted && !this.state.showing) {
      this.setState({
        showing: this.props.groups.map(g => g.name)
      });
    }
  }

  toggleGroup = (group) => () => {
    let showing = [...this.state.showing];
    const index = showing.indexOf(group.name);
    if (index < 0) {
      showing.push(group.name);
      this.props.add(group);
    } else {
      showing.splice(index, 1);
      this.props.remove(group);
    }
    this.props.render();
    this.setState({ showing });
  };

  toggleExpansion = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { groups, showing, expanded } = this.state;
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
          { groups.map( (g, i) => {
            const shown = ~(showing || []).indexOf(g.name);
            return (
              <React.Fragment key={i}>
                {i === 0 && <hr style={styles.hr} />}
                <div onClick={this.toggleGroup(g)} style={shown ? styles.groupShown : styles.group}>
                  {g.name}
                </div>
                <hr style={styles.hr} />
              </React.Fragment>
            );
          })}
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
    backgroundColor: '#304D6D',
    color: '#fff'
  },
  group: {
    padding: '10px',
    cursor: 'pointer'
  },
  groupShown: {
    padding: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#263f59',
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
    margin: 0
  }
};


export default Sidebar;
