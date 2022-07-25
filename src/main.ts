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

enum Status {
  Active = "active",
  Completed = "finished",
}

type ProjectsListKind = `${Status}`;
type ProjectStatus = `${Status}`;

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

function validate(project: Project) {
  Object.entries(project).forEach(([propertyName, value]) => {
    const propertyRules = projectSchema[propertyName];

    if (propertyRules) {
      propertyRules.forEach((rule) => {
        const validator = validatorMap[rule];

        validator(propertyName, value);
      });
    }
  });
}

/* Class */
type Listener<T> = (items: T) => void;

abstract class State<T> {
  protected listeners: Listener<T>[];
  protected state: T;

  protected constructor(initialState: T) {
    this.listeners = [];
    this.state = initialState;
  }

  addListener(callback: Listener<T>) {
    this.listeners.push(callback);
  }
}

class ProjectsState extends State<Project[]> {
  private static instance: ProjectsState;

  constructor(initialState: Project[]) {
    super(initialState);
  }

  static refer() {
    if (!this.instance) {
      this.instance = new ProjectsState([]);
    }

    return this.instance;
  }

  addProject(project: Project) {
    this.state.push(project);

    for (const listener of this.listeners) {
      listener(this.state.slice());
    }
  }
}

const projectsState = ProjectsState.refer();

const projectSchema: DataSchema = {};

class Project {
  readonly id: string;

  @ApplyRule(Rule.String)
  title: string;

  @ApplyRule(Rule.String)
  description: string;

  @ApplyRule(Rule.Positive)
  manday: number;

  status: ProjectStatus;

  constructor(title: string, description: string, manday: string) {
    this.id = Math.floor(Math.random() * 100).toString();
    this.title = title;
    this.description = description;
    this.manday = +manday;
    this.status = Status.Active;
  }
}

abstract class Component<T extends HTMLElement, V extends HTMLElement> {
  readonly instance: T;
  protected parentNode: V;

  constructor(templateId: string, parentId: string) {
    const template = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    const clone = template.content.firstElementChild!.cloneNode(true) as T;
    const parentNode = document.getElementById(parentId)! as V;

    this.instance = clone;
    this.parentNode = parentNode;
  }

  protected render() {
    this.parentNode.appendChild(this.instance);
  }
}

class ProductForm extends Component<HTMLFormElement, HTMLDivElement> {
  private instanceId: string;

  constructor(templateId: string, parentId: string, instanceId: string) {
    super(templateId, parentId);
    this.instanceId = instanceId;
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
      projectsState.addProject(data);
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
    this.instance.id = this.instanceId;
    this.instance.addEventListener("submit", this.submitHandler);
    this.instance.addEventListener("input", this.inputHandler);
  }

  @Writable(false)
  read() {
    const formData = new FormData(this.instance);

    return new Project(
      formData.get("title")! as string,
      formData.get("description")! as string,
      formData.get("manday")! as string
    );
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

abstract class ProjectsList extends Component<HTMLElement, HTMLDivElement> {
  readonly ul: HTMLUListElement;
  protected abstract kind: ProjectsListKind;

  constructor() {
    super("project-list", "root");
    this.ul = this.instance.querySelector("ul")! as HTMLUListElement;
    this.initialize();
    this.render();
  }

  protected initialize() {
    this.instance.id = `${this.kind}-projects`;
    this.instance.querySelector("h2")!.textContent = {
      active: "実行中プロジェクト",
      finished: "完了プロジェクト",
    }[this.kind];
    this.ul.id = `${this.kind}-projects-list`;
  }
}

class ActiveProjectsList extends ProjectsList {
  kind: ProjectsListKind = Status.Active;

  constructor() {
    super();
    this.initialize();
    this.render();
  }

  initialize() {
    super.initialize();
    projectsState.addListener((projects: Project[]) => {
      this.ul.replaceChildren();

      projects.forEach((project) => {
        const projectItem = new ProjectsListItem(project);

        this.ul.appendChild(projectItem.instance);
      });
    });
  }
}

class FinishedProjectsList extends ProjectsList {
  kind: ProjectsListKind = Status.Completed;

  constructor() {
    super();
    this.initialize();
    this.render();
  }
}

class ProjectsListItem extends Component<HTMLLIElement, HTMLUListElement> {
  readonly data: Project;

  constructor(project: Project) {
    super("single-project", activeProjectsList.ul.id);
    this.data = project;
    this.initialize();
  }

  private formatManday(manday: number): string {
    return manday < 20 ? manday + "人日" : manday / 20 + "人月";
  }

  private initialize() {
    const { title, description, manday } = this.data;

    const contentDomString = `
      <h2>${title}</h2>
      <h3>${this.formatManday(+manday)}</h3>
      <p>${description}<p>
    `;

    this.instance.innerHTML = contentDomString;
  }
}

const productForm = new ProductForm("project-input", "root", "user-input");
const activeProjectsList = new ActiveProjectsList();
const finishedProjectsList = new FinishedProjectsList();
