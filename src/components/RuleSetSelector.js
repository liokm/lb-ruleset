import React, { Component } from 'react';
import rulesets from '../rulesets';


export default class RuleSetSelector extends Component {
  render() {
    const { ruleset } = this.props;
    return (
      <select {...this.props} value={ruleset.getName()}>
      {
        rulesets.map((item, i) => {
          return (
            <option key={i} value={item.getName()}>{item.label}</option>
          )
        })
      }
      </select>
    );
  }
}
