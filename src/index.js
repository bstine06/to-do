import './style.css';
import { TodoItem } from './todo-item.js';

const projects = {};

projects["Default List"] = [];


document.addEventListener("DOMContentLoaded", () => {
  let sampleTodoItem = new TodoItem("eat", "food", "2024-06-20", 2, "nachos");
  addToDoItem(sampleTodoItem, "Default List");
  console.log(projects);
  const projectViewSelect = document.querySelector("#project-view-select");
  populateProjectsIntoSelect(projectViewSelect);
});


function addToDoItem(newTodoItem, project) {
  if (!(project in projects)) {
    throw new Error(`project with name '${project}' does not exist in projects.`)
  }
  projects[project].push(newTodoItem);
  console.log(projects);
  displayAllTasksInProject(project);
}


const newTaskModal = document.querySelector('#new-task-modal');
const newTaskButton = document.querySelector('#new-task-button');
const closeNewTaskModalSpan = document.querySelector("#close-new-task-span");
const newTaskForm = document.querySelector('#new-task-form');
const projectSelect = document.querySelector('#project-select');

newTaskButton.addEventListener('click', () => {
    newTaskModal.style.display = "block";
    populateProjectsIntoSelect(projectSelect);
    projectSelect.value = projectViewSelect.value;
});

function populateProjectsIntoSelect(select) {
  select.innerHTML = '';
    for (const [key] of Object.entries(projects)) {
      const projectOption = document.createElement('option');
      projectOption.innerHTML = key;
      select.appendChild(projectOption);
    }
}

window.onclick = function(event) {
    if (event.target == newTaskModal) {
        closeAndResetTaskModal();
    }
}

closeNewTaskModalSpan.addEventListener('click', () => {
  closeAndResetTaskModal();
})

newTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Retrieve form data
    const formData = new FormData(newTaskForm);
    const taskTitle = formData.get('title');
    const taskDescription = formData.get('description');
    const taskDueDate = formData.get('due-date');
    const taskPriority = formData.get('priority');
    const taskNotes = formData.get('notes');
    const taskProject = formData.get('project');

    const newTask = new TodoItem(taskTitle, taskDescription, taskDueDate, taskPriority, taskNotes);
    console.log(newTask);

    addToDoItem(newTask, taskProject);

    closeAndResetTaskModal();
})

function closeAndResetTaskModal() {
    newTaskModal.style.display = "none";
    newTaskForm.reset();
}

const mainContent = document.querySelector('#main-content');

function displayAllTasksInProject(project) {
  mainContent.innerHTML = '';
  const currentProject = projects[project];
  console.log(currentProject)
  currentProject.forEach((task) => {
    const taskDisplayElement = createTaskDisplayElement(task);
    mainContent.appendChild(taskDisplayElement);
  });
  const projectTitle = document.querySelector('#project-title');
  projectTitle.innerHTML = projectViewSelect.value;
}

function createTaskDisplayElement(task) {
  const taskDisplayDiv = document.createElement('div');
  const taskDisplayTitle = document.createElement('h3');
  const taskDisplayDescription = document.createElement('p');
  const taskDisplayDueDate = document.createElement('p');
  const taskDisplayNotes = document.createElement('p');

  taskDisplayTitle.innerHTML = task.title;
  taskDisplayDescription.innerHTML = task.description;
  taskDisplayDueDate.innerHTML = `Due: ${task.dueDate}`;
  taskDisplayNotes.innerHTML = task.notes;

  taskDisplayDiv.appendChild(taskDisplayTitle);
  taskDisplayDiv.appendChild(taskDisplayDueDate);
  taskDisplayDiv.appendChild(taskDisplayDescription);
  taskDisplayDiv.appendChild(taskDisplayNotes);

  switch (task.priority) {
    case 1: taskDisplayDiv.classList.add('low-priority'); break;
    case 2: taskDisplayDiv.classList.add('med-priority'); break;
    default: taskDisplayDiv.classList.add('high-priority');
  }

  taskDisplayDiv.classList.add('task-display');

  return taskDisplayDiv;
}




const newProjectModal = document.querySelector('#new-project-modal');
const newProjectButton = document.querySelector('#new-project-button');
const closeNewProjectModalSpan = document.querySelector("#close-new-project-span");
const newProjectForm = document.querySelector('#new-project-form');

newProjectButton.addEventListener('click', () => {
  newProjectModal.style.display = "block";
});

function closeAndResetProjectModal() {
  newProjectModal.style.display = "none";
  newProjectForm.reset();
}

window.onclick = function(event) {
  if (event.target == newProjectModal) {
      closeAndResetProjectModal();
  }
}

closeNewProjectModalSpan.addEventListener('click', () => {
closeAndResetProjectModal();
})

newProjectForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Retrieve form data
  const formData = new FormData(newProjectForm);
  const projectTitle = formData.get('title');

  console.log(projectTitle);

  projects[projectTitle] = [];

  const projectViewSelect = document.querySelector("#project-view-select");
  populateProjectsIntoSelect(projectViewSelect);
  populateProjectsIntoSelect(projectSelect);

  closeAndResetProjectModal();
});

const projectViewSelect = document.querySelector('#project-view-select')


projectViewSelect.addEventListener('change', (event) => {
  displayAllTasksInProject(projectViewSelect.value);
})