"use strict";

const storageKey = "eventPlannerData";

let totalBudget = 0;
let categories = [];
let guests = [];
let tasks = [];
let chartInstance = null;
const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
});

function $(id) {
    return document.getElementById(id);
}

function setStatus(message, isError = false) {
    const el = $("statusMessage");
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("error", isError);
}

function saveData() {
    const data = {
        totalBudget,
        categories,
        guests,
        tasks
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadData() {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
        try {
            const data = JSON.parse(raw);
            totalBudget = Number(data.totalBudget) || 0;
            categories = Array.isArray(data.categories) ? data.categories : [];
            guests = Array.isArray(data.guests) ? data.guests : [];
            tasks = Array.isArray(data.tasks) ? data.tasks : [];
        } catch {
            totalBudget = 0;
            categories = [];
            guests = [];
            tasks = [];
        }
    }

    const theme = localStorage.getItem("eventPlannerTheme");
    if (theme === "dark") {
        document.body.classList.add("dark");
    }

    renderGuests();
    renderTasks();
    renderCategories();
    updateBudgetUI();
    updateSuggestion();
    setStatus("Ready.");
}

function renderGuests() {
    const list = $("guestList");
    list.innerHTML = "";
    guests.forEach((name, index) => {
        const li = document.createElement("li");
        li.textContent = name;
        li.title = "Click to remove";
        li.addEventListener("click", () => {
            if (!confirm("Remove this guest?")) return;
            guests.splice(index, 1);
            renderGuests();
            updateSuggestion();
            saveData();
        });
        list.appendChild(li);
    });
    $("guestCount").textContent = String(guests.length);
}

function addGuest() {
    const input = $("guestName");
    const name = input.value.trim();
    if (!name) {
        setStatus("Please enter a guest name.", true);
        return;
    }
    guests.push(name);
    input.value = "";
    renderGuests();
    updateSuggestion();
    saveData();
    setStatus("Guest added.");
}

function setBudget() {
    const value = Number($("budgetInput").value);
    if (!Number.isFinite(value) || value < 0) {
        setStatus("Please enter a valid budget.", true);
        return;
    }
    totalBudget = value;
    updateBudgetUI();
    updateSuggestion();
    saveData();
    setStatus("Budget updated.");
}

function getSpentTotal() {
    return categories.reduce((sum, item) => sum + item.cost, 0);
}

function updateBudgetUI() {
    const spent = getSpentTotal();
    const remaining = Math.max(totalBudget - spent, 0);
    $("remainingBudget").textContent = remaining.toFixed(2);

    const bar = $("budgetBar");
    const percent = totalBudget > 0 ? Math.min((spent / totalBudget) * 100, 100) : 0;
    bar.style.width = `${percent}%`;
}

function addCategory() {
    const name = $("categoryName").value.trim();
    const cost = Number($("categoryCost").value);
    if (!name) {
        setStatus("Please enter a category name.", true);
        return;
    }
    if (!Number.isFinite(cost) || cost < 0) {
        setStatus("Please enter a valid category cost.", true);
        return;
    }

    categories.push({ name, cost });
    $("categoryName").value = "";
    $("categoryCost").value = "";
    renderCategories();
    updateBudgetUI();
    updateSuggestion();
    saveData();
    setStatus("Category added.");
}

function renderCategories() {
    const list = $("categoryList");
    list.innerHTML = "";
    categories.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name}: ${currency.format(item.cost)}`;
        li.title = "Click to remove";
        li.addEventListener("click", () => {
            if (!confirm("Remove this category?")) return;
            categories.splice(index, 1);
            renderCategories();
            updateBudgetUI();
            updateSuggestion();
            saveData();
        });
        list.appendChild(li);
    });

    updateCategoryChart();
}

function updateCategoryChart() {
    const canvas = $("categoryChart");
    const emptyMessage = $("chartEmpty");
    if (!canvas || typeof Chart === "undefined") return;

    const labels = categories.map((c) => c.name);
    const data = categories.map((c) => c.cost);

    if (emptyMessage) {
        emptyMessage.style.display = categories.length ? "none" : "block";
    }

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(canvas, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Category Costs",
                    data,
                    backgroundColor: "rgba(255, 214, 153, 0.8)",
                    borderColor: "rgba(255, 214, 153, 1)",
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function addTask() {
    const input = $("taskInput");
    const task = input.value.trim();
    if (!task) {
        setStatus("Please enter a task name.", true);
        return;
    }
    tasks.push(task);
    input.value = "";
    renderTasks();
    updateSuggestion();
    saveData();
    setStatus("Task added.");
}

function renderTasks() {
    const list = $("taskList");
    list.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task;
        li.title = "Click to remove";
        li.addEventListener("click", () => {
            if (!confirm("Remove this task?")) return;
            tasks.splice(index, 1);
            renderTasks();
            updateSuggestion();
            saveData();
        });
        list.appendChild(li);
    });
}

function applyTemplate(type) {
    const templates = {
        wedding: {
            guests: ["Bride", "Groom", "Parents", "Best Friend"],
            categories: [
                { name: "Venue", cost: 1500 },
                { name: "Food", cost: 1200 },
                { name: "Decor", cost: 800 }
            ],
            tasks: ["Book venue", "Send invitations", "Hire photographer"],
            budget: 5000
        },
        birthday: {
            guests: ["Family", "Best Friends"],
            categories: [
                { name: "Cake", cost: 150 },
                { name: "Food", cost: 300 },
                { name: "Decor", cost: 200 }
            ],
            tasks: ["Order cake", "Decorate venue", "Plan games"],
            budget: 1000
        },
        corporate: {
            guests: ["Team", "Partners", "Clients"],
            categories: [
                { name: "Venue", cost: 2000 },
                { name: "Catering", cost: 1800 },
                { name: "AV", cost: 600 }
            ],
            tasks: ["Confirm agenda", "Book speakers", "Arrange catering"],
            budget: 7000
        }
    };

    const template = templates[type];
    if (!template) return;

    guests = [...template.guests];
    categories = [...template.categories];
    tasks = [...template.tasks];
    totalBudget = template.budget;

    renderGuests();
    renderTasks();
    renderCategories();
    updateBudgetUI();
    updateSuggestion();
    saveData();
    setStatus("Template applied.");
}

function updateSuggestion() {
    const suggestion = $("suggestionText");
    const remaining = totalBudget - getSpentTotal();

    if (tasks.length === 0) {
        suggestion.textContent = "Add a few tasks to stay on track.";
        return;
    }

    if (totalBudget === 0) {
        suggestion.textContent = "Set a budget to track spending.";
        return;
    }

    if (remaining < 0) {
        suggestion.textContent = "You are over budget. Consider reducing costs.";
        return;
    }

    if (remaining < totalBudget * 0.2) {
        suggestion.textContent = "Budget is tight. Review remaining categories.";
        return;
    }

    suggestion.textContent = "Everything looks on track. Great job!";
}

function exportCSV() {
    const rows = [
        ["Event Planner Export"],
        [],
        ["Guests"],
        ...guests.map((g) => [g]),
        [],
        ["Tasks"],
        ...tasks.map((t) => [t]),
        [],
        ["Budget"],
        ["Total", currency.format(totalBudget)],
        ["Spent", currency.format(getSpentTotal())],
        ["Remaining", currency.format(totalBudget - getSpentTotal())],
        [],
        ["Categories"],
        ["Name", "Cost"],
        ...categories.map((c) => [c.name, currency.format(c.cost)])
    ];

    const csv = rows
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "event-plan.csv";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("CSV exported.");
}

function exportPDF() {
    const lines = [
        "Event Planner Export",
        "",
        "Guests:",
        ...guests.map((g) => `- ${g}`),
        "",
        "Tasks:",
        ...tasks.map((t) => `- ${t}`),
        "",
        `Budget Total: ${currency.format(totalBudget)}`,
        `Budget Spent: ${currency.format(getSpentTotal())}`,
        `Budget Remaining: ${currency.format(totalBudget - getSpentTotal())}`,
        "",
        "Categories:",
        ...categories.map((c) => `- ${c.name}: ${currency.format(c.cost)}`)
    ];

    const blob = new Blob([lines.join("\n")], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "event-plan.pdf";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("PDF exported.");
}

function clearAll() {
    if (!confirm("Clear all data? This cannot be undone.")) return;
    totalBudget = 0;
    categories = [];
    guests = [];
    tasks = [];
    saveData();
    renderGuests();
    renderTasks();
    renderCategories();
    updateBudgetUI();
    updateSuggestion();
    setStatus("All data cleared.");
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("eventPlannerTheme", isDark ? "dark" : "light");
    setStatus(isDark ? "Dark theme enabled." : "Light theme enabled.");
}

window.applyTemplate = applyTemplate;
window.addGuest = addGuest;
window.setBudget = setBudget;
window.addCategory = addCategory;
window.addTask = addTask;
window.exportCSV = exportCSV;
window.exportPDF = exportPDF;
window.loadData = loadData;
window.clearAll = clearAll;
window.toggleTheme = toggleTheme;
