# Animated

Declarative Animations Library for React and React Native

See the [interactive docs](http://animatedjs.github.io/interactive-docs/).


## Goal

The goal of this repo is to provide an implementation of the Animated library
that is currently provided by React Native that can also be used by React in
a web context. At some point, React Native will itself depend on this library.

Additionally, it would be ideal if this library would be compatible with future
potential "targets" of React where animation makes sense.


## Usage (Still Theoretical)

Right now the main export of this library is essentially just what is in the
`Animated` namespace in React Native, minus the `View`, `Image`, and `Text`
namespace. Additionally, it includes an `inject` namespace (explained below).

Ideally, I'd like to make it so that `View`, `Image`, and `Text` are exported,
and just do the "right thing" depending on whether or not they are being used
in the context of React Native or React Web.  I'm not quite sure how we can do
this yet without declaring dependencies on react native. Perhaps the platform
specific file extensions can be used for this?


### Injectables

There are several parts of this library that need to have slightly different
implementations for react-dom than for react-native. At the moment, I've just
made these things "injectable" so that this library can stay dependent on only
react.

Some of these I am implementing as "injectable", even though right now it would
technically work for both platforms. This doesn't hurt anything, and attempts to
make this library more compatible with future "targets" for react.

The injectable modules are available off of the `Animated.inject` namespace,
and include:

- `ApplyAnimatedValues`
- `FlattenStyle`
- `InteractionManager`
- `RequestAnimationFrame`
- `CancelAnimationFrame`

Each of these modules can be injected by passing in the implementation. For
example, a naive `FlattenStyle` could be passed in as:

```js
Animated.inject.FlattenStyle(
  styles => Array.isArray(styles)
    ? Object.assign.apply(null, styles)
    : styles
);
```

## Sample Code
Below are simple examples for using animated in React.

```js
import React from "react";
import ReactDOM from "react-dom";
import Animated from "animated/lib/targets/react-dom";

class App extends React.Component {
  state = { anim: new Animated.Value(0) };
  click = () => {
    Animated.timing(this.state.anim, { 
      toValue: 100, 
      duration: 500 
    }).start();
  };

  render() {
    return (
      <div className="App">
        <Animated.div
          className="box"
          style={{ left: this.state.anim }}
          onClick={this.click}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

```
The above code will move the `div` element with the class of `box` by `100px` when clicked.

```js
import React from "react";
import ReactDOM from "react-dom";
import Animated from "animated/lib/targets/react-dom";

class App extends React.Component {
  state = { anim: new Animated.Value(1) };
  handleMouseDown = () =>
    Animated.timing(this.state.anim, { toValue: 0.5 }).start();
  handleMouseUp = () =>
    Animated.timing(this.state.anim, { toValue: 1 }).start();

  render() {
    return (
      <div className="App">
        <Animated.div
          className="box"
          style={{ transform: [{ scale: this.state.anim }] }}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

```
The above code will scale the `div` element with the class of `box` by in and then out when pressed.
