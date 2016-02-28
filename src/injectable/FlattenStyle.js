var FlattenStyle = {
  current: style => style,
  inject(flatten) {
    FlattenStyle.current = flatten;
  },
};

module.exports = FlattenStyle;
