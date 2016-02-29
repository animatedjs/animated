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
var AnimatedWithChildren = require('./AnimatedWithChildren');
var AnimatedInterpolation = require('./AnimatedInterpolation');
var Interpolation = require('./Interpolation');

import type { InterpolationConfigType } from './Interpolation';

class AnimatedModulo extends AnimatedWithChildren {
  _a: Animated;
  _modulus: number; // TODO(lmr): Make modulus able to be an animated value

  constructor(a: Animated, modulus: number) {
    super();
    this._a = a;
    this._modulus = modulus;
  }

  __getValue(): number {
    return (this._a.__getValue() % this._modulus + this._modulus) % this._modulus;
  }

  interpolate(config: InterpolationConfigType): AnimatedInterpolation {
    return new AnimatedInterpolation(this, Interpolation.create(config));
  }

  __attach(): void {
    this._a.__addChild(this);
  }

  __detach(): void {
    this._a.__removeChild(this);
  }
}

module.exports = AnimatedModulo;
