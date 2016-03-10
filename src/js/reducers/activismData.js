const localData = require("../../../data/actions.json");


const initialState = {
  ...localData,
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
