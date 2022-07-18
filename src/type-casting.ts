// Approach 1
// const input = <HTMLInputElement>document.getElementById("input")!;

// Approach 2
const input = document.getElementById("input")! as HTMLInputElement;

input.addEventListener("change", function () {
  console.log(this.value);
});
