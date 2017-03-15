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

import Animation from './Animation';
import SpringConfig from './SpringConfig';
import AnimatedValue from './AnimatedValue';
import CancelAnimationFrame from './injectable/CancelAnimationFrame';
import RequestAnimationFrame from './injectable/RequestAnimationFrame';

import type { EndCallback, AnimationConfig, UpdateCallback } from './Animation';

type SpringAnimationConfigSingle = AnimationConfig & {
  toValue: number | AnimatedValue;
  overshootClamping?: bool;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number;
  bounciness?: number;
  speed?: number;
  tension?: number;
  friction?: number;
};

function withDefault<T>(value: ?T, defaultValue: T): T {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  return value;
}

export default class SpringAnimation extends Animation {
  _overshootClamping: bool;
  _restDisplacementThreshold: number;
  _restSpeedThreshold: number;
  _initialVelocity: ?number;
  _lastVelocity: number;
  _startPosition: number;
  _lastPosition: number;
  _fromValue: number;
  _toValue: any;
  _tension: number;
  _friction: number;
  _lastTime: number;
  _onUpdate: (value: number) => void;
  _animationFrame: any;

  constructor(config: SpringAnimationConfigSingle) {
    super();

    this._overshootClamping = withDefault(config.overshootClamping, false);
    this._restDisplacementThreshold = withDefault(config.restDisplacementThreshold, 0.001);
    this._restSpeedThreshold = withDefault(config.restSpeedThreshold, 0.001);
    this._initialVelocity = config.velocity;
    this._lastVelocity = withDefault(config.velocity, 0);
    this._toValue = config.toValue;
    this.__isInteraction = config.isInteraction !== undefined ? config.isInteraction : true;

    const springConfig = this._getSpringConfig(config);

    this._tension = springConfig.tension;
    this._friction = springConfig.friction;
  }

  _getSpringConfig(config: SpringAnimationConfigSingle) {
    if (config.bounciness !== undefined || config.speed !== undefined) {
      invariant(
        config.tension === undefined && config.friction === undefined,
        'You can only define bounciness/speed or tension/friction but not both',
      );

      return SpringConfig.fromBouncinessAndSpeed(
        withDefault(config.bounciness, 8),
        withDefault(config.speed, 12),
      );
    }

    return SpringConfig.fromOrigamiTensionAndFriction(
      withDefault(config.tension, 40),
      withDefault(config.friction, 7),
    );
  }

  start(
    fromValue: number,
    onUpdate: UpdateCallback,
    onEnd: ?EndCallback,
    previousAnimation: ?Animation,
  ): void {
    this.__active = true;
    this._startPosition = fromValue;
    this._lastPosition = this._startPosition;

    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;
    this._lastTime = Date.now();

    if (previousAnimation instanceof SpringAnimation) {
      const internalState = previousAnimation.getInternalState();

      this._lastPosition = internalState.lastPosition;
      this._lastVelocity = internalState.lastVelocity;
      this._lastTime = internalState.lastTime;
    }

    if (this._initialVelocity !== undefined && this._initialVelocity !== null) {
      this._lastVelocity = this._initialVelocity;
    }

    this.onUpdate();
  }

  getInternalState(): Object {
    return {
      lastPosition: this._lastPosition,
      lastVelocity: this._lastVelocity,
      lastTime: this._lastTime,
    };
  }

  onUpdate(): void {
    // If for some reason we lost a lot of frames (e.g. process large payload or
    // stopped in the debugger), we only advance by 4 frames worth of
    // computation and will continue on the next frame. It's better to have it
    // running at faster speed than jumping to the end.
    const MAX_STEPS = 64;
    let now = Date.now();

    if (now > this._lastTime + MAX_STEPS) {
      now = this._lastTime + MAX_STEPS;
    }

    // We are using a fixed time step and a maximum number of iterations.
    // The following post provides a lot of thoughts into how to build this
    // loop: http://gafferongames.com/game-physics/fix-your-timestep/
    const TIMESTEP_MSEC = 1;
    const numSteps = Math.floor((now - this._lastTime) / TIMESTEP_MSEC);

    let position = this._lastPosition;
    let velocity = this._lastVelocity;
    let tempPosition = this._lastPosition;
    let tempVelocity = this._lastVelocity;

    for (let i = 0; i < numSteps; ++i) {
      // Velocity is based on seconds instead of milliseconds
      const step = TIMESTEP_MSEC / 1000;

      // This is using RK4. A good blog post to understand how it works:
      // http://gafferongames.com/game-physics/integration-basics/
      const aVelocity = velocity;
      const aAcceleration = this._tension * (this._toValue - tempPosition) - this._friction * tempVelocity;

      tempPosition = position + aVelocity * step / 2;
      tempVelocity = velocity + aAcceleration * step / 2;

      const bVelocity = tempVelocity;
      const bAcceleration = this._tension * (this._toValue - tempPosition) - this._friction * tempVelocity;

      tempPosition = position + bVelocity * step / 2;
      tempVelocity = velocity + bAcceleration * step / 2;

      const cVelocity = tempVelocity;
      const cAcceleration = this._tension * (this._toValue - tempPosition) - this._friction * tempVelocity;

      tempPosition = position + cVelocity * step / 2;
      tempVelocity = velocity + cAcceleration * step / 2;

      const dVelocity = tempVelocity;
      const dAcceleration = this._tension * (this._toValue - tempPosition) - this._friction * tempVelocity;

      tempPosition = position + cVelocity * step / 2;
      tempVelocity = velocity + cAcceleration * step / 2;

      const dxdt = (aVelocity + 2 * (bVelocity + cVelocity) + dVelocity) / 6;
      const dvdt = (aAcceleration + 2 * (bAcceleration + cAcceleration) + dAcceleration) / 6;

      position += dxdt * step;
      velocity += dvdt * step;
    }

    this._lastTime = now;
    this._lastPosition = position;
    this._lastVelocity = velocity;

    this._onUpdate(position);
    
    if (!this.__active) { // a listener might have stopped us in _onUpdate
      return;
    }

    // Conditions for stopping the spring animation
    let isOvershooting = false;

    if (this._overshootClamping && this._tension !== 0) {
      if (this._startPosition < this._toValue) {
        isOvershooting = position > this._toValue;
      } else {
        isOvershooting = position < this._toValue;
      }
    }

    const isVelocity = Math.abs(velocity) <= this._restSpeedThreshold;
    let isDisplacement = true;

    if (this._tension !== 0) {
      isDisplacement = Math.abs(this._toValue - position) <= this._restDisplacementThreshold;
    }

    if (isOvershooting || (isVelocity && isDisplacement)) {
      if (this._tension !== 0) {
        // Ensure that we end up with a round value
        this._onUpdate(this._toValue);
      }

      this.__debouncedOnEnd({finished: true});
      return;
    }

    this._animationFrame = RequestAnimationFrame.current(this.onUpdate.bind(this));
  }

  stop(): void {
    this.__active = false;

    CancelAnimationFrame.current(this._animationFrame);
    this.__debouncedOnEnd({finished: false});
  }
}
