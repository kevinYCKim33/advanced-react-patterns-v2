// state reducer with types

// Things I learned:
/*
faking enums with static key-vals
i guess in TypeScript there are enums...

filtering out a key-val from a hash using ES6 destructuring...
*/

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) =>
  fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
    stateReducer: (state, changes) => changes,
  }
  // faking enums in JavaScript

  // 💰 any time I use a string as an identifier for a type,
  // I prefer to give it a variable name. That way folks who
  // want to reference the type can do so using variable which
  // will help mitigate the problems of indirection.
  static stateChangeTypes = {
    reset: '__toggle_reset__',
    toggle: '__toggle_toggle__',
  }
  initialState = {on: this.props.initialOn}
  state = this.initialState
  internalSetState(changes, callback) {
    this.setState(state => {
      // handle function setState call
      const changesObject =
        typeof changes === 'function' ? changes(state) : changes
      // apply state reducer
      const reducedChanges =
        this.props.stateReducer(state, changesObject) || {}
      // 🐨  in addition to what we've done, let's pluck off the `type`
      // property and return an object only if the state changes
      // 💰 to remove the `type`, you can destructure the changes:
      // `{type, ...c}`
      const {type: ignoredType, ...remainingChanges} = reducedChanges
      // reducedChanges.type will now be knows as ignoredType
      // everything else in reducedChanges will now be a new object of remainingChanges
      return Object.keys(remainingChanges).length
        ? remainingChanges
        : null
    }, callback)
  }
  reset = () =>
    // 🐨 add a `type` string property to this call
    this.internalSetState(
      {type: Toggle.stateChangeTypes.reset, ...this.initialState},
      () => this.props.onReset(this.state.on),
    )
  // 🐨 accept a `type` property here and give it a default value
  toggle = ({type = Toggle.stateChangeTypes.toggle} = {}) => {
    this.internalSetState(
      // pass the `type` string to this object
      ({on}) => ({type, on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  }
  getTogglerProps = ({onClick, ...props} = {}) => ({
    // 🐨 change `this.toggle` to `() => this.toggle()`
    // to avoid passing the click event to this.toggle.
    onClick: callAll(onClick, () => this.toggle()),
    'aria-pressed': this.state.on,
    ...props,
  })
  getStateAndHelpers() {
    return {
      on: this.state.on,
      toggle: this.toggle,
      reset: this.reset,
      getTogglerProps: this.getTogglerProps,
    }
  }
  render() {
    return this.props.children(this.getStateAndHelpers())
  }
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
class Usage extends React.Component {
  static defaultProps = {
    onToggle: (...args) => console.log('onToggle', ...args),
    onReset: (...args) => console.log('onReset', ...args),
  }
  initialState = {timesClicked: 0}
  state = this.initialState
  handleToggle = (...args) => {
    this.setState(({timesClicked}) => ({
      timesClicked: timesClicked + 1,
    }))
    this.props.onToggle(...args)
  }
  handleReset = (...args) => {
    this.setState(this.initialState)
    this.props.onReset(...args)
  }
  toggleStateReducer = (state, changes) => {
    if (changes.type === 'forced') {
      return changes
    }
    if (this.state.timesClicked >= 4) {
      return {...changes, on: false}
    }
    return changes
  }
  render() {
    const {timesClicked} = this.state
    return (
      <Toggle
        stateReducer={this.toggleStateReducer}
        onToggle={this.handleToggle}
        onReset={this.handleReset}
        ref={this.props.toggleRef}
      >
        {({on, toggle, reset, getTogglerProps}) => (
          <div>
            <Switch
              {...getTogglerProps({
                on: on,
              })}
            />
            {timesClicked > 4 ? (
              <div data-testid="notice">
                Whoa, you clicked too much!
                <br />
                <button onClick={() => toggle({type: 'forced'})}>
                  Force Toggle
                </button>
                <br />
              </div>
            ) : timesClicked > 0 ? (
              <div data-testid="click-count">
                Click count: {timesClicked}
              </div>
            ) : null}
            <button onClick={reset}>Reset</button>
          </div>
        )}
      </Toggle>
    )
  }
}
Usage.title = 'State Reducers (with change types)'

export {Toggle, Usage as default}

/* eslint
"no-unused-vars": [
  "warn",
  {
    "argsIgnorePattern": "^_.+|^ignore.+",
    "varsIgnorePattern": "^_.+|^ignore.+",
    "args": "after-used"
  }
]
 */
