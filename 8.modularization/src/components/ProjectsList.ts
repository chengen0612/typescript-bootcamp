import { Component } from "./Component.js";
import { Droppable } from "../models/Drag.js";
import { Status, ProjectsListKind, Project } from "../models/Project.js";
import { ProjectsListItem } from "./ProjectsListItem.js";
import { AutoBind } from "../decorators/AutoBind.js";
import { projectsState } from "../states/ProjectsState.js";

import { PLAIN_TEXT } from "../constants/drag.js";

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

export class ActiveProjectsList extends ProjectsList {
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
          const projectItem = new ProjectsListItem(project, this.ul.id);

          this.ul.appendChild(projectItem.instance);
        });
    });
  }
}

export class FinishedProjectsList extends ProjectsList {
  kind: ProjectsListKind = Status.Completed;

  constructor() {
    super();
    this.initialize();
    this.render();
  }
}
