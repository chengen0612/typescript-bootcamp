let myHobbies: string[];

myHobbies = ["Coffee", "Music", "Coding"];
// Argument of type 'number' is not assignable to property of type 'string'
// myHobbies.push(123);

for (const hobby of myHobbies) {
  console.log(hobby.toUpperCase());
  // Property 'map' does not exist on type 'string'
  // console.log(hobby.map());
}
