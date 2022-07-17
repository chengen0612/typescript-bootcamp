abstract class Animal {
  constructor(public name: string) {}

  abstract roar(): void;
}

class Cat extends Animal {
  roar() {
    console.log(`${this.name} says meow meow meow...`);
  }
}

class Mouse extends Animal {
  roar() {
    console.log(`${this.name} says chi chi chi...`);
  }
}

new Cat("Tom").roar();
new Mouse("Jerry").roar();
