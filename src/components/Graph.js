import React, { Component, PropTypes } from 'react';
import debug from 'debug';
import moment from 'moment';
import throttle from 'lodash.throttle';

export default class Graph extends Component {
  static H = 24
  static V = 4
  static propTypes = {
    block: PropTypes.number.isRequired,
    // TODO hLabels
  }

  static defaultProps = {
    hLabels: Array.from(Array(Graph.H + 1), (x, k) => k),
    seq: [],
    onMouseMove: debug('app:Graph:onMouseMove'),
    onClick: debug('app:Graph:onClick')
  }

  constructor() {
    super();
    this.handleMouseMove = throttle(this.handleMouseMove, 200);
  }

  getSize() {
    const { block } = this.props;
    return {
      block,
      width: block * Graph.H + 1,
      height: block * Graph.V + 1
    };
  }

  getPosition(e) {
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

  // We don't want a {...e} dump
  dumpEvent({currentTarget, clientX, clientY, ctrlKey, altKey, shiftKey}) {
    return { currentTarget, clientX, clientY, ctrlKey, altKey, shiftKey };
  }

  handleMouseMove(e) {
    this.props.onMouseMove({
      e,
      position: this.getPosition(e)
    });
    //duration: moment.duration(idx, 'day').add(pos.xRatio * 24, 'hour'),
  }

  handleClick(e) {
    // If we use the original e, we need to persist it
    //e.persist();
    this.props.onClick({
      e,
      position: this.getPosition(e)
    });
  }

  // Data => {}
  // Move this part to the outside
  // Get d for <path d={d}> for an entry seq
  getPath(seq) {
    const ret = ['M', 0];
    const { block, width } = this.getSize();
    const day = moment.duration(1, 'day');
    seq.forEach(({ type, duration }, idx) => {
      if (!duration) {
        return;
      }
      // Vertically move to target line, except the first move
      if (idx) {
        ret.push('V');
      }
      console.log(duration, width, day, duration * width / day);
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
    const { hLabels, seq } = this.props;
    const { block, width, height } = this.getSize();

    return (
      <svg width={width + block} height={height + block}>
        <svg x={block / 2} width={width} height={height}
          onClick={ e => this.handleClick(this.dumpEvent(e)) }
          onMouseMove={ e => this.handleMouseMove(this.dumpEvent(e)) }
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
            seq.length > 0
            ? <path strokeDasharray="3,3" d={this.getPath(seq)} stroke="blue" strokeWidth="1" fill="none" />
            : null
          }
        </svg>
        {hLabels.map((x, i) => <text width={block} x={block * (i + .5)} y={height + block * 0.9} key={i} style={{textAnchor: 'middle', fill: 'grey', fontSize: block * 0.75}}>{x}</text>)}
      </svg>
    );
  }
}
