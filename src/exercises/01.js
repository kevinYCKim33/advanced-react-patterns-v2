// Building the toggle component

import React from 'react'
// 🐨 uncomment this import to get the switch component.
// It takes an `onClick` and an `on` prop
import {Switch} from '../switch'

class Toggle extends React.Component {
  // 🐨 this toggle component is going to need to have state for `on`
  //
  state = {on: false}
  // can just do this with ESNext
  // pretty clean when you don't need anything else done in constructor

  // You'll also want a method to handle when the switch is clicked
  // which will update the `on` state and call the `onToggle` prop
  // with the new `on` state.

  // my notes
  // setState should be called with an update function when referencing current state...REALLY?
  // Kent C. Dodds thought: when using previous state to change the current state, always use an updater function in setState.
  // do you HAVE TO use a state updater function?
  // react does not guarantee is...setState could be batched...you have no control over...
  // what the state will be when this.setState is processed...
  // and so...by providing an update function...it can pass you what the state is,
  // at the time that this setState call is being processed in batching
  // so that you're actually referencing the current state.
  handleOnClick = () => {
    this.setState(
      ({on}) => ({on: !on}), // state updater function
      () => {
        this.props.onToggle(this.state.on)
      },
    )
  }

  // https://www.freecodecamp.org/news/functional-setstate-is-the-future-of-react-374f30401b6b/
  /*
  so...setState also accepts a function...
  the function accepts the PREVIOUS state and CURRENT props of the component which it uses to calculate and return the next state.
  i.e.
  this.setState(function (state, props) { return {  score: state.score - 1 }});
  */
  //
  // 💰 this.setState(newState, callback)
  //
  // The `callback` should be where you call `this.props.onToggle(this.state.on)`
  //
  // 💯 Use a state updater function for `newState` to avoid issues with batching
  render() {
    const {on} = this.state
    // 🐨 here you'll want to return the switch with the `on` and `onClick` props
    return <Switch on={on} onClick={this.handleOnClick} />
  }
}

// TLDR: Mounting <Toggle/> mounts <Switch /> with state (on) and action handler (handleOnClick)

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return <Toggle onToggle={onToggle} />
}
Usage.title = 'Build Toggle'

export {Toggle, Usage as default}
