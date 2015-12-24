import React, { Component } from 'react';
//export const GROUP = {
//  NZ: 'NZ',
//  USA: 'USA'
//};

class RuleSet {
  //static group = GROUP.USA
  static types = ['OFF', 'SB', 'D', 'ON']
  static labels = Array.from(Array(24 + 1), (x, k) => k)
  static getName() {
    // Dear IE does not support func.name
    return this.name || /^function\s+([\w\$]+)\s*\(/.exec(this.toString())[1];
  }
}

class HOS extends RuleSet {
  static label = 'Interstate Hours Of Service'
  static description = 'Hours Of Service'
}

class ShortHaul extends RuleSet {
  static label = 'Short Haul'
  static description = 'Short Haul'
}

class NZRule extends RuleSet {
  static label = 'New Zealand ruleset'
}

const rulesets = [
  HOS,
  ShortHaul,
  NZRule
];

rulesets.get = function(name) {
  for (let r of this) {
    if (r.getName() == name) {
      return r;
    }
  }
  return this[0];
};

export default rulesets;

// Transform rulesets into select
//const groupedRulesets = [];
//{
//  const map = {};
//  for (let r of rulesets) {
//    if (!(r.group in map)) {
//      const group = { group: r.group, items: [] };
//      map[r.group] = group;
//      groupedRulesets.push(group);
//    }
//    map[r.group].items.push(r);
//  }
//}

//export { groupedRulesets };
