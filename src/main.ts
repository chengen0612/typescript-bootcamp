import { ProjectForm } from "./components/ProjectForm.js";
import {
  ActiveProjectsList,
  FinishedProjectsList,
} from "./components/ProjectsList.js";

new ProjectForm("project-input", "root", "user-input");
new ActiveProjectsList();
new FinishedProjectsList();
