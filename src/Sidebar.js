import React from 'react';

class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      showing: [],
      groups: []
    };
  }

  componentDidMount() {
    this.setState({ showing: this.props.groups.map(g => g.name), groups: this.props.groups });
  }

  toggleGroup = (group) => () => {
    let showing = [...this.state.showing];
    const index = this.state.showing.indexOf(group.name);
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

  render() {
    const {} = this.state;
    return (
      <div id="sidebar" style={styles.main}>
        { this.state.groups.map( (g, i) => (
          <div key={i} onClick={ this.toggleGroup(g) } style={styles.group}>
            {g.name}
          </div>
        ))}
      </div>
    );
  }
}

const styles = {
  main: {
    backgroundColor: 'blue',
    color: '#fff'
  },
  group: {
    padding: '10px',
    cursor: 'pointer'
  }
};


export default Sidebar;
