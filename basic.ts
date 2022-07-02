function add(n1: number, n2: number, shouldPrint: boolean, prefix: string) {
  const sum = n1 + n2;

  if (shouldPrint) {
    return console.log(prefix + sum);
  }
  return sum;
}

const number1 = 2;
const number2 = 3.5;
const shouldPrint = true;
const prefix = "Result: ";

add(number1, number2, shouldPrint, prefix);
