function combine(input1: number | string, input2: number | string) {
  if (typeof input1 === "number" && typeof input2 === "number") {
    return input1 + input2;
  }

  return input1.toString() + " " + input2.toString();
}

const sum = combine(1, 2);
console.log("sum: ", sum);

const transaction = combine(120, "Have a cup of coffee.");
console.log("transaction: ", transaction);
