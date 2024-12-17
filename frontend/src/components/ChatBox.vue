<script>
import axios from 'axios';
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // If you're using Pinia for store management

export default {
  data() {
    return {
      user: {
        id: null,
        name: '',
        avatar: '',
      },
      users: [],
      selectedReceiver: null,
      newMessage: '',
      messages: [], // Default value is an empty array to avoid undefined errors
      replies: [], // Default value is an empty array to avoid undefined errors
    };
  },
  created() {
    this.fetchUserData();
    this.fetchUsers();
    this.startMessagePolling(); // Start polling for new replies
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => user.id !== this.user.id);
    }
  },
  methods: {
    async fetchUserData() {
      try {
        const userResponse = await axios.get('http://localhost:8000/api/me/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        this.user = userResponse.data;
        this.fetchMessages();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    
    async fetchUsers() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.data.status === 'success' && Array.isArray(response.data.data.users)) {
          this.users = response.data.data.users;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    selectReceiver(user) {
      this.selectedReceiver = user;
      this.fetchMessages();
      this.replies = []; // Clear previous replies when switching users
    },
    async fetchMessages() {
      if (!this.selectedReceiver) return;
      try {
        const receiverId = this.selectedReceiver.id;

        const response = await axios.get('http://127.0.0.1:8000/chat/messages-by-receiver/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            receiver_id: receiverId,
          },
        });

        this.messages = response.data;
        this.fetchReplies(); // Fetch replies from the selected receiver
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    async fetchReplies() {
      if (!this.selectedReceiver) return;
      try {
        const receiverId = this.selectedReceiver.id;

        const response = await axios.get('http://127.0.0.1:8000/chat/messages-by-sender/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            sender_id: receiverId, // Get replies from the selected user
          },
        });

        this.replies = response.data; // Store the replies
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    },
    startMessagePolling() {
      // Polling to fetch new messages every 5 seconds
      setInterval(() => {
        if (this.selectedReceiver) {
          this.fetchMessages();
          this.fetchReplies();
        }
      }, 5000);
    },
    async sendMessage() {
      if (!this.selectedReceiver || !this.newMessage) return;

      const messageData = {
        sender: this.user.id,
        receiver: this.selectedReceiver.id,
        content: this.newMessage,
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await axios.post('http://localhost:8000/chat/messages/', messageData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });

        this.messages.push({
          id: response.data.id,
          sender_name: this.user.name,
          content: this.newMessage,
        });

        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
            // Logout method
            logout() {
            const authStore = useAuthStore();
            authStore.logout(); // Clear the auth token in Pinia store
        }
  }
};
</script>


<template>
  <v-container fluid class="page-container">
    <!-- Navbar -->
    <v-row class="navbar">
      <!-- Logo and Brand Name -->
      <v-col class="d-flex justify-start">
        <v-img 
          src="/src/images/logo.png" 
          alt="SnapTalk Logo" 
          max-width="80px"
          contain
          class="navbar-logo"
        />
        <div class="navbar-logo">SnapTalk</div>
      </v-col>

      <!-- Dashboard Button -->
      <v-col class="d-flex justify-end" style="margin-right: -550px; margin-top: -3px;">
        <router-link to="/dashboard">
          <v-btn @click="ChatPage" class="chat-btn mt-4 mx-2" prepend-icon="mdi-message-text">Go to Dashboard</v-btn>
        </router-link>
      </v-col>

      <!-- Logout Button -->
      <v-col class="d-flex justify-end">
        <v-btn @click="logout" class="logout-btn">
          <v-icon left>mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <!-- Page Heading -->
      <v-col cols="12">
        <div class="d-flex flex-column align-items-center" style="margin-top: 15px;">
          <h2 class="page-heading">
            <v-icon left>mdi-comment-outline</v-icon> Select a conversation
          </h2>
          <div class="d-flex align-items-center w-100">
            <hr class="divider-left">
            <span class="message-text">Click on a user from the Inbox to start a chat</span>
            <hr class="divider-right">
          </div>
        </div>
      </v-col>

      <!-- Inbox Section -->
      <v-col cols="6" md="4">
        <v-card class="mb-3 chat-box" elevation="2">
          <v-card-title>
            <div class="headline">
              <v-icon left>mdi-inbox</v-icon> Inbox
            </div>
          </v-card-title>
          <v-list>
            <!-- Display users if available -->
            <v-list-item-group v-if="filteredUsers.length > 0">
              <v-list-item v-for="user in filteredUsers" :key="user.id" @click="selectReceiver(user)">
                <v-list-item-content>
                  <v-list-item-title>{{ user.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <!-- Display no conversations message -->
            <v-list-item v-else>
              <v-list-item-content>
                <v-list-item-title>No conversations available...</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Chat Section -->
      <v-col cols="12" md="8" class="chat-container">
        <!-- Chat Box -->
        <v-card v-if="selectedReceiver" class="chat-card" elevation="3" outlined>
          <!-- Title Section -->
          <v-card-title class="chat-title-section d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon color="white" class="mr-2">mdi-account-circle</v-icon>
              <h2 class="chat-title">{{ selectedReceiver.name }}</h2>
            </div>
            <p class="chat-subtitle">Chat with {{ selectedReceiver.name }}</p>
          </v-card-title>

          <!-- Messages List -->
          <v-card-subtitle class="chat-messages-container pa-0">
            <v-sheet height="100" class="chat-messages-wrapper overflow-y-auto pa-3">
              <v-list dense style="background-color: #3a5a60;">
                <!-- Display messages if available -->
                <v-list-item-group v-if="messages && messages.length > 0">
                  <v-list-item v-for="message in messages" :key="message.id" class="chat-message-item mb-2">
                    <v-list-item-content>
                      <v-list-item-title class="chat-message-text">
                        {{ message.content }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                <!-- Display no messages message -->
                <v-list-item v-else>
                  <v-list-item-content>
                    <v-list-item-title class="chat-no-message">
                      No messages yet...
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-card-subtitle>

          <!-- Message Input -->
          <v-card-actions class="chat-input-section pa-3 d-flex align-center">
            <v-text-field
              v-model="newMessage"
              label="Type your message"
              outlined
              dense
              hide-details
              class="chat-input"
            />
            <v-btn
              @click="sendMessage"
              :disabled="!newMessage"
              class="chat-send-button"
              elevation="2"
            >
              Send
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Replies Section -->
        <v-card v-if="replies && replies.length > 0" class="replies-card pa-3 mt-3" elevation="3" outlined>
          <v-card-title class="replies-title-section d-flex align-center">
            <v-icon color="white" class="mr-1">mdi-message-text</v-icon>
            <h3 class="replies-title">Replies</h3>
          </v-card-title>

          <v-sheet class="replies-container overflow-y-auto pa-3">
            <v-list dense style="background-color: #3a5a60;">
              <v-list-item v-for="reply in replies" :key="reply.id" class="reply-item mb-2">
                <v-list-item-content>
                  <v-list-item-title class="reply-text">
                    {{ reply.content }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>





<style scoped>
.navbar {
    background: linear-gradient(to right, #1A5C61, #0B2E33); 
    margin-top: -17px;
    margin-left: -17px;
}

.navbar-logo {
    display: flex;
    align-items: center;
    margin-left: 10px;
    font-size: 1.6rem;
    font-weight: bold;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 1.5px;
}

.logout-btn {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 13px;
    background-color: #4F7C82;
    color: #ffffff;
    border-radius: 8px;
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.logout-btn:hover {
    background-color: #B8E3E9;
    color: #0B2E33;
    transform: scale(1.05);
    cursor: pointer;
}

.chat-btn {
    font-size: 1rem;
    font-weight: bold;
    background-color: #4F7C82;
    color: #ffffff;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.chat-btn:hover {
    background-color: #B8E3E9;
    color: #0B2E33;
    transform: scale(1.05);
    cursor: pointer;
}

.page-heading {
  font-size: 2rem;
  color: #B8E3E9;
  margin-bottom: 10px;
  text-align: center; 
}

.divider-left, .divider-right {
  flex-grow: 1;
  border: 0;
  border-top: 3px solid #4f7c82;
  margin-top: 12px;
}

.message-text {
  font-size: 1.1rem;
  color: #B8E3E9;
  margin: 0 10px; 
}

.page-container {
  min-height: 100vh; 
  background-color: #0b2e33;
}

.chat-box {
  border-radius: 10px; 
  background: linear-gradient(185deg, #0b2e33, #064c54);
  border: 2px solid #B8E3E9;
  overflow: hidden;
}

.chat-box .v-card-title {
  padding: 10px 20px;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: -10px;
}

.chat-box .v-list {
  margin-top: 10px;
  padding: 0;
}

.chat-box .v-list-item {
  padding: 12px 10px;
  border-bottom: 1px solid #1a2a2a;
  background-color: #4F7C82;
}

.chat-box .v-list-item-title {
  font-size: 1rem;
  font-weight: normal;
  color: #ddd;
}

.chat-box .v-list-item-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 1.1rem;
  color: #bbb;
}

.chat-card {
  background-color: #4c7076;
  border-radius: 8px;
  color: #ffffff;
}

.chat-title-section {
  border-bottom: 1px solid #3a5a60;
}

.chat-title {
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
}

.chat-subtitle {
  color: #b0c4c9;
  font-size: 14px;
}

.chat-messages-wrapper {
  background-color: #4c7076;
  border-radius: 8px;
}

.chat-message-item {
  margin-bottom: 8px;
}

.chat-message-text {
  color: #000;
  font-size: 14px;
  line-height: 1.5;
}

.chat-no-message {
  text-align: center;
  color: #b0c4c9;
  font-style: italic;
}

.chat-input-section {
  background-color: #4c7076;
}

.chat-input {
  background-color: #3a5a60;
  border-radius: 8px;
}

.chat-send-button {
  background-color: #3a5a60;
  color: #fff;
  margin-left: 8px;
  border-radius: 8px;
}

.chat-send-button:disabled {
  background-color: #3a5a60;
  color: #d3d3d3;
}

.replies-card {
  background-color: #4c7076;
  border-radius: 8px;
}

.replies-title-section {
  border-bottom: 1px solid #3a5a60;
}

.replies-title {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
}

.replies-container {
  background-color: #3a5a60;
  border-radius: 8px;
}

.reply-item {
  margin-bottom: 8px;
}

.reply-text {
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
}
</style>
