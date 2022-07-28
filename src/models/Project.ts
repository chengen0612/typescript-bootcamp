import { Rule, DataSchema } from "../utils/validation";

export enum Status {
  Active = "active",
  Completed = "finished",
}

export type ProjectsListKind = `${Status}`;
type ProjectStatus = `${Status}`;

const schema: DataSchema = {
  title: [Rule.String],
  description: [Rule.String],
  manday: [Rule.Positive],
};

export class Project {
  readonly id: string;
  readonly schema: DataSchema;
  title: string;
  description: string;
  manday: number;
  status: ProjectStatus;

  constructor(title: string, description: string, manday: string) {
    this.id = Math.floor(Math.random() * 100).toString();
    this.schema = schema;
    this.title = title;
    this.description = description;
    this.manday = +manday;
    this.status = Status.Active;
  }
}
