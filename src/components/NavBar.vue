<template>
  <nav class="bg-white shadow-sm">
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

        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-center space-x-4">
            <a href="#" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Home</a>
            <a href="#" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">About</a>
            <a href="#" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Contact</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Component logic can be added here if needed
</script> 