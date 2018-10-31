









'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}

var _bezier=require('./bezier');var






Easing=function(){function Easing(){_classCallCheck(this,Easing);}_createClass(Easing,null,[{key:'step0',value:function step0(
n){
return n>0?1:0;
}},{key:'step1',value:function step1(

n){
return n>=1?1:0;
}},{key:'linear',value:function linear(

t){
return t;
}},{key:'ease',value:function ease(

t){
return _ease(t);
}},{key:'quad',value:function quad(

t){
return t*t;
}},{key:'cubic',value:function cubic(

t){
return t*t*t;
}},{key:'poly',value:function poly(

n){
return function(t){return Math.pow(t,n);};
}},{key:'sin',value:function sin(

t){
return 1-Math.cos(t*Math.PI/2);
}},{key:'circle',value:function circle(

t){
return 1-Math.sqrt(1-t*t);
}},{key:'exp',value:function exp(

t){
return Math.pow(2,10*(t-1));
}},{key:'elastic',value:function elastic()











{var bounciness=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1;
var p=bounciness*Math.PI;
return function(t){return 1-Math.pow(Math.cos(t*Math.PI/2),3)*Math.cos(t*p);};
}},{key:'back',value:function back(

s){
if(s===undefined){
s=1.70158;
}
return function(t){return t*t*((s+1)*t-s);};
}},{key:'bounce',value:function bounce(

t){
if(t<1/2.75){
return 7.5625*t*t;
}

if(t<2/2.75){
t-=1.5/2.75;
return 7.5625*t*t+0.75;
}

if(t<2.5/2.75){
t-=2.25/2.75;
return 7.5625*t*t+0.9375;
}

t-=2.625/2.75;
return 7.5625*t*t+0.984375;
}},{key:'bezier',value:function bezier(


x1,
y1,
x2,
y2)
{
return _bezier(x1,y1,x2,y2);
}},{key:'in',value:function _in(


easing)
{
return easing;
}},{key:'out',value:function out(





easing)
{
return function(t){return 1-easing(1-t);};
}},{key:'inOut',value:function inOut(





easing)
{
return function(t){
if(t<0.5){
return easing(t*2)/2;
}
return 1-easing((1-t)*2)/2;
};
}}]);return Easing;}();


var _ease=Easing.bezier(0.42,0,1,1);



module.exports=Easing;