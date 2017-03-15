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

import Interpolation from './Interpolation';
import AnimatedValue from './AnimatedValue';
import AnimatedInterpolation from './AnimatedInterpolation';
import AnimatedWithListenersAndChildren from './AnimatedWithListenersAndChildren';

import type { ListenerCallback } from './AnimatedWithListenersAndChildren';
import type { InterpolationConfigType } from './Interpolation';

export default class AnimatedMultiplication extends AnimatedWithListenersAndChildren {
  _a: AnimatedValue;
  _b: AnimatedValue;
  _aListener: string;
  _bListener: string;
  _listeners: { [key: string]: ListenerCallback };

  constructor(a: AnimatedValue | number, b: AnimatedValue | number) {
    super();

    this._a = typeof a === 'number' ? new AnimatedValue(a) : a;
    this._b = typeof b === 'number' ? new AnimatedValue(b) : b;
  }

  __getValue(): number {
    return this._a.__getValue() * this._b.__getValue();
  }

  addListener(callback: ListenerCallback): string {
    if (!this._aListener && this._a.addListener) {
      this._aListener = this._a.addListener(this.__handler.bind(this));
    }
    if (!this._bListener && this._b.addListener) {
      this._bListener = this._b.addListener(this.__handler.bind(this));
    }
    
    return super.addListener(callback);
  }

  __attach(): void {
    this._a.__addChild(this);
    this._b.__addChild(this);
  }

  __detach(): void {
    this._a.__removeChild(this);
    this._b.__removeChild(this);
  }
}
