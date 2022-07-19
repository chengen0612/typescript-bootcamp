// 戻り値がobject型だと推論され、中身については何も分からない
// const merge = (obj1: object, obj2: object) => {
//   return Object.assign(obj1, obj2);
// };

// 戻り値が交差型だと推論され、詳しい情報が表示される
const merge = <T, U>(obj1: T, obj2: U) => {
  return Object.assign(obj1, obj2);
};

const object1 = { id: 6203854, name: "Premium 6-Inch Waterproof Boots" };
const object2 = { id: 6203854, price: 210 };

const result = merge(object1, object2);

console.log(result.price);
