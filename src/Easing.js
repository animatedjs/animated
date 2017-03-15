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
import bezier from './bezier';

type Callback = (t: number) => number;

const {PI, pow, cos, sqrt} = Math;
const ease = bezier(0.42, 0, 1, 1);

/**
 * This class implements common easing functions. The math is pretty obscure,
 * but this cool website has nice visual illustrations of what they represent:
 * http://xaedes.de/dev/transitions/
 */
export default class Easing {
  static step0(n: number): number {
    return n > 0 ? 1 : 0;
  }

  static step1(n: number): number {
    return n >= 1 ? 1 : 0;
  }

  static linear(t: number): number {
    return t;
  }

  static ease(t: number): number {
    return ease(t);
  }

  static quad(t: number): number {
    return t * t;
  }

  static cubic(t: number): number {
    return t * t * t;
  }

  static poly(n: number): Callback {
    return t => pow(t, n);
  }

  static sin(t: number): number {
    return 1 - cos(t * PI / 2);
  }

  static circle(t: number): number {
    return 1 - sqrt(1 - t * t);
  }

  static exp(t: number): number {
    return pow(2, 10 * (t - 1));
  }

  /**
   * A simple elastic interaction, similar to a spring.  Default bounciness
   * is 1, which overshoots a little bit once.  0 bounciness doesn't overshoot
   * at all, and bounciness of N > 1 will overshoot about N times.
   *
   * Wolfram Plots:
   *
   *   http://tiny.cc/elastic_b_1 (default bounciness = 1)
   *   http://tiny.cc/elastic_b_3 (bounciness = 3)
   */
  static elastic(bounciness: number = 1): Callback {
    const p = bounciness * PI;

    return t => 1 - pow(cos(t * PI / 2), 3) * cos(t * p);
  }

  static back(s: number = 1.70158): Callback {
    return (t) => t * t * ((s + 1) * t - s);
  }

  static bounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    }

    if (t < 2 / 2.75) {
      t -= 1.5 / 2.75;
      return 7.5625 * t * t + 0.75;
    }

    if (t < 2.5 / 2.75) {
      t -= 2.25 / 2.75;
      return 7.5625 * t * t + 0.9375;
    }

    t -= 2.625 / 2.75;
    return 7.5625 * t * t + 0.984375;
  }

  static bezier(x1: number,y1: number,x2: number,y2: number): Callback {
    return bezier(x1, y1, x2, y2);
  }

  static in(easing: Callback): Callback {
    return easing;
  }

  /**
   * Runs an easing function backwards.
   */
  static out(easing: Callback): Callback {
    return t => 1 - easing(1 - t);
  }

  /**
   * Makes any easing function symmetrical.
   */
  static inOut(easing: Callback,): Callback {
    return t => {
      if (t < 0.5) {
        return easing(t * 2) / 2;
      }

      return 1 - easing((1 - t) * 2) / 2;
    };
  }
}
