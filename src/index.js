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
view.setupEditProjectModalListeners();
view.setupEditProjectSubmitListener(editProject);

function getProjectTitles() {
  return Object.keys(projects);
}

projects["Default List"] = [];


document.addEventListener("DOMContentLoaded", () => {
  createSampleContent();
  
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

function editProject(newProjectTitle, oldProjectTitle) {
  projects[newProjectTitle] = projects[oldProjectTitle];
  delete projects[oldProjectTitle];
  view.populateProjectsIntoSelects(getProjectTitles());
  
  return getAllTasksInProject(newProjectTitle);
}

function getAllTasksInProject(project) {
  return projects[project]
}

function createSampleContent() {
  let sampleTask = new Task("low priority task", "eat", new Date(), 1, "nachos");
  addTask(sampleTask, "Default List");

  let sampleTask2 = new Task("med priority task", "food", new Date(), 2, "nachos");
  addTask(sampleTask2, "Default List");

  let sampleTask3 = new Task("high priority task", "munch", new Date(), 3, "nachos");
  addTask(sampleTask3, "Default List");

  view.populateProjectsIntoSelects(getProjectTitles());
}