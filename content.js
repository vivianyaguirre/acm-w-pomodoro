// Create the floating window
const floatingWindow = document.createElement("div");
floatingWindow.id = "floating-window";
floatingWindow.innerHTML = `
  <div id="header">Pomodoro Timer</div>
  <div class="container">
    <div id="timer">25:00</div>
    <div class="buttons">
      <button id="start">Start</button>
      <button id="pause">Pause</button>
      <button id="reset">Reset</button>
    </div>
    <h2>My Task List</h2>
    <input type="text" id="taskInput" placeholder="Enter task">
    <button id="addTask">Add Task</button>
    <ul id="taskList"></ul>
  </div>
`;

// Append the floating window to the body
document.body.appendChild(floatingWindow);

// Make the floating window draggable
const header = document.getElementById("header");

let isDragging = false;
let offsetX, offsetY;

header.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - floatingWindow.offsetLeft;
  offsetY = e.clientY - floatingWindow.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    floatingWindow.style.left = `${e.clientX - offsetX}px`;
    floatingWindow.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateTimer") {
    document.getElementById("timer").textContent = message.time;
  }
  if (message.action === "updateTasks") {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    message.tasks.forEach(task => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
        <div class="task-buttons">
          <button class="complete">✓</button>
          <button class="delete">X</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }
});

// Send timer and task updates to the background script
document.getElementById("start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "startTimer" });
});

document.getElementById("pause").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "pauseTimer" });
});

document.getElementById("reset").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "resetTimer" });
});

document.getElementById("addTask").addEventListener("click", () => {
  const taskText = document.getElementById("taskInput").value.trim();
  if (taskText) {
    chrome.runtime.sendMessage({ action: "addTask", task: taskText });
    document.getElementById("taskInput").value = "";
  }
});

// Handle task completion and deletion
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("complete")) {
    const taskText = e.target.parentElement.previousElementSibling.textContent;
    chrome.runtime.sendMessage({ action: "completeTask", task: taskText });
  }
  if (e.target.classList.contains("delete")) {
    const taskText = e.target.parentElement.previousElementSibling.textContent;
    chrome.runtime.sendMessage({ action: "deleteTask", task: taskText });
  }
});