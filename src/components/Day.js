import React, { Component, PropTypes } from 'react';
import debug from 'debug';
import moment from 'moment';
import Graph from './Graph';

// Component that lifts the heavy of calculating block size of grid
//  and drawing day view
export default class Day extends Component {
  static propTypes = {
    /*
     * seq: segmented daily entries sequence, [{type, duration, style}]
     * editing: segmented editing daily entries sequence, [{type, duration, style}]
     * violations: daily violations, [TODO]
     */
  }

  static defaultProps = {
    seq: [],
    editing: [],
    violations: []
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
  handleMouseMove({e, position}) {
    const { actions, actions: { mouseMoved }, idx } = this.props;
    mouseMoved({
      idx, e, position,
      duration: moment.duration(idx, 'day').add(24 * position.xRatio, 'hour')
    });
    //console.log(position.h, position.v)
  }

  handleClick({e, position}) {
  }

  // Calculate the size of grid block
  // In order to prevent anti-alias bluring, always draw on integer grid
  getBlock() {
    const { width = 0 } = this.state || {};
    return Math.max(0, Math.floor((width - 1) / (Graph.H + 1)));
  }

  // For the right-side column, calculate the sum time
  // [{type: 0, duration: moment.duration}, ...] => [moment.duration, ...]
  getSumTime(seq) {
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

  render() {
    const { vLabels, seq, editing, violations, idx, actions } = this.props;
    const block = this.getBlock();
    // TODO Put Graph.getSize in this component?
    const svgHeight = block * Graph.V + 1;
    // XXX We can't simply change the whole fontSize here, the left/right columns will shrink,
    // and the layout is not that stable (need more iterations to be finalized)
    //const fontSize = block ? {fontSize: `${block * .9}px`} : {};
    const fontSize = {};
    return (
      <div style={{display: 'flex', marginBottom: '1em', textAlign: 'center', ...fontSize}}>
        {/* Left part: vLabels */}
        <div style={{svgHeight, paddingBottom: block, ...style.side}}>
          {vLabels.map((x, i) => <div key={i} style={style.sideContent}>{x}</div> )}
        </div>
        {/* Middle part: Graph */}
        <div style={{flexGrow: 1, overflow: 'hidden'}} ref="wrapper">
          {
            // TODO Simply pass the svg path string to <Graph> for a quick performance boost?
            block
            ? <Graph block={block} seq={seq} editing={editing} violations={violations}
                onClick={ this.handleClick.bind(this) }
                onMouseMove={ this.handleMouseMove.bind(this) }
              />
            : null
          }
        </div>
        {/* Right part: sum time */}
        <div style={{svgHeight, paddingBottom: block, ...style.side}}>
          {
            this.getSumTime(seq).map((x, i) => <div key={i} style={style.sideContent}>{x.format('s hh:mm:ss').split(' ')[1]}</div>)
          }
        </div>
      </div>
    );
  }
}

const style = {
  side: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  sideContent: {
    display: 'flex',
    flexBasis: 0,
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-around'
  }
};
