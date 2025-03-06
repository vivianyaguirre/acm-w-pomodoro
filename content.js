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

// Listen for messages to update UI
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "update") {
    document.getElementById("timer").textContent = message.time;
  }
});
