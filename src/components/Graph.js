import React, { Component, PropTypes } from 'react';

// Graph
export default class Graph extends Component {
  static H = 24
  static V = 4
  static propTypes = {
    block: PropTypes.number.isRequired
    // TODO
    // hLabels
  }

  static defaultProps = {
    hLabels: Array.from(Array(25), (x, k) => k)
  }

  getSize() {
    // In order to keep us from anti-alias lines, always draw on integer grid
    const { block } = this.props;
    return {
      block,
      width: block * Graph.H + 1,
      height: block * Graph.V + 1
    };
  }

  handleMouseMove(e) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - left);
    const y = Math.floor(e.clientY - top);
  }

  render() {
    const { hLabels } = this.props;
    const { block, width, height } = this.getSize();
    return (
      <svg width={width + block} height={height + block}>
        <svg ref="svg" x={block / 2} width={width} height={height} onMouseMove={e => this.handleMouseMove(e)}>
          <defs>
            <pattern id="grid" width={ block } height={ block } patternUnits="userSpaceOnUse">
              <path d={`M ${block} 0 L 0 0 0 ${block} M ${block/4} 0 v ${block/4} M ${block/2} 0 v ${block/2} M ${3*block/4} 0 v ${block/4}`} fill="none" stroke="gray" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="50%" fill="url(#grid)" />
          <rect width="100%" height="50%" fill="url(#grid)" transform={`translate(0, ${block * Graph.V + 1}) scale(1, -1)`} />
        </svg>
        {hLabels.map((x, i) => <text width={block} x={block * (i + .5)} y={block * (Graph.V + .9)} key={i} style={{textAnchor: 'middle', fill: 'grey', fontSize: block * .7}}>{x}</text>)}
      </svg>
    );
  }
}
