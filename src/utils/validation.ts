type PlainObject = { [key: string | symbol]: unknown };

export enum Rule {
  String = "string",
  Positive = "positive",
}

type RuleValidatorMap = {
  [value in Rule]: (propertyKey: string, value: unknown) => void;
};

/** @desc Define the rules to be applied to specific object. */
interface DataSchema {
  [propertyKey: string]: Rule[];
}

function stringValidator(propertyKey: string, value: unknown) {
  if (typeof value !== "string") {
    throw new Error(`
     String validation can only be applied to string value.
     Property "${propertyKey}" does not contain string value.
   `);
  }

  if (!(value.trim().length > 0)) {
    throw new Error(`
     Input value cannot be empty.
     Enter "${propertyKey}" field before submit.
   `);
  }
}

function positiveValidator(propertyKey: string, value: unknown) {
  if (typeof value !== "number") {
    throw new Error(`
     Positive validation can only be applied to number value.
     Property "${propertyKey}" does not contain number value.
   `);
  }

  if (!(value > 0)) {
    throw new Error(`
     Input value must be greater then 0.
     Replace "${propertyKey}" field with positive number.
   `);
  }
}

const ruleValidatorMap: RuleValidatorMap = {
  [Rule.String]: stringValidator,
  [Rule.Positive]: positiveValidator,
};

/** @desc Map through validators to check if the input object is valid. */
export function validate(project: PlainObject) {
  Object.entries(project).forEach(([propertyKey, value]) => {
    const propertyRules = projectSchema[propertyKey];

    if (propertyRules) {
      propertyRules.forEach((rule) => {
        const validator = ruleValidatorMap[rule];

        validator(propertyKey, value);
      });
    }
  });
}

export const projectSchema: DataSchema = {};
