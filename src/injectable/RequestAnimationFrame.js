var RequestAnimationFrame = {
  current: cb => global.requestAnimationFrame(cb),
  inject(injected) {
    RequestAnimationFrame.current = injected;
  },
};

module.exports = RequestAnimationFrame;
