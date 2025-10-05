const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const filterStatus = document.getElementById('filterStatus');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  const filtered = filterStatus.value === 'all'
    ? tasks
    : tasks.filter(t => t.status === filterStatus.value);

  filtered.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = `task ${task.status}`;
    li.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || ''}</p>
      <small>Deadline: ${task.deadline}</small>
      <small>Status: ${task.status}</small>
      <div class="task-actions">
        <button onclick="changeStatus(${i}, 'Pending')">⏳ Pending</button>
        <button onclick="changeStatus(${i}, 'In Progress')">🚧 In Progress</button>
        <button onclick="changeStatus(${i}, 'Completed')">✅ Completed</button>
        <button onclick="deleteTask(${i})">🗑️ Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  updateProgress();
  checkOverdueTasks();
}

function addTask() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const deadline = document.getElementById('deadline').value;

  if (!title || !deadline) return alert('Please fill all fields.');

  tasks.push({ title, description, deadline, status: 'Pending' });
  saveTasks();
  renderTasks();

  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('deadline').value = '';
}

function changeStatus(index, newStatus) {
  tasks[index].status = newStatus;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function updateProgress() {
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const total = tasks.length;
  const percent = total ? (completed / total) * 100 : 0;
  progressFill.style.width = percent + '%';
  progressText.textContent = `${completed}/${total} tasks completed`;
}

function checkOverdueTasks() {
  const today = new Date().toISOString().split('T')[0];
  tasks.forEach(task => {
    if (task.deadline < today && task.status !== 'Completed') {
      alert(`⚠️ Task "${task.title}" is overdue!`);
    }
  });
}

addTaskBtn.addEventListener('click', addTask);
filterStatus.addEventListener('change', renderTasks);

renderTasks();
