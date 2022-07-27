import { Rule, projectSchema } from "../utils/validation.js";

export function ApplyRule(rule: Rule | Rule[]) {
  return function (_target: object, propertyKey: string) {
    projectSchema[propertyKey] = [
      ...(projectSchema[propertyKey] ?? []),
      ...(Array.isArray(rule) ? rule : [rule]),
    ];
  };
}
