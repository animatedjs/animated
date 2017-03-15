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

import guid from './guid';
import Interpolation from './Interpolation';
import AnimatedWithListenersAndChildren from './AnimatedWithListenersAndChildren';

import type { ListenerCallback } from './AnimatedWithListenersAndChildren';
import type { InterpolationType, InterpolationConfigType } from './Interpolation';

export default class AnimatedInterpolation extends AnimatedWithListenersAndChildren {
  _parent: AnimatedWithListenersAndChildren;
  _interpolation: InterpolationType;
  _parentListener: string;

  constructor(parent: AnimatedWithListenersAndChildren, interpolation: InterpolationType) {
    super();

    this._parent = parent;
    this._interpolation = interpolation;
  }

  addListener(callback: ListenerCallback): string {
    if (!this._parentListener) {
      this._parentListener = this._parent.addListener(this.__handler.bind(this));
    }

    return super.addListener(callback);
  }

  __getValue(): number | string {
    const parentValue: number = this._parent.__getValue();

    invariant(typeof parentValue === 'number', 'Cannot interpolate an input which is not a number.');

    return this._interpolation(parentValue);
  }

  __attach(): void {
    this._parent.__addChild(this);
  }

  __detach(): void {
    this._parent.__removeChild(this);

    this._parent.removeListener(this._parentListener);
    this._parentListener = '';
  }
}