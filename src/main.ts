/* Type */
type PlainObject = { [key: string | symbol]: unknown };

enum Rule {
  String = "string",
  Positive = "positive",
}

type RuleValidatorMap = {
  [value in Rule]: (propertyKey: string, value: unknown) => void;
};

/** @desc Determine the shape of each property of the object. */
interface DataSchema {
  [propertyKey: string]: Rule[];
}

type Observer<T> = (items: T) => void;

enum Status {
  Active = "active",
  Completed = "finished",
}

type ProjectsListKind = `${Status}`;
type ProjectStatus = `${Status}`;

interface Draggable {
  ondragstart(event: DragEvent): void;
  ondragend?(event: DragEvent): void;
}

interface Droppable {
  ondragover(event: DragEvent): void;
  ondragleave?(event: DragEvent): void;
  ondrop(event: DragEvent): void;
}

/* Decorator */
function AutoBind(
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

function Writable(bool: boolean) {
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

function ApplyRule(rule: Rule | Rule[]) {
  return function (_target: object, propertyKey: string) {
    projectSchema[propertyKey] = [
      ...(projectSchema[propertyKey] ?? []),
      ...(Array.isArray(rule) ? rule : [rule]),
    ];
  };
}

/* Utility */
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

function validate(project: PlainObject) {
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

/* Class */
abstract class State<T> {
  protected observers: Observer<T>[];
  protected state: T;

  protected constructor(initialState: T) {
    this.observers = [];
    this.state = initialState;
  }

  observe(cb: Observer<T>) {
    this.observers.push(cb);
  }

  protected abstract notify(): void;
}

class ProjectsState extends State<Project[]> {
  private static instance: ProjectsState;

  static refer() {
    if (!this.instance) {
      this.instance = new ProjectsState([]);
    }

    return this.instance;
  }

  protected constructor(initialState: Project[]) {
    super(initialState);
  }

  addProject(project: Project) {
    this.state.push(project);
    this.notify();
  }

  updateProject(id: string, options: Partial<Omit<Project, "id">>) {
    const index = this.state.findIndex((project) => project.id === id);

    this.state[index] = { ...this.state[index], ...options };
    this.notify();
  }

  protected notify() {
    for (const observer of this.observers) {
      observer(this.state.slice());
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

class ProjectForm extends Component<HTMLFormElement, HTMLDivElement> {
  private instanceId: string;

  constructor(templateId: string, parentId: string, instanceId: string) {
    super(templateId, parentId);

    this.instanceId = instanceId;

    this.initialize();
    this.render();
  }

  @Writable(false)
  read(): Project {
    const formData = new FormData(this.instance);

    return new Project(
      formData.get("title")! as string,
      formData.get("description")! as string,
      formData.get("manday")! as string
    );
  }

  @Writable(false)
  inspect(p: Project) {
    validate({ ...p });
  }

  @Writable(false)
  reset() {
    this.instance.reset();
  }

  private initialize() {
    this.instance.id = this.instanceId;
    this.instance.addEventListener("submit", this.onsubmit);
  }

  @AutoBind
  private onsubmit(event: Event) {
    event.preventDefault();

    try {
      const p = this.read();
      this.inspect(p);
      alert("All validation passed!");
      projectsState.addProject(p);
      this.reset();
    } catch (error: any) {
      alert(error.message);
    }
  }
}

const PLAIN_TEXT = "text/plain";

abstract class ProjectsList
  extends Component<HTMLElement, HTMLDivElement>
  implements Droppable
{
  readonly ul: HTMLUListElement;
  protected abstract kind: ProjectsListKind;

  constructor() {
    super("project-list", "root");
    this.ul = this.instance.querySelector("ul")! as HTMLUListElement;
  }

  @AutoBind
  ondragover(event: DragEvent) {
    event.preventDefault();
  }

  @AutoBind
  ondrop(event: DragEvent) {
    event.preventDefault();

    const currentTarget = event.currentTarget! as HTMLDivElement;
    const draggedNodeId = event.dataTransfer!.getData(PLAIN_TEXT);
    const draggedNode = document.getElementById(draggedNodeId)!;

    if (!currentTarget.contains(draggedNode)) {
      draggedNode.parentNode!.removeChild(draggedNode);
      this.ul.appendChild(draggedNode);

      projectsState.updateProject(draggedNodeId, { status: this.kind });
    }
  }

  protected initialize() {
    this.instance.id = `${this.kind}-projects`;
    this.instance.querySelector("h2")!.textContent = {
      active: "実行中プロジェクト",
      finished: "完了プロジェクト",
    }[this.kind];
    this.ul.id = `${this.kind}-projects-list`;

    this.ul.addEventListener("dragover", this.ondragover);
    this.ul.addEventListener("drop", this.ondrop);
  }
}

class ActiveProjectsList extends ProjectsList {
  kind: ProjectsListKind = Status.Active;

  constructor() {
    super();
    this.initialize();
    this.render();
  }

  protected initialize() {
    super.initialize();
    projectsState.observe((projects: Project[]) => {
      this.ul.replaceChildren();

      projects
        .filter((project) => project.status === Status.Active)
        .forEach((project) => {
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

class ProjectsListItem
  extends Component<HTMLLIElement, HTMLUListElement>
  implements Draggable
{
  readonly data: Project;

  constructor(project: Project) {
    super("single-project", activeProjectsList.ul.id);
    this.data = project;
    this.initialize();
  }

  @AutoBind
  ondragstart(event: DragEvent) {
    event.dataTransfer!.effectAllowed = "move";
    event.dataTransfer!.setData(PLAIN_TEXT, this.data.id);
  }

  private initialize() {
    const { id, title, description, manday } = this.data;

    const h2 = this.instance.querySelector("h2")! as HTMLHeadingElement;
    const h3 = this.instance.querySelector("h3")! as HTMLHeadingElement;
    const p = this.instance.querySelector("p")! as HTMLParagraphElement;

    h2.textContent = title;
    h3.textContent = this.formatManday(+manday);
    p.textContent = description;

    this.instance.id = id;
    this.instance.draggable = true;
    this.instance.addEventListener("dragstart", this.ondragstart);
  }

  private formatManday(manday: number): string {
    return manday < 20 ? manday + "人日" : manday / 20 + "人月";
  }
}

const productForm = new ProjectForm("project-input", "root", "user-input");
const activeProjectsList = new ActiveProjectsList();
const finishedProjectsList = new FinishedProjectsList();
