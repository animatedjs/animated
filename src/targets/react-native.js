/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Animated
 * @flow
 */
'use strict';


var AnimatedImplementation = require('../AnimatedImplementation');
var { View, Image, Text } = require('react-native');

let AnimatedScrollView;

const Animated = {
  View: AnimatedImplementation.createAnimatedComponent(View),
  Text: AnimatedImplementation.createAnimatedComponent(Text),
  Image: AnimatedImplementation.createAnimatedComponent(Image),
};

Object.assign((Animated: Object), AnimatedImplementation);

module.exports = ((Animated: any): (typeof AnimatedImplementation) & typeof Animated);
