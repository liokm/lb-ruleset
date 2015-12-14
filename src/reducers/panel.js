import { Map } from 'immutable';
import { CHANGE_MODE } from '../constants/ActionTypes';
import { MODE } from '../constants/Panel';

const initial = Map({
  mode: MODE.VIEW
});

export default function panel(state=initial, action) {
  switch (action.type) {
    case CHANGE_MODE:
      return state.set('mode', action.mode);
    default:
      return state;
  }
}
