var AnimatedWithChildren = require('./AnimatedWithChildren');
var AnimatedValue = require('./AnimatedValue');
var Animated = require('./Animated');
var guid = require('./guid');
var spring = require('./spring');
var parallel = require('./parallel');
var timing = require('./timing');

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isOwnProperty(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function makeShape(shape, ret) {
  if (shape instanceof Animated) {
    return shape;
  } else if (shape instanceof Array) {
    return shape.map(val => makeShape(val, {}));
  } else {
    switch(typeof shape) {
      case 'object':
        for (var key in shape) {
          if (isOwnProperty(shape, key)) {
            ret[key] = makeShape(shape[key], {});
          }
        }
        return ret;
      case 'number':
      case 'string':
        return new AnimatedValue(value);
      default:
        return value;
    }
  }
  return ret;
}

function getValue(shape, ret) {
  if (shape instanceof Animated) {
    return shape.__getValue();
  } else if (shape instanceof Array) {
    return shape.map(val => getValue(val, {}));
  } else {
    switch(typeof shape) {
      case 'object':
        for (var key in shape) {
          if (isOwnProperty(shape, key)) {
            ret[key] = getValue(shape[key], {});
          }
        }
        return ret;
      default:
        return value;
    }
  }
  return ret;
}

function setValue(shape, obj) {
  if (shape instanceof Animated) {
    return shape.setValue(obj);
  } else if (shape instanceof Array) {
    return shape.map((val, i) => setValue(val, obj[i]));
  } else {
    switch(typeof shape) {
      case 'object':
        for (var key in shape) {
          if (isOwnProperty(shape, key)) {
            setValue(shape[key], obj[key]);
          }
        }
        break;
    }
  }
}

function setOffset(shape, obj) {
  if (shape instanceof Animated) {
    shape.setOffset(obj);
  } else if (shape instanceof Array) {
    return shape.map((val, i) => setOffset(val, obj[i]));
  } else {
    switch(typeof shape) {
      case 'object':
        for (var key in shape) {
          if (isOwnProperty(shape, key)) {
            setOffset(shape[key], obj[key]);
          }
        }
        break;
    }
  }
}

function getAnimateds(shape, animateds) {
  if (shape instanceof Animated) {
    animateds.push(shape);
  } else if (shape instanceof Array) {
    return shape.map(val => getAnimateds(val, animateds));
  } else {
    switch(typeof shape) {
      case 'object':
        for (var key in shape) {
          if (isOwnProperty(shape, key)) {
            ret[key] = getAnimateds(shape[key], animateds);
          }
        }
        break;
    }
  }
  return animateds;
}

function forEachAnimated(shape, match, fn) {
  if (shape instanceof Animated) {
    fn(shape, match);
  } else if (shape instanceof Array) {
    shape.map((val, i) => forEachAnimated(val, match[i], fn));
  } else {
    switch(typeof shape) {
      case 'object':
        for (var key in shape) {
          if (isOwnProperty(shape, key)) {
            forEachAnimated(shape[key], match[key], fn);
          }
        }
        break;
    }
  }
}

class AnimatedShape extends AnimatedWithChildren {
  _shape: any;
  _children: Array<Animated>;
  _listeners: {[key: string]: Array<string>};

  constructor(shape) {
    super();
    this._shape = makeShape(shape, {});
    this._children = getAnimateds(this._shape);
    this._listeners = {};
  }

  setValue(value) {
    setValue(this._shape, value);
  }

  setOffset(offset) {
    setOffset(this._shape, offset);
  }

  flattenOffset() {
    this._children.forEach(child => child.flattenOffset());
  }

  __getValue() {
    return getValue(this._shape, {});
  }

  __attach() {
    this._children.forEach(child => child.__addChild(this));
  }

  __detach() {
    this._children.forEach(child => child.__removeChild(this));
  }

  stopAnimation(callback?: ?() => number): void {
    this._children.forEach(child => child.stopAnimation());
    callback && callback(this.__getValue());
  }

  addListener(callback: ValueXYListenerCallback): string {
    var id = guid();
    var jointCallback = ({value: number}) => {
      callback(this.__getValue());
    };
    this._listeners[id] = this._children.map(value => value.addListener(jointCallback));
    return id;
  }

  removeListener(id: string): void {
    var listeners = this._listeners[id];
    this._children.forEach((value, i) => value.removeListener(listeners[i]));
    delete this._listeners[id];
  }

  spring(config) {
    var animations = [];
    forEachAnimated(
      this._shape,
      config.toValue,
      (anim, value) => {
        animations.push(timing(anim, {
          ...config,
          toValue: value,
        }));
      }
    );
    return parallel(animations);
  }

  timing(config) {
    var animations = [];
    forEachAnimated(
      this._shape,
      config.toValue,
      (anim, value) => {
        animations.push(timing(anim, {
          ...config,
          toValue: value,
        }));
      }
    );
    return parallel(animations);
  }
}

module.exports = AnimatedShape;
