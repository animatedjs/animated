









'use strict';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _require=

require('react-native'),View=_require.View,Image=_require.Image,Text=_require.Text;
var Animated=require('../');




module.exports=_extends({},
Animated,{
View:Animated.createAnimatedComponent(View),
Text:Animated.createAnimatedComponent(Text),
Image:Animated.createAnimatedComponent(Image)});