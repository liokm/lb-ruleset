import React, { Component } from 'react';
import moment from 'moment';
import Day from '../components/Day';
// import * as PanelActions from '../actions/PanelActions';
import { MODE } from '../constants/Panel';

// Split seq and show DayView
export default class DayList extends Component {
  static defaultProps = {
    entries: [
      {type: 0, duration: moment.duration(3, 'day').add(2, 'hour').add(30, 'minute')},
      {type: 1, duration: moment.duration(1, 'day').add(2, 'hour')}
    ],
    editingEntries: [
    ]
  }

  // Split the seq by day (of their duration sums)
  splitByDay(seq) {
    const day = moment.duration(1, 'day');
    //
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
    // Use global entries and editingEntries
    const { entries, editingEntries, mode, browser, ruleset, actions } = this.props;
    // TODO: Show violations for entries / editingEntries differently
    const splittedEntries = this.splitByDay(entries);
    const splittedEditingEntries = this.splitByDay(editingEntries);
    // Max showing day:
    //  - normal mode: splitted entries
    //  - editing mode: bigger one among splitted entries and splitted editing entries
    //  - add mode: bigger one among (mouse hovered position + 1) or (splitted entries + 1)
    let days;
    switch (mode) {
      case MODE.VIEW:
        days = splittedEntries;
        break;
      case MODE.ADD:
        // days =
        days = splittedEntries;
        break;
      // TODO editing mode
      default:
        days = splittedEntries;
    }

    return <div>
      {
        days.map((seq, i) => {
          return <Day
            seq={seq}
            editingEntries={splittedEditingEntries[i]}
            key={i}
            idx={i}
            actions={actions}
            ruleset={ruleset}
            vLabels={ruleset.types}
            browser={browser}
            />;
        })
      }
    </div>;
  }
}
