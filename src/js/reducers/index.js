import { combineReducers } from 'redux';
import activismData from './activismData';

const rootReducer = combineReducers({
  activismData,
  generalOptions: function (state = { MapViewportMode: 'large' }, action) {
    if (action.type === 'CHANGE_MAP_VIEWPORT_MODE' && state.MapViewportMode !== action.mode) {

      const newState = { MapViewportMode: action.mode}
      console.log('general options changed state to', newState);
      return newState;
    }

    return state;
  }
});

export default rootReducer;
