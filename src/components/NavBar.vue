<template>
  <nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Site Name -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <!-- Modern Logo SVG -->
            <svg 
              class="h-10 w-10 text-indigo-600" 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Modern Book Design -->
              <path 
                d="M8 32V8C8 6.89543 8.89543 6 10 6H30C31.1046 6 32 6.89543 32 8V32C32 33.1046 31.1046 34 30 34H10C8.89543 34 8 33.1046 8 32Z" 
                fill="currentColor"
                fill-opacity="0.1"
                stroke="currentColor"
                stroke-width="2"
              />
              <!-- Modern Pages -->
              <path 
                d="M12 12H28M12 18H28M12 24H20" 
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <!-- Modern Connection Lines -->
              <path 
                d="M24 28C24 28 26 30 28 28C30 26 32 28 32 28" 
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <!-- Decorative Elements -->
              <circle 
                cx="28" 
                cy="28" 
                r="2" 
                fill="currentColor"
              />
              <circle 
                cx="32" 
                cy="28" 
                r="2" 
                fill="currentColor"
              />
            </svg>
            <span class="ml-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">dbookmatch.com</span>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div v-if="user" class="flex items-center space-x-4">
            <span class="text-gray-700">{{ user.email }}</span>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
          <div v-else class="flex items-center space-x-4">
            <router-link
              to="/login"
              class="text-gray-700 hover:text-indigo-600"
            >
              Login
            </router-link>
            <router-link
              to="/signup"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { onAuthStateChange, logout } from '../firebase/auth';
import { auth } from '../firebase/config';

const router = useRouter();
const user = ref(null);

onMounted(() => {
  onAuthStateChange((currentUser) => {
    user.value = currentUser;
  });
});

const handleLogout = async () => {
  try {
    await logout();
    router.push('/');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
</script> 