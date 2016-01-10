import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
// Patch in the moment.duration().format()
import * as dummy from 'moment-duration-format';
import rulesets from '../rulesets';
import RuleSetSelector from '../components/RuleSetSelector';
import DayList from '../components/DayList';
import * as Actions from '../actions';


//import Counter from '../components/Counter';
// import DayView from '../components/DayView';
//import * as CounterActions from '../actions/CounterActions';
// import * as PanelActions from '../actions/PanelActions';
//import * as PanelActions from '../actions/ModeActions';

// class Panel extends Component {
//   render() {
//     const { panel, enableAddMode } = this.props;
//     return (
//     );
//   }
// }


class App extends Component {
  render() {
    // TODO Pass in seq and editingEntries
    const { dispatch, rulesetName, browser, mode, entries } = this.props;
    const actions = bindActionCreators(Actions, dispatch);
    const ruleset = rulesets.get(rulesetName);
    return (
      <div>
        <div>
          <button onClick={actions.enableAddMode}>Add</button>
          <button onClick={actions.enableViewMode}>Cancel</button>
        </div>
        <RuleSetSelector ruleset={ruleset} onChange={e => actions.changeRuleset(e.target.value)} />
        <DayList browser={browser} entries={entries} ruleset={ruleset} actions={actions} />
      </div>
      //<div onKeyDown={ e => panelActions.handleKeyDown(e) }>
        //{[>
        //<Counter counter={counter}
          //{...bindActionCreators(CounterActions, dispatch)} />
          //*/}
        //<button onClick={panelActions.enableAddMode}>Add</button>
        //<button onClick={panelActions.enableViewMode}>Cancel</button>
        //<DayList browser={browser} entries={entries} />
      //</div>
    );
  }
}

// Derived data
function processHighlight(highlight) {
}

/*
 *
 TODO We may want this heavy-lift logic to be somewhere else
 Transform raw entries into internal entries
 {type, duration} => {type: index-based type, duration, start}
 mark highlight
 add editing entry: depends on mouse position, mode and addStartAt
 when in edit/add mode: the editing one is highlighted
 in normal mode: the hovered one is highlighted
 click in add mode: add addStartAt or simply append
  if addStartAt is set, create an entry from addStartAt to the mouse position
    require: mouse position >= addStartAt
    whether we overlap or extend the entry or overlap at most to current position
    or add key modifiers:
      - no key: overlap / insert (extend)
      - ctrl: snap to interal timepoint
      - alt: snap to integral duration
      - shift: snap to near by position
  else set addStartAt if inside some entry (not the last, aka, there is no larger entry than the pos)
    set addStartAt
    whenever mouse moving, in processEntries, add an entry to entries (from mouse start to possible position, at least 0 duration)
    (use key modifier to determine the behaviour of add)
  else create an entry from the last position
    const last = entries.length? entries[entries.length - 1].end : moment.duration()
 show violations
 Update raw entries: cleanup 0 duration and invalid type at the first place
*/
import { MODE } from '../constants';
function addEditingEntry(entries, mode, addStartAt) {
  // Only add entries in ADD mode
  if (mode != MODE.ADD) {
    return entries;
  }
  // Add an entry to entries here directly (because it's temporal and is not stored)
  // By clicking to confirm insertion, modify entries in redux way
  //insertEntry(entry)
}

function processEntries(rulesetName, entries, { duration: mouse }, mode) {
  //if (mode == MODE.)
  const ruleset = rulesets.get(rulesetName);
  // Here we pro
  // remove empty entries
  const ret = [];
  const start = moment.duration();
  for (let {type, duration} of entries) {
    duration = moment.duration(duration);
    type = ruleset.types.indexOf(type);
    // Ignore entry with 0 duration
    //if (duration == 0) {
    //  continue;
    //}
    // Ignore entry with invalid type
    if (type == -1) {
      continue;
    }
    const data = {
      type,
      duration,
      start: moment.duration(start),
      end: moment.duration(start.add(duration))
    };
    if (data.start <= mouse && mouse <= data.end) {
      data.highlight = true;
    }
    ret.push(data);
    //if (mouse.)
  }
  return ret;
}

// TODO
// Apply violation ruleset on entries
function violations(entries) { }

function select(state) {
  return {
    //counter: state.counter,
    browser: state.browser,
    // panel: state.panel,
    mode: state.mode,
    //rawEntries: state.entries,
    rulesetName: state.rulesetName,
    highlight: state.highlight,
    // mouse => {type, duration}
    entries: processEntries(state.rulesetName, state.entries, state.mouse)
    //editingEntries: state.editingEntries
    // TODO second linke state
  };
}

export default connect(select)(App);
