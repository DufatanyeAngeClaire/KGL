<template>
  <div class="bg-light vh-100 d-flex justify-content-center align-items-center">

    <!-- Toast -->
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <div v-if="toastMessage" class="toast show align-items-center text-white"
           :class="toastType === 'error' ? 'bg-danger' : 'bg-success'">
        <div class="d-flex">
          <div class="toast-body">{{ toastMessage }}</div>
        </div>
      </div>
    </div>

    <!-- Login Card -->
    <div class="col-md-4">
      <div class="card shadow border-0">
        <div class="card-header bg-success text-white text-center">
          <h5 class="mb-0">Karibu Groceries LTD</h5>
        </div>
        <div class="card-body">
          <h6 class="text-center text-muted mb-3">Login</h6>

          <form @submit.prevent="login">

            <!-- Email Input -->
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                v-model="email"
                type="text"
                class="form-control"
                placeholder="Enter email"
                required
              />
            </div>

            <!-- Password Input -->
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Enter password"
                required
              />
            </div>

            <!-- Login Button -->
            <button type="submit" class="btn btn-success w-100">Login</button>
          </form>
        </div>
      </div>

      <p class="text-center text-muted mt-3">&copy; 2026 Karibu Groceries LTD</p>
    </div>
  </div>
</template>

<script>
import api from "../services/api"; // make sure this points to your axios instance

export default {
  data() {
    return {
      email: "",
      password: "",
      toastMessage: "",
      toastType: "success",
    };
  },
  methods: {
    showToast(message, type = "success") {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = "";
      }, 3000);
    },

    async login() {
      const email = this.email.trim();
      const password = this.password.trim();

      if (!email || !password) {
        this.showToast("Please enter both email and password.", "error");
        return;
      }

      try {
        const res = await api.post("/login", { email, password });

        // Save the full session in localStorage
        const userSession = {
          fullName: res.data.fullname,  // match backend key
          role: res.data.role,
          email: res.data.email,
          branch: res.data.branch,
          token: res.data.token,
        };

        localStorage.setItem("currentSession", JSON.stringify(userSession));

        this.showToast("Login successful!", "success");

        // Redirect to dashboard
        setTimeout(() => {
          this.$router.push("/dashboard");
        }, 1000);

      } catch (err) {
        const message = err.response?.data?.message || "Invalid credentials";
        this.showToast(message, "error");
      }
    },
  },
};
</script>

<style scoped>
/* Center the login card vertically */
.bg-light {
  background-color: #f8f9fa !important;
}

/* Toast styling */
.toast {
  border-radius: 0.25rem;
  min-width: 250px;
}

/* Card shadow */
.card.shadow {
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
}
</style>