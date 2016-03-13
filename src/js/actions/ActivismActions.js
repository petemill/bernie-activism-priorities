export function selectState(stateId) {
  return {
    type: 'SELECT_STATE_BYID',
    stateId
  };
}

export function changeViewportMode(mode) {
  return {
    type: 'CHANGE_MAP_VIEWPORT_MODE',
    mode
  };
}
