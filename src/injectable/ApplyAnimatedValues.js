var ApplyAnimatedValues = {
  current: function ApplyAnimatedValues(instance, props) {
    if (instance.setNativeProps) {
      instance.setNativeProps(props);
    } else {
      return false;
    }
  },
  inject(apply) {
    ApplyAnimatedValues.current = apply;
  },
};

module.exports = ApplyAnimatedValues;
