/* Example 1 */
let todoList: Array<object>;
todoList = [{ id: 1, description: "Take programming course" }];

/* Example 2 */
const delay = (duration: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      console.log(`${duration / 1000} seconds passed`);
    }, duration);
  });
};

delay(5000);
delay(300);
delay(3000);
