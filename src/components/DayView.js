import React, { Component, PropTypes } from 'react';
import Graph, { H } from './Graph';
import moment from 'moment';
import { MODE } from '../constants/Panel';

// TODO Ruleset has its vLabels
// Component that lifts the heavy of calculating block size of grid
//  and drawing day view
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

  // Dealing with mouse moving, especially in ADD mode
  handleMouseMove(e) {
    // When mouse moving, c
    const { mode } = this.props;
    if (mode == MODE.ADD) {


    }

  }

  // Calculate the size of grid block
  // 1. In order to prevent anti-alias bluring, always draw on integer grid
  // 2. width/height are passed into Graph without calculating them inside
  getBlock() {
    const { width = 0 } = this.state || {};
    return Math.max(0, Math.floor((width - 1) / (H + 1)));
  }

  // For the right-side column, calculate the sum time
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

  // TODO Simply pass the svg path string to <Graph> for a quick performance boost?
  render() {
    const { vLabels, panelActions, panel, entries, idx } = this.props;
    const block = this.getBlock();
    // TODO Block is calculated for full column size, thus the fontSize here
    //  can much possibly reduce the width of left and right columns.
    const fontSize = block ? {fontSize: `${block * .9}px`} : {};
    return (
      <div style={{display: 'flex', marginBottom: '1em', ...fontSize}}>
        {/* Left part: vLabels */}
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: block, textAlign: 'center'}}>
          {vLabels.map((x, i) => <div key={i} style={{flexGrow: 1, flexBasis: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>{x}</div> )}
        </div>
        {/* Middle part: Graph */}
        <div style={{flexGrow: 1, overflow: 'hidden', textAlign: 'center'}} ref="wrapper">
          {
            block
            ? <Graph block={block} seq={entries} idx={idx} {...panelActions}/>
            : null
          }
        </div>
        {/* Right part: accumulated timer */}
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: block}}>
          {
            // console.log('inside', seq),
            this.getAccumulatedTime(entries).map((x, i) => <div key={i} style={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>{x.format('s hh:mm:ss').split(' ')[1]}</div>)
          }
        </div>
      </div>
    );
  }
}
