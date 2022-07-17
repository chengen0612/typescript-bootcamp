interface AddFn {
  (n1: number, n2: number): number;
}

const add: AddFn = (n1: number, n2: number) => n1 + n2;

console.log(add(10, 15));
