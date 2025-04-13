<script setup>
import { ref, computed } from 'vue'
import { searchBooks } from '../utils/googleBooks'
import { getBookRecommendationsByInterests, getBookRecommendationsByBooks } from '../utils/gemini'

// Add debounce function
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const userType = ref('new') // 'new' or 'existing'
const interests = ref([])
const readBooks = ref([])
const bookTitle = ref('')
const recommendations = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const isGuideOpen = ref(false)
const addedBooks = ref([])

const availableInterests = [
  'newReader.interests.available.fiction',
  'newReader.interests.available.nonFiction',
  'newReader.interests.available.scienceFiction',
  'newReader.interests.available.fantasy',
  'newReader.interests.available.mystery',
  'newReader.interests.available.romance',
  'newReader.interests.available.biography',
  'newReader.interests.available.history',
  'newReader.interests.available.selfHelp',
  'newReader.interests.available.business',
  'newReader.interests.available.technology',
  'newReader.interests.available.science',
  'newReader.interests.available.philosophy',
  'newReader.interests.available.psychology',
  'newReader.interests.available.art'
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
  addedBooks.value = []
}

const switchToNewReader = () => {
  clearAllData()
  userType.value = 'new'
}

const switchToExistingReader = () => {
  clearAllData()
  userType.value = 'existing'
}

const addInterest = async (interest) => {
  if (interests.value.length < 3 && !interests.value.includes(interest)) {
    interests.value.push(interest)
    // Automatically get recommendations when an interest is selected
    await getRecommendations()
  }
}

const removeInterest = async (interest) => {
  interests.value = interests.value.filter(i => i !== interest)
  if (interests.value.length > 0) {
    await getRecommendations()
  } else {
    recommendations.value = []
  }
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

// Create debounced version of searchForBooks
const debouncedSearch = debounce(searchForBooks, 500)

const getRecommendations = async () => {
  if (userType.value === 'new') {
    if (interests.value.length === 0) {
      recommendations.value = []
      return
    }
    
    isLoading.value = true
    try {
      recommendations.value = await getBookRecommendationsByInterests(interests.value)
    } catch (error) {
      console.error('Error getting recommendations:', error)
      recommendations.value = []
    } finally {
      isLoading.value = false
    }
  } else {
    if (readBooks.value.length === 0) return;
    
    isLoading.value = true;
    try {
      recommendations.value = await getBookRecommendationsByBooks(readBooks.value);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      recommendations.value = [];
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Main Content Area -->
    <div class="flex-1 pt-16 pb-20 overflow-y-auto">
      <!-- Desktop User Type Selection -->
      <div class="hidden md:block p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('userType.title') }}</h2>
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
            {{ $t('userType.newReader') }}
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
            {{ $t('userType.existingReader') }}
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
        <!-- Guide Section -->
        <div class="mb-6">
          <button 
            @click="isGuideOpen = !isGuideOpen"
            class="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-all duration-300 ease-in-out cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <svg 
                class="w-5 h-5 text-indigo-600 transition-transform duration-300" 
                :class="{ 'rotate-45': isGuideOpen }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="font-medium text-gray-800">{{ $t('guide.title') }}</span>
            </div>
            <svg 
              class="w-5 h-5 text-gray-500 transform transition-transform duration-300 ease-in-out" 
              :class="{ 'rotate-180': isGuideOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform -translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform -translate-y-2"
          >
            <div 
              v-if="isGuideOpen"
              class="mt-2 p-4 bg-white rounded-lg border border-gray-200 space-y-3"
            >
              <div class="space-y-2">
                <h4 class="font-medium text-gray-800">{{ $t('guide.newReader.title') }}</h4>
                <p class="text-sm text-gray-600">
                  {{ $t('guide.newReader.description') }}
                </p>
              </div>
              
              <div class="space-y-2">
                <h4 class="font-medium text-gray-800">{{ $t('guide.existingReader.title') }}</h4>
                <p class="text-sm text-gray-600">
                  {{ $t('guide.existingReader.description') }}
                </p>
              </div>
              
              <div class="space-y-2">
                <h4 class="font-medium text-gray-800">{{ $t('guide.goal.title') }}</h4>
                <p class="text-sm text-gray-600">
                  {{ $t('guide.goal.description') }}
                </p>
              </div>
            </div>
          </transition>
        </div>

        <!-- New Reader Section -->
        <div v-if="userType === 'new'" class="space-y-6">
          <div v-if="interests.length < 3">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              {{ $t('newReader.interests.title', { count: interests.length }) }}
            </h3>
            <div class="flex flex-wrap gap-2 mb-4">
              <TransitionGroup
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 transform scale-95"
                enter-to-class="opacity-100 transform scale-100"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 transform scale-100"
                leave-to-class="opacity-0 transform scale-95"
              >
                <div key="interests-container" class="flex flex-wrap gap-2">
                  <span 
                    v-for="interest in interests" 
                    :key="interest"
                    class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    {{ interest }}
                    <button @click="removeInterest(interest)" class="text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors duration-200">
                      ×
                    </button>
                  </span>
                </div>
              </TransitionGroup>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              <button 
                v-for="interestKey in availableInterests" 
                :key="interestKey"
                @click="addInterest($t(interestKey))"
                :disabled="interests.includes($t(interestKey)) || interests.length >= 3"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
              >
                {{ $t(interestKey) }}
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <transition
            enter-active-class="transition-opacity duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div v-if="isLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p class="mt-4 text-gray-600">{{ $t('loading.findingBooks') }}</p>
            </div>
          </transition>

          <!-- Recommendations -->
          <TransitionGroup
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-y-4"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform translate-y-4"
          >
            <div key="new-recommendations-container" class="space-y-6">
              <div 
                v-for="book in recommendations" 
                :key="book.id"
                class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
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
                    <p v-if="book.description" class="mt-2 text-sm text-gray-500 line-clamp-3">{{ book.description }}</p>
                    <div v-if="book.categories" class="mt-4 flex flex-wrap gap-2">
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
                      <span class="text-sm text-gray-600">{{ book.averageRating.toFixed(1) }} ({{ book.ratingsCount }} {{ $t('book.ratings') }})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- No Recommendations -->
          <transition
            enter-active-class="transition-opacity duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div v-if="!isLoading && recommendations.length === 0 && interests.length > 0" class="text-center py-8">
              <p class="text-gray-600">{{ $t('newReader.interests.noRecommendations') }}</p>
            </div>
          </transition>
        </div>

        <!-- Existing Reader Section -->
        <div v-else class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('existingReader.title') }}</h3>
            <div class="flex flex-col gap-4">
              <div class="flex gap-2">
                <input 
                  v-model="searchQuery"
                  type="text"
                  :placeholder="$t('existingReader.search.placeholder')"
                  class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  @input="debouncedSearch"
                />
              </div>

              <!-- Search Results -->
              <div v-if="isSearching" class="text-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p class="mt-2 text-gray-600">{{ $t('existingReader.search.loading') }}</p>
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
                <div class="flex justify-between items-center mb-2">
                  <h4 class="text-lg font-semibold text-gray-800">{{ $t('existingReader.books.title') }}</h4>
                  <button 
                    @click="getRecommendations"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
                    :disabled="isLoading"
                  >
                    {{ $t('existingReader.books.getRecommendations') }}
                  </button>
                </div>
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
                      class="text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-200"
                    >
                      {{ $t('book.remove') }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Loading State -->
              <transition
                enter-active-class="transition-opacity duration-300 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-300 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div v-if="isLoading" class="text-center py-8">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p class="mt-4 text-gray-600">{{ $t('loading.findingBooks') }}</p>
                </div>
              </transition>

              <!-- Recommendations -->
              <TransitionGroup 
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 transform translate-y-4"
                enter-to-class="opacity-100 transform translate-y-0"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 transform translate-y-0"
                leave-to-class="opacity-0 transform -translate-y-4"
              >
                <div key="existing-recommendations-container" class="space-y-6">
                  <div v-if="!isLoading && recommendations.length === 0 && readBooks.length > 0" class="text-center py-8">
                    <p class="text-gray-600">{{ $t('existingReader.books.noRecommendations') }}</p>
                  </div>

                  <div 
                    v-for="book in recommendations" 
                    :key="book.id"
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
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
                        <p v-if="book.description" class="mt-2 text-sm text-gray-500 line-clamp-3">{{ book.description }}</p>
                        <div v-if="book.categories" class="mt-4 flex flex-wrap gap-2">
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
                          <span class="text-sm text-gray-600">{{ book.averageRating.toFixed(1) }} ({{ book.ratingsCount }} {{ $t('book.ratings') }})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 md:hidden transition-transform duration-300 ease-in-out">
      <div class="flex justify-around items-center h-16">
        <button 
          @click="switchToNewReader"
          class="flex flex-col items-center justify-center w-full h-full cursor-pointer"
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
          <span class="text-xs">{{ $t('userType.newReader') }}</span>
        </button>
        
        <div class="h-8 w-px bg-gray-200"></div>
        
        <button 
          @click="switchToExistingReader"
          class="flex flex-col items-center justify-center w-full h-full cursor-pointer"
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
          <span class="text-xs">{{ $t('userType.existingReader') }}</span>
        </button>
      </div>
    </div>
  </div>
</template> 