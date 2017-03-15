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

import AnimatedStyle from './AnimatedStyle';
import AnimatedWithChildren from './AnimatedWithChildren';

import { IAnimated } from './Animated';

type Callback = () => void;

export default class AnimatedProps implements IAnimated {
  _props: Object;
  _callback: Callback;

  constructor(props: Object, callback: Callback) {
    if (props.style) {
      props = { ...props, style: new AnimatedStyle(props.style) };
    }

    this._props = props;
    this._callback = callback;

    this.__attach();
  }

  update(): void {
    this._callback();
  }

  __getValue(): Object {
    const props = {};

    this.__forInProps((value: any, key: string) => {
      if (value instanceof AnimatedWithChildren) {
        props[key] = value.__getValue();
      } else {
        props[key] = value;
      }
    });

    return props;
  }

  __getAnimatedValue(): Object {
    const props = {};

    this.__forInProps((value: any, key: string) => {
      if (value instanceof AnimatedWithChildren) {
        props[key] = value.__getAnimatedValue();
      }
    });
    
    return props;
  }

  __attach(): void {
    this.__forInProps((value: any) => {
      if (value instanceof AnimatedWithChildren) {
        value.__addChild(this);
      }
    });
  }

  __detach(): void {
    this.__forInProps((value: any) => {
      if (value instanceof AnimatedWithChildren) {
        value.__removeChild(this);
      }
    });
  }

  __forInProps(callback: (value: any, key: string, _props: Object) => void) {
    const _props = this._props;

    for (const key in _props) {
      if (_props.hasOwnProperty(key)) {
        callback(_props[key], key, _props);
      }
    }
  }
}
