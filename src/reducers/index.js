import { combineReducers } from 'redux';
import { responsiveStateReducer } from 'redux-responsive';
import moment from 'moment';
import { CHANGE_MODE, ADD_ENTRY, CHANGE_RULESET, MODE } from '../constants';
import rulesets from '../rulesets';


function mode(state=MODE.VIEW, action) {
  switch (action.type) {
    case CHANGE_MODE:
      return action.mode;
    default:
      return state;
  }
}

function rulesetName(state=rulesets[0].getName(), action) {
  switch (action.type) {
    case CHANGE_RULESET:
      return action.name;
    default:
      return state;
  }
}

const initialEntries = [
  {type: 1, duration: moment.duration(3, 'day').add(1, 'hour')}
];

function entries(state=initialEntries, action) {
  switch (action.type) {
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
