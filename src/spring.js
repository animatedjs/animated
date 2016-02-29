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
'use strict';

var Animated = require('./Animated');
var maybeVectorAnim = require('./maybeVectorAnim');
var AnimatedValue = require('./AnimatedValue');
var AnimatedValueXY = require('./AnimatedValueXY');
var AnimatedTracking = require('./AnimatedTracking');
var SpringAnimation = require('./SpringAnimation');

import type { CompositeAnimation } from './Animation';

type SpringAnimationConfig = AnimationConfig & {
  toValue: number | AnimatedValue | {x: number, y: number} | AnimatedValueXY;
  overshootClamping?: bool;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number | {x: number, y: number};
  bounciness?: number;
  speed?: number;
  tension?: number;
  friction?: number;
};

var spring = function(
  value: AnimatedValue | AnimatedValueXY,
  config: SpringAnimationConfig,
): CompositeAnimation {
  return maybeVectorAnim(value, config, spring) || {
    start: function(callback?: ?EndCallback): void {
      var singleValue: any = value;
      var singleConfig: any = config;
      singleValue.stopTracking();
      if (config.toValue instanceof Animated) {
        singleValue.track(new AnimatedTracking(
          singleValue,
          config.toValue,
          SpringAnimation,
          singleConfig,
          callback
        ));
      } else {
        singleValue.animate(new SpringAnimation(singleConfig), callback);
      }
    },

    stop: function(): void {
      value.stopAnimation();
    },
  };
};

module.exports = spring;
