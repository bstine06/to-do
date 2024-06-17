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
const closeNewTaskModalSpan = document.getElementsByClassName("close")[0];
const newTaskForm = document.querySelector('#new-task-form');

newTaskButton.addEventListener('click', () => {
  console.log("new task");
  newTaskModal.style.display = "block";
});

window.onclick = function(event) {
  if (event.target == newTaskModal) {
    newTaskModal.style.display = "none";
  }
}

closeNewTaskModalSpan.onclick = function() {
  newTaskModal.style.display = "none";
}

newTaskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log("submit");
  newTaskModal.style.display = "none";
})


