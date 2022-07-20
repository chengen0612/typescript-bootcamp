function logger(target: string) {
  return function (constructor: Function) {
    console.log(`Logging ${target} constructor...`);
    console.log(constructor);
  };
}

@logger("user")
class User {
  readonly name: string;
  constructor(name: string) {
    console.log("Initializing user...");

    this.name = name;
  }
}
