import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import DayView from '../components/DayView';
import * as CounterActions from '../actions/CounterActions';
import * as PanelActions from '../actions/PanelActions';

class Panel extends Component {
  render() {
    const { panel, enableAddMode } = this.props;
    return (
      <div>
        <button onClick={enableAddMode}>Add</button>
      </div>
    );
  }
}
class App extends Component {
  render() {
    const { dispatch, counter, browser, panel } = this.props;
    return (
      <div>
        <Counter counter={counter}
          {...bindActionCreators(CounterActions, dispatch)} />
        <Panel
          panel={panel}
          {...bindActionCreators(PanelActions, dispatch)} />
        {
          /* TODO: transform timepoint to duration; show duration per DayView;
            in add mode: add extra entry to current one and show it (
              how to display different theme and color? (change current one with different color style)
              use two main lines for the drawing
            )

           */
          Array.from(Array(7)).map((x, i) => {
            return (
              <div>
                <h4>Day {i+1}</h4>
                <DayView key={i} browser={browser} />
              </div>
            )
          })
        }
      </div>
    );
  }
}

function select(state) {
  return {
    counter: state.counter,
    browser: state.browser,
    panel: state.panel
  };
}

export default connect(select)(App);
