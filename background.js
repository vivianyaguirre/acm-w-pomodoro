let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let tasks = [];

// Update all tabs with the current timer and tasks
function updateTabs() {
  const time = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`;
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: "updateTimer", time });
      chrome.tabs.sendMessage(tab.id, { action: "updateTasks", tasks });
    });
  });
}

// Timer functions
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

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60;
  updateTabs();
}

// Task functions
function addTask(taskText) {
  tasks.push({ text: taskText, completed: false });
  updateTabs();
}

function completeTask(taskText) {
  const task = tasks.find(t => t.text === taskText);
  if (task) {
    task.completed = !task.completed;
    updateTabs();
  }
}

function deleteTask(taskText) {
  tasks = tasks.filter(t => t.text !== taskText);
  updateTabs();
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startTimer") {
    startTimer();
  }
  if (message.action === "pauseTimer") {
    pauseTimer();
  }
  if (message.action === "resetTimer") {
    resetTimer();
  }
  if (message.action === "addTask") {
    addTask(message.task);
  }
  if (message.action === "completeTask") {
    completeTask(message.task);
  }
  if (message.action === "deleteTask") {
    deleteTask(message.task);
  }
});