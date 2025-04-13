<script setup>
import { ref, computed } from 'vue'
import { searchBooks, getRecommendationsByInterests, getRecommendationsByBooks } from '../utils/googleBooks'

const userType = ref('new') // 'new' or 'existing'
const interests = ref([])
const readBooks = ref([])
const bookTitle = ref('')
const recommendations = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)

const availableInterests = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
  'Romance', 'Biography', 'History', 'Self-Help', 'Business',
  'Technology', 'Science', 'Philosophy', 'Psychology', 'Art'
]

const clearAllData = () => {
  interests.value = []
  readBooks.value = []
  bookTitle.value = ''
  recommendations.value = []
  searchQuery.value = ''
  searchResults.value = []
  isSearching.value = false
  isLoading.value = false
}

const switchToNewReader = () => {
  clearAllData()
  userType.value = 'new'
}

const switchToExistingReader = () => {
  clearAllData()
  userType.value = 'existing'
}

const addInterest = (interest) => {
  if (interests.value.length < 3 && !interests.value.includes(interest)) {
    interests.value.push(interest)
  }
}

const removeInterest = (interest) => {
  interests.value = interests.value.filter(i => i !== interest)
}

const addBook = (book) => {
  if (book && !readBooks.value.some(b => b.id === book.id)) {
    readBooks.value.push(book)
  }
}

const removeBook = (book) => {
  readBooks.value = readBooks.value.filter(b => b.id !== book.id)
}

const searchForBooks = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  try {
    const results = await searchBooks(searchQuery.value)
    searchResults.value = results
  } catch (error) {
    console.error('Error searching books:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

const getRecommendations = async () => {
  isLoading.value = true
  try {
    if (userType.value === 'new') {
      recommendations.value = await getRecommendationsByInterests(interests.value)
    } else {
      recommendations.value = await getRecommendationsByBooks(readBooks.value)
    }
  } catch (error) {
    console.error('Error getting recommendations:', error)
    recommendations.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Top Navigation Bar -->
    <div class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
      <div class="p-4">
        <h2 class="text-xl font-bold text-gray-800">DBookMatch</h2>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 pt-16 pb-20 overflow-y-auto">
      <!-- Desktop User Type Selection -->
      <div class="mb-8 hidden md:block">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Are you a new or existing reader?</h2>
        <div class="flex space-x-4">
          <button 
            @click="switchToNewReader"
            :class="[
              'px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer',
              userType === 'new' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            ]"
          >
            New Reader
          </button>
          <button 
            @click="switchToExistingReader"
            :class="[
              'px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer',
              userType === 'existing' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            ]"
          >
            Existing Reader
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- New Reader Section -->
        <div v-if="userType === 'new'" class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Select your interests (up to 3)</h3>
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="interest in interests" 
                :key="interest"
                class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full flex items-center gap-2"
              >
                {{ interest }}
                <button @click="removeInterest(interest)" class="text-indigo-600 hover:text-indigo-800">
                  ×
                </button>
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button 
                v-for="interest in availableInterests" 
                :key="interest"
                @click="addInterest(interest)"
                :disabled="interests.includes(interest) || interests.length >= 3"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ interest }}
              </button>
            </div>
          </div>
        </div>

        <!-- Existing Reader Section -->
        <div v-else class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Add books you've read</h3>
            <div class="flex flex-col gap-4">
              <div class="flex gap-2">
                <input 
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search for a book..."
                  class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  @input="searchForBooks"
                />
              </div>

              <!-- Search Results -->
              <div v-if="isSearching" class="text-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p class="mt-2 text-gray-600">Searching books...</p>
              </div>

              <div v-else-if="searchResults.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
                <div 
                  v-for="book in searchResults" 
                  :key="book.id"
                  class="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors cursor-pointer"
                  @click="addBook(book)"
                >
                  <div class="flex gap-4">
                    <img 
                      v-if="book.thumbnail" 
                      :src="book.thumbnail" 
                      :alt="book.title"
                      class="w-16 h-24 object-cover rounded"
                    />
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-800">{{ book.title }}</h4>
                      <p class="text-sm text-gray-600">{{ book.authors.join(', ') }}</p>
                      <div class="mt-2 flex flex-wrap gap-2">
                        <span 
                          v-for="category in book.categories" 
                          :key="category"
                          class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {{ category }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Added Books -->
              <div v-if="readBooks.length > 0" class="mt-4">
                <h4 class="text-lg font-semibold text-gray-800 mb-2">Your Books</h4>
                <div class="space-y-2">
                  <div 
                    v-for="book in readBooks" 
                    :key="book.id"
                    class="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                  >
                    <div class="flex gap-4 items-center">
                      <img 
                        v-if="book.thumbnail" 
                        :src="book.thumbnail" 
                        :alt="book.title"
                        class="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <span class="text-gray-800 font-medium">{{ book.title }}</span>
                        <p class="text-sm text-gray-600">{{ book.authors.join(', ') }}</p>
                      </div>
                    </div>
                    <button 
                      @click="removeBook(book)"
                      class="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Get Recommendations Button -->
        <div class="mt-8">
          <button 
            @click="getRecommendations"
            :disabled="(userType === 'new' && interests.length === 0) || (userType === 'existing' && readBooks.length === 0)"
            class="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Book Recommendations
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="mt-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Finding the perfect books for you...</p>
        </div>

        <!-- Recommendations -->
        <div v-if="recommendations.length > 0" class="mt-8 space-y-4">
          <h3 class="text-xl font-semibold text-gray-800">Your Recommendations</h3>
          <div 
            v-for="book in recommendations" 
            :key="book.id"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div class="flex gap-6">
              <img 
                v-if="book.thumbnail" 
                :src="book.thumbnail" 
                :alt="book.title"
                class="w-24 h-36 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-gray-800">{{ book.title }}</h4>
                <p class="text-gray-600">{{ book.authors.join(', ') }}</p>
                <p class="mt-2 text-sm text-gray-500 line-clamp-3">{{ book.description }}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span 
                    v-for="category in book.categories" 
                    :key="category"
                    class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                  >
                    {{ category }}
                  </span>
                </div>
                <div v-if="book.averageRating" class="mt-2 flex items-center gap-1">
                  <span class="text-yellow-500">★</span>
                  <span class="text-sm text-gray-600">{{ book.averageRating.toFixed(1) }} ({{ book.ratingsCount }} ratings)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 md:hidden">
      <div class="flex justify-around items-center h-16">
        <button 
          @click="switchToNewReader"
          class="flex flex-col items-center justify-center w-full h-full"
          :class="userType === 'new' ? 'text-indigo-600' : 'text-gray-500'"
        >
          <svg 
            class="w-6 h-6 mb-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span class="text-xs">New Reader</span>
        </button>
        
        <div class="h-8 w-px bg-gray-200"></div>
        
        <button 
          @click="switchToExistingReader"
          class="flex flex-col items-center justify-center w-full h-full"
          :class="userType === 'existing' ? 'text-indigo-600' : 'text-gray-500'"
        >
          <svg 
            class="w-6 h-6 mb-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          <span class="text-xs">Existing Reader</span>
        </button>
      </div>
    </div>
  </div>
</template> 