import React, { Component, PropTypes } from 'react';

// Show horizontal labels and Graph
// export class HLabeledGraph extends Component {
//   render() {
//     return (
//       <svg>
//         <Graph />
//       </svg>
//     );
//   }
// }

// Component that lifts the heavy of calculating block size of grid
//  and drawing day view
const H = 24;
const V = 4;
export default class DayView extends Component {
  static defaultProps = {
    // vLabels: 'OFF SB D ON'.trim().split(/\s+/)
    vLabels: [
      '1. OFF DUTY',
      '2. SLEEPER BERTH',
      '3. DRIVING',
      <div>
        4. ON DUTY
        <br /><small>(NOT DRIVING)</small>
      </div>
    ]
  }

  handleResize() {
    this.setState({width: this.refs.wrapper.getBoundingClientRect().width});
  }

  componentDidMount() {
    this.handleResize();
  }

  // Ref https://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceivepropshttps://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
  // This method is not invoked at first thus we should invoke componentDidMount as well
  componentWillReceiveProps(nextProp) {
    if (this.props.browser.width != nextProp.browser.width) {
      this.handleResize();
    }
  }

  // Calculate the size of grid block
  getBlock() {
    let block = 0;
    if (this.state && 'width' in this.state) {
      const { width } = this.state;
      // In order to keep us from anti-alias lines, always draw on integer grid
      // TODO Limit block to be odd sized for middle line no anti-alias?
      block = Math.floor((width - 1) / (H + 1));
    }
    return block;
  }

  render() {
    const { vLabels } = this.props;
    const block = this.getBlock();

    return (
      <div style={{display: 'flex'}}>
        <div style={{display: 'flex', flexDirection: 'column', paddingBottom: block}}>
          {vLabels.map((x, i) => <div key={i} style={{flexGrow: 1, flexBasis: 0}}>{x}</div> )}
        </div>
        <div style={{flexGrow: 1, height: block * (V + 1) + 1}} ref="wrapper">
          {block
            ? <Graph block={block} />
            : null
          }
        </div>
        <div style={{display: 'flex', flexDirection: 'column', paddingBottom: block}}>
        {[1, 2, 3, 4].map((x, i) => <div key={i} style={{flexGrow: 1}}>00:00:00</div>)}
        </div>
      </div>
    );
  }
}

class Graph extends Component {
  static propTypes = {
    block: PropTypes.number.isRequired
  }

  getSize() {
    // In order to keep us from anti-alias lines, always draw on integer grid
    const { block } = this.props;
    return {
      block,
      width: block * H + 1,
      height: block * V + 1
    };
  }

  handleMouseMove(e) {
    const {pageX, pageY, currentTarget: {offsetLeft, offsetTop}, altKey, ctrlKey} = e;
    const x = pageX - offsetLeft;
    const y = pageY - offsetTop;
    const { block, width, height } = this.props;
  }

  render() {
    const { block, width, height } = this.getSize();
    return (
      <svg ref="svg" width={width} height={height} onMouseMove={e => this.handleMouseMove(e)}>
        <defs>
          <pattern id="grid" width={ block } height={ block } patternUnits="userSpaceOnUse">
            <path d={`M ${block} 0 L 0 0 0 ${block} M ${block/4} 0 v ${block/4} M ${block/2} 0 v ${block/2} M ${3*block/4} 0 v ${block/4}`} fill="none" stroke="gray" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="50%" fill="url(#grid)" />
        <rect width="100%" height="50%" fill="url(#grid)" transform={`translate(0, ${block * 4 + 1}) scale(1, -1)`} />
      </svg>
    );
  }
}
