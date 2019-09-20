// render props

import React from 'react'
import {Switch} from '../switch'

// const renderSwitch = ({on, toggle}) => {
//   return <Switch on={on} onClick={toggle} />
// }

// we're back to basics here. Rather than compound components,
// let's use a render prop!
class Toggle extends React.Component {
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => {
        this.props.onToggle(this.state.on)
      },
    )

  // a pure function here...
  // meaning you don't need this...
  // meaning it doesn't need to be a class function...
  // meaning it can be a static function
  // or just a const outside of class

  render() {
    // We want to give rendering flexibility, so we'll be making
    // a change to our render prop component here.
    // You'll notice the children prop in the Usage component
    // is a function. 🐨 So you can replace this with a call this.props.children()
    // But you'll need to pass it an object with `on` and `toggle`.
    // return <Switch on={on} onClick={this.toggle} />
    // Why not React.children.map?
    // b/c/ children prop either an array or it will be exactly one..
    // we're explicitly passing a single one...so we're doing this.props.children
    return this.props.children({
      on: this.state.on,
      toggle: this.toggle,
    })
  }
}

// say you don't like the added UI of the Final Product?
// well it's just minor code refactor to revert to original version...
function OriginalToggle(props) {
  return (
    <Toggle {...props}>
      {({on, toggle}) => <Switch on={on} onClick={toggle} />}
    </Toggle>
  )
}

// Render prop: My Take:
// One Component exposes state and actions to the User of the component
// The user of the component is now in full charge of the UI of how to handle the state and its actions
// this version just decouples Switch and and Toggle
// more work for users of Toggle, but more flexibility for them as well.

// this.props.children:
// TLDR: Mounting <Toggle /> now becomes
//<Toggle>
//  {(arguments of this.props.children) => (
//    ...
//  )
//  }
//</Toggle>

// <Toggle> : Hey, I'll be in charge of state
// Toggle Users: and I'll be in charge of rendering it
// if i can create another component that's built on top of this one...

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
// Users are now in charge of how to render the switch and its state and props
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  // return <Toggle onToggle={onToggle} children={renderSwitch} />
  // ^^ this is functionally equivalent to bottom...
  // as children is an implicit prop between opening and closing JSX
  // return <Toggle onToggle={onToggle}>{renderSwitch}</Toggle>

  // return <OriginalToggle onToggle={onToggle} />
  return (
    <Toggle onToggle={onToggle}>
      {({on, toggle}) => (
        <div>
          {on ? 'The button is on' : 'The button is off'}
          <Switch on={on} onClick={toggle} />
          <hr />
          <button aria-label="custom-button" onClick={toggle}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  )
}
Usage.title = 'Render Props'

export {Toggle, Usage as default}
