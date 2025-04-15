<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">
          {{ $t('signup.welcome') }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ $t('signup.subtitle') }}
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleSignup">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">{{ $t('signup.email.label') }}</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :placeholder="$t('signup.email.placeholder')"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">{{ $t('signup.password.label') }}</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :placeholder="$t('signup.password.placeholder')"
              />
            </div>
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ $t('signup.createAccount') }}
          </button>
        </div>
      </form>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">{{ $t('signup.orContinue') }}</span>
          </div>
        </div>

        <div class="mt-6">
          <button
            type="button"
            @click.stop.prevent="handleGoogleSignup"
            class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <img
              class="h-5 w-5 mr-2"
              src="https://www.google.com/favicon.ico"
              alt="Google"
            />
            {{ $t('signup.googleSignUp') }}
          </button>
        </div>
      </div>

      <div class="mt-6 text-sm text-center">
        <router-link
          to="/login"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {{ $t('signup.haveAccount') }} {{ $t('signup.signIn') }}
        </router-link>
      </div>

      <div class="mt-2 text-sm text-center">
        <router-link
          to="/"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {{ $t('signup.continueWithout') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signUp, signInWithGoogle } from '../../firebase/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');

const handleSignup = async () => {
  try {
    await signUp(email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.message;
  }
};

const handleGoogleSignup = async () => {
  try {
    await signInWithGoogle();
    router.replace('/');
  } catch (err) {
    console.error('Google signup error:', err);
    error.value = err.message || 'Failed to sign up with Google. Please try again.';
  }
};
</script> 