import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import * as dummy from 'moment-duration-format';
import Counter from '../components/Counter';
import DayView from '../components/DayView';
import * as CounterActions from '../actions/CounterActions';
import * as PanelActions from '../actions/PanelActions';

class Panel extends Component {
  render() {
    const { panel, enableAddMode } = this.props;
    return (
      <button onClick={enableAddMode}>Add</button>
    );
  }
}

// Split seq and showing DayView
class DayList extends Component {
  // Split the seq by day (of their duration sums)
  splitByDay(seq) {
    const day = moment.duration(1, 'day');
    let cur = [];
    const ret = [cur];
    // sum of the cur entry
    // const duration = moment.duration();
    for (let {type, duration: d} of seq) {
      const curDuration = cur.reduce((x, {duration}) => x.add(duration) , moment.duration());
      if (curDuration + d > day) {
        const delta = day - curDuration;
        cur.push({type, duration: moment.duration(delta)});
        const remain = d - delta;
        ret.push(...Array.from(Array(Math.floor(remain / day)), () => [{type, duration: moment.duration(1, 'day')}]));
        cur = [];
        ret.push(cur);
        if (remain % day) {
          cur.push({type, duration: moment.duration(remain % day)});
        }
      } else {
        cur.push({type, d});
      }
    }
    return ret;
  }

  render() {
    const seq = [
      {type: 0, duration: moment.duration(3, 'day').add(2, 'hour').add(30, 'minute')}
    ];
    console.log(this.props, this.splitByDay(seq), seq);
    return (
      <div>
        {
          this.splitByDay(seq).map((x, i) => {
            return (
              <DayView {...this.props} key={i} seq={x} />
            );
          })
        }
      </div>
    );
  }
}

class App extends Component {
  render() {
    const { dispatch, counter, browser, panel } = this.props;
    const panelActions = bindActionCreators(PanelActions, dispatch);
    return (
      <div>
        <Counter counter={counter}
          {...bindActionCreators(CounterActions, dispatch)} />
        <Panel panel={panel} {...panelActions} />
        <DayList browser={browser} />
        {
          /* TODO: transform timepoint to duration; show duration per DayView;
            in add mode: add extra entry to current one and show it (
              how to display different theme and color? (change current one with different color style)
              use two main lines for the drawing
            )

           */
          // Array.from(Array(7)).map((x, i) => {
          //   return (
          //     <div key={i}>
          //       <h4>Day {i+1}</h4>
          //       <DayView panel={panel} browser={browser} panelActions={panelActions} />
          //     </div>
          //   )
          // })
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
