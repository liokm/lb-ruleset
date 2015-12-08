import { combineReducers } from 'redux';
import counter from './counter';
import { responsiveStateReducer } from 'redux-responsive';

const rootReducer = combineReducers({
  counter,
  browser: responsiveStateReducer
});

export default rootReducer;
