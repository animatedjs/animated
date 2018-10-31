









'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var










Animation=function(){function Animation(){_classCallCheck(this,Animation);}_createClass(Animation,[{key:'start',value:function start(




fromValue,
onUpdate,
onEnd,
previousAnimation)
{}},{key:'stop',value:function stop()
{}},{key:'__debouncedOnEnd',value:function __debouncedOnEnd(

result){
var onEnd=this.__onEnd;
this.__onEnd=null;
onEnd&&onEnd(result);
}}]);return Animation;}();


module.exports=Animation;