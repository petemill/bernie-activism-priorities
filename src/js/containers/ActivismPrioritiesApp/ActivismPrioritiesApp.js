import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActivismActions from '../../actions/ActivismActions';
import { ActivismMap, ActivismActionList, StatesDropdown, StatesKey } from '../../components';
import $ from 'jquery';
const dateNames = require('date-names');

class ActivismPrioritiesApp extends Component {

  componentDidMount() {

    this.handleWindowWidth();
    $(window).on('resize', () => {

      //TODO: debounce
      this.handleWindowWidth();
    })
  }

  handleWindowWidth() {

    if ($(window).width() > 600) {
      this.props.actions.changeViewportMode('large');
    }
    else {
      this.props.actions.changeViewportMode('small');
    }
  }

  render() {

    //collect data we need for views
    const {activismData: {stateData, priorityActions, chosenState, dataLoaded}, actions} = this.props;
    //view for priority actions
    const priorityActionsComponents = priorityActions && priorityActions.length ?
      <ActivismActionList actionItems={priorityActions} />
      : null;
    //view for chosen state data
    let chosenStateComponents;
    if (chosenState) {
      const chosenStateData = stateData[chosenState];
      const activismComponents =
        chosenStateData.ActionData && chosenStateData.ActionData.Actions && chosenStateData.ActionData.Actions.length ?
          <ActivismActionList actionItems={chosenStateData.ActionData.Actions} />
        : null;
      //primary stuff
      //delegate info html
      let delegatesWonComponents = null;
      if (chosenStateData.delegateTotal && !chosenStateData.delegatesWon) {
        delegatesWonComponents = <div className="delegate-info">Total Delegates up for Grabs: <span className="delegate-count-total">{chosenStateData.delegateTotal}</span></div>
      }
      else if (chosenStateData.delegateTotal) {
        const delegatePercentageWon = Math.ceil(chosenStateData.delegatesWon / chosenStateData.delegateTotal * 100);
        delegatesWonComponents = <div className="delegate-info">Delegates won: <span className="delegate-count-bernie">{chosenStateData.delegatesWon || 0}</span> / <span className="delegate-count-total">{chosenStateData.delegateTotal}</span> (<span className="delegate-percentagewon">{delegatePercentageWon}%</span>)</div>
      }
      //primary date html
      let primaryDateComponents = null;
      if (chosenStateData.PrimaryDate) {
        const monthName = dateNames.months[chosenStateData.PrimaryDate.getMonth()];
        const day = chosenStateData.PrimaryDate.getDate();
        primaryDateComponents = <div className="primary-date">{monthName} {day}</div>;
      }
      //compile everything
      chosenStateComponents =
        <div className="chosen-state">
          {primaryDateComponents}
          {delegatesWonComponents}
          {activismComponents}
        </div>;
    }
    else {
      chosenStateComponents = null;
    }

    //combine to view for entire app
    return (
      <div className="app-activsm-priorities">
        <h1>Activism for Bernie Sanders</h1>
        {priorityActionsComponents}
        <StatesKey />
        <StatesDropdown statesData={stateData} chosenState={chosenState} chooseStateById={actions.selectState} />
	      {chosenStateComponents}
        <ActivismMap stateData={stateData} chosenState={chosenState} chooseStateById={actions.selectState} viewportMode={this.props.generalOptions.MapViewportMode} />
      </div>
    );
  }
}


function GetActionComponents(action) {


}


function mapStateToProps(state) {

  console.log('map app state', state);
  return {
    activismData: state.activismData,
    generalOptions: state.generalOptions
  };
}

function mapDispatchToProps(dispatch) {

  return {
    actions: bindActionCreators(ActivismActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivismPrioritiesApp);
