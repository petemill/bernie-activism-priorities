//import './ActivismActionList.scss';

import React, { Component, PropTypes } from 'react';

import ActivismAction from '../ActivismAction/ActivismAction';



export default class ActivismActionList extends Component {


  static propTypes = {
    actionItems: PropTypes.array.isRequired
  };


  renderList() {

    return this.props.actionItems.map((activismAction) =>
      (
        <ActivismAction key={activismAction.Summary}
          summary={activismAction.Summary}
          links={activismAction.Links}
           />
      )
    );
  }


  render () {

    return (
      <ul className="activism-actions">
        {this.renderList()}
      </ul>
    );
  }


}
