import AddDays from './addDays';
const actionsData = require("../../../data/actions.json");
const statesHash = require("../../../data/states_hash.json");
const primaryData = require("../../../data/generated/538-results.json");
const dateLimitPrimaryPast = new Date();
const dateLimitPrimarySoon = AddDays(new Date(), 7);


const initialState = {
  priorityActions: actionsData.priorityActions,
  stateData: BuildStateData(statesHash, actionsData.actionsByState, primaryData, actionsData.defaultPrimarySoonActions, actionsData.defaultPrimaryUpcomingActions),
  dataLoaded: false,
  chosenState: null
};

export default function (state = initialState, action) {

  switch (action.type) {
    case 'SELECT_STATE_BYID':
      return {
        ...state,
        chosenState: action.stateId
      };
    default:
      return state;
  }
}


function BuildStateData(stateHash, actionsByState, primaryData, defaultPrimarySoonActions, defaultPrimaryUpcomingActions) {

  //build state name <-> shortcode lookups
  const stateShortCodeLookup = new Map();
  const stateNameLookup = new Map();
  const stateData = {};
  for (var shortCode in stateHash) {
    stateNameLookup.set(shortCode, stateHash[shortCode]);
    stateShortCodeLookup.set(stateHash[shortCode], shortCode);
    //init state data
    stateData[shortCode] = { Name: stateHash[shortCode] };
  }
  //add primary date, delegate count and results
  const primaryDataCollectedStates = new Set();
  for (const primary of primaryData) {
    //which state
    const stateCode = stateShortCodeLookup.get(primary.state);
    //validate state
    if (!stateCode) {
      console.warn('Unknown state primary data detected', primary);
      continue;
    }
    //ensure we only see a state primary once
    if (primaryDataCollectedStates.has(stateCode)) {
      console.error('State primary data received multiple times', stateCode, primary);
      continue;
    }
    //remember we've seen this state's primary data
    primaryDataCollectedStates.add(stateCode);
    //take data we want
    const thisStateData = stateData[stateCode];
    //primary date
    try {
      thisStateData.PrimaryDate = new Date(primary.date + ', 2016 23:59:59');
    }
    catch (e) {
      console.error('error parsing primary date', primary.date);
      console.error(e);
    }
    //calculate if date is past, soon or upcoming
    if (thisStateData.PrimaryDate) {
        thisStateData.PrimaryDateDistance =
          thisStateData.PrimaryDate < dateLimitPrimaryPast ?
            0 //past
          :
            thisStateData.PrimaryDate < dateLimitPrimarySoon ?
              1 //soon
            :
              2; //future
    }
    //delegate math
    if (primary.num_del_tot) {
      thisStateData.delegateTotal = primary.num_del_tot;
      if (primary.del_won_bern) {
        thisStateData.delegatesWon = primary.del_won_bern;
      }
    }
  }
  //merge with actions
  //iterate through state data
  for (const stateCode of Object.keys(stateData)) {
    //see if we have action data for state
    if (actionsByState[stateCode]) {
      stateData[stateCode].ActionData = actionsByState[stateCode];
    }
    //get some default actions if no existing actions
    else {
      let defaultActions;
      switch (stateData[stateCode].PrimaryDateDistance) {
        case 2: //upcoming
          defaultActions = defaultPrimaryUpcomingActions;
          break;
        case 1: //soon
          defaultActions = defaultPrimarySoonActions;
          break;
        case 0: //past
        default: //no primary date data
          break; //no default data
      }
      //check we have default actions
      if (defaultActions) {
        //give the state default actions
        stateData[stateCode].ActionData = {Actions: defaultActions};
      }
    }
  }
  //done
  return stateData;
}
