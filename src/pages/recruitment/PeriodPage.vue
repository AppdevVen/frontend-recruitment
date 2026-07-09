<template>
  <div class="q-pa-md">
    <q-card class="tw-shadow-2xl tw-rounded-2xl tw-overflow-hidden">
      <!-- Header -->
      <q-card-section class="bg-primary tw-py-6">
        <div class="tw-flex tw-items-center tw-gap-3">
          <q-icon name="event" size="28px" class="tw-text-white" />
          <div>
            <div class="text-h6 tw-text-white tw-font-bold">Master Periode Pendaftaran</div>
            <div class="tw-flex tw-items-center tw-gap-2 tw-text-blue-100 tw-text-xs">
              <router-link to="/dashboard" class="tw-text-blue-100 hover:tw-text-white tw-transition-colors">
                <q-icon name="home" size="14px" class="tw-cursor-pointer" />
              </router-link>
              <q-icon name="chevron_right" size="14px" />
              <span>Recruitment</span>
              <q-icon name="chevron_right" size="14px" />
              <span>Periode</span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />

      <!-- Content -->
      <q-card-section class="tw-bg-white">
        <!-- Status Banner -->
        <q-banner :class="isOpen ? 'bg-green-1 text-green-8' : 'bg-orange-1 text-orange-8'" rounded class="q-mb-lg">
          <template v-slot:avatar>
            <q-icon :name="isOpen ? 'check_circle' : 'info'" :color="isOpen ? 'green' : 'orange'" />
          </template>
          <strong>{{ isOpen ? 'Pendaftaran sedang DIBUKA' : 'Pendaftaran sedang DITUTUP' }}</strong>
        </q-banner>

        <!-- Loading -->
        <div v-if="loading" class="tw-flex tw-justify-center tw-py-8">
          <q-spinner-dots size="40px" color="primary" />
        </div>

        <!-- Form -->
        <q-form v-else @submit="onSave" class="q-gutter-md" style="max-width: 600px;">
          <q-input
            v-model="form.periode_date_start"
            label="Periode Mulai"
            outlined
            type="date"
            :rules="[val => !!val || 'Periode mulai wajib diisi']"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>

          <q-input
            v-model="form.periode_date_end"
            label="Periode Akhir"
            outlined
            type="date"
            :rules="[val => !!val || 'Periode akhir wajib diisi']"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>

          <q-input
            v-model="form.periode_time_end"
            label="Jam Akhir"
            outlined
            type="time"
            :rules="[val => !!val || 'Jam akhir wajib diisi']"
          >
            <template v-slot:prepend>
              <q-icon name="schedule" />
            </template>
          </q-input>

          <q-select
            v-model="form.periode_status"
            :options="statusOptions"
            label="Status"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'Status wajib dipilih']"
          >
            <template v-slot:prepend>
              <q-icon name="toggle_on" />
            </template>
          </q-select>

          <div class="tw-flex tw-gap-3 tw-mt-4">
            <q-btn
              unelevated
              color="primary"
              label="Simpan"
              icon="save"
              type="submit"
              :loading="saving"
              class="tw-px-6"
            />
            <q-btn
              flat
              color="grey"
              label="Kembali"
              icon="arrow_back"
              @click="$router.push('/admin/priorities')"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';

const $q = useQuasar();

const loading = ref(false);
const saving = ref(false);

const form = reactive({
  periode_date_start: '',
  periode_date_end: '',
  periode_time_end: '',
  periode_status: 'Active'
});

const statusOptions = [
  { label: 'Aktif', value: 'Active' },
  { label: 'Tidak Aktif', value: 'Inactive' }
];

const isOpen = computed(() => {
  if (!form.periode_date_start || !form.periode_date_end || !form.periode_time_end) return false;
  const now = new Date();
  const start = new Date(form.periode_date_start);
  const end = new Date(`${form.periode_date_end}T${form.periode_time_end}`);
  return now >= start && now <= end && form.periode_status === 'Active';
});

const formatDateForInput = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

const formatTimeForInput = (timeVal) => {
  if (!timeVal) return '';
  // If already in HH:mm format
  if (/^\d{2}:\d{2}$/.test(timeVal)) return timeVal;
  // If in HH:mm:ss format
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeVal)) return timeVal.substring(0, 5);
  // If it's a date string containing time — use UTC to avoid timezone offset
  const d = new Date(timeVal);
  if (!isNaN(d.getTime())) {
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  return timeVal;
};

const loadData = async () => {
  loading.value = true;
  try {
    const token = window.localStorage.getItem('token');
    const res = await axios.get(`${import.meta.env.VITE_API}recruitment/periods`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = res.data.data;
    form.periode_date_start = formatDateForInput(data.periode_date_start);
    form.periode_date_end = formatDateForInput(data.periode_date_end);
    form.periode_time_end = formatTimeForInput(data.periode_time_end);
    form.periode_status = data.periode_status || 'Inactive';
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Gagal memuat data periode', position: 'bottom' });
  } finally {
    loading.value = false;
  }
};

const onSave = async () => {
  // Validate date range
  if (new Date(form.periode_date_end) < new Date(form.periode_date_start)) {
    $q.notify({ type: 'warning', message: 'Periode akhir tidak boleh sebelum periode mulai', position: 'bottom' });
    return;
  }

  saving.value = true;
  try {
    const token = window.localStorage.getItem('token');
    await axios.put(`${import.meta.env.VITE_API}recruitment/periods`, {
      periode_date_start: form.periode_date_start,
      periode_date_end: form.periode_date_end,
      periode_time_end: form.periode_time_end,
      periode_status: form.periode_status
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    $q.notify({ type: 'positive', message: 'Periode berhasil diperbarui', position: 'bottom' });
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Gagal menyimpan data periode', position: 'bottom' });
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
