/* Utility */
function divide() {
  console.log("***");
}

/* Property decorator */
function logProperty(target: any, propName: string) {
  console.log("* Property *");
  console.log(`The decorator is applied to "${propName}" property.`);
  console.log("The property is declared in...");
  console.log(target);
  divide();
}

/* Accessor decorator */
function logAccessor(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) {
  console.log("* Accessor *");
  console.log(`The decorator is applied to "${name}" accessor.`);
  console.log(`The accessor is declared in...`);
  console.log(target);
  console.log(`Further information...`);
  console.log(descriptor);
  divide();
}

/* Method decorator */
function logMethod(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("* Method *");
  console.log(`The decorator is applied to "${name}" method.`);
  console.log(`The method is declared in...`);
  console.log(target);
  console.log(`Further information...`);
  console.log(descriptor);
  divide();
}

/* Parameter decorator */
function logParameter(target: any, name: string | Symbol, index: number) {
  console.log("* Parameter *");
  console.log(`The decorator is applied to the parameter in "${name}" method.`);
  console.log(`The index of the target parameter is ${index}`);
  console.log(`The method of this parameter is declared in...`);
  console.log(target);
  divide();
}

class C {
  @logProperty
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  @logAccessor
  get name() {
    return this._name;
  }

  @logMethod
  static makeSound(@logParameter phrase: string) {
    console.log(phrase);
  }
}
