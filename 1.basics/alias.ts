type Role = "frontend" | "backend";

type Engineer = {
  name: string;
  tenure: number;
  role: Role;
};

const engineer1: Engineer = {
  name: "Evans",
  tenure: 1,
  role: "frontend",
};

console.log(engineer1);
