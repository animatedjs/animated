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

var CSSPropertyOperations = require('react/lib/CSSPropertyOperations');
var Animated = require('../Animated');

function ApplyAnimatedValues(instance, props) {
  if (instance.setNativeProps) {
    instance.setNativeProps(props);
  } else if (instance.getDOMNode) {
    var node = instance.getDOMNode();
    if (node.setAttribute) {
      var strStyle = CSSPropertyOperations.setValueForStyles(node, props.style, instance);
    }
  } else {
    return false;
  }
}

Animated
  .inject
  .ApplyAnimatedValues(ApplyAnimatedValues);

module.exports = {
  ...Animated,
  div: Animated.createAnimatedComponent('div'),
  span: Animated.createAnimatedComponent('span'),
  img: Animated.createAnimatedComponent('img'),
};
