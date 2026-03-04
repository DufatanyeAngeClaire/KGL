<template>
  <div class="d-flex">
    <!-- SIDEBAR -->
    <div class="sidebar bg-success text-white p-3">

      <!-- Logo (circle) -->
      <div class="text-center mb-3">
        <img
          src="/src/assets/karibu logo.jpg"
          alt="Logo"
          class="sidebar-logo"
        />
      </div>

      <!-- Welcome + Role/Name -->
      <div class="text-center mb-4">
        <h5>Welcome</h5>
        <div class="fw-bold">{{ user.role }}</div>
        <div>{{ user.fullName }}</div>
      </div>

      <!-- Sidebar Links -->
      <router-link to="/manager/procurement" class="nav-link">Procurement</router-link>
      <router-link to="/manager/sales" class="nav-link">Sales</router-link>
      <router-link to="/manager/credit-sales" class="nav-link">Credit Sales</router-link>
      <router-link to="/manager/reports" class="nav-link">Reports</router-link>
      <router-link to="/manager/users" class="nav-link">User Management</router-link>

      <!-- Logout Button -->
      <button @click="logout" class="btn btn-danger mt-4 w-100">Logout</button>

    </div>

    <!-- MAIN CONTENT -->
    <div class="content p-4 w-100">
      <h3 class="text-success fw-bold">Manager Dashboard</h3>

      <!-- SUMMARY CARDS -->
      <div class="row g-4 my-4">
        <div class="col-md-3" v-for="card in summaryCards" :key="card.title">
          <div class="card shadow text-center">
            <div class="card-body">
              <h6 class="text-muted">{{ card.title }}</h6>
              <h4 class="fw-bold text-success">{{ card.value }}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- RECENT TRANSACTIONS TABLE -->
      <div class="card shadow">
        <div
          class="card-header bg-success text-white d-flex justify-content-between align-items-center"
        >
          <span>Recent Transactions</span>
          <input
            type="text"
            class="form-control w-25"
            placeholder="Search produce, branch, type..."
            v-model="searchQuery"
          />
        </div>

        <div class="card-body">
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Type</th>
                <th>Produce</th>
                <th>Branch</th>
                <th>Quantity (KG)</th>
                <th>Amount (UGX)</th>
                <th>Person</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in filteredTransactions" :key="item._id">
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-primary': item.type === 'Procurement',
                      'bg-success': item.type === 'Sale',
                      'bg-warning text-dark': item.type === 'Credit Sale',
                    }"
                  >
                    {{ item.type }}
                  </span>
                </td>
                <td>{{ item.produceName }}</td>
                <td>{{ item.branch }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.amount }}</td>
                <td>{{ item.person }}</td>
                <td>{{ formatDate(item.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      summaryCards: [],
      transactions: [],
      searchQuery: "",
      user: {
        fullName: "",
        role: ""
      }
    };
  },
mounted() {
  // Load user info from localStorage
  const sessionString = localStorage.getItem("currentSession");
  if (sessionString) {
    try {
      const session = JSON.parse(sessionString);
      this.user.fullName = session.fullName || "Unknown";
      this.user.role = session.role || "Manager";
    } catch (err) {
      console.error("Failed to parse session from localStorage:", err);
    }
  }

  this.fetchDashboardData();
 },
  computed: {
    filteredTransactions() {
      if (!this.searchQuery) return this.transactions
      ;

      return this.transactions.filter(
        (item) =>
          item.type?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.produceName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.branch?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },

  methods: {
    logout() {
      localStorage.removeItem("currentSession");
      this.$router.push("/");
    },

    async fetchDashboardData() {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard");

        // Map backend fields to frontend unified fields
        const allTransactions = res.data.transactions.map((item) => ({
          _id: item._id,
          type: item.type || this.detectType(item),
          produceName: item.produceName || item.item,
          branch: item.branch || "-",
          quantity: item.quantity || item.tonnage || 0,
          amount: item.amount || item.amountPaid || item.amountDue || 0,
          person: item.person || "-",
          date: item.date || item.dispatchDate || item.createdAt,
        }));

        // Sort latest first
        this.transactions = allTransactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        this.summaryCards = res.data.summary;
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    },

    detectType(item) {
      if (item.amountDue !== undefined) return "Credit Sale";
      if (item.amountPaid !== undefined) return "Sale";
      if (item.item !== undefined) return "Procurement";
      return "Unknown";
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>

<style>
.sidebar {
  width: 230px;
  min-height: 100vh;
}
.content {
  margin-left: 10px;
}
.nav-link {
  color: white;
  display: block;
  padding: 8px;
}
.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Circular logo */
.sidebar-logo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

/* Add this to your <style> section */
.sidebar .user-info h5,
.sidebar .user-info div {
  color: #fff; /* ensure text is visible */
  margin: 0;
}

/* Optional: add a subtle background or padding to the user info */
.sidebar .user-info {
  background: rgba(255, 255, 255, 0.1); /* light overlay */
  padding: 10px;
  border-radius: 8px;
}
</style>