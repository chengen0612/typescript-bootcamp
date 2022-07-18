type Shape =
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number }
  | { kind: "circle"; radius: number };

const getArea = (s: Shape) => {
  let output: number;

  switch (s.kind) {
    case "circle":
      output = Math.PI * Math.pow(s.radius, 2);
      break;

    case "square":
      output = Math.pow(s.x, 2);
      break;

    case "triangle":
      output = (s.x * s.y) / 2;
      break;
  }

  return output;
};

const a = getArea({ kind: "circle", radius: 12 });

console.log(a);
