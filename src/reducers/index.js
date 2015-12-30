import moment from 'moment';
import { combineReducers } from 'redux';
import { responsiveStateReducer } from 'redux-responsive';
import { CHANGE_MODE, ADD_ENTRY, CHANGE_RULESET, MODE, CHANGE_ENTRY } from '../constants';
import rulesets from '../rulesets';


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
  {type: 1, duration: moment.duration(1, 'day').add(1, 'hour')},
  {type: 2, duration: moment.duration(1, 'day').add(2, 'hour')},
  {type: 0, duration: moment.duration().add(2, 'hour')}
];

function entries(state=initialEntries, action) {
  switch (action.type) {
    case CHANGE_ENTRY:
      return [action.payload];
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  mode,
  entries,
  rulesetName,
  browser: responsiveStateReducer
});

export default rootReducer;
