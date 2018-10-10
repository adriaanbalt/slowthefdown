
class ShareTheNavigation {
  constructor() {
    this.listeners = [];
    this.navigation = this.navigation;
    this.receiveNewVisibleStateListeners = [];
  }

  receiveNewVisibleState(listener) {
    this.receiveNewVisibleStateListeners.push(listener);
  }

  set(navigation) {
    this.listeners.forEach(listener => listener(navigation));
    this.listeners = [];
  }

  listen(listener) {
    if (this.navigation) {
      listener(this.navigation);
      return;
    }

    this.listeners.push(listener);
  }

  setParams(navigation, params) {
    navigation.setParams(params);

    // if (params.dirty) {
    //   this.setNewVisibleState(false);
    //   return;
    // }

    // if (params.saving) {
    //   this.setNewVisibleState(false);
    //   return;
    // }

    // this.setNewVisibleState(true);
  }

  setNewVisibleState(state) {
    this.receiveNewVisibleStateListeners.forEach(handler => handler(state));
  }
}

module.exports = new ShareTheNavigation();
