<script>
    export default {
        
    }
</script>

<template>
    <v-container fluid class="d-flex align-center justify-center" style="height: 100vh; background-color: #0b2e33;">
      <v-row class="text-center">
        <v-col>
          <v-icon size="100" color="red">mdi-alert-circle</v-icon>
          <h1 class="display-1 font-weight-bold" style="color: #fff;">404</h1>
          <p class="headline">Oops!  Page does not exist.</p>
          <v-btn @click="$router.push('/')">
          <v-icon left>mdi-home</v-icon>Go Back Home
        </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <style scoped>
    .v-btn {
      font-size: 16px;
      padding: 12px 24px;
      margin-top: 20px;
      border-radius: 8px;
      background-color: #4f7c82;
      color: #ffffff;
    }
  
    .headline {
      font-size: 18px;
      margin: 10px 0;
      color: #fff;
    }
  
    .text-center {
      text-align: center;
    }
  </style>
