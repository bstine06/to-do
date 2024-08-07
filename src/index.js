import './style.css';
import { Task } from './task.js';
import { format } from 'date-fns';
import {Project} from './project.js';
import { View } from './view.js';
import { apiGetAllTasks, apiGetAllProjects, apiCreateTask, apiCreateProject, apiGetAllTasksInProject, apiCheckServerHealth, apiRemoveTaskByUUID } from './api.js';

let projects = [];

const view = new View();
let focusTask = new Task();

let connection = false;

view.setupNewTaskModalListeners();
view.setupNewTaskSubmitListener(addTask);
view.setupNewProjectModalListeners();
view.setupNewProjectSubmitListener(addProject);
view.setupProjectViewSelectListener(getProjectByUUID, setFocusTask);
view.setupProjectSelectListener(getProjectByUUID, setFocusTask);
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
    view.updateFocusedProject(projects[0]);
    view.populateProjectsIntoSelects(projects);
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

function getProjectUUIDs() {
  const projectUUIDs = projects.map((project) => {
    return project.UUID;
  });
  return projectUUIDs;
}

async function handleCompleteElement(taskUUID, projectUUID) {
  console.log(`Complete element with UUID: ${taskUUID}`);
  console.log(projects);
  const projectIndex = projects.findIndex(project => project.UUID === projectUUID);
  const taskIndex = projects[projectIndex].tasks.findIndex(task => task.UUID === taskUUID);
  console.log(projectIndex);
  projects[projectIndex].tasks.splice(taskIndex, 1);
  await removeTaskByUUID(taskUUID);
  view.displayTasks(projects[projectIndex].tasks, setFocusTask);
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

async function addTask(newTask, projectUUID) {
  for (const project of projects) {
    if (project.UUID === projectUUID) {
      console.log(project);
      project.tasks.push(newTask);
      await apiCreateTask(newTask.UUID, newTask.title, newTask.description, format(newTask.dueDate, "yyyy-MM-dd"), newTask.priority, newTask.notes, projectUUID);
      view.displayTasks(project.tasks, setFocusTask);
      view.updateFocusedProject(project);
    }
  }
}

function getUUIDFromProjectName(projectTitle) {
  for (const project of projects) {
    if (project.title === projectTitle) {
      return project.UUID;
    }
  }
}

function editTask(modifiedTask, projectUUID) {
  console.log(projectUUID);
  let index = -1;
  for (const project of projects) {
    if (project.UUID === projectUUID) {
      index = project.tasks.findIndex(task => task.UUID === modifiedTask.UUID);
      break;
    }
  }

  // Check if the object was found
  if (index !== -1) {
    // Remove the object from the array
    projects[projectTitle].splice(index, 1);
    addTask(modifiedTask, projectUUID);
  }
}

async function addProject(projectTitle) {
  //throw error if duplicate name is trying to be added
  for (const project of projects) {
    if (project.title === projectTitle) {
      throw new Error("Cannot assign duplicate project names");
    }
  }

  const newProject = new Project(projectTitle);
  projects.push(newProject);

  await apiCreateProject(newProject.UUID, newProject.title);
  view.displayTasks(newProject.tasks);
  view.populateProjectsIntoSelects(projects);
  view.updateFocusedProject(newProject);
}

function editProject(projectUUID, newProjectTitle) {
  const myProject = getProjectByUUID(projectUUID);
  //immediately return if name is the same as previous
  if (myProject.title === newProjectTitle) return myProject;

  //throw error if duplicate name is trying to be added
  for (const project of projects) {
    if (project.title === newProjectTitle) {
      throw new Error("Cannot assign duplicate project names");
    }
  }
  myProject.title = newProjectTitle;
  view.populateProjectsIntoSelects(projects);
  return myProject;
}

function getProjectByUUID(projectUUID) {
  for (const project of projects) {
    if (project.UUID === projectUUID) {
      return project;
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
  } catch (error) {
    console.log("display error message");
    view.displayErrorMessage("Could not establish connection to server");
    throw new Error('Server health check failed: ' + error);
  }
}

async function removeTaskByUUID(UUID) {
  try {
    await apiRemoveTaskByUUID(UUID);
  } catch (error) {
    console.log("display error message");
    view.displayErrorMessage("Could not establish connection to server");
    throw new Error('Lost connection to server: ' + error);
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