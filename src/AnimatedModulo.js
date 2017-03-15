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
import AnimatedInterpolation from './AnimatedInterpolation';
import AnimatedWithListenersAndChildren from './AnimatedWithListenersAndChildren';

import type { ListenerCallback } from './AnimatedWithListenersAndChildren';
import type { InterpolationConfigType } from './Interpolation';

export default class AnimatedModulo extends AnimatedWithListenersAndChildren {
  _a: AnimatedWithListenersAndChildren;
  _modulus: number; // TODO(lmr): Make modulus able to be an animated value
  _aListener: string;
  _listeners: { [key: string]: ListenerCallback };

  constructor(a: AnimatedWithListenersAndChildren, modulus: number) {
    super();
    
    this._a = a;
    this._modulus = modulus;
    this._listeners = {};
  }

  __getValue(): number {
    return (this._a.__getValue() % this._modulus + this._modulus) % this._modulus;
  }

  addListener(callback: ListenerCallback): string {
    if (!this._aListener) {
      this._aListener = this._a.addListener(this.__handler.bind(this));
    }

    return super.addListener(callback);
  }

  __attach(): void {
    this._a.__addChild(this);
  }

  __detach(): void {
    this._a.__removeChild(this);
  }
}
