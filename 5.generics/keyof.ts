function pick<T extends object, U extends keyof T>(obj: T, key: U) {
  return obj[key];
}

const obj = { title: "Some Day My Prince Will Come", artist: "Bill Evans" };

const result = pick(obj, "artist");

console.log(result);
