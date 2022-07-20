function logger(constructor: Function) {
  console.log("Logging...");
  console.log(constructor);
}

@logger
class User {
  readonly name: string;
  constructor(name: string) {
    console.log("Initializing user...");

    this.name = name;
  }
}
