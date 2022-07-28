import { State } from "./State";
import { Project } from "../models/Project";

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

export const projectsState = ProjectsState.refer();
