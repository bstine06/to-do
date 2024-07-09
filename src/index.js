import './style.css';
import { Task } from './task.js';
import {Project} from './project.js';
import { View } from './view.js';
import { apiGetAllTasks, apiGetAllProjects, apiCreateTask, apiGetAllTasksInProject, apiCheckServerHealth } from './api.js';

let projects = [];

const view = new View();
let focusTask = new Task();

let connection = false;

view.setupNewTaskModalListeners();
view.setupNewTaskSubmitListener(addTask);
view.setupNewProjectModalListeners();
view.setupNewProjectSubmitListener(addProject);
view.setupProjectViewSelectListener(getAllTasksInProject, setFocusTask);
view.setupProjectSelectListener(getAllTasksInProject, setFocusTask);
view.setupEditProjectModalListeners();
view.setupEditProjectSubmitListener(editProject);
view.setupEditTaskSubmitListener(editTask);
view.setupEditTaskModalListeners(getFocusTask);
view.bindCompleteElement(handleCompleteElement.bind(this));

initialize();


async function initialize() {
  try {
    await checkServerHealth();
    projects = await getAllProjects();
    await fetchAndPopulateAllTasksForAllProjects();
    view.displayTasks(projects[0].tasks, setFocusTask);
    view.updateProjectTitle(projects[0].title);
    view.populateProjectsIntoSelects(getProjectTitles());
  } catch (error) {
    console.error("An error occurred during initialization:", error);
  }
}


function getProjectTitles() {
  const projectTitles = projects.map((project) => {
    return project.title;
  });
  return projectTitles;
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
  view.displayTasks(projects[projectTitle], setFocusTask);
}

projects["Default List"] = [];

// document.addEventListener("DOMContentLoaded", () => {
//   createSampleContent();
  
// });

function setFocusTask(task) {
  focusTask = task;
}

function getFocusTask(task) {
  return focusTask;
}

//separated from view
function addTask(newTask, projectTitle) {
  if (!(projectTitle in projects)) {
    throw new Error(`project with name '${projectTitle}' does not exist in projects.`)
  }
  projects[projectTitle].push(newTask);
  view.displayTasks(getAllTasksInProject(projectTitle), setFocusTask);
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
  //throw error if duplicate name is trying to be added
  if (projects.hasOwnProperty(projectTitle)) {
    throw new Error("Cannot assign duplicate project names");
  }
  projects[projectTitle] = [];
  return getAllTasksInProject(projectTitle);
}

function editProject(newProjectTitle, oldProjectTitle) {
  //immediately return if its the same name
  if (newProjectTitle === oldProjectTitle) return getAllTasksInProject(newProjectTitle);
  
  //throw error if duplicate name is trying to be added
  if (projects.hasOwnProperty(newProjectTitle)) {
    throw new Error("Cannot assign duplicate project names");
  }
  projects[newProjectTitle] = projects[oldProjectTitle];
  delete projects[oldProjectTitle];
  view.populateProjectsIntoSelects(getProjectTitles());
  
  return getAllTasksInProject(newProjectTitle);
}

function getAllTasksInProject(projectTitle) {
  for (const project of projects) {
    if (project.title === projectTitle) {
      return project.tasks;
    }
  }
  return undefined;
}

async function fetchAllTasksInProject(projectUUID) {
  try {
    const projectTasks = await apiGetAllTasksInProject(projectUUID);
    return projectTasks;
  } catch (error) {
    console.error('Error:', error);
    console.log("Display error message in HTML");
  }
}

async function getAllTasks() {
  try {
    const tasks = await apiGetAllTasks();
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getAllProjects() {
  try {
    const apiResponse = await apiGetAllProjects();
    return makeProjectObjects(apiResponse);
    // view.populateProjectsIntoSelects(getProjectTitles());
  } catch (error) {
    console.error('Error:', error);
  }
}

async function checkServerHealth() {
  try {
    await apiCheckServerHealth();
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

function makeTaskObjects(taskData) {
  const tasks = []
  taskData.forEach((t) => {
    const [year, month, day] = t.due_date.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    const newTask = new Task(t.name, t.description, dueDate, t.priority, t.notes, t.uuid);
    tasks.push(newTask);
  })
  return tasks;
}

function makeProjectObjects(projectData) {
  const myProjects = [];
  projectData.forEach((p, index) => {
    const newProject = new Project(p.name, p.uuid);
    myProjects.push(newProject);
  });
  return myProjects;
}

async function fetchAndPopulateAllTasksForAllProjects() {
  for (const project of projects) {
    try {
      const projectTasks = await fetchAllTasksInProject(project.UUID);
      project.tasks = makeTaskObjects(projectTasks);
    } catch (error) {
      console.error(`Failed to fetch tasks for project ${project.UUID}:`, error);
    }
  }
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