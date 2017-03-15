/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import invariant from 'invariant';

import isAnimated from './isAnimated';
import AnimatedProps from './AnimatedProps';
import AnimatedValue from './AnimatedValue';
import AnimatedModulo from './AnimatedModulo';
import AnimatedValueXY from './AnimatedValueXY';
import AnimatedAddition from './AnimatedAddition';
import AnimatedTemplate from './AnimatedTemplate';
import AnimatedTracking from './AnimatedTracking';
import AnimatedWithChildren from './AnimatedWithChildren';
import AnimatedMultiplication from './AnimatedMultiplication';

import Animation from './Animation';
import DecayAnimation from './DecayAnimation';
import SpringAnimation from './SpringAnimation';
import TimingAnimation from './TimingAnimation';

import createAnimatedComponent from './createAnimatedComponent';

import FlattenStyle from '././injectable/FlattenStyle';
import InteractionManager from '././injectable/InteractionManager';
import ApplyAnimatedValues from '././injectable/ApplyAnimatedValues';
import CancelAnimationFrame from '././injectable/CancelAnimationFrame';
import RequestAnimationFrame from '././injectable/RequestAnimationFrame';

import type { InterpolationConfigType } from './Interpolation';
import type { AnimationConfig, EndResult, EndCallback } from './Animation';

type AValueOrAValueXY = AnimatedValue | AnimatedValueXY;

type TimingAnimationConfig =  AnimationConfig & {
  toValue: number | AnimatedValue | {x: number, y: number} | AnimatedValueXY;
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
};

type DecayAnimationConfig = AnimationConfig & {
  velocity: number | {x: number, y: number};
  deceleration?: number;
};

type SpringAnimationConfig = AnimationConfig & {
  toValue: number | AnimatedValue | {x: number, y: number} | AnimatedValueXY;
  overshootClamping?: bool;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number | {x: number, y: number};
  bounciness?: number;
  speed?: number;
  tension?: number;
  friction?: number;
};

type CompositeAnimation = {
  start: (callback?: ?EndCallback) => void;
  stop: () => void;
};

type MaybeVectorAnim = (value: AnimatedValue, config: Object) => CompositeAnimation;

type ParallelConfig = {
  stopTogether?: bool; // If one is stopped, stop all.  default: true
}

type Mapping = {[key: string]: Mapping} | AnimatedValue;

type EventConfig = {listener?: ?Function};

export function maybeVectorAnim(value: AValueOrAValueXY, config: Object, anim: MaybeVectorAnim): ?CompositeAnimation {
  if (value instanceof AnimatedValueXY) {
    const configX = {...config};
    const configY = {...config};

    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        const {x, y} = config[key];

        if (x !== undefined && y !== undefined) {
          configX[key] = x;
          configY[key] = y;
        }
      }
    }

    const aX = anim((value: AnimatedValueXY).x, configX);
    const aY = anim((value: AnimatedValueXY).y, configY);

    // We use `stopTogether: false` here because otherwise tracking will break
    // because the second animation will get stopped before it can update.
    return parallel([aX, aY], {stopTogether: false});
  }

  return null;
};

export function spring(value: AValueOrAValueXY, config: SpringAnimationConfig): CompositeAnimation {
  const vectorAnim = maybeVectorAnim(value, config, spring);

  if (vectorAnim) {
    return vectorAnim;
  }

  return {
    start(callback?: ?EndCallback) {
      const singleValue: any = value;
      const singleConfig: any = config;

      singleValue.stopTracking();

      if (config.toValue instanceof AnimatedWithChildren) {
        singleValue.track(new AnimatedTracking(
          singleValue,
          config.toValue,
          SpringAnimation,
          singleConfig,
          callback
        ));
      } else {
        singleValue.animate(new SpringAnimation(singleConfig), callback);
      }
    },

    stop() {
      value.stopAnimation();
    },
  };
};

export function timing(value: AValueOrAValueXY, config: TimingAnimationConfig): CompositeAnimation {
  const vectorAnim = maybeVectorAnim(value, config, spring);

  if (vectorAnim) {
    return vectorAnim;
  }

  return {
    start(callback?: ?EndCallback) {
      const singleValue: any = value;
      const singleConfig: any = config;

      singleValue.stopTracking();

      if (config.toValue instanceof AnimatedWithChildren) {
        singleValue.track(new AnimatedTracking(
          singleValue,
          config.toValue,
          TimingAnimation,
          singleConfig,
          callback
        ));
      } else {
        singleValue.animate(new TimingAnimation(singleConfig), callback);
      }
    },

    stop() {
      value.stopAnimation();
    },
  };
};

export function decay(value: AValueOrAValueXY, config: DecayAnimationConfig): CompositeAnimation {
  const vectorAnim = maybeVectorAnim(value, config, spring);

  if (vectorAnim) {
    return vectorAnim;
  }

  return {
    start(callback?: ?EndCallback) {
      const singleValue: any = value;
      const singleConfig: any = config;

      singleValue.stopTracking();
      singleValue.animate(new DecayAnimation(singleConfig), callback);
    },

    stop() {
      value.stopAnimation();
    },
  };
};

export function sequence(animations: Array<CompositeAnimation>): CompositeAnimation {
  let current = 0;

  return {
    start: (callback?: ?EndCallback): void => {
      function onComplete(result) {
        if (!result.finished) {
          callback && callback(result);
          return;
        }

        current++;

        if (current === animations.length) {
          callback && callback(result);
          return;
        }

        animations[current].start(onComplete);
      };

      if (animations.length === 0) {
        callback && callback({finished: true});
      } else {
        animations[current].start(onComplete);
      }
    },

    stop: function(): void {
      if (current < animations.length) {
        animations[current].stop();
      }
    }
  };
};

export function parallel(animations: Array<CompositeAnimation>, config?: ?ParallelConfig): CompositeAnimation {
  let doneCount = 0;
  // Make sure we only call stop() at most once for each animation
  const hasEnded = {};
  const stopTogether = !(config && config.stopTogether === false);

  return {
    start(callback?: ?EndCallback) {
      if (doneCount === animations.length) {
        callback && callback({finished: true});
        return;
      }

      animations.forEach((animation, idx) => {
        const cb = endResult => {
          hasEnded[idx] = true;
          doneCount++;

          if (doneCount === animations.length) {
            doneCount = 0;
            callback && callback(endResult);
            return;
          }

          if (!endResult.finished && stopTogether) {
            this.stop();
          }
        };

        if (!animation) {
          cb({finished: true});
        } else {
          animation.start(cb);
        }
      });
    },

    stop() {
      animations.forEach((animation, idx) => {
        !hasEnded[idx] && animation.stop();
        hasEnded[idx] = true;
      });
    }
  };
};

export function delay(time: number): CompositeAnimation {
  // Would be nice to make a specialized implementation
  return timing(new AnimatedValue(0), {toValue: 0, delay: time, duration: 0});
};

export function stagger(time: number, animations: Array<CompositeAnimation>): CompositeAnimation {
  return parallel(animations.map((animation, i) => sequence([delay(time * i), animation])));
};

export function event(argMapping: Array<?Mapping>, config?: ?EventConfig): () => void {
  return (...args) => {
    function traverse(recMapping, recEvt, key) {
      if (typeof recEvt === 'number') {
        invariant(
          recMapping instanceof AnimatedValue,
          `Bad mapping of type ${typeof recMapping} for key ${key}, event value must map to AnimatedValue`
        );

        recMapping.setValue(recEvt);
        return;
      }

      invariant(
        typeof recMapping === 'object',
        `Bad mapping of type ${typeof recMapping} for key ${key}`
      );

      invariant(
        typeof recEvt === 'object',
        `Bad event of type ${typeof recEvt} for key ${key}`
      );

      for (const key in recMapping) {
        if (recMapping.hasOwnProperty(key)) {
          traverse(recMapping[key], recEvt[key], key);
        }
      }
    }
    
    argMapping.forEach((mapping, idx) => traverse(mapping, args[idx], `arg${idx}`));
    
    if (config && config.listener) {
      config.listener.apply(null, args);
    }
  };
};

export function add(a: AnimatedValue, b: AnimatedValue): AnimatedAddition {
  return new AnimatedAddition(a, b);
}

export function multiply(a: AnimatedValue, b: AnimatedValue): AnimatedMultiplication {
  return new AnimatedMultiplication(a, b);
}

export function modulo(a: AnimatedValue, modulus: number): AnimatedModulo {
  return new AnimatedModulo(a, modulus);
}

export function template(strings: Array<string>, ...values: Array<any>) {
  return new AnimatedTemplate(strings, values);
}

export const inject = {
  FlattenStyle: FlattenStyle.inject,
  InteractionManager: InteractionManager.inject,
  ApplyAnimatedValues: ApplyAnimatedValues.inject,
  CancelAnimationFrame: CancelAnimationFrame.inject,
  RequestAnimationFrame: RequestAnimationFrame.inject,
};

/**
 * Animations are an important part of modern UX, and the `Animated`
 * library is designed to make them fluid, powerful, and easy to build and
 * maintain.
 *
 * The simplest workflow is to create an `Animated.Value`, hook it up to one or
 * more style attributes of an animated component, and then drive updates either
 * via animations, such as `Animated.timing`, or by hooking into gestures like
 * panning or scrolling via `Animated.event`.  `Animated.Value` can also bind to
 * props other than style, and can be interpolated as well.  Here is a basic
 * example of a container view that will fade in when it's mounted:
 *
 *```javascript
 *  class FadeInView extends React.Component {
 *    constructor(props) {
 *      super(props);
 *      this.state = {
 *        fadeAnim: new Animated.Value(0), // init opacity 0
 *      };
 *    }
 *    componentDidMount() {
 *      Animated.timing(          // Uses easing functions
 *        this.state.fadeAnim,    // The value to drive
 *        {toValue: 1},           // Configuration
 *      ).start();                // Don't forget start!
 *    }
 *    render() {
 *      return (
 *        <Animated.View          // Special animatable View
 *          style={{opacity: this.state.fadeAnim}}> // Binds
 *          {this.props.children}
 *        </Animated.View>
 *      );
 *    }
 *  }
 *```
 *
 * Note that only animatable components can be animated.  `View`, `Text`, and
 * `Image` are already provided, and you can create custom ones with
 * `createAnimatedComponent`.  These special components do the magic of binding
 * the animated values to the properties, and do targeted native updates to
 * avoid the cost of the react render and reconciliation process on every frame.
 * They also handle cleanup on unmount so they are safe by default.
 *
 * Animations are heavily configurable.  Custom and pre-defined easing
 * functions, delays, durations, decay factors, spring constants, and more can
 * all be tweaked depending on the type of animation.
 *
 * A single `Animated.Value` can drive any number of properties, and each
 * property can be run through an interpolation first.  An interpolation maps
 * input ranges to output ranges, typically using a linear interpolation but
 * also supports easing functions.  By default, it will extrapolate the curve
 * beyond the ranges given, but you can also have it clamp the output value.
 *
 * For example, you may want to think about your `Animated.Value` as going from
 * 0 to 1, but animate the position from 150px to 0px and the opacity from 0 to
 * 1. This can easily be done by modifying `style` in the example above like so:
 *
 *```javascript
 *  style={{
 *    opacity: this.state.fadeAnim, // Binds directly
 *    transform: [{
 *      translateY: this.state.fadeAnim.interpolate({
 *        inputRange: [0, 1],
 *        outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
 *      }),
 *    }],
 *  }}>
 *```
 *
 * Animations can also be combined in complex ways using composition functions
 * such as `sequence` and `parallel`, and can also be chained together simply
 * by setting the `toValue` of one animation to be another `Animated.Value`.
 *
 * `Animated.ValueXY` is handy for 2D animations, like panning, and there are
 * other helpful additions like `setOffset` and `getLayout` to aid with typical
 * interaction patterns, like drag-and-drop.
 *
 * You can see more example usage in `AnimationExample.js`, the Gratuitous
 * Animation App, and [Animations documentation guide](docs/animations.html).
 *
 * Note that `Animated` is designed to be fully serializable so that animations
 * can be run in a high performance way, independent of the normal JavaScript
 * event loop. This does influence the API, so keep that in mind when it seems a
 * little trickier to do something compared to a fully synchronous system.
 * Checkout `Animated.Value.addListener` as a way to work around some of these
 * limitations, but use it sparingly since it might have performance
 * implications in the future.
 */
export default {
  /**
   * Standard value class for driving animations.  Typically initialized with
   * `new Animated.Value(0);`
   */
  Value: AnimatedValue,
  /**
   * 2D value class for driving 2D animations, such as pan gestures.
   */
  ValueXY: AnimatedValueXY,

  /**
   * Animates a value from an initial velocity to zero based on a decay
   * coefficient.
   */
  decay,
  /**
   * Animates a value along a timed easing curve.  The `Easing` module has tons
   * of pre-defined curves, or you can use your own function.
   */
  timing,
  /**
   * Spring animation based on Rebound and Origami.  Tracks velocity state to
   * create fluid motions as the `toValue` updates, and can be chained together.
   */
  spring,

  /**
   * Creates a new Animated value composed from two Animated values added
   * together.
   */
  add,
  /**
   * Creates a new Animated value composed from two Animated values multiplied
   * together.
   */
  multiply,

  /**
   * Creates a new Animated value that is the (non-negative) modulo of the
   * provided Animated value
   */
  modulo,

  /**
   * Creates a new Animated value that is the specified string, with each
   * substitution expression being separately animated and interpolated.
   */
  template,

  /**
   * Starts an animation after the given delay.
   */
  delay,
  /**
   * Starts an array of animations in order, waiting for each to complete
   * before starting the next.  If the current running animation is stopped, no
   * following animations will be started.
   */
  sequence,
  /**
   * Starts an array of animations all at the same time.  By default, if one
   * of the animations is stopped, they will all be stopped.  You can override
   * this with the `stopTogether` flag.
   */
  parallel,
  /**
   * Array of animations may run in parallel (overlap), but are started in
   * sequence with successive delays.  Nice for doing trailing effects.
   */
  stagger,

  /**
   *  Takes an array of mappings and extracts values from each arg accordingly,
   *  then calls `setValue` on the mapped outputs.  e.g.
   *
   *```javascript
   *  onScroll={Animated.event(
   *    [{nativeEvent: {contentOffset: {x: this._scrollX}}}]
   *    {listener},          // Optional async listener
   *  )
   *  ...
   *  onPanResponderMove: Animated.event([
   *    null,                // raw event arg ignored
   *    {dx: this._panX},    // gestureState arg
   *  ]),
   *```
   */
  event,

  /**
   * Existential test to figure out if an object is an instance of the Animated
   * class or not.
   */
  isAnimated,

  /**
   * Make any React component Animatable.  Used to create `Animated.View`, etc.
   */
  createAnimatedComponent,

  inject,

  __PropsOnlyForTests: AnimatedProps,
};
