type State = {
  [key: string | symbol]: string;
};

// НЕ УМЕЕТ РАБОТАТЬ С ВЛОЖЕННЫМИ ОБЬЕКТАМИ, ТОЛЬКО СТРОКОВЫЕ КЛЮЧИ
const state: State = {};

const stateProxy = new Proxy(state, {
  set: (target, prop, value) => {
    target[prop] = value;

    notifySubscribers();

    return true;
  },
});

const subscribers: Set<(state: State) => void> = new Set();

const notifySubscribers = () => {
  for (const subscriber of subscribers) {
    subscriber(stateProxy);
  }
};

const getState = () => {
  return Object.assign({}, stateProxy);
};

const subscribe = (cb: (state: State) => void) => {
  subscribers.add(cb);

  return () => subscribers.delete(cb);
};
