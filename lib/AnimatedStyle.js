









'use strict';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var Animated=require('./Animated');
var AnimatedWithChildren=require('./AnimatedWithChildren');
var AnimatedTransform=require('./AnimatedTransform');
var FlattenStyle=require('./injectable/FlattenStyle');var

AnimatedStyle=function(_AnimatedWithChildren){_inherits(AnimatedStyle,_AnimatedWithChildren);


function AnimatedStyle(style){_classCallCheck(this,AnimatedStyle);var _this=_possibleConstructorReturn(this,(AnimatedStyle.__proto__||Object.getPrototypeOf(AnimatedStyle)).call(this));

style=FlattenStyle.current(style)||{};
if(style.transform&&!(style.transform instanceof Animated)){
style=_extends({},
style,{
transform:new AnimatedTransform(style.transform)});

}
_this._style=style;return _this;
}_createClass(AnimatedStyle,[{key:'__getValue',value:function __getValue()

{
var style={};
for(var key in this._style){
var value=this._style[key];
if(value instanceof Animated){
style[key]=value.__getValue();
}else{
style[key]=value;
}
}
return style;
}},{key:'__getAnimatedValue',value:function __getAnimatedValue()

{
var style={};
for(var key in this._style){
var value=this._style[key];
if(value instanceof Animated){
style[key]=value.__getAnimatedValue();
}
}
return style;
}},{key:'__attach',value:function __attach()

{
for(var key in this._style){
var value=this._style[key];
if(value instanceof Animated){
value.__addChild(this);
}
}
}},{key:'__detach',value:function __detach()

{
for(var key in this._style){
var value=this._style[key];
if(value instanceof Animated){
value.__removeChild(this);
}
}
}}]);return AnimatedStyle;}(AnimatedWithChildren);


module.exports=AnimatedStyle;