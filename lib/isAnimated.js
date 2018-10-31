









'use strict';

var Animated=require('./Animated');

function isAnimated(obj){
return obj instanceof Animated;
}

module.exports=isAnimated;