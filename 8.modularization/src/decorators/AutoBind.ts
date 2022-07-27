export function AutoBind(
  _target: object,
  _propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  return {
    configurable: false,
    enumerable: false,
    get() {
      return descriptor.value.bind(this);
    },
  };
}
