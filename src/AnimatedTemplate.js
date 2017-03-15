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

import AnimatedWithChildren from './AnimatedWithChildren';

export default class AnimatedTemplate extends AnimatedWithChildren {
  _values: Array<any>;
  _strings: Array<string>;

  constructor(strings: Array<string>, values: Array<any>) {
    super();

    this._values = values;
    this._strings = strings;
  }

  __transformValue(value: any): any {
    if (value instanceof AnimatedWithChildren) {
      return value.__getValue();
    } else {
      return value;
    }
  }

  __getValue(): string {
    const strings = this._strings;
    let string = strings[0];

    this._values.forEach((value, i) => {
      string += this.__transformValue(value) + strings[1 + i];
    });

    return string;
  }

  __attach(): void {
    this._values.forEach(value => {
      if (value instanceof AnimatedWithChildren) {
        value.__addChild(this);
      }
    });
  }

  __detach(): void {
    this._values.forEach(value => {
      if (value instanceof AnimatedWithChildren) {
        value.__removeChild(this);
      }
    });
  }
}
