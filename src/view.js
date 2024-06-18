import { Task } from './task.js';
const { formatDistanceToNowStrict } = require("date-fns");

export class View {
  constructor() {
    this.mainContent = document.querySelector("#main-content");
    this.projectTitle = document.querySelector("#project-title");
    this.projectViewSelect = document.querySelector("#project-view-select");

    this.newTaskButton = document.querySelector("#new-task-button");
    this.newTaskModal = document.querySelector("#new-task-modal");
    this.closeNewTaskModalSpan = document.querySelector("#close-new-task-span");
    this.newTaskForm = document.querySelector("#new-task-form");
    this.projectSelect = document.querySelector("#project-select");
    
    this.newProjectButton = document.querySelector("#new-project-button");
    this.newProjectModal = document.querySelector("#new-project-modal");
    this.closeNewProjectModalSpan = document.querySelector("#close-new-project-span");
    this.newProjectForm = document.querySelector("#new-project-form");
  }

  displayTasks(tasks) {
    this.mainContent.innerHTML = "";
    tasks.forEach((task) => {
      const taskDisplayElement = this.createTaskDisplayElement(task);
      this.mainContent.appendChild(taskDisplayElement);
    });
  }

  updateProjectTitle(title) {
    this.projectTitle.innerHTML = title;
    this.updateProjectSelects(title);
  }

  createTaskDisplayElement(task) {
    const taskDisplayDiv = document.createElement("div");
    const taskDisplayTitle = document.createElement("h3");
    const taskDisplayDescription = document.createElement("p");
    const taskDisplayDueDate = document.createElement("p");
    const taskDisplayNotes = document.createElement("p");

    taskDisplayTitle.innerHTML = task.title;
    taskDisplayDescription.innerHTML = task.description;
    taskDisplayNotes.innerHTML = task.notes;
    if(task.dueDate.setHours(0,0,0,0) == (new Date()).setHours(0,0,0,0)) {
      taskDisplayDueDate.innerHTML = 'today';
    } else {
      taskDisplayDueDate.innerHTML = formatDistanceToNowStrict(task.dueDate, {
        addSuffix: true,
        unit: 'day',
        roundingMethod: 'floor'
      });
    }

    taskDisplayDiv.appendChild(taskDisplayTitle);
    taskDisplayDiv.appendChild(taskDisplayDueDate);
    taskDisplayDiv.appendChild(taskDisplayDescription);
    taskDisplayDiv.appendChild(taskDisplayNotes);

    switch (Number(task.priority)) {
      case 1:
        taskDisplayDiv.classList.add("low-priority");
        break;
      case 2:
        taskDisplayDiv.classList.add("med-priority");
        break;
      case 3:
        taskDisplayDiv.classList.add("high-priority");
    }

    taskDisplayDiv.classList.add("task-display");

    return taskDisplayDiv;
  }

  setupNewTaskModalListeners() {
    this.newTaskButton.addEventListener("click", () => {
      this.newTaskModal.style.display = "block";
      this.projectSelect.value = this.projectViewSelect.value;
    });

    this.closeNewTaskModalSpan.addEventListener("click", () => {
      this.closeAndResetTaskModal();
    });
  }

  setupNewTaskSubmitListener(callback) {
    this.newTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Retrieve form data
      const formData = new FormData(this.newTaskForm);
      const taskTitle = formData.get("title");
      const taskDescription = formData.get("description");
      const taskDueDate = new Date(formData.get("due-date") + 'T00:00:00');
      const taskPriority = formData.get("priority");
      const taskNotes = formData.get("notes");
      const taskProject = formData.get("project");

      const newTask = new Task(
        taskTitle,
        taskDescription,
        taskDueDate,
        taskPriority,
        taskNotes
      );
      callback(newTask, taskProject);

      this.closeAndResetTaskModal();
    });
  }

  closeAndResetTaskModal() {
    this.newTaskModal.style.display = "none";
    this.newTaskForm.reset();
  }

  setupNewProjectModalListeners() {
    this.closeNewProjectModalSpan.addEventListener("click", () => {
      this.closeAndResetProjectModal();
    });

    this.newProjectButton.addEventListener("click", () => {
      this.newProjectModal.style.display = "block";
    });
  }

  setupNewProjectSubmitListener(addProjectCallback) {
    this.newProjectForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Retrieve form data
      const formData = new FormData(this.newProjectForm);
      const projectTitle = formData.get("title");
      addProjectCallback(projectTitle);

      this.displayTasks(addProjectCallback(projectTitle));
      this.updateProjectTitle(projectTitle);

      this.closeAndResetProjectModal();
    });
  }

  closeAndResetProjectModal() {
    this.newProjectModal.style.display = "none";
    this.newProjectForm.reset();
  }

  populateProjectsIntoSelects(projectTitles) {
    this.projectViewSelect.innerHTML = "";
    this.projectSelect.innerHTML = "";
    projectTitles.forEach((projectTitle) => {
      const projectOption = document.createElement("option");
      const projectViewOption = document.createElement("option");

      projectOption.innerHTML = projectTitle;
      projectViewOption.innerHTML = projectTitle;

      this.projectSelect.appendChild(projectOption);
      this.projectViewSelect.appendChild(projectViewOption);
    });
  }

  updateProjectSelects(projectTitle) {
    this.projectViewSelect.value = projectTitle;
    this.projectSelect.value = projectTitle;
  }

  setupProjectViewSelectListener(getAllTasksInProjectCallback) {
    this.projectViewSelect.addEventListener("change", (event) => {
      const projectTitle = this.projectViewSelect.value;
      this.displayTasks(getAllTasksInProjectCallback(projectTitle));
      this.updateProjectTitle(projectTitle);
    });
  }

  setupProjectSelectListener(getAllTasksInProjectCallback) {
    this.projectSelect.addEventListener("change", (event) => {
      const projectTitle = this.projectSelect.value;
      this.displayTasks(getAllTasksInProjectCallback(projectTitle));
      this.updateProjectTitle(projectTitle);
    });
  }

}