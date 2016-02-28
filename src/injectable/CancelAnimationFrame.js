var CancelAnimationFrame = {
  current: id => global.cancelAnimationFrame(id),
  inject(injected) {
    CancelAnimationFrame.current = injected;
  },
};

module.exports = CancelAnimationFrame;
