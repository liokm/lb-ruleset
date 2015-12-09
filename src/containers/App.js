import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import DayView from '../components/DayView';
import * as CounterActions from '../actions/CounterActions';

class App extends Component {
  render() {
    const { counter, dispatch, browser } = this.props;
    return (
      <div>
        <Counter counter={counter}
          {...bindActionCreators(CounterActions, dispatch)} />
        <DayView browser={browser} />
      </div>
    );
  }
}

function select(state) {
  return {
    counter: state.counter,
    browser: state.browser
  };
}

export default connect(select)(App);
