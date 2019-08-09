
import React from 'react';

class LidarPointControls extends React.Component {
  constructor() {
    super();
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true;
  }

  render() {
    const { group, updateLidarPoints } = this.props.groupInfo;

    return (
      <React.Fragment>
        <div>TODO</div>
      </React.Fragment>
    );
  }
}

const styles = {};

export default LidarPointControls;
