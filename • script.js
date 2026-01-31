// --- Variables ---
let guests = [];
let tasks = [];
let categories = [];
let budget = 0;

// --- GUESTS ---
function addGuest() {
  const name = document.getElementById("guestName").value;
  if (!name) return;

  guests.push(name);
  document.getElementById("guestName").value = "";
  updateGuests();
  updateSuggestions();
}

function updateGuests() {
  const list = document.getElementById("guestList");
  list.innerHTML = "";
  guests.forEach(guest => {
    const li = document.createElement("li");
    li.textContent = `${guest}`;
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
}

function updateCategories() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = `${cat.name}: $${cat.cost}`;
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
}

function updateTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task;
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