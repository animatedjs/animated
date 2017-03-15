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

import guid from './guid';
import Animation from './Animation';
import Interpolation from './Interpolation';
import InteractionManager from './injectable/InteractionManager';
import AnimatedInterpolation from './AnimatedInterpolation';
import AnimatedWithListenersAndChildren from './AnimatedWithListenersAndChildren';

import { IAnimated } from './Animated';
import type { InterpolationConfigType } from './Interpolation';
import type { EndResult, EndCallback } from './Animation';

const Set = global.Set || require('./SetPolyfill');

/**
 * Animated works by building a directed acyclic graph of dependencies
 * transparently when you render your Animated components.
 *
 *               new Animated.Value(0)
 *     .interpolate()        .interpolate()    new Animated.Value(1)
 *         opacity               translateY      scale
 *          style                         transform
 *         View#234                         style
 *                                         View#123
 *
 * A) Top Down phase
 * When an Animated.Value is updated, we recursively go down through this
 * graph in order to find leaf nodes: the views that we flag as needing
 * an update.
 *
 * B) Bottom Up phase
 * When a view is flagged as needing an update, we recursively go back up
 * in order to build the new value that it needs. The reason why we need
 * this two-phases process is to deal with composite props such as
 * transform which can receive values from multiple parents.
 */
const findAnimatedStyles = animatedStyles => function find(node) {
  if (typeof node.update === 'function') {
    animatedStyles.add(node);
  } else {
    node.__getChildren().forEach(find);
  }
}

function flush(rootNode: AnimatedValue): void {
  const animatedStyles = new Set();

  findAnimatedStyles(animatedStyles)(rootNode);
  
  animatedStyles.forEach(animatedStyle => animatedStyle.update());
}

/**
 * Standard value for driving animations.  One `Animated.Value` can drive
 * multiple properties in a synchronized fashion, but can only be driven by one
 * mechanism at a time.  Using a new mechanism (e.g. starting a new animation,
 * or calling `setValue`) will stop any previous ones.
 */
export default class AnimatedValue extends AnimatedWithListenersAndChildren {
  _value: number;
  _offset: number;
  _tracking: ?IAnimated;
  _animation: ?Animation;

  constructor(value: number) {
    super();
    
    this._value = value;
    this._offset = 0;
    this._animation = null;
  }

  __detach() {
    this.stopAnimation();
  }

  __getValue(): number {
    return this._value + this._offset;
  }

  /**
   * Directly set the value.  This will stop any animations running on the value
   * and update all the bound properties.
   */
  setValue(value: number): void {
    if (this._animation) {
      this._animation.stop();
      this._animation = null;
    }
    
    this._updateValue(value);
  }

  /**
   * Sets an offset that is applied on top of whatever value is set, whether via
   * `setValue`, an animation, or `Animated.event`.  Useful for compensating
   * things like the start of a pan gesture.
   */
  setOffset(offset: number): void {
    this._offset = offset;
  }

  /**
   * Merges the offset value into the base value and resets the offset to zero.
   * The final output of the value is unchanged.
   */
  flattenOffset(): void {
    this._value += this._offset;
    this._offset = 0;
  }

  removeAllListeners(): void {
    this._listeners = {};
  }

  /**
   * Stops any running animation or tracking.  `callback` is invoked with the
   * final value after stopping the animation, which is useful for updating
   * state to match the animation position with layout.
   */
  stopAnimation(callback?: ?(value: number) => void): void {
    this.stopTracking();

    if (this._animation) {
      this._animation.stop();
      this._animation = null;
    }

    if (callback) {
      callback(this.__getValue());
    }
  }

  /**
   * Typically only used internally, but could be used by a custom Animation
   * class.
   */
  animate(animation: Animation, callback: ?EndCallback): void {
    const previousAnimation = this._animation;
    let handle = null;

    if (animation.__isInteraction) {
      handle = InteractionManager.current.createInteractionHandle();
    }

    if (this._animation) {
      this._animation.stop();
    }

    this._animation = animation;

    animation.start(
      this._value,
      this._updateValue.bind(this),
      this.__onAnimationEnd.bind(this, handle, callback),
      previousAnimation,
    );
  }

  /**
   * Typically only used internally.
   */
  stopTracking(): void {
    if (this._tracking) {
      this._tracking.__detach();
      this._tracking = null;
    }
  }

  /**
   * Typically only used internally.
   */
  track(tracking: IAnimated): void {
    this.stopTracking();

    this._tracking = tracking;
  }

  _updateValue(value: number): void {
    const listeners = this._listeners

    this._value = value;

    flush(this);

    for (const key in listeners) {
      if (listeners.hasOwnProperty(key)) {
        listeners[key]({ value: this.__getValue() });
      }
    }
  }

  __onAnimationEnd(handle: any, callback: ?EndCallback, result: EndResult): void {
    this._animation = null;

    if (handle !== null) {
      InteractionManager.current.clearInteractionHandle(handle);
    }

    if (callback) {
      callback(result);
    }
  };
}
