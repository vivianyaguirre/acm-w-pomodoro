// Make the floating window draggable
const floatingWindow = document.getElementById("floating-window");
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
// Timer variables
let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;

// DOM elements for the timer
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

// Timer functions
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(updateTimer, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60; // Reset to 25 minutes
  updateDisplay();
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    updateDisplay();
  } else {
    clearInterval(timer);
    alert("Time's up! Take a break.");
    resetTimer();
  }
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Event listeners for timer buttons
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);


// Load saved tasks
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(["tasks"], function (result) {
        if (result.tasks) {
            const list = document.querySelector("#taskList");
            result.tasks.forEach(taskText => {
                addTaskToList(taskText);
            });
        }
    });
});

// Function to add task and save it
function addTask() {
    const inputField = document.querySelector("#taskInput");
    const taskText = inputField.value.trim();

    if (taskText) {
        addTaskToList(taskText);

        // Save updated task list
        chrome.storage.local.get(["tasks"], function (result) {
            let tasks = result.tasks || [];
            tasks.push(taskText);
            chrome.storage.local.set({ tasks: tasks });
        });

        inputField.value = "";
    } else {
        alert("Please enter a task!");
    }
}

// Helper function to add task to UI
function addTaskToList(taskText) {
    const list = document.querySelector("#taskList");
    const listItem = document.createElement("li");

    const taskSpan = document.createElement("span");
    taskSpan.className = "task-text";
    taskSpan.textContent = taskText;
    listItem.appendChild(taskSpan);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => {
        listItem.remove();
        removeTaskFromStorage(taskText);
    });

    listItem.appendChild(deleteButton);
    list.appendChild(listItem);
}

// Function to remove task from storage
function removeTaskFromStorage(taskText) {
    chrome.storage.local.get(["tasks"], function (result) {
        let tasks = result.tasks || [];
        tasks = tasks.filter(task => task !== taskText);
        chrome.storage.local.set({ tasks: tasks });
    });
}

document.getElementById("addTask").addEventListener("click", addTask);
