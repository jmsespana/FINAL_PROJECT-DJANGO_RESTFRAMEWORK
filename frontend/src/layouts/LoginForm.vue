<template>
<v-card class="pa-4 login-card" style="background-color: #93b1b5;">
  <img src="" alt="SnapTalk Logo" class="logo" />
  <slot name="header">
    <h2>Login</h2>
  </slot>
  <v-form ref="form" @submit.prevent="handleLogin">
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      required
      outlined
      prepend-icon="mdi-email"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      required
      outlined
      prepend-icon="mdi-lock"
    ></v-text-field>
    <v-btn type="submit" class="mt-4" block prepend-icon="mdi-login">Login</v-btn>
  </v-form>
  <br />
  <slot name="footer"></slot>
</v-card>

</template>

<script>
import { useAuthStore } from "@/stores/auth"; // Importing the merged auth store
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  setup() {
    const authStore = useAuthStore();  // Access the auth store
    const router = useRouter();
    const email = ref("");  // Bind email input
    const password = ref("");  // Bind password input
    const toast = useToast();

    const handleLogin = async () => {
      const success = await authStore.login(email.value, password.value);  // Use the store's login action
      if (!success) {
        toast.error("Login failed");  // Display error toast if login fails
      } else {
        toast.success("Login successful");  // Display success toast if login succeeds
        // Redirect to the previously requested page, or to /dashboard if none is specified
        const redirect = router.currentRoute.value.query.redirect || "/dashboard";
        router.push(redirect);
      }
    };

    return { email, password, handleLogin };
  },
};
</script>


<style scoped>
/* Style for the Login button */
.v-btn {
  background-color: #0b2e33; /* Background color */
  color: #fff; /* Text color */
  font-weight: bold; /* Make the text bold */
  text-transform: uppercase; /* Uppercase text for a strong appearance */
  border-radius: 8px; /* Rounded corners */
  padding: 12px 20px; /* Padding to make the button bigger */
}




/* Style for the logo image */
.logo {
  display: block;
  width: 150px; /* Set width for the logo */
  margin: 0 auto 20px auto; /* Center the logo and give space below */
}


.login-card {
  padding: 60px; /* Increased padding for more space inside the card */
  width: 150%; /* Full width for responsive sizing */
  margin-left: -120px;
  border: 2px solid #93b1b5; /* Border color set to #93b1b5 */
  border-radius: 10px; /* Optional: add rounded corners */

}




/* Optional: Style for the card's title (h2) */
.login-card h2 {
  font-family: 'Roboto', sans-serif;
  color: #333;
  font-size: 2.5rem; /* Increased font size for better readability */
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

/* Make the card responsive on smaller screens */
@media (max-width: 768px) {
  .login-card {
    padding: 40px; /* Slightly reduced padding for smaller screens */
    width: 90%; /* Slightly reduce the width for better fitting on smaller screens */
  }

  .login-card h2 {
    font-size: 2rem; /* Reduce font size for smaller screens */
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px; /* Further reduce padding on very small screens */
    width: 90%; /* Keep the width 90% for very small screens */
  }

  .login-card h2 {
    font-size: 1.8rem; /* Further reduce font size for very small screens */
  }
}
</style>

