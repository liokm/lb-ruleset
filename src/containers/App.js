import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import * as dummy from 'moment-duration-format';
import Counter from '../components/Counter';
// import DayView from '../components/DayView';
import DayList from '../components/DayList';
import * as CounterActions from '../actions/CounterActions';
import * as PanelActions from '../actions/PanelActions';

// class Panel extends Component {
//   render() {
//     const { panel, enableAddMode } = this.props;
//     return (
//     );
//   }
// }

class App extends Component {
  render() {
    const { dispatch, counter, browser, panel, entries } = this.props;
    const panelActions = bindActionCreators(PanelActions, dispatch);
    // TODO Pass in seq and editingEntries
    return (
      <div onKeyDown={ e => panelActions.handleKeyDown(e) }>
        {/*
        <Counter counter={counter}
          {...bindActionCreators(CounterActions, dispatch)} />
          */}
        <button onClick={panelActions.enableAddMode}>Add</button>
        <button onClick={panelActions.enableViewMode}>Cancel</button>
        <DayList browser={browser} entries={entries} />
      </div>
    );
  }
}

function select(state) {
  return {
    counter: state.counter,
    browser: state.browser,
    panel: state.panel,
    entries: state.entries,
    editingEntries: state.editingEntries
    // TODO second linke state
  };
}

export default connect(select)(App);
