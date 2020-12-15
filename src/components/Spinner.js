import React from "react";
import EarthSVG from '../assets/earth.svg';

const Spinner = (props) => {
  return (
    props.earth ?
    <img src={EarthSVG} className="p8Spinner" alt="loading" />
    :
    <div className={"spinner-border " + (props.className || '')} style={props.style} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
