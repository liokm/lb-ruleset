import React, { Component, PropTypes } from 'react';
import debug from 'debug';
import moment from 'moment';
import Graph from './Graph';

// Component that lifts the heavy of calculating block size of grid
//  and drawing day view
export default class Day extends Component {
  static propTypes = {
    // TODO browser
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

  }

  // Calculate the size of grid block
  // In order to prevent anti-alias bluring, always draw on integer grid
  getBlock() {
    const { width = 0 } = this.state || {};
    return Math.max(0, Math.floor((width - 1) / (Graph.H + 1)));
  }

  // For the right-side column, calculate the sum time
  getSumTime(seq) {
    //[{type: 0, duration: moment.duration}, ...]
    return seq.reduce(
      (prev, {type, duration}) => (prev[type].add(duration), prev),
      Array.from(Array(Graph.V), moment.duration)
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
    const { vLabels, panelActions, panel, entries, idx, actions } = this.props;
    const block = this.getBlock();
    // TODO Block is calculated for full column size, thus the fontSize here
    //  can much possibly reduce the width of left and right columns.
    //
    //const fontSize = block ? {fontSize: `${block * .9}px`} : {};
    const fontSize = {};
    const height = block * (Graph.V + 0) + 1;
    return (
      <div style={{display: 'flex', marginBottom: '1em', ...fontSize}}>
        {/* Left part: vLabels */}
        <div style={{height, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: block, textAlign: 'center'}}>
          {vLabels.map((x, i) => <div key={i} style={{flexGrow: 1, flexBasis: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>{x}</div> )}
        </div>
        {/* Middle part: Graph */}
        <div style={{flexGrow: 1, overflow: 'hidden', textAlign: 'center'}} ref="wrapper">
          {
            block
            ? <Graph block={block} seq={entries} idx={idx} actions={actions} {...panelActions}/>
            : null
          }
        </div>
        {/* Right part: accumulated timer */}
        <div style={{height, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: block}}>
          {
            this.getSumTime(entries).map((x, i) => <div key={i} style={{flexGrow: 1, display: 'flex', flexBasis: 0, flexDirection: 'column', justifyContent: 'space-around'}}>{x.format('s hh:mm:ss').split(' ')[1]}</div>)
          }
        </div>
      </div>
    );
  }
}
