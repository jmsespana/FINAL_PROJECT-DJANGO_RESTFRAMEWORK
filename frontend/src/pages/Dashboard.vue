<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // If you're using Pinia for store management

export default {
    name: "Users",
    data() {
        return {
            users: [], // The list of users
            loading: true, // Loading state to show spinner until data is fetched
            error: null, // Error message state

        };
    },
    mounted() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/users/", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Using Bearer token authentication
                    },
                });
                console.log("API response:", response); // For debugging
                this.users = response.data.data.users; // Ensure the correct path to users data
            } catch (error) {
                console.error("Error fetching users:", error);
                this.error = error.message || "Something went wrong!"; // Set error message if request fails
            } finally {
                this.loading = false; // Set loading to false after the request is done
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
    <v-container fluid class="winter-container">
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
            <!-- Logout Button -->
            <v-col class="d-flex justify-end">
                <v-btn @click="logout" class="logout-btn">
                    <v-icon left>mdi-logout</v-icon>
                    Logout
                </v-btn>
            </v-col>
        </v-row>

        <!-- Main Content Section -->
        <v-row>
            <v-col cols="12">
                <!-- Title Section with Icon -->
                <h2 class="text-center my-4 title-text">
                    <v-icon left class="title-icon" style="margin-top: -15px;">mdi-account-group</v-icon>
                    USERS DATA / DASHBOARD
                </h2>

                <!-- Loading Spinner -->
                <v-spinner v-if="loading" color="primary" class="d-flex justify-center" />

                <!-- Data Table -->
                <v-data-table
                    v-else-if="!loading && users.length > 0"
                    :items="users"
                    :headers="headers"
                    item-value="id"
                    hide-default-header
                    class="elevation-1 card-table"
                >
                    <!-- Custom Table Rows -->
                    <template v-slot:[`item`]="{ item }">
                        <div class="custom-row">
                            <div class="custom-cell">
                                <span class="cell-label">ID:</span> 
                                <span class="cell-content">{{ item.id }}</span>
                            </div>
                            <div class="custom-cell">
                                <span class="cell-label">Name:</span> 
                                <span class="cell-content">{{ item.name }}</span>
                            </div>
                            <div class="custom-cell">
                                <span class="cell-label">Email:</span> 
                                <span class="cell-content">{{ item.email }}</span>
                            </div>
                        </div>
                    </template>
                </v-data-table>

                <!-- No Users Found Alert -->
                <v-alert v-else-if="!loading && users.length === 0" type="info" class="mt-4 alert-info">
                    No users found.
                </v-alert>

                <!-- Error Alert -->
                <v-alert v-if="error" type="error" class="mt-4 alert-error">
                    Error fetching users: {{ error }}
                </v-alert>
            </v-col>
        </v-row>

        <!-- Action Buttons -->
        <v-row>
            <v-col>
                <router-link to="/chat">
                    <v-btn @click="ChatPage" class="chat-btn mt-4 mx-2">Chat Page</v-btn>
                </router-link>
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
    background-color: #2E3B40;
    color: #ffffff;
    padding: 8px 15px;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.chat-btn:hover {
    background-color: #E04E39;
    transform: scale(1.05);
}

.winter-container {
    background-color: #0B2E33;
    color: #ffffff;
    min-height: 100vh;
}

.title-text {
    font-size: 2.2rem;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 20px;
    letter-spacing: 1.5px;
    color: #B8E3E9;
}

.card-table {
    background-color: transparent;
    border: 3px solid #4F7C82;
    border-radius: 10px;
    width: 100%;
}

.custom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #4F7C82;
    margin: 10px 0;
    padding: 5px 0px;
}

.custom-cell {
    flex: 1;
    text-align: center;
    padding: 5px;
}

.cell-label {
    display: block;
    font-size: 0.9rem;
    font-weight: bold;
    color: #0B2E33;
    text-transform: uppercase;
    margin-bottom: 4px;
    letter-spacing: 1px;
}

.cell-content {
    font-size: 1rem;
    color: #B8E3E9;
    font-weight: 500;
}

@media (max-width: 768px) {
    .custom-row {
        flex-direction: column;
        text-align: center;
    }
    .custom-cell {
        margin: 8px 0;
    }
}

.alert-info, .alert-error {
    background-color: #f9fafb;
    color: #4F7C82;
}
</style>

