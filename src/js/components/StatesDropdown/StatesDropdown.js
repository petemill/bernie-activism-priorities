import './StatesDropdown.scss';

import React, { Component, PropTypes } from 'react';
const classNames = require('classnames');

export default class StatesDropdown extends Component {

  static propTypes = {
    chooseStateById: React.PropTypes.func.isRequired,
    statesData: PropTypes.object.isRequired,
    chosenState: PropTypes.string
  };


  render () {

    //bootstrap dropdown html
    return (
      <div className="statelist">
        <div className="dropdown-statelist dropdown">
          {this.renderDropdownButton()}
          {this.renderDropdownList()}
        </div>
      </div>
    );
  }

  isAnyDataForState(stateData, stateCode) {

    //inspect element for any data
    return (Object.keys(stateData).length > 1);
  }


  renderDropdownItem(stateData, stateCode) {

    //do not render anything if there is no data for state
    if (!this.isAnyDataForState(stateData, stateCode))
      return null;
    //class suffix based on primary date
    let primaryDateDistanceClass;
    if (stateData.PrimaryDateDistance === 1)
      primaryDateDistanceClass = 'soon';
    else if (stateData.PrimaryDateDistance === 0)
      primaryDateDistanceClass = 'past';
    else
      primaryDateDistanceClass = 'upcoming';
    //html elements
    const itemClassNames = classNames('dropdown-item', `primary-${primaryDateDistanceClass}`, {'active': this.props.chosenState === stateCode});
    return (
      <li key={stateCode} className={itemClassNames} onClick={() => {this.props.chooseStateById(stateCode)}}>
        <span className="state-name">{stateData.Name}</span>
      </li>
    );
  }


  renderDropdownList() {

    const stateCodes = Object.keys(this.props.statesData);
    //for each state, render dropdown item
    return  (
      <ul className="dropdown-menu">
        {
          stateCodes.map(stateCode => this.renderDropdownItem(this.props.statesData[stateCode], stateCode))
        }
      </ul>
    );
  }


  renderDropdownButton() {

    //button with text either default or representing selected state
    return (
      <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        {this.renderDropdownButtonText()}
        <span className="caret"></span>
      </button>
    );
  }


  renderDropdownButtonText() {

    //default
    if (!this.props.chosenState) {
      return 'Choose a State';
    }
    else {
      return this.props.statesData[this.props.chosenState].Name;
    }
  }


}
