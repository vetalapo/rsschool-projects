let taskInput = document.getElementById("new-task-text");
let addButton = document.getElementsByClassName("button")[0];
let incompleteTaskHolder = document.getElementById("incomplete-tasks");
let completedTasksHolder = document.getElementById("completed-tasks");

let createNewTaskElement = function(taskString) {
  let listItem = document.createElement("li");
  let checkBox = document.createElement("input");
  let label = document.createElement("label");
  let editInput = document.createElement("input");
  let editButton = document.createElement("button");

  let deleteButton = document.createElement("button");
  let deleteButtonImg = document.createElement("img");

  listItem.classList.add("task-item");

  label.innerText = taskString;
  label.className = "task-label";

  checkBox.type = "checkbox";
  checkBox.classList.add("task-checkbox");
  editInput.type = "text";
  editInput.className = "task-text";

  editButton.innerText = "Edit";
  editButton.className = "button button-edit";

  deleteButton.className = "button button-delete";
  deleteButtonImg.src = "assets/remove.svg";
  deleteButtonImg.classList.add("image-delete");
  deleteButtonImg.alt = "";
  deleteButton.appendChild(deleteButtonImg);

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  return listItem;
}

let addTask = function() {
  console.log("Add Task...");
  
  if (!taskInput.value) {
    return;
  }
  
  // Create a new list item with the text from the #new-task-text:
  let listItem = createNewTaskElement(taskInput.value);

  // Append listItem to incompleteTaskHolder
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  taskInput.value = "";
}

// Edit an existing task.
let editTask = function() {
  console.log("Edit Task...");
  console.log("Change \"edit\" to \"save\"");

  let listItem = this.parentNode;

  let editInput = listItem.querySelector(".task-text");
  let label = listItem.querySelector(".task-label");
  let editBtn = listItem.querySelector(".button-edit");
  let isEditMode = listItem.classList.contains("edit-mode");

  if (isEditMode) {
    // switch to .editmode
    // label becomes the inputs value.
    label.innerText=editInput.value;
    editBtn.innerText="Edit";
  } else {
    editInput.value=label.innerText;
    editBtn.innerText="Save";
  }

  listItem.classList.toggle("edit-mode");
};


let deleteTask = function() {
  console.log("Delete Task...");

  let listItem = this.parentNode;
  let ul = listItem.parentNode;

  ul.removeChild(listItem);
}


//Mark task completed
let taskCompleted = function() {
  console.log("Complete Task...");

  let listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
}

let taskIncomplete = function() {
  console.log("Incomplete Task...");

  let listItem = this.parentNode;
  incompleteTaskHolder.appendChild(listItem);

  bindTaskEvents(listItem,taskCompleted);
}

let ajaxRequest = function() {
  console.log("AJAX Request");
}

// The glue to hold it all together.

// Set the click handler to the addTask function.
addButton.onclick = addTask;
addButton.addEventListener("click", addTask);
addButton.addEventListener("click", ajaxRequest);

let bindTaskEvents = function(taskListItem,checkBoxEventHandler) {
  console.log("bind list item events");
  
  let checkBox = taskListItem.querySelector(".task-checkbox");
  let editButton = taskListItem.querySelector(".button-edit");
  let deleteButton = taskListItem.querySelector(".button-delete");

  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
}

for (let i = 0; i < incompleteTaskHolder.children.length; i++) {
  bindTaskEvents(incompleteTaskHolder.children[i], taskCompleted);
}

for (let i = 0; i < completedTasksHolder.children.length; i++) {
  bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
}

// Issues with usability don't get seen until they are in front of a human tester.

//prevent creation of empty tasks.

//Change edit to save when you are in edit mode.
