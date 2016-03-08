import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActivismActions from '../../actions/ActivismActions';
import { ActivismMap } from '../../components';

class ActivismPrioritiesApp extends Component {

  render() {

    //collect data we need for views
    const {activismData: {actionsByState, priorityActions, chosenState}, actions} = this.props;
    //view for priority actions
    const priorityActionsComponents = priorityActions && priorityActions.length ?
      priorityActions.map(action =>
        <div className="activism-action">
          <span className="activism-action-summary">{action.Summary}</span>
        </div>
      )
      : null;
    //view for chosen state data
    const chosenStateComponents = chosenState ? <h2>{chosenState.Id}</h2> : <p className="bg-info">Select a state from the map or the dropdown to view details</p>;
    //combine to view for entire app
    return (
      <div className="app-activsm-priorities">
        <h1>Activism for Bernie Sanders</h1>
        {priorityActionsComponents}
        <ActivismMap stateActions={actionsByState} chosenState={chosenState} chooseStateById={actions.selectState} />
        {chosenStateComponents}
      </div>
    );
  }
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
