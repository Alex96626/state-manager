type State = {
  [key: string | symbol]: string;
};

class MyState {
  // НЕ УМЕЕТ РАБОТАТЬ С ВЛОЖЕННЫМИ ОБЬЕКТАМИ, ТОЛЬКО СТРОКОВЫЕ КЛЮЧИ
  _state: State = {};

  _stateProxy = new Proxy(this._state, {
    set: (target, prop, value) => {
      target[prop] = value;

      this.notifySubscribers();
      
      return true;
    },
  });

  private subscribers: Set<(state: State) => void> = new Set();

  private notifySubscribers = () => {
    for (const subscriber of this.subscribers) {
      subscriber(this._stateProxy);
    }
  };

  public getState = () => {
    return Object.assign({}, this._stateProxy);
  };

  public subscribe = (cb: (state: State) => void) => {
    this.subscribers.add(cb);

    return () => this.subscribers.delete(cb);
  };
}
