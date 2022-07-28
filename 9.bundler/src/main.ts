import { ProjectForm } from "./components/ProjectForm";
import {
  ActiveProjectsList,
  FinishedProjectsList,
} from "./components/ProjectsList";

new ProjectForm("project-input", "root", "user-input");
new ActiveProjectsList();
new FinishedProjectsList();
