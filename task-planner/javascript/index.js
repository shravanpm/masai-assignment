import { debouncer, formatTask, loadFromLS, saveToLS } from "./utils.js";

function loadTasks() {
  let tasks = loadFromLS("tasks") || [];
  loadTasksList(tasks);
}

loadTasks();

let taskInput = document.getElementById("taskInput");
let searchInput = document.getElementById("searchInput");

function addTask() {
  let tasks = [...loadFromLS("tasks"), formatTask(taskInput.value)];
  saveToLS("tasks", tasks);
  taskInput.value = "";
  loadTasksList(tasks);
}

function searchTask() {
  let tasks = loadFromLS("tasks") || [];
  let searchTerm = searchInput.value.toLowerCase();
  let searchResult = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm)
  );
  tasks = searchResult;
  searchInput.value = "";
  loadTasksList(tasks);
}

function updateTaskStatus(id, status, tasks) {
  saveToLS(
    "tasks",
    loadFromLS("tasks").map((task) => {
      if (task.id == id) {
        task.completed = status;
      }
      return task;
    })
  );
  tasks = tasks.map((task) => {
    if (task.id == id) {
      task.completed = status;
    }
    return task;
  });
  loadTasksList(tasks);
}

function deleteTask(id, tasks) {
  const filteredtasks = loadFromLS("tasks").filter((task) => {
    return task.id !== id;
  });

  saveToLS(
    "tasks",
    loadFromLS("tasks").filter((task) => task.id !== id)
  );
  loadTasksList(tasks.filter((task) => task.id !== id));
}

function clearTasks() {
  saveToLS("tasks", []);
  loadTasksList([]);
}

let addTaskBtn = document.getElementById("addTaskBtn");
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

addTaskBtn.addEventListener("click", addTask);

let searchTaskBtn = document.getElementById("searchTaskBtn");

const debouncingSearch = debouncer(searchTask, 3000);

searchTaskBtn.addEventListener("click", () => {
  debouncingSearch();
});

let resetTaskBtn = document.getElementById("resetTasksBtn");
resetTaskBtn.addEventListener("click", loadTasks);

const clearTaskBtn = document.getElementById("clearTasksBtn");
clearTaskBtn.addEventListener("click", clearTasks);

function loadTasksList(tasks) {
  const taskListContainer = document.getElementById("taskList");
  taskListContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    let className = "taskCard";
    const div = document.createElement("div");
    const taskP = document.createElement("p");
    taskP.innerText = `${index + 1}. ${task?.title}`;
    const checkbox = document.createElement("input");

    const div2 = document.createElement("div");
    div2.className = "taskCardDelete";
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash");
    deleteIcon.style.color = "red";
    deleteIcon.classList.add("deleteIcon");
    deleteIcon.addEventListener("click", () => deleteTask(task.id, tasks));

    div2.append(checkbox, deleteIcon);

    checkbox.type = "checkbox";
    checkbox.name = `${task.id}`;
    checkbox.value = task.completed;

    checkbox.checked = task.completed;
    if (task.completed) {
      className = className + " taskCompleted";
    }
    checkbox.addEventListener("change", (e) => {
      const { name, value } = e.target;
      updateTaskStatus(name, checkbox.checked, tasks);
    });
    div.className = className;
    div.append(taskP, div2);
    taskListContainer.append(div);
  });
}
