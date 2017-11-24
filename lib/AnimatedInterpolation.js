









'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var Animated=require('./Animated');
var AnimatedWithChildren=require('./AnimatedWithChildren');
var invariant=require('invariant');
var Interpolation=require('./Interpolation');
var guid=require('./guid');var



AnimatedInterpolation=function(_AnimatedWithChildren){_inherits(AnimatedInterpolation,_AnimatedWithChildren);





function AnimatedInterpolation(parent,interpolation){_classCallCheck(this,AnimatedInterpolation);var _this=_possibleConstructorReturn(this,(AnimatedInterpolation.__proto__||Object.getPrototypeOf(AnimatedInterpolation)).call(this));

_this._parent=parent;
_this._interpolation=interpolation;
_this._listeners={};return _this;
}_createClass(AnimatedInterpolation,[{key:'__getValue',value:function __getValue()

{
var parentValue=this._parent.__getValue();
invariant(
typeof parentValue==='number',
'Cannot interpolate an input which is not a number.');

return this._interpolation(parentValue);
}},{key:'addListener',value:function addListener(

callback){var _this2=this;
if(!this._parentListener){
this._parentListener=this._parent.addListener(function(){
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
this._parent.__addChild(this);
}},{key:'__detach',value:function __detach()

{
this._parent.__removeChild(this);
this._parentListener=this._parent.removeListener(this._parentListener);
}}]);return AnimatedInterpolation;}(AnimatedWithChildren);


module.exports=AnimatedInterpolation;