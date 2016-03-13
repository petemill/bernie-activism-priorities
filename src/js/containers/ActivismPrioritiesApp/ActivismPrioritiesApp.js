import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActivismActions from '../../actions/ActivismActions';
import { ActivismMap, ActivismActionList, StatesDropdown } from '../../components';

class ActivismPrioritiesApp extends Component {

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
      chosenStateComponents =
        <div class="chosen-state">
          {activismComponents}
        </div>;
    }
    else {
      chosenStateComponents = <p className="bg-info">Select a state from the map or the dropdown to view details</p>;
    }

    //combine to view for entire app
    return (
      <div className="app-activsm-priorities">
        <h1>Activism for Bernie Sanders</h1>
        {priorityActionsComponents}
        <StatesDropdown statesData={stateData} chosenState={chosenState} chooseStateById={actions.selectState} />
	      {chosenStateComponents}
        <ActivismMap stateData={stateData} chosenState={chosenState} chooseStateById={actions.selectState} />      
      </div>
    );
  }
}


function GetActionComponents(action) {


}


function mapStateToProps(state) {

  console.log('map app state', state);
  return {
    activismData: state.activismData
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
