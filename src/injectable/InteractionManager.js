var InteractionManager = {
  current: {
    createInteractionHandle: function() {},
    clearInteractionHandle: function() {},
  },
  inject(manager) {
    InteractionManager.current = manager;
  },
};

module.exports = InteractionManager;
