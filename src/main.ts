/* Type */
enum Rule {
  String = "string",
  Positive = "positive",
}

type RuleValidatorMap = {
  [value in Rule]: (propertyName: string, value: unknown) => void;
};

/** @desc Determine the shape of each property of the object. */
interface DataSchema {
  [propertyName: string]: Rule[];
}

/* Decorator */
function AutoBind(
  _constructor: object,
  _methodName: string,
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

function Writable(bool: boolean) {
  return function (
    _constructor: object,
    _methodName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    return {
      ...descriptor,
      writable: bool,
    };
  };
}

function ApplyRule(rule: Rule | Rule[]) {
  return function (_constructor: object, propertyName: string) {
    projectSchema[propertyName] = [
      ...(projectSchema[propertyName] ?? []),
      ...(Array.isArray(rule) ? rule : [rule]),
    ];
  };
}

/* Utility */
function stringValidator(propertyName: string, value: unknown) {
  if (typeof value !== "string") {
    throw new Error(`
      String validation can only be applied to string value.
      Property "${propertyName}" does not contain string value.
    `);
  }

  if (!(value.trim().length > 0)) {
    throw new Error(
      `Input value cannot be empty. Enter "${propertyName}" field before submit.`
    );
  }
}

function positiveValidator(propertyName: string, value: unknown) {
  if (typeof value !== "number") {
    throw new Error(`
      Positive validation can only be applied to number value.
      Property "${propertyName}" does not contain number value.
    `);
  }

  if (!(value > 0)) {
    throw new Error(
      `Input value must be greater then 0. Replace "${propertyName}" field with positive number.`
    );
  }
}

const validatorMap: RuleValidatorMap = {
  [Rule.String]: stringValidator,
  [Rule.Positive]: positiveValidator,
};

function validate(project: object) {
  Object.entries(project).forEach(([propertyName, value]) => {
    const propertyRules = projectSchema[propertyName];

    propertyRules.forEach((rule) => {
      const validator = validatorMap[rule];

      validator(propertyName, value);
    });
  });
}

/* Class */
const projectSchema: DataSchema = {};

class Project {
  @ApplyRule(Rule.String)
  title: string;

  @ApplyRule(Rule.String)
  description: string;

  @ApplyRule(Rule.Positive)
  manday: number;

  constructor(title: string, description: string, manday: number) {
    this.title = title;
    this.description = description;
    this.manday = manday;
  }
}

/* Body */
class ProductForm {
  readonly template: HTMLTemplateElement;
  private instance: HTMLFormElement;

  constructor() {
    const template = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    const clone = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLFormElement;

    clone.id = "user-input";

    this.template = template;
    this.instance = clone;

    this.listen();
    this.insert();
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();

    try {
      this.inspect();
      alert("All validation passed!");
      this.reset();
    } catch (error: any) {
      alert(error.message);
    }
  }

  private inputHandler(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }

  private listen() {
    this.instance.addEventListener("submit", this.submitHandler);
    this.instance.addEventListener("input", this.inputHandler);
  }

  private insert() {
    const root = document.getElementById("root")! as HTMLDivElement;
    root.appendChild(this.instance);
  }

  @Writable(false)
  inspect() {
    const formData = new FormData(this.instance);
    const title = formData.get("title")! as string;
    const description = formData.get("description")! as string;
    const manday = formData.get("manday")! as string;

    const project = new Project(title, description, +manday);

    validate(project);
  }

  @Writable(false)
  reset() {
    this.instance.reset();
  }
}

const p = new ProductForm();
