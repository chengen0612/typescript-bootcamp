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

interface ProjectType {
  title: string;
  description: string;
  manday: number;
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
class Store {
  private static instance: Store;
  private projects: any[];
  private listeners: Function[];

  private constructor() {
    this.projects = [];
    this.listeners = [];
  }

  static refer() {
    if (!this.instance) {
      this.instance = new Store();
    }

    return this.instance;
  }

  subscribe(listener: Function) {
    this.listeners = [...this.listeners, listener];
  }

  addProjects(project: any) {
    this.projects = [...this.projects, project];

    for (const listener of this.listeners) {
      // TODO: Check implementation
      listener(this.projects);
    }
  }
}

const store = Store.refer();

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

    this.template = template;
    this.instance = clone;

    this.initialize();
    this.render();
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();

    try {
      const data = this.read();
      this.inspect(data);
      alert("All validation passed!");
      // TODO: Check implementation
      store.addProjects(data);
      this.reset();
    } catch (error: any) {
      alert(error.message);
    }
  }

  private inputHandler(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }

  private initialize() {
    this.instance.id = "user-input";
    this.instance.addEventListener("submit", this.submitHandler);
    this.instance.addEventListener("input", this.inputHandler);
  }

  private render() {
    const root = document.getElementById("root")! as HTMLDivElement;
    root.appendChild(this.instance);
  }

  @Writable(false)
  read() {
    const formData = new FormData(this.instance);

    const title = formData.get("title")! as string;
    const description = formData.get("description")! as string;
    const manday = formData.get("manday")! as string;

    return new Project(title, description, +manday);
  }

  @Writable(false)
  inspect(data: Project) {
    validate(data);
  }

  @Writable(false)
  reset() {
    this.instance.reset();
  }
}

type ProjectsListKind = "active" | "finished";

abstract class ProjectsList {
  protected template: HTMLTemplateElement;
  protected instance: HTMLElement;
  protected ul: HTMLUListElement;
  protected abstract kind: ProjectsListKind;

  constructor() {
    const template = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    const clone = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    const ul = clone.querySelector("ul")! as HTMLUListElement;

    this.template = template;
    this.instance = clone;
    this.ul = ul;
  }

  protected initialize() {
    this.instance.id = `${this.kind}-projects`;
    this.instance.querySelector("h2")!.textContent = {
      active: "実行中プロジェクト",
      finished: "完了プロジェクト",
    }[this.kind];
    this.ul.id = `${this.kind}-projects-list`;
  }

  protected render() {
    const root = document.getElementById("root")! as HTMLDivElement;
    root.appendChild(this.instance);
  }
}

class ActiveProjectsList extends ProjectsList {
  kind: ProjectsListKind = "active";

  constructor() {
    super();
    this.initialize();
    this.render();
  }

  initialize() {
    super.initialize();
    store.subscribe((projects: any[]) => {
      this.ul.replaceChildren();

      projects.forEach((project) => {
        const li = document.createElement("li");
        li.textContent = project.title;

        this.ul.appendChild(li);
      });
    });
  }
}

class FinishedProjectsList extends ProjectsList {
  kind: ProjectsListKind = "finished";

  constructor() {
    super();
    this.initialize();
    this.render();
  }
}

// class ProjectListItem {
//   readonly template: HTMLTemplateElement;
//   private instance: HTMLLIElement;

//   constructor() {
//     const template = document.getElementById(
//       "single-project"
//     )! as HTMLTemplateElement;
//     const clone = template.content.firstElementChild!.cloneNode(
//       true
//     ) as HTMLLIElement;

//     this.template = template;
//     this.instance = clone;

//     this.initialize();
//   }

//   private initialize() {}
// }

const productForm = new ProductForm();
const activeProjectsList = new ActiveProjectsList();
const finishedProjectsList = new FinishedProjectsList();
