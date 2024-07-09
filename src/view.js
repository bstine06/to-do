import { Task } from './task.js';
const { format, formatDistanceToNowStrict } = require("date-fns");

export class View {
  constructor() {
    this.mainContent = document.querySelector("#main-content");
    this.projectTitle = document.querySelector("#project-title");
    this.projectTitleEditButton = document.querySelector("#project-title-edit-button");
    this.projectViewSelect = document.querySelector("#project-view-select");

    this.newTaskButton = document.querySelector("#new-task-button");
    this.newTaskModal = document.querySelector("#new-task-modal");
    this.closeNewTaskModalSpan = document.querySelector("#close-new-task-span");
    this.newTaskForm = document.querySelector("#new-task-form");
    this.projectSelect = document.querySelector("#project-select");

    this.taskDetailsModal = document.querySelector("#task-details-modal");
    this.closeTaskDetailsModalSpan = document.querySelector("#close-task-details-span");
    this.taskDetailsTitle = document.querySelector("#task-details-title");
    this.taskDetailsDescription = document.querySelector("#task-details-description");
    this.taskDetailsDueDate = document.querySelector("#task-details-due-date")
    this.taskDetailsPriority = document.querySelector("#task-details-priority");
    this.taskDetailsNotes = document.querySelector("#task-details-notes");
    this.taskDetailsUUID = document.querySelector("#task-details-uuid");
    
    this.editTaskForm = document.querySelector("#edit-task-form");
    this.editTaskModal = document.querySelector("#edit-task-modal");
    this.editTaskButton = document.querySelector("#edit-task-button");
    this.closeEditTaskModalSpan = document.querySelector("#close-edit-task-span");
    this.editTaskTitle = document.querySelector("#edit-task-title");
    this.editTaskProjectSelect = document.querySelector("#edit-task-project-select");
    this.editTaskDescription = document.querySelector("#edit-task-description");
    this.editTaskDueDate = document.querySelector("#edit-task-due-date");
    this.editTaskPriority = document.querySelector("#edit-task-priority");
    this.editTaskNotes = document.querySelector("#edit-task-notes");

    this.newProjectButton = document.querySelector("#new-project-button");
    this.newProjectModal = document.querySelector("#new-project-modal");
    this.closeNewProjectModalSpan = document.querySelector("#close-new-project-span");
    this.newProjectForm = document.querySelector("#new-project-form");
    this.newProjectModalErrorText = document.querySelector("#new-project-modal-error-text");

    this.editProjectButton = document.querySelector("#edit-project-button");
    this.editProjectModal = document.querySelector("#edit-project-modal");
    this.closeEditProjectModalSpan = document.querySelector("#close-edit-project-span");
    this.editProjectForm = document.querySelector("#edit-project-form");
    this.editProjectModalErrorText = document.querySelector("#edit-project-modal-error-text");
  }

  displayTasks(tasks, setFocusTaskCallback) {
    this.mainContent.innerHTML = "";
    if (tasks === undefined) {
    console.log("NO TASKS TO DISPLAY");
    } else {
      tasks.forEach((task) => {
        const taskDisplayElement = this.createTaskDisplayElement(task, setFocusTaskCallback);
        this.mainContent.appendChild(taskDisplayElement);
      });
    }
  }

  updateProjectTitle(title) {
    this.projectTitle.innerHTML = title;
    this.updateProjectSelects(title);
  }

  createTaskDisplayElement(task, setFocusTaskCallback) {
    const taskDisplayDiv = document.createElement("div");
    const taskDisplayTitle = document.createElement("h3");
    const taskDisplayDueDate = document.createElement("p");

    taskDisplayTitle.innerHTML = task.title;

    const today = (new Date()).setHours(0,0,0,0)
    if(task.dueDate.setHours(0,0,0,0) == today) {
      taskDisplayDueDate.innerHTML = 'today';
    } else if (task.dueDate.setHours(0,0,0,0) > today) {
      taskDisplayDueDate.innerHTML = formatDistanceToNowStrict(task.dueDate-1, {
        addSuffix: true,
        unit: 'day',
        roundingMethod: 'ceil'
      });
    } else {
      taskDisplayDueDate.innerHTML = formatDistanceToNowStrict(task.dueDate, {
        addSuffix: true,
        unit: 'day',
        roundingMethod: 'floor'
      });
    }


    taskDisplayDiv.appendChild(taskDisplayTitle);
    taskDisplayDiv.appendChild(taskDisplayDueDate);

    taskDisplayDiv.classList.add(task.priority);

    taskDisplayDiv.classList.add("task-display");

    this.createCompleteButton(task.UUID, taskDisplayDiv);

    

    taskDisplayDiv.addEventListener('click', () => {
      this.displayTaskDetails(task, setFocusTaskCallback);
    })

    this.closeTaskDetailsModalSpan.addEventListener("click", () => {
      this.closeTaskDetailsModal();
    });

    return taskDisplayDiv;
  }

  bindCompleteElement(handler) {
    this.mainContent.addEventListener('click', (event) => {
        if (event.target.classList.contains('complete-button')) {
            this.closeTaskDetailsModal();
            const uuid = event.target.getAttribute('data-uuid');
            handler(uuid, this.projectViewSelect.value);
        }
    });
  }

  createCompleteButton(uuid, parentDiv) {
    const button = document.createElement('button');
    button.classList.add('complete-button');
    button.setAttribute('data-uuid', uuid);
    button.textContent = 'Complete';
    parentDiv.appendChild(button);
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

      try {
        this.displayTasks(addProjectCallback(projectTitle));
        this.updateProjectTitle(projectTitle);
        this.closeAndResetProjectModal();
      } catch (error) {
        this.newProjectModalErrorText.innerHTML = error.message;
      }
      
    });
  }

  closeAndResetProjectModal() {
    this.newProjectModal.style.display = "none";
    this.newProjectForm.reset();
    this.newProjectModalErrorText.innerHTML = "";
  }

  populateProjectsIntoSelects(projectTitles) {
    this.projectViewSelect.innerHTML = "";
    this.projectSelect.innerHTML = "";
    this.editTaskProjectSelect.innerHTML = "";
    projectTitles.forEach((projectTitle) => {
      const projectOption = document.createElement("option");
      const projectViewOption = document.createElement("option");
      const editTaskProjectOption = document.createElement("option");

      projectOption.innerHTML = projectTitle;
      projectViewOption.innerHTML = projectTitle;
      editTaskProjectOption.innerHTML = projectTitle;

      this.projectSelect.appendChild(projectOption);
      this.projectViewSelect.appendChild(projectViewOption);
      this.editTaskProjectSelect.appendChild(editTaskProjectOption);
    });
  }

  updateProjectSelects(projectTitle) {
    this.projectViewSelect.value = projectTitle;
    this.projectSelect.value = projectTitle;
    this.editTaskProjectSelect.value = projectTitle;
  }

  setupProjectViewSelectListener(getAllTasksInProjectCallback, setFocusTaskCallback) {
    this.projectViewSelect.addEventListener("change", (event) => {
      const projectTitle = this.projectViewSelect.value;
      this.displayTasks(getAllTasksInProjectCallback(projectTitle), setFocusTaskCallback);
      this.updateProjectTitle(projectTitle);
    });
  }

  setupProjectSelectListener(getAllTasksInProjectCallback, setFocusTaskCallback) {
    this.projectSelect.addEventListener("change", (event) => {
      const projectTitle = this.projectSelect.value;
      this.displayTasks(getAllTasksInProjectCallback(projectTitle), setFocusTaskCallback);
      this.updateProjectTitle(projectTitle);
    });
  }

  setupEditProjectModalListeners() {
    this.closeEditProjectModalSpan.addEventListener("click", () => {
      this.closeAndResetEditProjectModal();
    });

    this.editProjectButton.addEventListener("click", () => {
      this.editProjectModal.style.display = "block";
    });
  }

  setupEditProjectSubmitListener(editProjectCallback) {
    this.editProjectForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Retrieve form data
      const formData = new FormData(this.editProjectForm);
      const newProjectTitle = formData.get("title");
      const oldProjectTitle = this.projectTitle.innerHTML;

      try {
        this.displayTasks(editProjectCallback(newProjectTitle, oldProjectTitle));
        this.updateProjectTitle(newProjectTitle);

        this.closeAndResetEditProjectModal();
      } catch (error) {
        this.editProjectModalErrorText.innerHTML = error.message;
      }
      
    });
  }

  closeAndResetEditProjectModal() {
    this.editProjectModal.style.display = "none";
    this.editProjectForm.reset();
    this.newProjectModalErrorText.innerHTML = "";
  }

  displayTaskDetails(task, setFocusTaskCallback) {
    setFocusTaskCallback(task);
    this.taskDetailsTitle.innerHTML = task.title;
    this.taskDetailsDescription.innerHTML = "Description: " + task.description;
    this.taskDetailsDueDate.innerHTML = "Due: " + format(task.dueDate, 'EEEE, MMMM dd yyyy');
    this.taskDetailsPriority.innerHTML = "Priority: ";
    this.taskDetailsPriority.innerHTML += task.priority.split("-")[0];
    this.taskDetailsNotes.innerHTML = "Notes: " + task.notes;
    this.taskDetailsUUID.innerHTML = task.UUID;

    this.taskDetailsModal.style.display = "block";
  }

  closeTaskDetailsModal() {
    this.taskDetailsModal.style.display = "none";
  }

  setupEditTaskModalListeners(getFocusTask) {
    
    this.editTaskButton.addEventListener("click", () => {
      const focusTask = getFocusTask();
      this.editTaskTitle.value = focusTask.title;
      this.editTaskDescription.value = focusTask.description;
      const dateString = focusTask.dueDate;
      const date = new Date(dateString);
      const formattedDate = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
      this.editTaskDueDate.value = formattedDate;
      const selectedPriority = focusTask.priority;
      //document.querySelector(`input[name="edit-task-priority"][value="${selectedPriority}"]`).checked = true;
      this.editTaskNotes.value = focusTask.notes;
      this.editTaskModal.style.display = "block";
      this.editTaskProjectSelect.value = this.projectViewSelect.value;
      document.querySelector("#edit-task-uuid").value = focusTask.UUID;
    });

    this.closeEditTaskModalSpan.addEventListener("click", () => {
      this.closeAndResetEditTaskModal();
    });
  }

  setupEditTaskSubmitListener(editTaskCallback) {
    this.editTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Retrieve form data
      const formData = new FormData(this.editTaskForm);
      const taskTitle = formData.get("title");
      const taskDescription = formData.get("description");
      const taskDueDate = new Date(formData.get("due-date") + 'T00:00:00');
      const taskPriority = formData.get("edit-task-priority");
      const taskNotes = formData.get("notes");
      const taskProject = formData.get("project");

      const modifiedTask = new Task(
        taskTitle,
        taskDescription,
        taskDueDate,
        taskPriority,
        taskNotes
      );
      modifiedTask.UUID = this.taskDetailsUUID.innerHTML;
      editTaskCallback(modifiedTask, taskProject);

      this.closeAndResetEditTaskModal();
      this.closeTaskDetailsModal();
    });
  }

  closeAndResetEditTaskModal() {
    this.editTaskModal.style.display = "none";
    this.editTaskForm.reset();
  }



}