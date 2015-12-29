import { CHANGE_MODE, ADD_ENTRY, CHANGE_RULESET, MODE, CHANGE_ENTRY } from '../constants';

// Action creators
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

export function changeRuleset(name) {
  return {
    type: CHANGE_RULESET,
    name: name
  }
}

import lodash from 'lodash';

export function mouseMoved(payload) {
  return {
    type: CHANGE_ENTRY,
    payload: payload
  }
}

const fn = lodash.debounce((func, idx) => {
  console.log(func(), idx);
}, 500);
// TODO Duration and snap
// [{type, duration}, ...]
//export function mouseMoved(func, idx) {
//  return (dispatch, getState) => {
//    fn(func, idx);
//  }
//  //return (dispatch, getState) => {
//    //const { panel } = getState();
//    //if (panel.get('mode') == MODE.ADD) {
//      ////dispatch(addEntry())
//      //dispatch({
//        //type: ADD_ENTRY,
//        //payload: data
//      //});
//    //}
//  //};
//}

// export function handleKeyDown({ keyCode }) {
//   return (dispatch, getState) => {
//       const { mode } = getState();
//       // ESC
//       if (panel.get('mode') == MODE.ADD && keyCode == 27) {
//         dispatch(enableViewMode());
//       } else if (false) {
//
//       }
//   };
// }
