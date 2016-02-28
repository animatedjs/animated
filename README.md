# Animated
Declarative Animations Library for React and React Native

See the [interactive docs](http://animatedjs.github.io/interactive-docs/).


## Usage (Still Theoretical)


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
