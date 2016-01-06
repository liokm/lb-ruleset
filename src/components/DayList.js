import React, { Component } from 'react';
import moment from 'moment';
import Day from '../components/Day';
// import * as PanelActions from '../actions/PanelActions';
import { MODE } from '../constants/Panel';

// Split seq and show DayView
export default class DayList extends Component {
  static defaultProps = {
    editingEntries: []
  }

  // Split the seq by day (of their duration sums)
  // [{duration}, ...] => [[{duration}, ...]...]
  // push to cur and change cur if full, split to two parts, until seq is consumed
  splitByDay([...seq]) {
    const day = moment.duration(1, 'day');
    let cur = [];
    const ret = [cur];
    while (seq.length) {
      const item = seq.shift();
      const sum = cur.reduce((p, { duration: d }) => p.add(d), item.duration);
      if (sum < day) {
        cur.push({...item});
      } else {
        cur.push({...item, duration: moment.duration(day - (sum - item.duration))});
        if (sum - day) {
          seq.unshift({...item, duration: moment.duration(sum - day)});
        }
        cur = [];
        ret.push(cur);
      }
    }
    if (cur.length == 0) {
      ret.pop();
    }
    return ret;
  }

  //splitByDay2(seq) {
  //  const day = moment.duration(1, 'day');
  //  let cur = [];
  //  const ret = [cur];
  //  for (let item of seq) {
  //    const curDuration = cur.reduce((p, {duration: d}) => p.add(d) , moment.duration());
  //    if (curDuration < day == 0) {
  //      cur = [{...item}]
  //      ret.push(cur);
  //    } else {

  //    }
  //    // curDuration
  //    if (curDuration + d > day) {
  //      const delta = day - curDuration;
  //      cur.push({type, duration: moment.duration(delta)});
  //      const remain = d - delta;
  //      ret.push(...Array.from(Array(Math.floor(remain / day)), () => [{type, duration: moment.duration(1, 'day')}]));
  //      cur = [];
  //      ret.push(cur);
  //      if (remain % day) {
  //        cur.push({type, duration: moment.duration(remain % day)});
  //      }
  //    } else {
  //      cur.push({...item});
  //    }
  //  }
  //  return ret;
  //}

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
