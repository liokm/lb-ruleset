import { CHANGE_MODE } from '../constants/ActionTypes';
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
