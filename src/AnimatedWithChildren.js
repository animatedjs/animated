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

import { IAnimated, IAnimatedWithChildren } from './Animated';

export default class AnimatedWithChildren implements IAnimatedWithChildren {
  _children: Array<IAnimated>;

  constructor() {
    this._children = [];
  }

  __attach() {}

  __detach() {}

  __getValue(): any {} 

  __getAnimatedValue() { return this.__getValue(); } 

  __addChild(child: IAnimated): void {
    const children = this.__getChildren();

    if (children.length === 0) {
      this.__attach();
    }

    children.push(child);
  }

  __removeChild(child: IAnimated): void {
    const children = this.__getChildren();
    const index = children.indexOf(child);

    if (index === -1) {
      console.warn('Trying to remove a child that doesn\'t exist');
      return;
    }

    children.splice(index, 1);
    
    if (children.length === 0) {
      this.__detach();
    }
  }

  __getChildren(): Array<IAnimated> {
    return this._children;
  }
}