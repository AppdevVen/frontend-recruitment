<template>
  <q-drawer v-model="isOpen" side="right" :width="380" overlay behavior="mobile" class="tw-bg-white">
    <div class="tw-h-full tw-flex tw-flex-col">
      <!-- Header with gradient -->
      <div class="tw-p-6 tw-text-white tw-relative tw-overflow-hidden" :style="headerStyle">
        <div class="tw-absolute tw-top-2 tw-right-2 tw-z-10">
          <q-btn flat round dense icon="close" @click="isOpen = false" class="tw-text-white tw-bg-black/30 tw-backdrop-blur-sm hover:tw-bg-black/50" />
        </div>
        <div class="tw-mb-4 tw-mt-6 tw-relative tw-z-10">
          <h3 class="tw-text-xl tw-font-bold tw-drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">Profile</h3>
        </div>
        <div class="tw-text-center tw-relative tw-z-10">
          <q-avatar size="90px" class="tw-mb-4 tw-border-4 tw-border-white tw-shadow-2xl tw-bg-white/20 tw-backdrop-blur-sm">
            <div class="tw-text-3xl tw-font-bold tw-text-white">{{ userInitial }}</div>
          </q-avatar>
          <div class="tw-text-2xl tw-font-bold tw-drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">{{ username }}</div>
          <div class="tw-mt-1 tw-opacity-90 tw-drop-shadow-[1px_1px_3px_rgba(0,0,0,0.6)]">
            <q-badge color="white" text-color="primary" :label="userLevel" class="tw-px-3 tw-py-1 tw-text-xs tw-font-semibold" />
          </div>
        </div>
      </div>

      <!-- Account Info -->
      <div class="tw-flex-1 tw-overflow-auto tw-p-6 tw-bg-white">
        <div class="tw-space-y-4">
          <div class="tw-text-sm tw-text-gray-500 tw-uppercase tw-font-semibold tw-mb-4">Account Information</div>
          
          <div class="tw-flex tw-items-center tw-p-3 tw-bg-gray-50 tw-rounded-lg">
            <q-icon name="person" class="tw-mr-3 tw-text-blue-600" size="sm" />
            <div>
              <div class="tw-text-xs tw-text-gray-500">Nama</div>
              <div class="tw-font-semibold">{{ username }}</div>
            </div>
          </div>

          <div class="tw-flex tw-items-center tw-p-3 tw-bg-gray-50 tw-rounded-lg">
            <q-icon name="admin_panel_settings" class="tw-mr-3 tw-text-blue-600" size="sm" />
            <div>
              <div class="tw-text-xs tw-text-gray-500">Level</div>
              <div class="tw-font-semibold">{{ userLevel }}</div>
            </div>
          </div>

          <div class="tw-flex tw-items-center tw-p-3 tw-bg-gray-50 tw-rounded-lg">
            <q-icon name="account_circle" class="tw-mr-3 tw-text-blue-600" size="sm" />
            <div>
              <div class="tw-text-xs tw-text-gray-500">Username</div>
              <div class="tw-font-semibold">{{ username }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="tw-p-6 tw-border-t tw-bg-white">
        <q-btn 
          unelevated 
          label="Logout" 
          icon="logout" 
          color="blue-6" 
          @click="handleLogout" 
          class="tw-w-full tw-font-semibold tw-rounded-lg" 
        />
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';

const $q = useQuasar();
const router = useRouter();

const props = defineProps({
  modelValue: Boolean,
  domain: String,
  userName: String,
  userLevel: String,
  userInitial: String
});

const emit = defineEmits(['update:modelValue']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const username = computed(() => window.localStorage.getItem('username') || '');

const headerStyle = computed(() => {
  const domainColors = {
    '100': 'linear-gradient(135deg, #003399 0%, #00b2e3 100%)',
    '110': 'linear-gradient(135deg, #003399 0%, #00b2e3 100%)',
    '200': 'linear-gradient(135deg, #003b7b 0%, #231f20 100%)',
    '210': 'linear-gradient(135deg, #003b7b 0%, #231f20 100%)',
    '800': 'linear-gradient(135deg, #ee4034 0%, #BABCBE 100%)',
    '130': 'linear-gradient(135deg, #ee4034 0%, #BABCBE 100%)',
    '700': 'linear-gradient(135deg, #ee4034 0%, #BABCBE 100%)',
    '120': 'linear-gradient(135deg, #ef4123 0%, #4d5e6c 100%)',
    '300': 'linear-gradient(135deg, #A8479A 0%, #5BAF42 100%)',
    '320': 'linear-gradient(135deg, #A8479A 0%, #5BAF42 100%)'
  };
  
  return {
    background: domainColors[props.domain] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
});

const handleLogout = async () => {
  try {
    $q.loading.show({ message: 'Logging out...' });
    await axios.post(`${import.meta.env.VITE_API}recruitment/logout`, {
      username: window.localStorage.getItem('username'),
      type: 'user'
    });
  } catch (e) {
    // silent
  } finally {
    $q.loading.hide();
    window.localStorage.clear();
    window.sessionStorage.clear();
    const environment = import.meta.env.VITE_ENV;
    if (environment === 'LOCAL') {
      router.push('/login');
    } else {
      window.location.replace(import.meta.env.VITE_APPDBC || '/login');
    }
  }
};
</script>
