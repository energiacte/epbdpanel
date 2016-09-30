import React from 'react';

import { readenergystring } from '../energycalculations.js';

export default class ActionsPanel extends React.Component {

  handleFiles(e, onLoadHandler) {
    let file;
    if (e.dataTransfer) {
      file = e.dataTransfer.files[0];
    } else if (e.target) {
      file = e.target.files[0];
    }

    let getData = str => {
      let { components, meta } = readenergystring(str);
      components = components.map(dd => { return {...dd, active: true }; });
      return { components, meta };
    };

    const reader = new FileReader();
    reader.onload = e => onLoadHandler(getData(e.target.result));
    reader.readAsText(file);
  }

  downloadFile(e, getEnergyString) {
    const energystring = getEnergyString();
    const data = new Blob([energystring],
                          { type: 'text/plain;charset=utf8;' });
    // create hidden link
    const element = document.createElement('a');
    document.body.appendChild(element);
    element.setAttribute('href', window.URL.createObjectURL(data));
    element.setAttribute('download', 'csvEPBDpanel.csv');
    element.style.display = '';
    element.click();
    document.body.removeChild(element);
  }

  render() {
    return (
      <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
        <button className="btn" id="add" onClick={this.props.onAdd}>
          <span className="glyphicon glyphicon-plus"></span> Añadir
        </button>
        <button className="btn" id="remove" onClick={this.props.onRemove}>
          <span className="glyphicon glyphicon-minus"></span> Borrar
        </button>
        <button className="btn" id="modify" onClick={this.props.onRestore}>
          <span className="glyphicon glyphicon-repeat"></span> Restaurar
        </button>
        <input ref="fileInput" type="file"
               onChange={ e => this.handleFiles(e, this.props.onLoad) }
               style={{visibility:'hidden', position:'absolute', top:'-50px', left:'-50px'}} />
        <button className="btn bg-primary" id="modify"
                onClick={ e => this.refs.fileInput.click() }>
          <span className="glyphicon glyphicon-upload"></span> Cargar datos
        </button>
        <button className="btn bg-primary" id="save"
                onClick={ e => this.downloadFile(e, this.props.getEnergyString) }>
          <span className="glyphicon glyphicon-download"></span> Guardar datos
        </button>
      </div>
    );
  }
};
