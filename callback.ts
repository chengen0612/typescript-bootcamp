function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
  const sum = n1 + n2;
  cb(sum);
}

addAndHandle(5, 10, (sum) => {
  console.log(`total: ${sum}`);
});
