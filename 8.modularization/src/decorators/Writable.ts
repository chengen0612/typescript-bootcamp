export function Writable(bool: boolean) {
  return function (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    return {
      ...descriptor,
      writable: bool,
    };
  };
}
