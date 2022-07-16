interface Profile {
  name: string;
  describe: (phrase: string) => void;
}

class User implements Profile {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  describe(phrase: string) {
    console.log(`Hi, I am ${this.name}. ${phrase}`);
  }
}

const u = new User("Vicky", 21);
u.describe("I love to travel on weekends.");
