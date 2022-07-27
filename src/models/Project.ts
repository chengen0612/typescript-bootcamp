import { ApplyRule } from "../decorators/ApplyRule.js";
import { Rule } from "../utils/validation.js";

export enum Status {
  Active = "active",
  Completed = "finished",
}

export type ProjectsListKind = `${Status}`;
type ProjectStatus = `${Status}`;

export class Project {
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
