<template>
  <v-container fluid class="pa-0">
    <v-row class="fill-height" align="center" justify="center">
      <!-- Main Column (Login Form) -->
      <v-col cols="12" sm="8" md="6" lg="4">
          <login-form>
            <template #header>
              <h2 class="text-center" style="font-family: 'Roboto', sans-serif; color: #333; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; background: linear-gradient(45deg, #0b2e33, #4f7c82, #0b2e33); -webkit-background-clip: text; color: transparent; animation: slideIn 1s ease-out; font-size: 40px; margin-bottom: 20px;">
                Welcome Back
              </h2>
            </template>

            <template #footer>
              <v-btn 
                text 
                class="d-block mx-auto  footer-btn" 
                @click="switchToRegister" 
                style="font-weight: 500; color: #fff; background-color: #0b2e33;">
                Don't have an account? Register
              </v-btn>
            </template>

          </login-form>
      </v-col>
    </v-row>

    <!-- Register Dialog -->
    <v-dialog v-model="showRegister" persistent max-width="400px">
      <register-form v-model="showRegister">
        <template #header>
          <h2 class="text-center" style="font-family: 'Roboto', sans-serif; color: #333;">Create an Account</h2>
        </template>
        <template #footer>
          <!-- Optional footer content for the register form -->
        </template>
      </register-form>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref } from "vue";
import LoginForm from "@/layouts/LoginForm.vue";
import RegisterForm from "@/layouts/RegisterForm.vue";

export default {
  components: { LoginForm, RegisterForm },
  setup() {
    const showRegister = ref(false);

    const switchToLogin = () => (showRegister.value = false);
    const switchToRegister = () => (showRegister.value = true);

    return { showRegister, switchToLogin, switchToRegister };
  },
};
</script>

<style scoped>

/* Centering the login form and setting background */
.v-container {
  background-color: #0b2e33;
  background-size: 100% 100%;
  animation: colorAnimation 5s ease infinite;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Animation for subtle background color shift */
@keyframes colorAnimation {
  0% {
    background-color: #0b2e33; /* Deep teal */
  }
  50% {
    background-color: #4f7c82; /* Lighter teal */
  }
  100% {
    background-color: #0b2e33; /* Deep teal */
  }
}


.v-btn {
  font-weight: 500;
  color: #00796b; /* Primary color for links */
  text-transform: none;
  transition: color 0.3s ease;
}

.v-btn:hover {
  color: #004d40; /* Darker shade for hover effect */
}

/* Adjustments for responsiveness */
@media (max-width: 600px) {
  .v-card {
    padding: 30px;
  }

  .v-btn {
    font-size: 14px;
  }
}
</style>
