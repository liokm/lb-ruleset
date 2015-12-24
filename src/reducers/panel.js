import { Map } from 'immutable';
import { CHANGE_MODE, ADD_ENTRY } from '../constants/ActionTypes';
import { MODE } from '../constants/Panel';

const initial = Map({
  mode: MODE.VIEW
});

export default function panel(state=initial, action) {
  switch (action.type) {
    // case CHANGE_MODE:
    //   return state.set('mode', action.mode);
    // case ADD_ENTRY: {
    //   const { xRatio, yBlock } = action.payload;
    //   return state.set('line', [action.payload]);
    // }
    default:
      return state;
  }
}
