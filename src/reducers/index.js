import { combineReducers } from 'redux';
import counter from './counter';
import panel from './panel';
import { responsiveStateReducer } from 'redux-responsive';

const rootReducer = combineReducers({
  counter,
  panel,
  browser: responsiveStateReducer
});

export default rootReducer;
