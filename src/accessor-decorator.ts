/**
 * Automatically bind this object to target method.
 * @see https://blog.logrocket.com/a-practical-guide-to-typescript-decorators/
 */
function bind(_target: object, _name: string, descriptor: PropertyDescriptor) {
  return {
    configurable: false,
    enumerable: false,
    get(...args: any[]) {
      return descriptor.value.bind(this, args);
    },
  };
}

function descriptive(
  _target: object,
  _name: string,
  descriptor: PropertyDescriptor
) {
  console.log(descriptor);
}

class Printer {
  private message: string;

  constructor(message?: string) {
    this.message = message ?? "Clicked!!";
  }

  @descriptive
  @bind
  execute() {
    console.log(this.message);
  }
}

const p = new Printer();
const button = document.createElement("button");

button.id = "click";
button.textContent = "Click";
button.addEventListener("click", p.execute);

document.body.appendChild(button);
