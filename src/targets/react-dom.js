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

// We need to remove this and come up with our own for React v16
var CSSPropertyOperations = require('react-dom/lib/CSSPropertyOperations');
var AnimatedImplementation = require('../AnimatedImplementation');

// { scale: 2 } => 'scale(2)'
function mapTransform(t) {
  var k = Object.keys(t)[0];
  return `${k}(${t[k]})`;
}

// NOTE(lmr):
// Since this is a hot code path, right now this is mutative...
// As far as I can tell, this shouldn't cause any unexpected behavior.
function mapStyle(style) {
  if (style && style.transform && typeof style.transform !== 'string') {
    // TODO(lmr): this doesn't attempt to use vendor prefixed styles
    style.transform = style.transform.map(mapTransform).join(' ');
  }
  return style;
}

function ApplyAnimatedValues(instance, props, comp) {
  if (instance.setNativeProps) {
    instance.setNativeProps(props);
  } else if (instance.nodeType && instance.setAttribute !== undefined) {
    CSSPropertyOperations.setValueForStyles(instance, mapStyle(props.style), comp._reactInternalInstance);
  } else {
    return false;
  }
}

AnimatedImplementation.inject.ApplyAnimatedValues(ApplyAnimatedValues);

var Animated = {
  div: AnimatedImplementation.createAnimatedComponent('div'),
  span: AnimatedImplementation.createAnimatedComponent('span'),
  img: AnimatedImplementation.createAnimatedComponent('img'),
};


Object.assign((Animated: Object), AnimatedImplementation);

module.exports = ((Animated: any): (typeof AnimatedImplementation) & typeof Animated);