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

import AnimatedValue from './AnimatedValue';
import AnimatedWithListenersAndChildren from './AnimatedWithListenersAndChildren';

import type { ListenerCallback } from './AnimatedWithListenersAndChildren';

export default class AnimatedAddition extends AnimatedWithListenersAndChildren {
  _a: AnimatedValue;
  _b: AnimatedValue;
  _aListener: string;
  _bListener: string;

  constructor(a: AnimatedValue | number, b: AnimatedValue | number) {
    super();

    this._a = typeof a === 'number' ? new AnimatedValue(a) : a;
    this._b = typeof b === 'number' ? new AnimatedValue(b) : b;
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

  __getValue(): number {
    return this._a.__getValue() + this._b.__getValue();
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
