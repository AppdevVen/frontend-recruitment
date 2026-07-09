<template>
  <div class="q-pa-md">
    <q-card class="tw-shadow-2xl tw-rounded-2xl tw-overflow-hidden">
      <!-- Header -->
      <q-card-section class="bg-primary tw-py-6">
        <div class="tw-flex tw-items-center tw-gap-3">
          <q-icon name="list_alt" size="28px" class="tw-text-white" />
          <div>
            <div class="text-h6 tw-text-white tw-font-bold">Master Prioritas</div>
            <div class="tw-flex tw-items-center tw-gap-2 tw-text-blue-100 tw-text-xs">
              <router-link to="/dashboard" class="tw-text-blue-100 hover:tw-text-white tw-transition-colors">
                <q-icon name="home" size="14px" class="tw-cursor-pointer" />
              </router-link>
              <q-icon name="chevron_right" size="14px" />
              <span>Recruitment</span>
              <q-icon name="chevron_right" size="14px" />
              <span>Prioritas</span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />

      <!-- Content -->
      <q-card-section class="tw-bg-white">
        <q-table
          :rows="dataList"
          :columns="columns"
          row-key="id_prioritas"
          v-model:pagination="pagination"
          :rows-per-page-options="[]"
          :loading="loading"
          :filter="filter"
          binary-state-sort
          flat
          class="tw-shadow-md tw-rounded-xl tw-overflow-hidden"
        >
          <!-- Header styling -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="bg-primary tw-text-white tw-font-bold tw-text-sm tw-uppercase tw-tracking-wide tw-py-4"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <!-- Top left: rows per page -->
          <template v-slot:top-left>
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-select
                  borderless
                  dense
                  debounce="300"
                  v-model="pagination.rowsPerPage"
                  :options="[5, 10, 25, 50]"
                >
                  <template v-slot:before>
                    <q-icon name="reorder">
                      <q-tooltip class="tw-bg-black/90">Rows per page</q-tooltip>
                    </q-icon>
                  </template>
                </q-select>
              </div>
            </div>
          </template>

          <!-- Top right: Add button + Search -->
          <template v-slot:top-right>
            <div class="tw-flex tw-gap-3 tw-items-center">
              <q-btn
                unelevated
                color="blue-6"
                label="Tambah Data"
                icon="add"
                @click="openAdd"
                class="tw-font-semibold tw-px-4 tw-rounded-lg hover:tw-brightness-110 tw-transition-all"
              />
              <q-input
                outlined
                dense
                debounce="300"
                v-model="filter"
                placeholder="Cari prioritas..."
                class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-min-w-[300px]"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="blue-6" />
                </template>
              </q-input>
            </div>
          </template>

          <!-- No column -->
          <template v-slot:body-cell-no="props">
            <q-td :props="props" class="tw-py-4 tw-text-slate-700 tw-text-center tw-font-medium">
              {{ getRowNumber(props.rowIndex) }}
            </q-td>
          </template>

          <!-- Status column -->
          <template v-slot:body-cell-is_active="props">
            <q-td :props="props" class="tw-py-4">
              <q-badge :color="props.row.is_active == 1 ? 'green' : 'grey'" :label="props.row.is_active == 1 ? 'Aktif' : 'Tidak Aktif'" />
            </q-td>
          </template>

          <!-- Action buttons -->
          <template v-slot:body-cell-aksi="props">
            <q-td :props="props" class="tw-py-4">
              <q-btn
                round dense color="light-blue-9" size="sm" icon="edit"
                @click="openEdit(props.row)"
                class="tw-mr-1 tw-shadow-md hover:tw-shadow-lg hover:tw-scale-110 tw-transition-all"
              >
                <q-tooltip class="tw-bg-slate-800 tw-text-xs">Edit</q-tooltip>
              </q-btn>
              <q-btn
                round dense color="negative" size="sm" icon="delete"
                @click="confirmDelete(props.row)"
                class="tw-shadow-md hover:tw-shadow-lg hover:tw-scale-110 tw-transition-all"
              >
                <q-tooltip class="tw-bg-slate-800 tw-text-xs">Hapus</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent transition-show="slide-up" transition-hide="slide-down">
      <q-card style="min-width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ isEdit ? 'Edit Prioritas' : 'Tambah Prioritas' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-form @submit="onSave" class="q-gutter-md">
            <q-input
              v-model="formData.alias_prioritas"
              label="Nama Prioritas"
              outlined
              :rules="[val => !!val || 'Nama prioritas wajib diisi']"
            />
            <q-select
              v-model="formData.is_active"
              :options="statusOptions"
              label="Status"
              outlined
              emit-value
              map-options
            />
            <div class="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
              <q-btn flat label="Batal" color="grey" v-close-popup />
              <q-btn unelevated label="Simpan" color="primary" type="submit" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="negative" size="2em" class="q-mr-sm" />
          <span class="text-subtitle1">Konfirmasi Hapus</span>
        </q-card-section>
        <q-card-section>
          Apakah Anda yakin ingin menghapus prioritas <strong>"{{ deleteTarget?.alias_prioritas }}"</strong>?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Batal" color="grey" v-close-popup />
          <q-btn unelevated label="Hapus" color="negative" @click="doDelete" :loading="deleting" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';

const $q = useQuasar();

const dataList = ref([]);
const loading = ref(false);
const filter = ref('');
const showDialog = ref(false);
const showDeleteDialog = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const deleting = ref(false);
const deleteTarget = ref(null);

const pagination = ref({
  sortBy: 'id_prioritas',
  descending: false,
  page: 1,
  rowsPerPage: 10
});

const formData = reactive({
  id_prioritas: null,
  alias_prioritas: '',
  is_active: 1
});

const statusOptions = [
  { label: 'Aktif', value: 1 },
  { label: 'Tidak Aktif', value: 0 }
];

const columns = [
  { name: 'no', label: 'No', field: 'no', align: 'center', sortable: false, style: 'width: 60px' },
  { name: 'alias_prioritas', label: 'Nama Prioritas', field: 'alias_prioritas', align: 'left', sortable: true },
  { name: 'is_active', label: 'Status', field: 'is_active', align: 'center', sortable: true },
  { name: 'modify_by', label: 'Diubah Oleh', field: 'modify_by', align: 'left', sortable: false },
  { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'center', sortable: false }
];

const getRowNumber = (rowIndex) => {
  return (pagination.value.page - 1) * pagination.value.rowsPerPage + rowIndex + 1;
};

const loadData = async () => {
  loading.value = true;
  try {
    const token = window.localStorage.getItem('token');
    const res = await axios.get(`${import.meta.env.VITE_API}recruitment/priorities`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dataList.value = res.data.data;
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Gagal memuat data', position: 'bottom' });
  } finally {
    loading.value = false;
  }
};

const openAdd = () => {
  isEdit.value = false;
  formData.id_prioritas = null;
  formData.alias_prioritas = '';
  formData.is_active = 1;
  showDialog.value = true;
};

const openEdit = (row) => {
  isEdit.value = true;
  formData.id_prioritas = row.id_prioritas;
  formData.alias_prioritas = row.alias_prioritas;
  formData.is_active = row.is_active;
  showDialog.value = true;
};

const onSave = async () => {
  saving.value = true;
  try {
    const token = window.localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const payload = {
      alias_prioritas: formData.alias_prioritas,
      is_active: formData.is_active
    };

    if (isEdit.value) {
      await axios.put(`${import.meta.env.VITE_API}recruitment/priorities/${formData.id_prioritas}`, payload, { headers });
      $q.notify({ type: 'positive', message: 'Prioritas berhasil diperbarui', position: 'bottom' });
    } else {
      await axios.post(`${import.meta.env.VITE_API}recruitment/priorities`, payload, { headers });
      $q.notify({ type: 'positive', message: 'Prioritas berhasil ditambahkan', position: 'bottom' });
    }

    showDialog.value = false;
    await loadData();
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Gagal menyimpan data', position: 'bottom' });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (row) => {
  deleteTarget.value = row;
  showDeleteDialog.value = true;
};

const doDelete = async () => {
  deleting.value = true;
  try {
    const token = window.localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API}recruitment/priorities/${deleteTarget.value.id_prioritas}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    $q.notify({ type: 'positive', message: 'Prioritas berhasil dihapus', position: 'bottom' });
    showDeleteDialog.value = false;
    await loadData();
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Gagal menghapus data', position: 'bottom' });
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
