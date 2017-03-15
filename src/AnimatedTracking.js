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

import { IAnimated, IAnimatedWithChildren } from './Animated';
import AnimatedValue from './AnimatedValue';

import type { EndCallback } from './Animation';

export default class AnimatedTracking implements IAnimated {
  _value: AnimatedValue;
  _parent: IAnimatedWithChildren;
  _callback: ?EndCallback;
  _animationClass: any;
  _animationConfig: Object;

  constructor(
    value: AnimatedValue,
    parent: IAnimatedWithChildren,
    animationClass: any,
    animationConfig: Object,
    callback?: ?EndCallback,
  ) {
    this._value = value;
    this._parent = parent;
    this._animationClass = animationClass;
    this._animationConfig = animationConfig;
    this._callback = callback;
    
    this.__attach();
  }

  __getValue(): Object {
    return this._parent.__getValue();
  }

  __getAnimatedValue(): Object {
    return this._parent.__getAnimatedValue();
  }

  __attach(): void {
    this._parent.__addChild(this);
  }

  __detach(): void {
    this._parent.__removeChild(this);
  }

  update(): void {
    this._value.animate(new this._animationClass({
      ...this._animationConfig,
      toValue: this._animationConfig.toValue.__getValue(),
    }), this._callback);
  }
}
