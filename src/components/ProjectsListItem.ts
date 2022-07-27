import { Component } from "./Component.js";
import { Draggable } from "../models/Drag.js";
import { Project } from "../models/Project.js";
import { AutoBind } from "../decorators/AutoBind.js";

import { PLAIN_TEXT } from "../constants/drag.js";

export class ProjectsListItem
  extends Component<HTMLLIElement, HTMLUListElement>
  implements Draggable
{
  readonly data: Project;

  constructor(project: Project, parentId: string) {
    super("single-project", parentId);
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
