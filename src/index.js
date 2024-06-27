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
view.setupEditTaskSubmitListener(editTask);
view.setupEditTaskModalListeners();
view.bindCompleteElement(handleCompleteElement.bind(this));

function getProjectTitles() {
  return Object.keys(projects);
}

function handleCompleteElement(uuid, projectTitle) {
  console.log(`Complete element with UUID: ${uuid}`);
  // Perform the deletion logic here
  const index = projects[projectTitle].findIndex(task => task.UUID === uuid);

  // Check if the object was found
  if (index !== -1) {
    // Remove the object from the array
    projects[projectTitle].splice(index, 1);
  }
  view.displayTasks(projects[projectTitle]);
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

function editTask(modifiedTask, projectTitle) {
  const index = projects[projectTitle].findIndex(task => task.UUID === modifiedTask.UUID);

  // Check if the object was found
  if (index !== -1) {
    // Remove the object from the array
    projects[projectTitle].splice(index, 1);
    addTask(modifiedTask, projectTitle);
  }
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
  let sampleTask = new Task("low priority task", "eat", new Date(), 'low-priority', "nachos");
  addTask(sampleTask, "Default List");

  let sampleTask2 = new Task("med priority task", "food", new Date(), 'medium-priority', "nachos");
  addTask(sampleTask2, "Default List");

  let sampleTask3 = new Task("high priority task", "munch", new Date(), 'high-priority', "nachos");
  addTask(sampleTask3, "Default List");

  view.populateProjectsIntoSelects(getProjectTitles());
}