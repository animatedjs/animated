/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
'use strict';

// Note(vjeux): this would be better as an interface but flow doesn't
// support them yet
class Animated {
  __attach(): void {}
  __detach(): void {}
  __getValue(): any {}
  __getAnimatedValue(): any { return this.__getValue(); }
  __addChild(child: Animated) {}
  __removeChild(child: Animated) {}
  __getChildren(): Array<Animated> { return []; }
}

module.exports = Animated;
