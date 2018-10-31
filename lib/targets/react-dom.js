









'use strict';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};

var Animated=require('../');




var transformWithLengthUnits={
translateX:true,
translateY:true,
translateZ:true,
perspective:true};




function mapTransform(t){
var k=Object.keys(t)[0];
var unit=transformWithLengthUnits[k]&&typeof t[k]==='number'?'px':'';
return k+'('+t[k]+unit+')';
}

var isUnitlessNumber={
animationIterationCount:true,
borderImageOutset:true,
borderImageSlice:true,
borderImageWidth:true,
boxFlex:true,
boxFlexGroup:true,
boxOrdinalGroup:true,
columnCount:true,
columns:true,
flex:true,
flexGrow:true,
flexPositive:true,
flexShrink:true,
flexNegative:true,
flexOrder:true,
gridRow:true,
gridRowEnd:true,
gridRowSpan:true,
gridRowStart:true,
gridColumn:true,
gridColumnEnd:true,
gridColumnSpan:true,
gridColumnStart:true,
fontWeight:true,
lineClamp:true,
lineHeight:true,
opacity:true,
order:true,
orphans:true,
tabSize:true,
widows:true,
zIndex:true,
zoom:true,


fillOpacity:true,
floodOpacity:true,
stopOpacity:true,
strokeDasharray:true,
strokeDashoffset:true,
strokeMiterlimit:true,
strokeOpacity:true,
strokeWidth:true};








function prefixKey(prefix,key){
return prefix+key.charAt(0).toUpperCase()+key.substring(1);
}





var prefixes=['Webkit','ms','Moz','O'];



Object.keys(isUnitlessNumber).forEach(function(prop){
prefixes.forEach(function(prefix){
isUnitlessNumber[prefixKey(prefix,prop)]=isUnitlessNumber[prop];
});
});




function mapStyle(style){
if(style&&style.transform&&typeof style.transform!=='string'){

style.transform=style.transform.map(mapTransform).join(' ');
}
return style;
}

function dangerousStyleValue(name,value,isCustomProperty){










var isEmpty=value==null||typeof value==='boolean'||value==='';
if(isEmpty){
return'';
}

if(
!isCustomProperty&&
typeof value==='number'&&
value!==0&&
!(isUnitlessNumber.hasOwnProperty(name)&&isUnitlessNumber[name]))
{
return value+'px';
}

return(''+value).trim();
}

function setValueForStyles(node,styles){
var style=node.style;
for(var styleName in styles){
if(!styles.hasOwnProperty(styleName)){
continue;
}
var isCustomProperty=styleName.indexOf('--')===0;
var styleValue=dangerousStyleValue(
styleName,
styles[styleName],
isCustomProperty);

if(styleName==='float'){
styleName='cssFloat';
}
if(isCustomProperty){
style.setProperty(styleName,styleValue);
}else{
style[styleName]=styleValue;
}
}
}

function ApplyAnimatedValues(instance,props){
if(instance.setNativeProps){
instance.setNativeProps(props);
}else if(instance.nodeType&&instance.setAttribute!==undefined){
setValueForStyles(instance,mapStyle(props.style));
}else{
return false;
}
}

Animated.
inject.
ApplyAnimatedValues(ApplyAnimatedValues);

module.exports=_extends({},
Animated,{
div:Animated.createAnimatedComponent('div'),
span:Animated.createAnimatedComponent('span'),
img:Animated.createAnimatedComponent('img')});