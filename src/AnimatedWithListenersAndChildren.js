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
import Interpolation from './Interpolation';
import AnimatedWithChildren from './AnimatedWithChildren';
import AnimatedInterpolation from './AnimatedInterpolation';

import type { InterpolationConfigType } from './Interpolation';

export type CallbackParam = {value: number};
export type ListenerCallback = (state: CallbackParam) => void;

export default class AnimatedWithListenersAndChildren extends AnimatedWithChildren {
  _listeners: { [key: string]: ListenerCallback };

  constructor() {
    super();

    this._listeners = {};
  }

  /**
   * Adds an asynchronous listener to the value so you can observe updates from
   * animations.  This is useful because there is no way to
   * synchronously read the value because it might be driven natively.
   */
  addListener(callback: ListenerCallback) { 
    const id = guid();

    this._listeners[id] = callback;

    return id;
  }

  removeListener(id: string): void {
    delete this._listeners[id];
  }

  /**
   * Interpolates the value before updating the property, e.g. mapping 0-1 to
   * 0-10.
   */
  interpolate(config: InterpolationConfigType): AnimatedInterpolation {
    return new AnimatedInterpolation(this, Interpolation.create(config));
  }

  __handler(): void {
    const listeners = this._listeners;

    for (const key in listeners) {
      if (listeners.hasOwnProperty(key)) {
        listeners[key]({ value: this.__getValue() });
      }
    }
  }
}