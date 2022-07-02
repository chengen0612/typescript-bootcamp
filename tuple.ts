const role: [number, string] = [5, "engineer"];

// The length of 'tuple' could be mutated by array methods
role.push(123);
role.pop();
role.pop();

console.log(role);
