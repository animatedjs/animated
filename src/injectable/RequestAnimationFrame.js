var RequestAnimationFrame = {
  current: global.requestAnimationFrame,
  inject(injected) {
    RequestAnimationFrame.current = injected;
  },
};

module.exports = RequestAnimationFrame;
