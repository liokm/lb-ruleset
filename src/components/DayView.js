import React, { Component, PropTypes } from 'react';
import Graph from './Graph';
import moment from 'moment';

// TODO Ruleset has its vLabels
// Component that lifts the heavy of calculating block size of grid
//  and drawing day view
const H = 24;
const V = 4;
export default class DayView extends Component {
  static defaultProps = {
    vLabels: [ 'OFF', 'SB', 'D', 'ON' ]
    // vLabels: [
    //   '1. OFF DUTY',
    //   '2. SLEEPER BERTH',
    //   '3. DRIVING',
    //   <div>
    //     4. ON DUTY
    //     <br /><small>(NOT DRIVING)</small>
    //   </div>
    // ]
  }

  handleResize() {
    this.setState({width: this.refs.wrapper.getBoundingClientRect().width});
  }

  componentDidMount() {
    this.handleResize();
  }

  // Ref https://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
  // This method is not invoked at first thus we should invoke componentDidMount as well
  componentWillReceiveProps(nextProp) {
    if (this.props.browser.width != nextProp.browser.width) {
      this.handleResize();
    }
  }

  // Calculate the size of grid block
  // 1. In order to prevent anti-alias bluring, always draw on integer grid
  // 2. width/height are passed into Graph without calculating them inside
  getSize() {
    const { width = 0 } = this.state || {};
    const block = Math.max(0, Math.floor((width - 1) / (H + 1)));
    return {
      block,
      width: block * H + 1,
      height: block * V + 1
    }
  }

  getAccumulatedTime(seq) {
    return seq.reduce(
      (prev, {type, duration}) => (prev[type].add(duration), prev),
      Array.from(Array(4), () => moment.duration())
    );
  }

  // TODO immutable
  removeZero(seq) {
    return seq.filter(({type, duration}) => duration != 0);
  }

  mergeConsecutive(seq) {
    const ret = [];
    for (let {type, duration} of seq) {
      if (ret.length && ret[ret.length - 1].type == type) {
        ret[ret.length - 1].duration.add(duration);
      } else {
        ret.push({type, duration});
      }
    }
    return ret;
  }

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
    const { vLabels, panelActions, panel } = this.props;
    const { block, width, height } = this.getSize();
    // TODO
    const seq = [
      {type: 1, duration: moment.duration(1, 'week')}
    ];

    console.log(this.splitByDay(seq));
    // const foo = [
    //   {type: 1, duration: moment.duration(2, 'h')},
    //   {type: 2, duration: moment.duration(1, 'm')},
    //   {type: 1, duration: moment.duration(1, 'm')},
    //   {type: 1, duration: moment.duration(30, 's')}
    // ]
    // console.log(this.mergeSeq(foo));

    // durations are splited to different part
    // Instead of passing in splitted seq, simply pass in the svg path string
    return (
      <div style={{display: 'flex'}}>
        {/* Left part: vLabels */}
        <div style={{display: 'flex', flexDirection: 'column', paddingBottom: block}}>
          {vLabels.map((x, i) => <div key={i} style={{flexGrow: 1, flexBasis: 0}}>{x}</div> )}
        </div>
        {/* Middle part: Graph */}
        <div style={{flexGrow: 1, height: height + block, overflow: 'hidden'}} ref="wrapper">
          {
            block
            ? <Graph block={block} width={width} height={height} panel={panel} {...panelActions}/>
            : null
          }
        </div>
        {/* Right part: accumulated timer */}
        <div style={{display: 'flex', flexDirection: 'column', paddingBottom: block}}>
          {
            block
            // x.format('s hh:mm:ss') is a quick hackaround...
            ? this.getAccumulatedTime(seq).map((x, i) => <div key={i} style={{flexGrow: 1}}>{x.format('s hh:mm:ss').split(' ')[1]}</div>)
            : [1, 2, 3, 4].map((x, i) => <div key={i} style={{flexGrow: 1}}>00:00:00</div>)
          }
        </div>
      </div>
    );
  }
}
