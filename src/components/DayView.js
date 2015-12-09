import React, { Component, PropTypes } from 'react';
import Graph from './Graph';

// Component that lifts the heavy of calculating block size of grid
//  and drawing day view
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

  // Ref https://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
  // This method is not invoked at first thus we should invoke componentDidMount as well
  componentWillReceiveProps(nextProp) {
    // TODO Take a look at
    if (this.props.browser.width != nextProp.browser.width) {
      this.handleResize();
    }
  }

  // Calculate the size of grid block
  getBlock() {
    let block = 0;
    if (this.state && 'width' in this.state) {
      const { width } = this.state;
      // In order to keep us from blurred anti-alias lines, always draw on integer grid
      // TODO Limit block to be odd sized to avoid middle line anti-aliasing?
      block = Math.max(0, Math.floor((width - 1) / (Graph.H + 1)));
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
        <div style={{flexGrow: 1, height: block * (Graph.V + 1) + 1, overflow: 'hidden'}} ref="wrapper">
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
