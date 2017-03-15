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

import FlattenStyle from './injectable/FlattenStyle';
import AnimatedTransform from './AnimatedTransform';
import AnimatedWithChildren from './AnimatedWithChildren';

export default class AnimatedStyle extends AnimatedWithChildren {
  _style: Object;

  constructor(style: any) {
    super();

    style = FlattenStyle.current(style) || {};

    if (style.transform && !(style.transform instanceof AnimatedWithChildren)) {
      style = {
        ...style, 
        transform: new AnimatedTransform(style.transform) 
      };
    }

    this._style = style;
  }

  __getValue(): Object {
    const style = {};

    this.__forInStyles((value: any, key: string) => {
      if (value instanceof AnimatedWithChildren) {
        style[key] = value.__getValue();
      } else {
        style[key] = value;
      }
    });

    return style;
  }

  __getAnimatedValue(): Object {
    const style = {};

    this.__forInStyles((value: any, key: string) => {
      if (value instanceof AnimatedWithChildren) {
        style[key] = value.__getAnimatedValue();
      }
    });

    return style;
  }

  __attach(): void {
    this.__forInStyles((value: any) => {
      if (value instanceof AnimatedWithChildren) {
        value.__addChild(this);
      }
    });
  }

  __detach(): void {
    this.__forInStyles((value: any) => {
      if (value instanceof AnimatedWithChildren) {
        value.__removeChild(this);
      }
    });
  }

  __forInStyles(callback: (value: any, key: string, _style: Object) => void) {
    const _style = this._style;

    for (const key in _style) {
      if (_style.hasOwnProperty(key)) {
        callback(_style[key], key, _style);
      }
    }
  }
}
