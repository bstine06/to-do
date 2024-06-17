import './style.css';
import { TodoItem } from './todo-item.js';


const projects = {};

const defaultList = [];
projects["defaultList"] = defaultList;



let sampleTodoItem = new TodoItem('eat', 'food', 121224, 2, 'nachos');
addToDoItem(sampleTodoItem, "defaultList");
console.log(projects);


function addToDoItem(newTodoItem, project) {
  if (!(project in projects)) {
    throw new Error(`project with name '${project}' does not exist in projects.`)
  }
  defaultList.push(newTodoItem);
}


const newTaskModal = document.querySelector('#new-task-modal');
const newTaskButton = document.querySelector('#new-task-button');
const closeNewTaskModalSpan = document.querySelector("#close-new-task-span");
const newTaskForm = document.querySelector('#new-task-form');

newTaskButton.addEventListener('click', () => {
    newTaskModal.style.display = "block";
});

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
    const taskNotes = formData.get('notes')

    const newTask = new TodoItem(taskTitle, taskDescription, taskDueDate, taskPriority, taskNotes);
    console.log(newTask);

    closeAndResetTaskModal();
})

function closeAndResetTaskModal() {
    newTaskModal.style.display = "none";
    newTaskForm.reset();
}


