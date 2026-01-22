Cash-Flow: Salary & Expense Tracker

Cash-Flow is an interactive financial dashboard built using **Vanilla JavaScript** that allows users to track salary, manage expenses, and monitor remaining balance in real time. The project focuses on strengthening **core frontend fundamentals** such as JavaScript logic, DOM manipulation, data persistence, and third-party library integration—without using any framework.


## Features:-

Salary & Expense Management:
Set monthly salary
Add expenses with validation
Delete individual expenses
Automatically calculate remaining balance

Real-Time Updates:
No page reloads
Instant UI updates on every action

Data Persistence:
Salary and expenses stored using `localStorage`
Data remains intact after page refresh

Currency Conversion:
Switch between **INR, USD, and EUR**
Real-time conversion using a free exchange-rate API
Internal data remains consistent (stored in INR)

Budget Alert:
Warning triggered when remaining balance drops below **10% of salary**
Balance value turns red and alert is shown

Data Visualization:
Doughnut chart showing **Expenses vs Remaining Balance**
Built using **Chart.js**
Chart updates dynamically

PDF Export:
Downloadable financial report
Includes salary, expense list, and remaining balance
Generated using **jsPDF**


## Tech Stack:-

- HTML5  
- CSS3  
- Vanilla JavaScript (ES6+)  
- Chart.js  
- jsPDF  
- Frankfurter Exchange Rate API  

---

## 📂 Project Structure

cash-flow/
│
├── index.html
├── style.css
├── script.js
├── README.md
└── Prompts.md




## How to Run

1. Clone the repository  
2. Open `index.html` in a browser  
(Alternatively, use Live Server in Visual Studio Code)
3. Start tracking salary and expenses  

No build tools or dependencies required.

---

