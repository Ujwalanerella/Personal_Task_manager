let editTaskId = null;

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskStatus = document.getElementById("taskStatus");
const taskList = document.getElementById("taskList");

async function fetchTasks() {
  try {
    const res = await fetch("/tasks");
    let tasks = await res.json();

    // Sort automatically: priority first, then status
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    const statusOrder = { Pending: 1, "In Progress": 2, Completed: 3 };

    tasks.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return statusOrder[a.status] - statusOrder[b.status];
    });

    taskList.innerHTML = "";
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="task-info">
          <strong>${task.title}</strong> 
          <span class="priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
          <span class="status status-${task.status.replace(/\s+/g, '-').toLowerCase()}">${task.status}</span>
          <br/>
          <em>${task.description || ""}</em>
        </div>
        <div class="task-actions">
          <span class="edit-task" title="Edit Task">✏️</span>
          <span class="delete-task" title="Delete Task">🗑️</span>
        </div>
      `;

      // Edit icon click
      li.querySelector(".edit-task").onclick = () => {
        editTaskId = task.id;
        taskTitle.value = task.title;
        taskDescription.value = task.description || "";
        taskPriority.value = task.priority || "Medium";
        taskStatus.value = task.status || "Pending";
        taskForm.querySelector("button").textContent = "Update Task";
      };

      // Delete icon click
      li.querySelector(".delete-task").onclick = () => deleteTask(task.id);

      taskList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
}

taskForm.addEventListener("submit", async e => {
  e.preventDefault();
  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();
  const priority = taskPriority.value;
  const status = taskStatus.value;

  if (!title) return alert("Task name is required");

  try {
    if (editTaskId) {
      await fetch(`/tasks/${editTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, status }),
      });
      editTaskId = null;
      taskForm.querySelector("button").textContent = "Add Task";
    } else {
      await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, status }),
      });
    }

    taskTitle.value = "";
    taskDescription.value = "";
    taskPriority.value = "Medium";
    taskStatus.value = "Pending";
    fetchTasks();
  } catch (error) {
    console.error("Failed to save task:", error);
  }
});

// Disable browser suggestions for task title
taskTitle.setAttribute("autocomplete", "off");

// Initial fetch
fetchTasks();
