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

import Animation, { IAnimation } from './Animation';
import CancelAnimationFrame from './injectable/CancelAnimationFrame';
import RequestAnimationFrame from './injectable/RequestAnimationFrame';

import type { EndCallback, UpdateCallback, AnimationConfig } from './Animation';

type DecayAnimationConfigSingle = AnimationConfig & {
  velocity: number;
  deceleration?: number;
};

class DecayAnimation extends Animation {
  _velocity: number;
  _onUpdate: UpdateCallback;
  _startTime: number;
  _fromValue: number;
  _lastValue: number;
  _deceleration: number;
  _animationFrame: any;

  constructor({velocity, deceleration = 0.998, isInteraction = true}: DecayAnimationConfigSingle) {
    super();

    this._velocity = velocity;
    this._deceleration = deceleration;
    this.__isInteraction = isInteraction;
  }

  start(fromValue: number, onUpdate: UpdateCallback, onEnd: ?EndCallback): void {
    this.__active = true;
    this.__onEnd = onEnd;
    this._onUpdate = onUpdate;
    this._fromValue = fromValue;
    this._startTime = Date.now();
    this._lastValue = fromValue;
    this._animationFrame = RequestAnimationFrame.current(this.onUpdate.bind(this));
  }

  onUpdate(): void {
    const now = Date.now();

    const value = this._fromValue +
      (this._velocity / (1 - this._deceleration)) *
      (1 - Math.exp(-(1 - this._deceleration) * (now - this._startTime)));

    this._onUpdate(value);

    if (Math.abs(this._lastValue - value) < 0.1) {
      this.__debouncedOnEnd({finished: true});

      return;
    }

    this._lastValue = value;

    if (this.__active) {
      this._animationFrame = RequestAnimationFrame.current(this.onUpdate.bind(this));
    }
  }

  stop(): void {
    this.__active = false;

    CancelAnimationFrame.current(this._animationFrame);
    this.__debouncedOnEnd({finished: false});
  }
}

module.exports = DecayAnimation;
