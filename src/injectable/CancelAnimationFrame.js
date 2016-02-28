var CancelAnimationFrame = {
  current: global.cancelAnimationFrame,
  inject(injected) {
    CancelAnimationFrame.current = injected;
  },
};

module.exports = CancelAnimationFrame;
