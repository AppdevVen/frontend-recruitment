<template>
  <q-page class="q-pa-md">
    <!-- Page Loading -->
    <div v-if="pageLoading" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-20">
      <q-spinner-dots size="50px" color="primary" />
      <div class="tw-text-gray-500 tw-mt-4 tw-text-sm">Memuat data...</div>
    </div>

    <div v-else>
    <!-- Welcome Section -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12">
        <q-card class="tw-rounded-2xl tw-overflow-hidden tw-shadow-lg">
          <q-card-section class="tw-bg-gradient-to-r tw-from-blue-600 tw-to-blue-800 tw-py-8 tw-px-6">
            <div class="tw-flex tw-items-center tw-gap-4">
              <q-icon name="waving_hand" size="40px" class="tw-text-yellow-300" />
              <div>
                <div class="tw-text-white tw-text-2xl tw-font-bold">Selamat Datang, {{ userName }}!</div>
                <div class="tw-text-blue-100 tw-text-sm tw-mt-1">Recruitment Management System</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="tw-rounded-xl tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-cursor-pointer" @click="$router.push('/admin/candidates')">
          <q-card-section class="tw-flex tw-items-center tw-gap-4">
            <div class="tw-bg-blue-100 tw-rounded-full tw-p-3">
              <q-icon name="people" size="28px" color="blue-8" />
            </div>
            <div>
              <div class="tw-text-gray-500 tw-text-xs tw-uppercase tw-font-semibold">Total Kandidat</div>
              <div class="tw-text-2xl tw-font-bold tw-text-gray-800">{{ stats.totalCandidates }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="tw-rounded-xl tw-shadow-md hover:tw-shadow-lg tw-transition-shadow">
          <q-card-section class="tw-flex tw-items-center tw-gap-4">
            <div class="tw-bg-green-100 tw-rounded-full tw-p-3">
              <q-icon name="today" size="28px" color="green-8" />
            </div>
            <div>
              <div class="tw-text-gray-500 tw-text-xs tw-uppercase tw-font-semibold">Hari Ini</div>
              <div class="tw-text-2xl tw-font-bold tw-text-gray-800">{{ stats.todayCandidates }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="tw-rounded-xl tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-cursor-pointer" @click="$router.push('/admin/periods')">
          <q-card-section class="tw-flex tw-items-center tw-gap-4">
            <div class="tw-bg-orange-100 tw-rounded-full tw-p-3">
              <q-icon name="event" size="28px" color="orange-8" />
            </div>
            <div>
              <div class="tw-text-gray-500 tw-text-xs tw-uppercase tw-font-semibold">Status Periode</div>
              <div class="tw-text-lg tw-font-bold" :class="stats.periodOpen ? 'tw-text-green-600' : 'tw-text-red-600'">
                {{ stats.periodOpen ? 'Dibuka' : 'Ditutup' }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="tw-rounded-xl tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-cursor-pointer" @click="$router.push('/admin/priorities')">
          <q-card-section class="tw-flex tw-items-center tw-gap-4">
            <div class="tw-bg-purple-100 tw-rounded-full tw-p-3">
              <q-icon name="list_alt" size="28px" color="purple-8" />
            </div>
            <div>
              <div class="tw-text-gray-500 tw-text-xs tw-uppercase tw-font-semibold">Total Prioritas</div>
              <div class="tw-text-2xl tw-font-bold tw-text-gray-800">{{ stats.totalPriorities }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Candidates Filter & Table -->
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12">
        <q-card class="tw-rounded-2xl tw-shadow-lg tw-overflow-hidden">
          <!-- Filters -->
          <q-card-section class="tw-bg-gray-50">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-2">
                <q-input v-model="filters.ktp" label="No. KTP" outlined dense clearable @keyup.enter="loadCandidates" />
              </div>
              <div class="col-12 col-md-2">
                <q-select v-model="filters.gender" :options="genderOptions" label="Gender" outlined dense emit-value map-options />
              </div>
              <div class="col-12 col-md-2">
                <q-select v-model="filters.priority_1" :options="priorityFilterOptions" label="Priority 1" outlined dense emit-value map-options clearable />
              </div>
              <div class="col-12 col-md-2">
                <q-input v-model="filters.apply_start" label="Dari Tanggal" outlined dense type="date" />
              </div>
              <div class="col-12 col-md-2">
                <q-input v-model="filters.apply_end" label="Sampai Tanggal" outlined dense type="date" />
              </div>
              <div class="col-12 col-md-2 tw-flex tw-gap-2">
                <q-btn unelevated color="purple" icon="filter_alt" label="Filter" @click="loadCandidates" class="tw-flex-1" />
                <q-btn flat color="grey" icon="restart_alt" @click="resetFilters">
                  <q-tooltip>Reset Filter</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>

          <!-- Action bar -->
          <q-card-section class="tw-py-2">
            <div class="tw-flex tw-justify-between tw-items-center">
              <span class="tw-text-sm tw-text-gray-500">Total: {{ dataList.length }} kandidat</span>
              <div class="tw-flex tw-gap-2 tw-items-center">
                <q-badge v-if="pendingEmail > 0" color="orange" :label="`${pendingEmail} pending`" class="tw-mr-2" />
                <q-btn unelevated color="red-7" icon="send" label="Kirim Semua Email" @click="confirmSendAll" :disable="pendingEmail === 0" :loading="sendingAll" />
                <q-btn unelevated color="blue-7" icon="download" label="Export Excel" @click="exportExcel" :disable="dataList.length === 0" />
              </div>
            </div>
          </q-card-section>

          <!-- Table -->
          <q-card-section class="tw-bg-white tw-pt-0">
            <q-table
              :rows="dataList"
              :columns="columns"
              row-key="cv_id"
              v-model:pagination="pagination"
              :rows-per-page-options="[]"
              :loading="loadingTable"
              :filter="search"
              binary-state-sort
              flat
              class="tw-shadow-md tw-rounded-xl tw-overflow-hidden"
            >
              <template v-slot:top-left>
                <q-select borderless dense v-model="pagination.rowsPerPage" :options="[10, 25, 50, 100]">
                  <template v-slot:before>
                    <q-icon name="reorder"><q-tooltip>Rows per page</q-tooltip></q-icon>
                  </template>
                </q-select>
              </template>

              <template v-slot:top-right>
                <q-input outlined dense debounce="300" v-model="search" placeholder="Cari nama/email..." class="tw-min-w-[250px]">
                  <template v-slot:prepend><q-icon name="search" color="blue-6" /></template>
                </q-input>
              </template>

              <template v-slot:body-cell-no="props">
                <q-td :props="props" class="tw-text-center">{{ getRowNumber(props.rowIndex) }}</q-td>
              </template>

              <template v-slot:body-cell-cv_gender="props">
                <q-td :props="props">
                  <q-badge :color="props.row.cv_gender === 'M' ? 'blue' : 'pink'" :label="props.row.cv_gender === 'M' ? 'L' : 'P'" />
                </q-td>
              </template>

              <template v-slot:body-cell-file_cv="props">
                <q-td :props="props">
                  <q-btn v-if="props.row.file_cv" flat dense size="sm" icon="download" color="primary" @click="downloadCV(props.row.file_cv)" label="CV" />
                  <span v-else class="tw-text-gray-400 tw-text-xs">—</span>
                </q-td>
              </template>

              <template v-slot:body-cell-aksi="props">
                <q-td :props="props">
                  <q-btn round dense color="light-blue-9" size="sm" icon="visibility" @click="viewDetail(props.row)" class="tw-shadow-md tw-mr-1">
                    <q-tooltip>Detail</q-tooltip>
                  </q-btn>
                  <q-btn v-if="props.row.send === 0 || props.row.send === '0'" round dense color="orange-7" size="sm" icon="email" @click="sendEmailSingle(props.row)" :loading="props.row._sending" class="tw-shadow-md">
                    <q-tooltip>Kirim Email</q-tooltip>
                  </q-btn>
                </q-td>
              </template>

              <template v-slot:no-data>
                <div class="tw-text-center tw-py-8">
                  <q-icon name="search_off" size="3rem" color="grey-5" />
                  <div class="tw-text-gray-500 tw-mt-2">Tidak ada data kandidat</div>
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Detail Dialog -->
    <q-dialog v-model="showDetail" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card v-if="selectedCandidate">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">Detail Kandidat — {{ selectedCandidate.cv_name }}</div>
          <q-space />
          <q-btn flat round icon="close" color="white" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-lg" style="max-height: 80vh; overflow-y: auto;">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 tw-font-bold tw-mb-2">Data Personal</div>
              <q-list bordered separator class="tw-rounded-lg">
                <q-item><q-item-section><q-item-label caption>Kode CV</q-item-label><q-item-label>{{ selectedCandidate.cv_code }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>KTP</q-item-label><q-item-label>{{ selectedCandidate.id_num }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Nama</q-item-label><q-item-label>{{ selectedCandidate.cv_name }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Gender</q-item-label><q-item-label>{{ selectedCandidate.cv_gender === 'M' ? 'Laki-laki' : 'Perempuan' }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>TTL</q-item-label><q-item-label>{{ selectedCandidate.cv_place }}, {{ formatDate(selectedCandidate.cv_bod) }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Alamat</q-item-label><q-item-label>{{ selectedCandidate.cv_address }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Telepon</q-item-label><q-item-label>{{ selectedCandidate.cv_telp }} / {{ selectedCandidate.cv_phone }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Email</q-item-label><q-item-label>{{ selectedCandidate.cv_email }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Source</q-item-label><q-item-label>{{ selectedCandidate.source }}</q-item-label></q-item-section></q-item>
              </q-list>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 tw-font-bold tw-mb-2">Prioritas & Pendidikan</div>
              <q-list bordered separator class="tw-rounded-lg">
                <q-item><q-item-section><q-item-label caption>Priority 1</q-item-label><q-item-label>{{ selectedCandidate.priority_1 }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Priority 2</q-item-label><q-item-label>{{ selectedCandidate.priority_2 }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Priority 3</q-item-label><q-item-label>{{ selectedCandidate.priority_3 }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Pendidikan 1</q-item-label><q-item-label>{{ selectedCandidate.edu_school1 }} ({{ selectedCandidate.edu_degree1 }}) — {{ selectedCandidate.edu_jurusan1 }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Pengalaman Kerja</q-item-label><q-item-label>{{ selectedCandidate.exp_pt }} — {{ selectedCandidate.exp_posisi }}</q-item-label></q-item-section></q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import axios from 'axios';
import * as XLSX from 'xlsx';

const $q = useQuasar();
const userName = ref(window.localStorage.getItem('username') || 'User');

// Stats
const stats = reactive({
  totalCandidates: 0,
  todayCandidates: 0,
  periodOpen: false,
  totalPriorities: 0
});

const pageLoading = ref(true);

// Table
const dataList = ref([]);
const loadingTable = ref(false);
const search = ref('');
const showDetail = ref(false);
const selectedCandidate = ref(null);
const priorityFilterOptions = ref([]);
const pendingEmail = ref(0);
const sendingAll = ref(false);

const genderOptions = [
  { label: 'Semua', value: '' },
  { label: 'Laki-laki', value: 'M' },
  { label: 'Perempuan', value: 'F' }
];

const filters = reactive({
  ktp: '',
  gender: '',
  priority_1: '',
  apply_start: '',
  apply_end: ''
});

const pagination = ref({ sortBy: 'cv_date', descending: true, page: 1, rowsPerPage: 10 });

const columns = [
  { name: 'no', label: 'No', field: 'no', align: 'center', sortable: false, style: 'width:50px' },
  { name: 'cv_code', label: 'Kode', field: 'cv_code', align: 'left', sortable: true },
  { name: 'cv_name', label: 'Nama', field: 'cv_name', align: 'left', sortable: true },
  { name: 'cv_position', label: 'Posisi', field: 'cv_position', align: 'left', sortable: true },
  { name: 'priority_1', label: 'Priority 1', field: 'priority_1', align: 'left', sortable: true },
  { name: 'cv_date', label: 'Tgl Apply', field: 'cv_date', align: 'center', sortable: true, format: val => val ? val.split('T')[0] : '' },
  { name: 'cv_gender', label: 'Gender', field: 'cv_gender', align: 'center', sortable: true },
  { name: 'cv_age', label: 'Umur', field: 'cv_age', align: 'center', sortable: true },
  { name: 'cv_email', label: 'Email', field: 'cv_email', align: 'left', sortable: true },
  { name: 'source', label: 'Source', field: 'source', align: 'left', sortable: true },
  { name: 'file_cv', label: 'CV', field: 'file_cv', align: 'center', sortable: false },
  { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'center', sortable: false }
];

const getRowNumber = (rowIndex) => (pagination.value.page - 1) * pagination.value.rowsPerPage + rowIndex + 1;
const getHeaders = () => ({ Authorization: `Bearer ${window.localStorage.getItem('token')}` });

const formatDate = (val) => {
  if (!val) return '-';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

const loadCandidates = async () => {
  loadingTable.value = true;
  try {
    const params = {};
    if (filters.ktp) params.ktp = filters.ktp;
    if (filters.gender) params.gender = filters.gender;
    if (filters.priority_1) params.priority_1 = filters.priority_1;
    if (filters.apply_start) params.apply_start = filters.apply_start;
    if (filters.apply_end) params.apply_end = filters.apply_end;

    const res = await axios.get(`${import.meta.env.VITE_API}recruitment/candidates`, { params, headers: getHeaders() });
    dataList.value = res.data?.data || [];
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Gagal memuat data kandidat', position: 'bottom' });
  } finally {
    loadingTable.value = false;
  }
};

const loadPriorities = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}recruitment/priorities?active=1`, { headers: getHeaders() });
    const data = res.data?.data || [];
    priorityFilterOptions.value = [
      { label: 'Semua', value: '' },
      ...data.map(p => ({ label: p.alias_prioritas, value: p.alias_prioritas }))
    ];
  } catch { /* silent */ }
};

const resetFilters = () => {
  filters.ktp = '';
  filters.gender = '';
  filters.priority_1 = '';
  filters.apply_start = '';
  filters.apply_end = '';
  loadCandidates();
};

const viewDetail = (row) => {
  selectedCandidate.value = row;
  showDetail.value = true;
};

const sendEmailSingle = async (row) => {
  try {
    row._sending = true;
    await axios.post(`${import.meta.env.VITE_API}recruitment/notifications/send-single`, {
      cv_id: row.cv_id
    }, { headers: getHeaders() });
    row.send = 1;
    pendingEmail.value = Math.max(0, pendingEmail.value - 1);
    $q.notify({ type: 'positive', message: `Email berhasil dikirim ke ${row.cv_email}`, position: 'bottom' });
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Gagal mengirim email', position: 'bottom' });
  } finally {
    row._sending = false;
  }
};

const loadPendingCount = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}recruitment/notifications/pending`, { headers: getHeaders() });
    pendingEmail.value = res.data?.data?.pending || 0;
  } catch { /* silent */ }
};

const confirmSendAll = () => {
  $q.dialog({
    title: 'Kirim Semua Email',
    message: `Kirim email notifikasi ke ${pendingEmail.value} kandidat yang belum menerima email?`,
    cancel: { flat: true, label: 'Batal' },
    ok: { unelevated: true, color: 'orange-7', label: 'Kirim Semua' },
    persistent: true
  }).onOk(async () => {
    await sendAllEmails();
  });
};

const sendAllEmails = async () => {
  sendingAll.value = true;
  try {
    const res = await axios.post(`${import.meta.env.VITE_API}recruitment/notifications/send`, {}, { headers: getHeaders() });
    const data = res.data?.data || {};
    $q.notify({ type: 'positive', message: `${data.sent || 0} email berhasil dikirim, ${data.failed || 0} gagal`, position: 'bottom' });
    await loadCandidates();
    await loadPendingCount();
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Gagal mengirim email batch', position: 'bottom' });
  } finally {
    sendingAll.value = false;
  }
};

const downloadCV = (filename) => {
  if (!filename) return;
  window.open(`https://app-files.dbc.co.id/recruitment/uploadcv/${filename}`, '_blank');
};

const exportExcel = () => {
  try {
    const exportData = dataList.value.map((d, i) => ({
      'No': i + 1,
      'Kode CV': d.cv_code,
      'KTP': d.id_num,
      'Nama': d.cv_name,
      'Posisi': d.cv_position,
      'Priority 1': d.priority_1,
      'Priority 2': d.priority_2,
      'Priority 3': d.priority_3,
      'Tgl Apply': d.cv_date ? d.cv_date.split('T')[0] : '',
      'Gender': d.cv_gender === 'M' ? 'Laki-laki' : 'Perempuan',
      'Umur': d.cv_age,
      'Source': d.source,
      'Email': d.cv_email,
      'HP': d.cv_phone,
      'Alamat': d.cv_address,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Pelamar');
    XLSX.writeFile(wb, `data-pelamar-${date.formatDate(Date.now(), 'YYYY-MM-DD')}.xlsx`);
    $q.notify({ type: 'positive', message: 'Export berhasil', position: 'bottom' });
  } catch (err) {
    console.error('Export error:', err);
    $q.notify({ type: 'negative', message: 'Gagal export Excel', position: 'bottom' });
  }
};

const loadStats = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    stats.totalCandidates = dataList.value.length;
    stats.todayCandidates = dataList.value.filter(c => c.cv_date && c.cv_date.split('T')[0] === today).length;
  } catch { /* silent */ }

  try {
    const resPeriod = await axios.get(`${import.meta.env.VITE_API}recruitment/periods/status`);
    stats.periodOpen = resPeriod.data?.data?.is_open || false;
  } catch { /* silent */ }

  try {
    const resPriorities = await axios.get(`${import.meta.env.VITE_API}recruitment/priorities?active=1`, { headers: getHeaders() });
    stats.totalPriorities = (resPriorities.data?.data || []).length;
  } catch { /* silent */ }
};

onMounted(async () => {
  pageLoading.value = true;
  await loadCandidates();
  await loadPriorities();
  await loadPendingCount();
  await loadStats();
  pageLoading.value = false;
});
</script>
