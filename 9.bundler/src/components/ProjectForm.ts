import { Component } from "./Component";
import { Project } from "../models/Project";
import { Writable } from "../decorators/Writable";
import { AutoBind } from "../decorators/AutoBind";
import { validate } from "../utils/validation";
import { projectsState } from "../states/ProjectsState";

export class ProjectForm extends Component<HTMLFormElement, HTMLDivElement> {
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
    validate({ ...p }, p.schema);
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
