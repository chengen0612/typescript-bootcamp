function calculate(num1: number, num2: number, method: "add" | "subtract") {
  switch (method) {
    case "add":
      return num1 + num2;

    case "subtract":
      return num1 - num2;

    default:
    // Unreachable
  }
}

console.log(calculate(100, 5, "add"));
console.log(calculate(100, 5, "subtract"));
