import { CHANGE_MODE, ADD_ENTRY } from '../constants/ActionTypes';
import { MODE } from '../constants/Panel';

export function changeMode(mode) {
  return {
    type: CHANGE_MODE,
    mode
  };
}

export function enableViewMode() {
  return changeMode(MODE.VIEW);
}

export function enableAddMode() {
  return changeMode(MODE.ADD);
}

// TODO Duration and snap
// [{type, duration}, ...]
export function mouseMoved(data) {
  return (dispatch, getState) => {
    const { panel } = getState();
    if (panel.get('mode') == MODE.ADD) {
      //dispatch(addEntry())
      dispatch({
        type: ADD_ENTRY,
        payload: data
      });
    }
  };
}
