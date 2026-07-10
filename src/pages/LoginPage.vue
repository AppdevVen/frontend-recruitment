<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="fit row wrap justify-center items-center content-center" style="background: linear-gradient(135deg, #1a56db 0%, #0d47a1 100%); min-height: 100vh;">
        <div style="background: white; border-radius: 16px; padding: 48px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <!-- Logo -->
          <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 32px;">
            <img src="/images/dbc-blue.png" style="max-width: 120px; margin-bottom: 16px;" alt="DBC Logo" />
            <h1 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0;">Recruitment Management</h1>
            <p style="font-size: 14px; color: #6b7280; margin-top: 4px;"></p>
          </div>

          <!-- Login Form -->
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.username"
              label="Username"
              outlined
              :rules="[val => !!val || 'Username wajib diisi']"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <q-input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              outlined
              :rules="[val => !!val || 'Password wajib diisi']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-btn
              unelevated
              color="primary"
              label="Login"
              type="submit"
              class="full-width"
              style="height: 48px; font-size: 16px; border-radius: 8px;"
              :loading="loading"
            />
          </q-form>

          <!-- Error message -->
          <q-banner v-if="errorMessage" class="bg-red-1 text-red-8 q-mt-md" rounded>
            <template v-slot:avatar>
              <q-icon name="error" color="red" />
            </template>
            {{ errorMessage }}
          </q-banner>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';

const $q = useQuasar();
const router = useRouter();

const form = reactive({
  username: '',
  password: ''
});

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const onSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const res = await axios.post(`${import.meta.env.VITE_API}recruitment/login`, {
      username: form.username,
      password: form.password
    });

    const data = res.data.data;

    // Store auth data
    window.localStorage.setItem('token', data.token);
    window.localStorage.setItem('username', data.username);
    window.localStorage.setItem('name', data.name);
    window.localStorage.setItem('level', data.level);
    window.localStorage.setItem('user_id', data.id);

    // Set default auth header
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;

    $q.notify({
      type: 'positive',
      message: 'Login berhasil',
      position: 'bottom'
    });

    router.push('/dashboard');
  } catch (error) {
    if (error.response?.status === 401) {
      errorMessage.value = 'Username atau password salah';
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Terjadi kesalahan pada server. Silakan coba lagi.';
    }
  } finally {
    loading.value = false;
  }
};

// Clear any previous session on mount
window.localStorage.clear();
</script>
