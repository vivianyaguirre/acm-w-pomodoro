let timer;
let timeLeft = 25 * 60; // 25-minute default timer
let isRunning = false;
let tasks = [];

// Load saved data from storage when extension starts
chrome.storage.local.get(["timeLeft", "isRunning", "tasks"], (result) => {
  if (result.timeLeft !== undefined) timeLeft = result.timeLeft;
  if (result.isRunning !== undefined) isRunning = result.isRunning;
  if (result.tasks !== undefined) tasks = result.tasks;
});

// Broadcast updates to all tabs
function updateTabs() {
  chrome.storage.local.set({ timeLeft, isRunning, tasks });

  chrome.runtime.sendMessage({
    action: "update",
    time: `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`,
    tasks: tasks
  });
}

// Start Timer
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTabs();
      } else {
        clearInterval(timer);
        isRunning = false;
        timeLeft = 25 * 60;
        updateTabs();
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon128.png",
          title: "Pomodoro Timer",
          message: "Time's up! Take a break."
        });
      }
    }, 1000);
  }
}

// Pause Timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  updateTabs();
}

// Reset Timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60;
  updateTabs();
}

// Task Management
function addTask(taskText) {
  tasks.push(taskText);
  updateTabs();
}

function deleteTask(taskText) {
  tasks = tasks.filter(task => task !== taskText);
  updateTabs();
}

// Listen for Messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startTimer") startTimer();
  if (message.action === "pauseTimer") pauseTimer();
  if (message.action === "resetTimer") resetTimer();
  if (message.action === "addTask") addTask(message.task);
  if (message.action === "deleteTask") deleteTask(message.task);
});
