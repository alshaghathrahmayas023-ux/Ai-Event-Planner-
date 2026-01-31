// --- Variables ---
let guests = [];
let tasks = [];
let categories = [];
let budget = 0;

// Color mapping for categories
const categoryColors = {
  "food": "#e74c3c",
  "venue": "#3498db",
  "decoration": "#2ecc71",
  "entertainment": "#f39c12",
  "transport": "#9b59b6",
  "photography": "#1abc9c"
};

function getCategoryColor(name) {
  const lowerName = name.toLowerCase();
  return categoryColors[lowerName] || "#95a5a6";
}

// --- STORAGE ---
function saveData() {
  localStorage.setItem("eventData", JSON.stringify({ guests, tasks, categories, budget }));
}

function loadData() {
  const data = localStorage.getItem("eventData");
  if (data) {
    const parsed = JSON.parse(data);
    guests = parsed.guests || [];
    tasks = parsed.tasks || [];
    categories = parsed.categories || [];
    budget = parsed.budget || 0;
    updateGuests();
    updateTasks();
    updateCategories();
    updateRemainingBudget();
    updateSuggestions();
    document.getElementById("budgetInput").value = budget;
  }
}

// --- GUESTS ---
function addGuest() {
  const name = document.getElementById("guestName").value;
  if (!name) return;

  guests.push(name);
  document.getElementById("guestName").value = "";
  updateGuests();
  updateSuggestions();
  saveData();
}

function deleteGuest(index) {
  guests.splice(index, 1);
  updateGuests();
  updateSuggestions();
  saveData();
}

function updateGuests() {
  const list = document.getElementById("guestList");
  list.innerHTML = "";
  guests.forEach((guest, index) => {
    const li = document.createElement("li");
    li.textContent = guest;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "deleteBtn";
    deleteBtn.onclick = () => deleteGuest(index);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
  document.getElementById("guestCount").textContent = guests.length;
}

// --- BUDGET ---
function setBudget() {
  const inputBudget = Number(document.getElementById("budgetInput").value);
  if (inputBudget < 0) return;
  budget = inputBudget;
  updateRemainingBudget();
  updateSuggestions();
  saveData();
}

function updateRemainingBudget() {
  const spent = categories.reduce((sum, cat) => sum + cat.cost, 0);
  const remaining = budget - spent;
  document.getElementById("remainingBudget").textContent = remaining;
}

// --- CATEGORIES ---
function addCategory() {
  const name = document.getElementById("categoryName").value;
  const cost = Number(document.getElementById("categoryCost").value);
  if (!name || cost <= 0) return;

  categories.push({ name, cost });
  document.getElementById("categoryName").value = "";
  document.getElementById("categoryCost").value = "";

  updateCategories();
  updateRemainingBudget();
  updateSuggestions();
  saveData();
}

function deleteCategory(index) {
  categories.splice(index, 1);
  updateCategories();
  updateRemainingBudget();
  updateSuggestions();
  saveData();
}

function updateCategories() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "";
  categories.forEach((cat, index) => {
    const li = document.createElement("li");
    li.style.borderLeft = `4px solid ${getCategoryColor(cat.name)}`;
    li.textContent = `${cat.name}: $${cat.cost}`;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "deleteBtn";
    deleteBtn.onclick = () => deleteCategory(index);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// --- TASKS ---
function addTask() {
  const task = document.getElementById("taskInput").value;
  if (!task) return;

  tasks.push(task);
  document.getElementById("taskInput").value = "";
  updateTasks();
  saveData();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  updateTasks();
  saveData();
}

function updateTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "deleteBtn";
    deleteBtn.onclick = () => deleteTask(index);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// --- SUGGESTIONS ---
function updateSuggestions() {
  const suggestion = document.getElementById("suggestionText");

  if (guests.length > 300) {
    suggestion.textContent = "Very large event detected. Consider reducing guest count or increasing venue budget.";
  } else if (guests.length > 0 && budget > 0 && budget / guests.length < 40) {
    suggestion.textContent = "Low budget per guest. Consider buffet-style catering or a smaller menu.";
  } else if (tasks.length < 5) {
    suggestion.textContent = "Few tasks planned. You may want to add more preparation steps.";
  } else {
    suggestion.textContent = "Your plan looks balanced so far.";
  }
}
