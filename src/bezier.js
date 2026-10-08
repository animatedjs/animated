/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2026 – MIT License
 * @nolint
 */

 // Fallback for ES5 environments without Math.cbrt
 var cbrt = Math.cbrt || function (x) { return x < 0 ? -Math.pow(-x, 1 / 3) : Math.pow(x, 1 / 3); };

 // Solves x(t) = ((2a * t + 3b) * t + 3c) * t = x for t, with x in (0, 1):
 // u = 1/t is the largest real root of x·u³ − 3c·u² − 3b·u − 2a = 0
 function solveTForX (x, a, b, c) {
   var j = 1 / Math.max(c, Math.sqrt(x));
   var k = x * j;
   var l = k * j;
   var s = c * j;
   var q = b * l;
   var m = s * s + q;
   var h = -s * (s * s + 1.5 * q) - a * k * l;
   var D = h * h - m * m * m;
   var v;
   if (m === 0 || D > 1e-12 * h * h) {
     // one real root (Cardano)
     var U = -cbrt(h < 0 ? h - Math.sqrt(D) : h + Math.sqrt(D));
     v = (U + m / U) || 0;
   } else {
     // three real roots, take the largest
     var r = Math.sqrt(m);
     v = 2 * r * Math.cos(Math.acos(Math.max(-1, Math.min(1, -h / (m * r)))) / 3);
   }
   return Math.min(1, k / (v + s));
 }

 module.exports = function bezier (mX1, mY1, mX2, mY2) {
   if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) { // eslint-disable-line yoda
     throw new Error('bezier x values must be in [0, 1] range');
   }

   if (mX1 === mY1 && mX2 === mY2) {
     return function LinearEasing (x) {
       return x;
     };
   }

   // x(t) = ((2a * t + 3b) * t + 3c) * t, y(t) = ((ay * t + by) * t + cy) * t
   var a = (3 * mX1 - 3 * mX2 + 1) / 2;
   var b = mX2 - 2 * mX1;
   var c = mX1;
   var ay = 3 * mY1 - 3 * mY2 + 1;
   var by = 3 * (mY2 - 2 * mY1);
   var cy = 3 * mY1;

   return function BezierEasing (x) {
     // x outside (0, 1) saturates to 0 / 1
     if (x <= 0) {
       return 0;
     }
     if (x >= 1) {
       return 1;
     }
     var t = solveTForX(x, a, b, c);
     return ((ay * t + by) * t + cy) * t;
   };
 };
