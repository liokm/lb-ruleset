import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export const H = 24;
export const V = 4;
// Graph
export default class Graph extends Component {
  static propTypes = {
    block: PropTypes.number.isRequired,
    // TODO hLabels
  }

  static defaultProps = {
    hLabels: Array.from(Array(H + 1), (x, k) => k),
    seq: []
  }

  getSize() {
    const { block } = this.props;
    return {
      block,
      width: block * H + 1,
      height: block * V + 1
    };
  }

  getPos(e) {
    const { block, width, height } = this.getSize();
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
    const { actions, mouseMoved, idx } = this.props;
    actions.mouseMoved( () => this.getPos(e), idx );
    //
    // mouseMoved(e, )
    // TODO debounce here or in panelAction
    // mouseMoved({...this.getSize(), ...this.getPos(e)});
    // Ctrl/Alt key for snap
  }

  handleClick(e) {
    console.log(this.getPos(e));
  }

  // Get d for <path d={d}> for an entry seq
  getPath(seq) {
    const ret = ['M', 0];
    const { block, width } = this.getSize();
    const day = moment.duration(1, 'day');
    seq.forEach(({ type, duration }, idx) => {
      // Vertically move to target line, except the first move
      if (idx) {
        ret.push('V');
      }
      ret.push(
        // type is index-based already
        (type + 0.5) * block,
        'h',
        duration * width / day // x / width == duration / day
      );
    });
    return ret.join(' ');
  }

  render() {
    const { hLabels, panel, seq } = this.props;
    const { block, width, height } = this.getSize();

    return (
      <svg width={width + block} height={height + block}>
        <svg x={block / 2} width={width} height={height}
          onClick={ e => this.handleClick(e) }
          onMouseMove={ e => this.handleMouseMove(e) }
          >
          <defs>
            <pattern id="grid" width={ block } height={ block } patternUnits="userSpaceOnUse">
              <path d={`M ${block} 0 L 0 0 0 ${block} M ${block/4} 0 v ${block/4} M ${block/2} 0 v ${block/2} M ${3*block/4} 0 v ${block/4}`} fill="none" stroke="gray" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="50%" fill="url(#grid)" />
          <rect width="100%" height="50%" fill="url(#grid)" transform={`translate(0, ${height}) scale(1, -1)`} />
          {
            // draw whatever we got
            seq
            ? <path d={this.getPath(seq)} stroke="blue" strokeWidth="1" fill="none" />
            : null
          }
        </svg>
        {hLabels.map((x, i) => <text width={block} x={block * (i + .5)} y={height + block * 0.9} key={i} style={{textAnchor: 'middle', fill: 'grey', fontSize: block * 0.75}}>{x}</text>)}
      </svg>
    );
  }
}
