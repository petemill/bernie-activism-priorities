
const initialState = {
  actionsByState: {
    AK: {
      Summary: 'hi'
    }
  },
  priorityActions: [
    {
      Summary: 'do this'
    }
  ],
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
