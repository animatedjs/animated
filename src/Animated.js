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

export interface IAnimated {
  __attach(): void;
  __detach(): void;
  __getValue(): any;
  __getAnimatedValue(): any;
}

export interface IAnimatedWithChildren extends IAnimated {
  __addChild(child: IAnimated): void;
  __removeChild(child: IAnimated): void;
  __getChildren(): Array<IAnimated>;
}