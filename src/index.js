import './style.css';
import { Task } from './task.js';
import { View } from './view.js';

const projects = {};

const view = new View();

view.setupNewTaskModalListeners();
view.setupNewTaskSubmitListener(addTask);
view.setupNewProjectModalListeners();
view.setupNewProjectSubmitListener(addProject);
view.setupProjectViewSelectListener(getAllTasksInProject);
view.setupProjectSelectListener(getAllTasksInProject);

function getProjectTitles() {
  return Object.keys(projects);
}

projects["Default List"] = [];


document.addEventListener("DOMContentLoaded", () => {
  let sampleTask = new Task("eat", "food", "2024-06-20", 2, "nachos");
  addTask(sampleTask, "Default List");
  view.populateProjectsIntoSelects(getProjectTitles());
});

//separated from view
function addTask(newTask, projectTitle) {
  if (!(projectTitle in projects)) {
    throw new Error(`project with name '${projectTitle}' does not exist in projects.`)
  }
  projects[projectTitle].push(newTask);
  view.displayTasks(getAllTasksInProject(projectTitle));
  view.updateProjectTitle(projectTitle);
}

function addProject(projectTitle) {
  projects[projectTitle] = [];
  view.populateProjectsIntoSelects(getProjectTitles());
  return getAllTasksInProject(projectTitle);
}

function getAllTasksInProject(project) {
  return projects[project]
}