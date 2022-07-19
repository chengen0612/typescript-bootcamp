const merge = <T extends object, U extends object>(obj1: T, obj2: U) => {
  return Object.assign(obj1, obj2);
};

const object1 = { id: 6203854, name: "Premium 6-Inch Waterproof Boots" };
const object2 = { id: 6203854, price: 210 };

const merged = merge(object1, object2);

// 型‘number‘の引数を型‘object‘のパラメーターに割り当てることができない
// const violated = merge(1, 2);
