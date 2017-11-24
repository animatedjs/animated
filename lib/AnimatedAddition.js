









'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var AnimatedWithChildren=require('./AnimatedWithChildren');
var Animated=require('./Animated');
var AnimatedValue=require('./AnimatedValue');
var Interpolation=require('./Interpolation');
var AnimatedInterpolation=require('./AnimatedInterpolation');var



AnimatedAddition=function(_AnimatedWithChildren){_inherits(AnimatedAddition,_AnimatedWithChildren);






function AnimatedAddition(a,b){_classCallCheck(this,AnimatedAddition);var _this=_possibleConstructorReturn(this,(AnimatedAddition.__proto__||Object.getPrototypeOf(AnimatedAddition)).call(this));

_this._a=typeof a==='number'?new AnimatedValue(a):a;
_this._b=typeof b==='number'?new AnimatedValue(b):b;
_this._listeners={};return _this;
}_createClass(AnimatedAddition,[{key:'__getValue',value:function __getValue()

{
return this._a.__getValue()+this._b.__getValue();
}},{key:'addListener',value:function addListener(

callback){var _this2=this;
if(!this._aListener&&this._a.addListener){
this._aListener=this._a.addListener(function(){
for(var key in _this2._listeners){
_this2._listeners[key]({value:_this2.__getValue()});
}
});
}
if(!this._bListener&&this._b.addListener){
this._bListener=this._b.addListener(function(){
for(var key in _this2._listeners){
_this2._listeners[key]({value:_this2.__getValue()});
}
});
}
var id=guid();
this._listeners[id]=callback;
return id;
}},{key:'removeListener',value:function removeListener(

id){
delete this._listeners[id];
}},{key:'interpolate',value:function interpolate(

config){
return new AnimatedInterpolation(this,Interpolation.create(config));
}},{key:'__attach',value:function __attach()

{
this._a.__addChild(this);
this._b.__addChild(this);
}},{key:'__detach',value:function __detach()

{
this._a.__removeChild(this);
this._b.__removeChild(this);
}}]);return AnimatedAddition;}(AnimatedWithChildren);


module.exports=AnimatedAddition;