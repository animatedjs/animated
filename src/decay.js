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

var AnimatedValue = require('./AnimatedValue');
var AnimatedValueXY = require('./AnimatedValueXY');
var DecayAnimation = require('./DecayAnimation');
var maybeVectorAnim = require('./maybeVectorAnim');

import type { CompositeAnimation, EndCallback } from './Animation';

type DecayAnimationConfig = AnimationConfig & {
  velocity: number | {x: number, y: number};
  deceleration?: number;
};

var decay = function(
  value: AnimatedValue | AnimatedValueXY,
  config: DecayAnimationConfig,
): CompositeAnimation {
  return maybeVectorAnim(value, config, decay) || {
    start: function(callback?: ?EndCallback): void {
      var singleValue: any = value;
      var singleConfig: any = config;
      singleValue.stopTracking();
      singleValue.animate(new DecayAnimation(singleConfig), callback);
    },

    stop: function(): void {
      value.stopAnimation();
    },
  };
};

module.exports = decay;
