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

export type TransformsType = Array<Object>;

export default class AnimatedTransform extends AnimatedWithChildren {
  _transforms: TransformsType;

  constructor(transforms: TransformsType) {
    super();

    this._transforms = transforms;
  }

  __getValue(): TransformsType {
    return this._transforms.map(transform => {
      const result = {};

      this.__forInTransform((transform: Object), (value: any, key: string) => {
        if (value instanceof AnimatedWithChildren) {
          result[key] = value.__getValue();
        } else {
          result[key] = value;
        }
      });

      return result;
    });
  }

  __getAnimatedValue(): TransformsType {
    return this._transforms.map(transform => {
      const result = {};

      this.__forInTransform((transform: Object), (value: any, key: string) => {
         if (value instanceof AnimatedWithChildren) {
          result[key] = value.__getAnimatedValue();
        } else {
          // All transform components needed to recompose matrix
          result[key] = value;
        }
      });

      return result;
    });
  }

  __attach(): void {
    this._transforms.forEach((transform: Object) => {
      this.__forInTransform(transform, (value: any) => {
        if (value instanceof AnimatedWithChildren) {
          value.__addChild(this);
        }
      });
    });
  }

  __detach(): void {
    this._transforms.forEach((transform: Object) => {
      this.__forInTransform(transform, (value: any) => {
        if (value instanceof AnimatedWithChildren) {
          value.__removeChild(this);
        }
      });
    });
  }

  __forInTransform(transform: Object, callback: (value: any, key: string, _style: Object) => void) {
    for (const key in transform) {
      if (transform.hasOwnProperty(key)) {
        callback(transform[key], key, transform);
      }
    }
  }
}

