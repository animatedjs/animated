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

import guid from './guid';
import AnimatedValue from './AnimatedValue';
import AnimatedWithChildren from './AnimatedWithChildren';

import { IAnimated } from './Animated';

type Value = number | AnimatedValue;
type ValueXYAsNumbers = {x: number; y: number;};
type ValueXYListenerCallback = (value: {x: number; y: number;}) => void;

/**
 * 2D Value for driving 2D animations, such as pan gestures.  Almost identical
 * API to normal `Animated.Value`, but multiplexed.  Contains two regular
 * `Animated.Value`s under the hood.  Example:
 *
 *```javascript
 *  class DraggableView extends React.Component {
 *    constructor(props) {
 *      super(props);
 *      this.state = {
 *        pan: new Animated.ValueXY(), // inits to zero
 *      };
 *      this.state.panResponder = PanResponder.create({
 *        onStartShouldSetPanResponder: () => true,
 *        onPanResponderMove: Animated.event([null, {
 *          dx: this.state.pan.x, // x,y are Animated.Value
 *          dy: this.state.pan.y,
 *        }]),
 *        onPanResponderRelease: () => {
 *          Animated.spring(
 *            this.state.pan,         // Auto-multiplexed
 *            {toValue: {x: 0, y: 0}} // Back to zero
 *          ).start();
 *        },
 *      });
 *    }
 *    render() {
 *      return (
 *        <Animated.View
 *          {...this.state.panResponder.panHandlers}
 *          style={this.state.pan.getLayout()}>
 *          {this.props.children}
 *        </Animated.View>
 *      );
 *    }
 *  }
 *```
 */
export default class AnimatedValueXY extends AnimatedWithChildren {
  x: AnimatedValue;
  y: AnimatedValue;

  _listeners: {[key: string]: {x: string; y: string}}; 

  constructor({x, y}: {x: Value, y: Value}) {
    super();

    if (typeof x === 'number' && typeof y === 'number') {
      this.x = new AnimatedValue(x);
      this.y = new AnimatedValue(y);
    } else {
      invariant(
        x instanceof AnimatedValue && y instanceof AnimatedValue,
        'AnimatedValueXY must be initalized with an object of numbers or AnimatedValues.'
      );
      this.x = x;
      this.y = y;
    }

    this._listeners = {};
  }

  setValue({x, y}: ValueXYAsNumbers): void {
    this.x.setValue(x);
    this.y.setValue(y);
  }

  setOffset({x, y}: ValueXYAsNumbers): void {
    this.x.setOffset(x);
    this.y.setOffset(y);
  }

  flattenOffset(): void {
    this.x.flattenOffset();
    this.y.flattenOffset();
  }

  __getValue(): ValueXYAsNumbers {
    return {
      x: this.x.__getValue(),
      y: this.y.__getValue(),
    };
  }

  stopAnimation(callback?: ?() => number): void {
    this.x.stopAnimation();
    this.y.stopAnimation();

    if (callback) {
      callback(this.__getValue());
    }
  }

  addListener(callback: ValueXYListenerCallback): string {
    const id = guid();
    const jointCallback = () => callback(this.__getValue());

    this._listeners[id] = {
      x: this.x.addListener(jointCallback),
      y: this.y.addListener(jointCallback),
    };

    return id;
  }

  removeListener(id: string): void {
    this.x.removeListener(this._listeners[id].x);
    this.y.removeListener(this._listeners[id].y);

    delete this._listeners[id];
  }

  /**
   * Converts `{x, y}` into `{left, top}` for use in style, e.g.
   *
   *```javascript
   *  style={this.state.anim.getLayout()}
   *```
   */
  getLayout(): {[key: string]: AnimatedValue} {
    return {
      left: this.x,
      top: this.y,
    };
  }

  /**
   * Converts `{x, y}` into a useable translation transform, e.g.
   *
   *```javascript
   *  style={{
   *    transform: this.state.anim.getTranslateTransform()
   *  }}
   *```
   */
  getTranslateTransform(): Array<{[key: string]: AnimatedValue}> {
    return [
      {translateX: this.x},
      {translateY: this.y}
    ];
  }
}

