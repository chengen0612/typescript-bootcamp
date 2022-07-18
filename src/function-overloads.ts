type Combinable = string | number;

function combine(input1: number, input2: number): number;
function combine(input1: string, input2: string): string;
function combine(input1: string, input2: number): string;
function combine(input1: number, input2: string): string;
function combine(input1: Combinable, input2: Combinable) {
  if (typeof input1 === "string" || typeof input2 === "string") {
    return input1.toString() + input2.toString();
  }

  return input1 + input2;
}

const str = combine(10, "人十色");
const splitted = str.split("0");
console.log(splitted);

const sum = combine(16.4, 2);
console.log(Math.round(sum));
