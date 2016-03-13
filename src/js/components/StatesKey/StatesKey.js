import './StatesKey.scss';

import React, { Component, PropTypes } from 'react';
const classNames = require('classnames');

export default class StatesKey extends Component {

  static propTypes = {

  };


  render () {

    //bootstrap dropdown html
    return (
      <div className="key-states">
        <div className="key-states-soon">Primary within 7 days!</div>
        <div className="key-states-upcoming">Primary upcoming</div>
        <div className="key-states-past">Primary has ended</div>
      </div>
    );
  }

}
