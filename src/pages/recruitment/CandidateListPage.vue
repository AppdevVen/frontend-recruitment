<template>
  <div class="q-pa-md">
    <q-card class="tw-shadow-2xl tw-rounded-2xl tw-overflow-hidden">
      <!-- Header -->
      <q-card-section class="bg-primary tw-py-6">
        <div class="tw-flex tw-items-center tw-gap-3">
          <q-icon name="people" size="28px" class="tw-text-white" />
          <div>
            <div class="text-h6 tw-text-white tw-font-bold">Data Pelamar</div>
            <div class="tw-flex tw-items-center tw-gap-2 tw-text-blue-100 tw-text-xs">
              <router-link to="/dashboard" class="tw-text-blue-100 hover:tw-text-white tw-transition-colors">
                <q-icon name="home" size="14px" class="tw-cursor-pointer" />
              </router-link>
              <q-icon name="chevron_right" size="14px" />
              <span>Recruitment</span>
              <q-icon name="chevron_right" size="14px" />
              <span>Kandidat</span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />

      <!-- Filters -->
      <q-card-section class="tw-bg-gray-50">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-2">
            <q-input v-model="filters.ktp" label="No. KTP" outlined dense clearable />
          </div>
          <div class="col-12 col-md-2">
            <q-select v-model="filters.gender" :options="[{label:'Semua',value:''},{label:'Laki-laki',value:'M'},{label:'Perempuan',value:'F'}]" label="Gender" outlined dense emit-value map-options />
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
            <q-btn unelevated color="warning" icon="filter_alt" label="Filter" @click="loadData" class="tw-flex-1" />
            <q-btn flat color="grey" icon="restart_alt" @click="resetFilters" />
          </div>
        </div>
      </q-card-section>

      <!-- Action bar -->
      <q-card-section class="tw-py-2">
        <div class="tw-flex tw-justify-between tw-items-center">
          <span class="tw-text-sm tw-text-gray-500">Total: {{ dataList.length }} kandidat</span>
          <q-btn unelevated color="green-7" icon="download" label="Export Excel" @click="exportExcel" :disable="dataList.length === 0" />
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
          :loading="loading"
          :filter="search"
          binary-state-sort
          flat
          class="tw-shadow-md tw-rounded-xl tw-overflow-hidden"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props" class="bg-primary tw-text-white tw-font-bold tw-text-xs tw-uppercase tw-tracking-wide tw-py-3">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:top-left>
            <q-select borderless dense v-model="pagination.rowsPerPage" :options="[10, 25, 50, 100]">
              <template v-slot:before><q-icon name="reorder"><q-tooltip>Rows per page</q-tooltip></q-icon></template>
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
            <q-td :props="props"><q-badge :color="props.row.cv_gender === 'M' ? 'blue' : 'pink'" :label="props.row.cv_gender === 'M' ? 'L' : 'P'" /></q-td>
          </template>

          <template v-slot:body-cell-file_cv="props">
            <q-td :props="props">
              <q-btn v-if="props.row.file_cv" flat dense size="sm" icon="download" color="primary" @click="downloadCV(props.row.file_cv)" label="CV" />
              <span v-else class="tw-text-gray-400 tw-text-xs">—</span>
            </q-td>
          </template>

          <template v-slot:body-cell-aksi="props">
            <q-td :props="props">
              <q-btn round dense color="light-blue-9" size="sm" icon="visibility" @click="viewDetail(props.row)" class="tw-shadow-md">
                <q-tooltip>Detail</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

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
                <q-item><q-item-section><q-item-label caption>TTL</q-item-label><q-item-label>{{ selectedCandidate.cv_place }}, {{ selectedCandidate.cv_bod }}</q-item-label></q-item-section></q-item>
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { date } from 'quasar';

const $q = useQuasar();

const dataList = ref([]);
const loading = ref(false);
const search = ref('');
const showDetail = ref(false);
const selectedCandidate = ref(null);
const priorityFilterOptions = ref([]);

const filters = reactive({
  ktp: '', gender: '', priority_1: '', apply_start: '', apply_end: ''
});

const pagination = ref({ sortBy: 'cv_date', descending: true, page: 1, rowsPerPage: 25 });

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

const loadData = async () => {
  loading.value = true;
  try {
    const params = {};
    if (filters.ktp) params.ktp = filters.ktp;
    if (filters.gender) params.gender = filters.gender;
    if (filters.priority_1) params.priority_1 = filters.priority_1;
    if (filters.apply_start) params.apply_start = filters.apply_start;
    if (filters.apply_end) params.apply_end = filters.apply_end;

    const res = await axios.get(`${import.meta.env.VITE_API}recruitment/candidates`, { params, headers: getHeaders() });
    dataList.value = res.data.data;
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Gagal memuat data', position: 'bottom' });
  } finally {
    loading.value = false;
  }
};

const loadPriorities = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}recruitment/priorities?active=1`, { headers: getHeaders() });
    priorityFilterOptions.value = [{ label: 'Semua', value: '' }, ...res.data.data.map(p => ({ label: p.alias_prioritas, value: p.alias_prioritas }))];
  } catch { /* silent */ }
};

const resetFilters = () => {
  filters.ktp = ''; filters.gender = ''; filters.priority_1 = ''; filters.apply_start = ''; filters.apply_end = '';
  loadData();
};

const viewDetail = (row) => { selectedCandidate.value = row; showDetail.value = true; };

const downloadCV = (filename) => {
  if (!filename) return;
  const ftpUrl = `https://app-files.dbc.co.id/recruitment/uploadcv/${filename}`;
  window.open(ftpUrl, '_blank');
};

const exportExcel = () => {
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
    'Universitas 1': d.edu_school1,
    'Gelar 1': d.edu_degree1,
    'Jurusan 1': d.edu_jurusan1,
    'IPK 1': d.edu_gpa1,
    'Perusahaan': d.exp_pt,
    'Posisi Terakhir': d.exp_posisi
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data Pelamar');
  XLSX.writeFile(wb, `data-pelamar-${date.formatDate(Date.now(), 'YYYY-MM-DD')}.xlsx`);
  $q.notify({ type: 'positive', message: 'Export berhasil', position: 'bottom' });
};

onMounted(() => { 
  // loadData(); 
  loadPriorities();
});
</script>
