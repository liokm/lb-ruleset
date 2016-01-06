import moment from 'moment';
import { combineReducers } from 'redux';
import { responsiveStateReducer } from 'redux-responsive';
import { CHANGE_MODE, ADD_ENTRY, CHANGE_RULESET, MODE, CHANGE_ENTRY, UPDATE_MOUSE_POSITION, SET_HIGHLIGHT_INDEX } from '../constants';
import rulesets from '../rulesets';


function highlight(state=null, action) {
  switch (action.type) {
    case SET_HIGHLIGHT_INDEX:
      return action.index;
    default:
      return state;
  }
}

function mode(state=MODE.VIEW, action) {
  switch (action.type) {
    case CHANGE_MODE:
      return action.mode;
    default:
      return state;
  }
}

function rulesetName(state=rulesets.get().getName(), action) {
  switch (action.type) {
    case CHANGE_RULESET:
      return action.name;
    default:
      return state;
  }
}

const initialEntries = [
  {type: rulesets.get().types[0], duration: moment.duration(1, 'day').add(1, 'hour')},
  {type: rulesets.get().types[1], duration: moment.duration(6, 'h')},
  {type: rulesets.get().types[2], duration: moment.duration(6, 'h')},
  {type: rulesets.get().types[1], duration: moment.duration(1, 'day').add(2, 'hour')},
  {type: rulesets.get().types[2], duration: moment.duration().add(2.5, 'hour')}
];

function entries(state=initialEntries, action) {
  switch (action.type) {
    case CHANGE_ENTRY:
      return [action.payload];
    default:
      return state;
  }
}

function mouse(state={}, action) {
  switch (action.type) {
    case UPDATE_MOUSE_POSITION:
      return action.data;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  mode,
  entries,
  rulesetName,
  mouse,
  highlight,
  browser: responsiveStateReducer
});

export default rootReducer;
