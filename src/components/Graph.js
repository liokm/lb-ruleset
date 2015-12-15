import React, { Component, PropTypes } from 'react';

// Graph
export default class Graph extends Component {
  static propTypes = {
    block: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
    // TODO hLabels
  }

  static defaultProps = {
    hLabels: Array.from(Array(25), (x, k) => k)
  }

  getPos(e) {
    const { block, width, height } = this.props;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(e.clientX - left);
    const y = Math.floor(e.clientY - top);
    return {
      x,
      y,
      // XXX precision issue?
      xRatio: x / width,
      yRatio: y / height,
      // TODO snap to grid or integer value
      h: Math.floor(x / block),
      v: Math.floor(y / block)
    };
  }


  handleMouseMove(e) {
    const { mouseMoved } = this.props;
    // TODO debounce here or in panelAction
    // mouseMoved({...this.getSize(), ...this.getPos(e)});
  }

  handleClick(e) {
    console.log(this.getPos(e));
  }

  handleMouseEnter() {
    this.setState({ highlight: true });
  }

  handleMouseLeave() {
    this.setState({ highlight: false });
  }

  render() {
    const { block, width, height, hLabels, panel } = this.props;
    let path;
    if (panel.has('line')) {
      const [{ xRatio, v }] = panel.get('line');
      path = `M 0 ${block * (v + 0.5)} h ${xRatio * width}`;
    }
    return (
      <svg width={width + block} height={height + block}>
        <svg ref="svg" x={block / 2} width={width} height={height}
          onMouseEnter={ e => this.handleMouseEnter(e) }
          onMouseLeave={ e => this.handleMouseLeave(e) }
          onClick={ e => this.handleClick(e) }
          onMouseMove={ e => this.handleMouseMove(e) }>
          <defs>
            <pattern id="grid" width={ block } height={ block } patternUnits="userSpaceOnUse">
              <path d={`M ${block} 0 L 0 0 0 ${block} M ${block/4} 0 v ${block/4} M ${block/2} 0 v ${block/2} M ${3*block/4} 0 v ${block/4}`} fill="none" stroke="gray" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="50%" fill="url(#grid)" />
          <rect width="100%" height="50%" fill="url(#grid)" transform={`translate(0, ${height}) scale(1, -1)`} />
          {
            path
            ? <path d={path} stroke="red" strokeWidth="2" fill="none" />
            : null
          }
          {
            // highlight border when real Graph is hovered
            this.state && this.state.highlight
            ? <rect x="1" y="0" width={width - 1} height="100%" stroke="purple" strokeWidth="1" fill="none" />
            : null
          }
        </svg>
        {hLabels.map((x, i) => <text width={block} x={block * (i + .5)} y={height + block * 0.9} key={i} style={{textAnchor: 'middle', fill: 'grey', fontSize: block * .7}}>{x}</text>)}
      </svg>
    );
  }
}
