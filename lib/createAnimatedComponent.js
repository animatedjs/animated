









'use strict';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName='src\\createAnimatedComponent.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var React=require('react');
var AnimatedProps=require('./AnimatedProps');
var ApplyAnimatedValues=require('./injectable/ApplyAnimatedValues');

function createAnimatedComponent(Component){
var refName='node';var

AnimatedComponent=function(_React$Component){_inherits(AnimatedComponent,_React$Component);function AnimatedComponent(){_classCallCheck(this,AnimatedComponent);return _possibleConstructorReturn(this,(AnimatedComponent.__proto__||Object.getPrototypeOf(AnimatedComponent)).apply(this,arguments));}_createClass(AnimatedComponent,[{key:'componentWillUnmount',value:function componentWillUnmount()


{
this._propsAnimated&&this._propsAnimated.__detach();
}},{key:'setNativeProps',value:function setNativeProps(

props){
var didUpdate=ApplyAnimatedValues.current(this.refs[refName],props,this);
if(didUpdate===false){
this.forceUpdate();
}
}},{key:'componentWillMount',value:function componentWillMount()

{
this.attachProps(this.props);
}},{key:'attachProps',value:function attachProps(

nextProps){var _this2=this;
var oldPropsAnimated=this._propsAnimated;







var callback=function callback(){
var didUpdate=ApplyAnimatedValues.current(_this2.refs[refName],_this2._propsAnimated.__getAnimatedValue(),_this2);
if(didUpdate===false){
_this2.forceUpdate();
}
};

this._propsAnimated=new AnimatedProps(
nextProps,
callback);










oldPropsAnimated&&oldPropsAnimated.__detach();
}},{key:'componentWillReceiveProps',value:function componentWillReceiveProps(

nextProps){
this.attachProps(nextProps);
}},{key:'render',value:function render()

{
return(
React.createElement(Component,_extends({},
this._propsAnimated.__getValue(),{
ref:refName,__source:{fileName:_jsxFileName,lineNumber:76}})));


}}]);return AnimatedComponent;}(React.Component);

AnimatedComponent.propTypes={
style:function style(props,propName,componentName){
if(!Component.propTypes){
return;
}














}};


return AnimatedComponent;
}

module.exports=createAnimatedComponent;