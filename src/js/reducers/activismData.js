const actionsData = require("../../../data/actions.json");
const statesHash = require("../../../data/states_hash.json");
const primaryData = require("../../../data/generated/538-results.json");
console.log(primaryData.length);


const initialState = {
  priorityActions: actionsData.priorityActions,
  stateData: BuildStateData(statesHash, actionsData.actionsByState, primaryData),
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


function BuildStateData(stateHash, actionsByState, primaryData) {

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
    console.log(stateCode, primary.date)
    thisStateData.PrimaryDate = primary.date;
    //delegate math
    if (primary.num_del_tot) {
      thisStateData.delegateTotal = primary.num_del_tot;
      if (primary.del_won_bern) {
        thisStateData.delegatesWon = primary.del_won_bern;
      }
    }
  }
  //merge with actions
  for (const stateCode of Object.keys(actionsByState)) {
    //verify valid state code
    if (!stateNameLookup.has(stateCode)) {
      console.error('unknown state found in actions', stateCode);
      continue;
    }
    stateData[stateCode].ActionData = actionsByState[stateCode];
  }
  //done
  return stateData;
}
