







'use strict';

jest.
dontMock('Interpolation').
dontMock('Easing').
dontMock('normalizeColor');

var Interpolation=require('Interpolation');
var Easing=require('Easing');

describe('Interpolation',function(){
it('should work with defaults',function(){
var interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:[0,1]});


expect(interpolation(0)).toBe(0);
expect(interpolation(0.5)).toBe(0.5);
expect(interpolation(0.8)).toBe(0.8);
expect(interpolation(1)).toBe(1);
});

it('should work with output range',function(){
var interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:[100,200]});


expect(interpolation(0)).toBe(100);
expect(interpolation(0.5)).toBe(150);
expect(interpolation(0.8)).toBe(180);
expect(interpolation(1)).toBe(200);
});

it('should work with input range',function(){
var interpolation=Interpolation.create({
inputRange:[100,200],
outputRange:[0,1]});


expect(interpolation(100)).toBe(0);
expect(interpolation(150)).toBe(0.5);
expect(interpolation(180)).toBe(0.8);
expect(interpolation(200)).toBe(1);
});

it('should throw for non monotonic input ranges',function(){
expect(function(){return Interpolation.create({
inputRange:[0,2,1],
outputRange:[0,1,2]});}).
toThrow();

expect(function(){return Interpolation.create({
inputRange:[0,1,2],
outputRange:[0,3,1]});}).
not.toThrow();
});

it('should work with empty input range',function(){
var interpolation=Interpolation.create({
inputRange:[0,10,10],
outputRange:[1,2,3],
extrapolate:'extend'});


expect(interpolation(0)).toBe(1);
expect(interpolation(5)).toBe(1.5);
expect(interpolation(10)).toBe(2);
expect(interpolation(10.1)).toBe(3);
expect(interpolation(15)).toBe(3);
});

it('should work with empty output range',function(){
var interpolation=Interpolation.create({
inputRange:[1,2,3],
outputRange:[0,10,10],
extrapolate:'extend'});


expect(interpolation(0)).toBe(-10);
expect(interpolation(1.5)).toBe(5);
expect(interpolation(2)).toBe(10);
expect(interpolation(2.5)).toBe(10);
expect(interpolation(3)).toBe(10);
expect(interpolation(4)).toBe(10);
});

it('should work with easing',function(){
var interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:[0,1],
easing:Easing.quad});


expect(interpolation(0)).toBe(0);
expect(interpolation(0.5)).toBe(0.25);
expect(interpolation(0.9)).toBe(0.81);
expect(interpolation(1)).toBe(1);
});

it('should work with extrapolate',function(){
var interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:[0,1],
extrapolate:'extend',
easing:Easing.quad});


expect(interpolation(-2)).toBe(4);
expect(interpolation(2)).toBe(4);

interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:[0,1],
extrapolate:'clamp',
easing:Easing.quad});


expect(interpolation(-2)).toBe(0);
expect(interpolation(2)).toBe(1);

interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:[0,1],
extrapolate:'identity',
easing:Easing.quad});


expect(interpolation(-2)).toBe(-2);
expect(interpolation(2)).toBe(2);
});

it('should work with keyframes with extrapolate',function(){
var interpolation=Interpolation.create({
inputRange:[0,10,100,1000],
outputRange:[0,5,50,500],
extrapolate:true});


expect(interpolation(-5)).toBe(-2.5);
expect(interpolation(0)).toBe(0);
expect(interpolation(5)).toBe(2.5);
expect(interpolation(10)).toBe(5);
expect(interpolation(50)).toBe(25);
expect(interpolation(100)).toBe(50);
expect(interpolation(500)).toBe(250);
expect(interpolation(1000)).toBe(500);
expect(interpolation(2000)).toBe(1000);
});

it('should work with keyframes without extrapolate',function(){
var interpolation=Interpolation.create({
inputRange:[0,1,2],
outputRange:[0.2,1,0.2],
extrapolate:'clamp'});


expect(interpolation(5)).toBeCloseTo(0.2);
});

it('should throw for an infinite input range',function(){
expect(function(){return Interpolation.create({
inputRange:[-Infinity,Infinity],
outputRange:[0,1]});}).
toThrow();

expect(function(){return Interpolation.create({
inputRange:[-Infinity,0,Infinity],
outputRange:[1,2,3]});}).
not.toThrow();
});

it('should work with negative infinite',function(){
var interpolation=Interpolation.create({
inputRange:[-Infinity,0],
outputRange:[-Infinity,0],
easing:Easing.quad,
extrapolate:'identity'});


expect(interpolation(-Infinity)).toBe(-Infinity);
expect(interpolation(-100)).toBeCloseTo(-10000);
expect(interpolation(-10)).toBeCloseTo(-100);
expect(interpolation(0)).toBeCloseTo(0);
expect(interpolation(1)).toBeCloseTo(1);
expect(interpolation(100)).toBeCloseTo(100);
});

it('should work with positive infinite',function(){
var interpolation=Interpolation.create({
inputRange:[5,Infinity],
outputRange:[5,Infinity],
easing:Easing.quad,
extrapolate:'identity'});


expect(interpolation(-100)).toBeCloseTo(-100);
expect(interpolation(-10)).toBeCloseTo(-10);
expect(interpolation(0)).toBeCloseTo(0);
expect(interpolation(5)).toBeCloseTo(5);
expect(interpolation(6)).toBeCloseTo(5+1);
expect(interpolation(10)).toBeCloseTo(5+25);
expect(interpolation(100)).toBeCloseTo(5+95*95);
expect(interpolation(Infinity)).toBe(Infinity);
});

it('should work with output ranges as string',function(){
var interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:['rgba(0, 100, 200, 0)','rgba(50, 150, 250, 0.4)']});


expect(interpolation(0)).toBe('rgba(0, 100, 200, 0)');
expect(interpolation(0.5)).toBe('rgba(25, 125, 225, 0.2)');
expect(interpolation(1)).toBe('rgba(50, 150, 250, 0.4)');
});

it('should work with output ranges as short hex string',function(){
var interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:['#024','#9BF']});


expect(interpolation(0)).toBe('rgba(0, 34, 68, 1)');
expect(interpolation(0.5)).toBe('rgba(76.5, 110.5, 161.5, 1)');
expect(interpolation(1)).toBe('rgba(153, 187, 255, 1)');
});

it('should work with output ranges as long hex string',function(){
var interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:['#FF9500','#87FC70']});


expect(interpolation(0)).toBe('rgba(255, 149, 0, 1)');
expect(interpolation(0.5)).toBe('rgba(195, 200.5, 56, 1)');
expect(interpolation(1)).toBe('rgba(135, 252, 112, 1)');
});

it('should work with output ranges with mixed hex and rgba strings',function(){
var interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:['rgba(100, 120, 140, .4)','#87FC70']});


expect(interpolation(0)).toBe('rgba(100, 120, 140, 0.4)');
expect(interpolation(0.5)).toBe('rgba(117.5, 186, 126, 0.7)');
expect(interpolation(1)).toBe('rgba(135, 252, 112, 1)');
});

it('should work with negative and decimal values in string ranges',function(){
var interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:['-100.5deg','100deg']});


expect(interpolation(0)).toBe('-100.5deg');
expect(interpolation(0.5)).toBe('-0.25deg');
expect(interpolation(1)).toBe('100deg');
});

it('should crash when chaining an interpolation that returns a string',function(){
var interpolation=Interpolation.create({
inputRange:[0,1],
outputRange:[0,1]});

expect(function(){interpolation('45rad');}).toThrow();
});

it('should support a mix of color patterns',function(){
var interpolation=Interpolation.create({
inputRange:[0,1,2],
outputRange:['rgba(0, 100, 200, 0)','rgb(50, 150, 250)','red']});


expect(interpolation(0)).toBe('rgba(0, 100, 200, 0)');
expect(interpolation(0.5)).toBe('rgba(25, 125, 225, 0.5)');
expect(interpolation(1.5)).toBe('rgba(152.5, 75, 125, 1)');
expect(interpolation(2)).toBe('rgba(255, 0, 0, 1)');
});

it('should crash when defining output range with different pattern',function(){
expect(function(){return Interpolation.create({
inputRange:[0,1],
outputRange:['20deg','30rad']});}).
toThrow();
});
});