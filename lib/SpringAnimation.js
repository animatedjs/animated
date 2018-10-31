









'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var Animation=require('./Animation');
var AnimatedValue=require('./AnimatedValue');
var RequestAnimationFrame=require('./injectable/RequestAnimationFrame');
var CancelAnimationFrame=require('./injectable/CancelAnimationFrame');
var invariant=require('invariant');
var SpringConfig=require('./SpringConfig');















function withDefault(value,defaultValue){
if(value===undefined||value===null){
return defaultValue;
}
return value;
}var

SpringAnimation=function(_Animation){_inherits(SpringAnimation,_Animation);















function SpringAnimation(
config)
{_classCallCheck(this,SpringAnimation);var _this=_possibleConstructorReturn(this,(SpringAnimation.__proto__||Object.getPrototypeOf(SpringAnimation)).call(this));


_this._overshootClamping=withDefault(config.overshootClamping,false);
_this._restDisplacementThreshold=withDefault(config.restDisplacementThreshold,0.001);
_this._restSpeedThreshold=withDefault(config.restSpeedThreshold,0.001);
_this._initialVelocity=config.velocity;
_this._lastVelocity=withDefault(config.velocity,0);
_this._toValue=config.toValue;
_this.__isInteraction=config.isInteraction!==undefined?config.isInteraction:true;

var springConfig;
if(config.bounciness!==undefined||config.speed!==undefined){
invariant(
config.tension===undefined&&config.friction===undefined,
'You can only define bounciness/speed or tension/friction but not both');

springConfig=SpringConfig.fromBouncinessAndSpeed(
withDefault(config.bounciness,8),
withDefault(config.speed,12));

}else{
springConfig=SpringConfig.fromOrigamiTensionAndFriction(
withDefault(config.tension,40),
withDefault(config.friction,7));

}
_this._tension=springConfig.tension;
_this._friction=springConfig.friction;return _this;
}_createClass(SpringAnimation,[{key:'start',value:function start(


fromValue,
onUpdate,
onEnd,
previousAnimation)
{
this.__active=true;
this._startPosition=fromValue;
this._lastPosition=this._startPosition;

this._onUpdate=onUpdate;
this.__onEnd=onEnd;
this._lastTime=Date.now();

if(previousAnimation instanceof SpringAnimation){
var internalState=previousAnimation.getInternalState();
this._lastPosition=internalState.lastPosition;
this._lastVelocity=internalState.lastVelocity;
this._lastTime=internalState.lastTime;
}
if(this._initialVelocity!==undefined&&
this._initialVelocity!==null){
this._lastVelocity=this._initialVelocity;
}
this.onUpdate();
}},{key:'getInternalState',value:function getInternalState()

{
return{
lastPosition:this._lastPosition,
lastVelocity:this._lastVelocity,
lastTime:this._lastTime};

}},{key:'onUpdate',value:function onUpdate()

{
var position=this._lastPosition;
var velocity=this._lastVelocity;

var tempPosition=this._lastPosition;
var tempVelocity=this._lastVelocity;





var MAX_STEPS=64;
var now=Date.now();
if(now>this._lastTime+MAX_STEPS){
now=this._lastTime+MAX_STEPS;
}




var TIMESTEP_MSEC=1;
var numSteps=Math.floor((now-this._lastTime)/TIMESTEP_MSEC);

for(var i=0;i<numSteps;++i){

var step=TIMESTEP_MSEC/1000;



var aVelocity=velocity;
var aAcceleration=this._tension*(this._toValue-tempPosition)-this._friction*tempVelocity;
var tempPosition=position+aVelocity*step/2;
var tempVelocity=velocity+aAcceleration*step/2;

var bVelocity=tempVelocity;
var bAcceleration=this._tension*(this._toValue-tempPosition)-this._friction*tempVelocity;
tempPosition=position+bVelocity*step/2;
tempVelocity=velocity+bAcceleration*step/2;

var cVelocity=tempVelocity;
var cAcceleration=this._tension*(this._toValue-tempPosition)-this._friction*tempVelocity;
tempPosition=position+cVelocity*step/2;
tempVelocity=velocity+cAcceleration*step/2;

var dVelocity=tempVelocity;
var dAcceleration=this._tension*(this._toValue-tempPosition)-this._friction*tempVelocity;
tempPosition=position+cVelocity*step/2;
tempVelocity=velocity+cAcceleration*step/2;

var dxdt=(aVelocity+2*(bVelocity+cVelocity)+dVelocity)/6;
var dvdt=(aAcceleration+2*(bAcceleration+cAcceleration)+dAcceleration)/6;

position+=dxdt*step;
velocity+=dvdt*step;
}

this._lastTime=now;
this._lastPosition=position;
this._lastVelocity=velocity;

this._onUpdate(position);
if(!this.__active){
return;
}


var isOvershooting=false;
if(this._overshootClamping&&this._tension!==0){
if(this._startPosition<this._toValue){
isOvershooting=position>this._toValue;
}else{
isOvershooting=position<this._toValue;
}
}
var isVelocity=Math.abs(velocity)<=this._restSpeedThreshold;
var isDisplacement=true;
if(this._tension!==0){
isDisplacement=Math.abs(this._toValue-position)<=this._restDisplacementThreshold;
}

if(isOvershooting||isVelocity&&isDisplacement){
if(this._tension!==0){

this._onUpdate(this._toValue);
}

this.__debouncedOnEnd({finished:true});
return;
}
this._animationFrame=RequestAnimationFrame.current(this.onUpdate.bind(this));
}},{key:'stop',value:function stop()

{
this.__active=false;
CancelAnimationFrame.current(this._animationFrame);
this.__debouncedOnEnd({finished:false});
}}]);return SpringAnimation;}(Animation);


module.exports=SpringAnimation;