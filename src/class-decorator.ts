/**
 * Apply new feature to existing class constructor or replace the whole constructor.
 *
 * @param {Function} constructor The constructor function of applied class.
 * @returns {class} The modified constructor function.
 *
 * @see https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
 * @see https://2ality.com/2020/04/classes-as-values-typescript.html#a-generic-type-for-classes%3A-class%3Ct%3E
 */

// Tell typescript that the target of this decorator can be initialized with the new operator.
// Also declare that the generated instance will have a name property in string type
// so we can refer to the name property in the return constructor.
function RegisterEmail<T extends { new (...args: any[]): { name: string } }>(
  originalConstructor: T
) {
  return class extends originalConstructor {
    email: string;

    constructor(...args: any[]) {
      super(...args);
      this.email = `${this.name}@dummy.com`;
    }
  };
}

@RegisterEmail
class Profile {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const p = new Profile("Vincent", 35);

console.log(p);
