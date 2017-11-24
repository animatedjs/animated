









'use strict';

var FlattenStyle={
current:function current(style){return style;},
inject:function inject(flatten){
FlattenStyle.current=flatten;
}};


module.exports=FlattenStyle;