









'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var Animation=require('./Animation');
var AnimatedValue=require('./AnimatedValue');
var Easing=require('./Easing');
var RequestAnimationFrame=require('./injectable/RequestAnimationFrame');
var CancelAnimationFrame=require('./injectable/CancelAnimationFrame');



var easeInOut=Easing.inOut(Easing.ease);var








TimingAnimation=function(_Animation){_inherits(TimingAnimation,_Animation);










function TimingAnimation(
config)
{_classCallCheck(this,TimingAnimation);var _this=_possibleConstructorReturn(this,(TimingAnimation.__proto__||Object.getPrototypeOf(TimingAnimation)).call(this));

_this._toValue=config.toValue;
_this._easing=config.easing!==undefined?config.easing:easeInOut;
_this._duration=config.duration!==undefined?config.duration:500;
_this._delay=config.delay!==undefined?config.delay:0;
_this.__isInteraction=config.isInteraction!==undefined?config.isInteraction:true;return _this;
}_createClass(TimingAnimation,[{key:'start',value:function start(


fromValue,
onUpdate,
onEnd)
{var _this2=this;
this.__active=true;
this._fromValue=fromValue;
this._onUpdate=onUpdate;
this.__onEnd=onEnd;

var start=function start(){
if(_this2._duration===0){
_this2._onUpdate(_this2._toValue);
_this2.__debouncedOnEnd({finished:true});
}else{
_this2._startTime=Date.now();
_this2._animationFrame=RequestAnimationFrame.current(_this2.onUpdate.bind(_this2));
}
};
if(this._delay){
this._timeout=setTimeout(start,this._delay);
}else{
start();
}
}},{key:'onUpdate',value:function onUpdate()

{
var now=Date.now();
if(now>=this._startTime+this._duration){
if(this._duration===0){
this._onUpdate(this._toValue);
}else{
this._onUpdate(
this._fromValue+this._easing(1)*(this._toValue-this._fromValue));

}
this.__debouncedOnEnd({finished:true});
return;
}

this._onUpdate(
this._fromValue+
this._easing((now-this._startTime)/this._duration)*(
this._toValue-this._fromValue));

if(this.__active){
this._animationFrame=RequestAnimationFrame.current(this.onUpdate.bind(this));
}
}},{key:'stop',value:function stop()

{
this.__active=false;
clearTimeout(this._timeout);
CancelAnimationFrame.current(this._animationFrame);
this.__debouncedOnEnd({finished:false});
}}]);return TimingAnimation;}(Animation);


module.exports=TimingAnimation;