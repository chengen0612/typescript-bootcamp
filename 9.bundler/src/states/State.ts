type Observer<T> = (items: T) => void;

export abstract class State<T> {
  protected observers: Observer<T>[];
  protected state: T;

  protected constructor(initialState: T) {
    this.observers = [];
    this.state = initialState;
  }

  observe(cb: Observer<T>) {
    this.observers.push(cb);
  }

  protected abstract notify(): void;
}
