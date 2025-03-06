document.addEventListener("DOMContentLoaded", function () {
    // Load saved timer and tasks
    chrome.storage.local.get(["timeLeft", "isRunning", "tasks"], function (result) {
        if (result.timeLeft !== undefined) {
            timeLeft = result.timeLeft;
            updateDisplay();
        }
        if (result.isRunning !== undefined) isRunning = result.isRunning;
        if (result.tasks) {
            result.tasks.forEach(task => addTaskToList(task));
        }
    });

    // Listen for updates from the background script
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "update") {
            document.getElementById("timer").textContent = message.time;

            const taskList = document.getElementById("taskList");
            taskList.innerHTML = "";
            message.tasks.forEach(task => addTaskToList(task));
        }
    });
});

// Start Timer
document.getElementById("start").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "startTimer" });
});

// Pause Timer
document.getElementById("pause").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "pauseTimer" });
});

// Reset Timer
document.getElementById("reset").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "resetTimer" });
});

// Add Task
document.getElementById("addTask").addEventListener("click", () => {
    const taskText = document.getElementById("taskInput").value.trim();
    if (taskText) {
        chrome.runtime.sendMessage({ action: "addTask", task: taskText });
        document.getElementById("taskInput").value = "";
    }
});

// Delete Task
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        const taskText = e.target.previousElementSibling.textContent;
        chrome.runtime.sendMessage({ action: "deleteTask", task: taskText });
    }
});

// Helper function to add tasks to UI
function addTaskToList(taskText) {
    const list = document.querySelector("#taskList");
    const listItem = document.createElement("li");

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    listItem.appendChild(taskSpan);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete");
    listItem.appendChild(deleteButton);

    list.appendChild(listItem);
}
