function sayHello(name: string) {
  return `Hello, ${name}!`;
}

function sayGoodbye() {
  return "See you!";
}

let f1: Function;
f1 = sayHello;
f1 = sayGoodbye;

///////
// Type checking is unreliable in the situations below.
///////
let f2: (input: string) => string;
f2 = sayHello;
f2 = sayGoodbye;

let f3 = sayHello;
f3 = sayGoodbye;
