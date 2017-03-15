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

import Easing from './Easing';
import Animation from './Animation';
import AnimatedValue from './AnimatedValue';
import CancelAnimationFrame from './injectable/CancelAnimationFrame';
import RequestAnimationFrame from './injectable/RequestAnimationFrame';

import type { EndCallback, AnimationConfig, UpdateCallback } from './Animation';

type TimingAnimationConfigSingle = AnimationConfig & {
  toValue: number | AnimatedValue;
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
};

const easeInOut = Easing.inOut(Easing.ease);

export default class TimingAnimation extends Animation {
  _delay: number;
  _easing: (value: number) => number;
  _toValue: any;
  _timeout: any;
  _duration: number;
  _onUpdate: (value: number) => void;
  _fromValue: number;
  _startTime: number;
  _animationFrame: any;

  constructor({
    delay = 0,
    easing = easeInOut,
    toValue,
    duration = 500,
    isInteraction = true,
  }: TimingAnimationConfigSingle) {
    super();

    this._delay = delay;
    this._easing = easing;
    this._toValue = toValue;
    this._duration = duration;
    this.__isInteraction = isInteraction;
  }

  start(
    fromValue: number,
    onUpdate: UpdateCallback,
    onEnd: ?EndCallback,
  ): void {
    this.__active = true;
    this._fromValue = fromValue;
    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;

    const start = () => {
      if (this._duration === 0) {
        this._onUpdate(this._toValue);
        this.__debouncedOnEnd({finished: true});
      } else {
        this._startTime = Date.now();
        this._animationFrame = RequestAnimationFrame.current(this.onUpdate.bind(this));
      }
    };

    if (this._delay) {
      this._timeout = setTimeout(start, this._delay);
    } else {
      start();
    }
  }

  onUpdate(): void {
    const now = Date.now();

    if (now >= this._startTime + this._duration) {
      if (this._duration === 0) {
        this._onUpdate(this._toValue);
      } else {
        this._onUpdate(this._fromValue + this._easing(1) * (this._toValue - this._fromValue));
      }

      this.__debouncedOnEnd({finished: true});
      return;
    }

    this._onUpdate(
      this._fromValue +
        this._easing((now - this._startTime) / this._duration) *
        (this._toValue - this._fromValue)
    );

    if (this.__active) {
      this._animationFrame = RequestAnimationFrame.current(this.onUpdate.bind(this));
    }
  }

  stop(): void {
    this.__active = false;

    clearTimeout(this._timeout);
    CancelAnimationFrame.current(this._animationFrame);
    this.__debouncedOnEnd({finished: false});
  }
}
