class User {
  constructor(readonly name?: string) {}

  greet() {
    if (this.name) {
      console.log(`Hello, I am ${this.name}!`);
    } else {
      console.log("Hi!");
    }
  }
}

new User("Evans").greet();
new User().greet();
