async function loadSummary() {

  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/director/summary", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await response.json();

  const branches = data.normalSales.map(item => item._id);
  const totals = data.normalSales.map(item => item.totalSales);

  document.getElementById("cash").innerText = data.grandTotalCash;
  document.getElementById("credit").innerText = data.grandTotalCredit;

  new Chart(document.getElementById("salesChart"), {
    type: "bar",
    data: {
      labels: branches,
      datasets: [{
        label: "Total Sales Per Branch",
        data: totals,
        backgroundColor: ["#212529", "#6c757d"]
      }]
    }
  });
}

loadSummary();