import uuid from 'node-uuid';
import React from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Navigation from 'components/Navigation.jsx';
import Components from 'components/Components';

class Base extends React.Component {
  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <PageHeader>{this.props.headertitle}</PageHeader>
          <p className="lead">Energía suministrada y producida:</p>
          <Components />
        </div>
      </div>
    );
  }
}

export default Base;
