import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import numeral from 'numeral';

export default class GlobalVarsControl extends React.Component {

  render() {
    const { kexp, krdel, area, onChangeKexp, onChangeKrdel, onChangeArea } = this.props;

    return (
      <div id="globalvarscontrol" className="form-horizontal bg-primary col-md-12">
        <div id="kexp" className="form-group col-md-3">
          <label className="control-label" htmlFor="kexprange">k<sub>exp</sub> </label>
          <input type="range" min="0" max="1" step="0.1"
                 name="kexprange"
                 className="form-control"
                 defaultValue={ kexp }
                 onChange={ e => onChangeKexp(e.target.value) } />
          <input type="text" readOnly maxLength="3" size="3"
                 value={ numeral(kexp).format('0.0') } />
        </div>
        <div id="krdel" className="form-group col-md-3">
          <label className="control-label" htmlFor="krdelrange">k<sub>rdel</sub> </label>
          <input type="range" min="0" max="1" step="0.1"
                 name="krdelrange"
                 className="form-control"
                 defaultValue={ krdel }
                 onChange={ e => onChangeKrdel(e.target.value) } />
          <input type="text" readOnly maxLength="3" size="3"
                 value={ numeral(krdel).format('0.0') } />
        </div>
        <div className="form-group col-md-3" />
        <div id="area" className="form-group col-md-3">
          <label className="control-label" htmlFor="areaentry">Area<sub>ref</sub> (m²) </label>
          <input type="number" lang="es" min="1" step="1"
                 name="areaentry"
                 className="form-control"
                 value={ numeral(area).format('0') }
                 onChange={ e => onChangeArea(e.target.value) } />
        </div>
      </div>
    );
  }

}

