import React, { Component, PropTypes } from 'react';
import Graph from './Graph';
import * as dummy from 'moment-duration-format';
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
  // In order to prevent anti-alias bluring, always draw on integer grid
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

  render() {
    const { vLabels, panelActions, panel } = this.props;
    const { block, width, height } = this.getSize();
    // TODO
    const seq = [];

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
