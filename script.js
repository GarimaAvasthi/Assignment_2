let salary = 0;
let expenses = [];
let currency = "INR";
let exchangeRate = 1;
let chart = null;
let alertShown = false;

// DOM
const salaryInput = document.getElementById("salaryInput");
const salaryDisplay = document.getElementById("salaryDisplay");
const expenseTotalDisplay = document.getElementById("expenseTotal");
const balanceDisplay = document.getElementById("balanceDisplay");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseList = document.getElementById("expenseList");
const currencySelect = document.getElementById("currencySelect");

// Helpers
function symbol() {
  if (currency === "USD") return "$";
  if (currency === "EUR") return "€";
  return "INR";
}

// Load & Save
function loadData() {
  salary = Number(localStorage.getItem("salary")) || 0;
  expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  updateUI();
}

function saveData() {
  localStorage.setItem("salary", salary);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Salary
document.getElementById("setSalaryBtn").onclick = () => {
  const val = Number(salaryInput.value);
  if (val >= 0) {
    salary = val;
    saveData();
    updateUI();
  }
};

// Add Expense
document.getElementById("addExpenseBtn").onclick = () => {
  const name = expenseName.value.trim();
  const amount = Number(expenseAmount.value);

  if (!name || amount <= 0) return;

  expenses.push({ id: Date.now(), name, amount });
  expenseName.value = "";
  expenseAmount.value = "";

  saveData();
  updateUI();
};

// Currency Switch
currencySelect.onchange = async () => {
  currency = currencySelect.value;

  if (currency === "INR") {
    exchangeRate = 1;
    updateUI();
    return;
  }

  const res = await fetch(
    `https://api.frankfurter.app/latest?from=INR&to=${currency}`
  );
  const data = await res.json();
  exchangeRate = data.rates[currency];
  updateUI();
};

// UI Update
function updateUI() {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = salary - total;

  salaryDisplay.textContent = `${symbol()}${(salary * exchangeRate).toFixed(2)}`;
  expenseTotalDisplay.textContent = `${symbol()}${(total * exchangeRate).toFixed(2)}`;
  balanceDisplay.textContent = `${symbol()}${(remaining * exchangeRate).toFixed(2)}`;

  if (remaining < salary * 0.1) {
    balanceDisplay.style.color = "red";
    if (!alertShown) {
      alert("Warning: Remaining balance below 10% of salary.");
      alertShown = true;
    }
  } else {
    balanceDisplay.style.color = "";
    alertShown = false;
  }

  renderExpenses();
  renderChart(total, remaining);
}

// Expenses
function renderExpenses() {
  expenseList.innerHTML = "";
  expenses.forEach(e => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${e.name}
      <span class="delete">${symbol()}${(e.amount * exchangeRate).toFixed(2)} ✕</span>
    `;
    li.querySelector(".delete").onclick = () => {
      expenses = expenses.filter(x => x.id !== e.id);
      saveData();
      updateUI();
    };
    expenseList.appendChild(li);
  });
}

// Chart
function renderChart(exp, rem) {
  if (chart) chart.destroy();
 chart = new Chart(document.getElementById("expenseChart"), {
  type: "doughnut",
  data: {
    labels: ["Expenses", "Remaining"],
    datasets: [{
      data: [exp, rem],
      backgroundColor: ["#ef4444", "#22c55e"],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.3,   // 👈 controls size visually
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 12,
          color: "#9ca3af"
        }
      }
    },
    cutout: "70%"        
  }
});

}

// PDF Export
document.getElementById("downloadPdfBtn").onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  doc.text("Cash-Flow Report", 10, y); y += 10;
  doc.text(`Salary: INR${salary}`, 10, y); y += 10;
  doc.text("Expenses:", 10, y); y += 10;

  expenses.forEach((e, i) => {
    doc.text(`${i + 1}. ${e.name} - INR${e.amount}`, 10, y);
    y += 8;
  });

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  doc.text(`Remaining Balance: INR${salary - total}`, 10, y + 10);

  doc.save("CashFlow_Report.pdf");
};

// Reset
document.getElementById("clearBtn").onclick = () => {
  if (confirm("Reset all data?")) {
    localStorage.clear();
    location.reload();
  }
};

// Init
loadData();
