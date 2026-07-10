<template>
  <q-layout view="lHh Lpr lff" class="main-layout"> <!-- view="hHh lpR fFf" -->
    <q-header elevated class="modern-header">
      <q-toolbar class="main-toolbar" :class="$q.dark.mode ? `${Header} text-white` : `text-white ${Header}`"> 
        <q-btn v-if="menuType == false" flat @click="drawer = !drawer" round class="menu-btn" icon="menu" size="lg" />
        
        <q-toolbar-title class="modern-title">
          <div class="title-container">
            <span class="app-name">Recruitment Barcode</span>
            <span class="app-subtitle"></span>
          </div>
        </q-toolbar-title>

        <q-space />

        <div class="flex items-center gap-4">
          <div class="bg-white/15 px-4 py-2 rounded-[20px] text-sm font-medium flex items-center backdrop-blur-[10px]">
            <q-icon name="business" class="q-mr-xs" />
            {{ Unit }}
          </div>
          
          <q-btn round flat class="bg-white/10 rounded-xl transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5" icon="apps" size="md">
            <q-tooltip class="tw-bg-black/80 tw-text-white">Select Domain</q-tooltip>
            <q-menu class="domain-select-menu">
              <div class="domain-menu-container">
                <div class="domain-menu-header">
                  <q-icon name="business" size="sm" class="header-icon" />
                  <span class="header-title">Select Domain</span>
                </div>
                <q-input 
                  v-model="domainSearchQuery" 
                  placeholder="Search domain..."
                  dense
                  outlined
                  class="domain-search-input"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="search" class="search-icon" />
                  </template>
                </q-input>
                <div class="domain-grid">
                  <div v-for="(data, i) in filteredDomains" :key="i" 
                    @click="setDomain(data)" 
                    v-close-popup
                    class="domain-card" 
                    :class="`domain-card-${data.value}`">
                    <div class="domain-card-inner">
                      <div class="domain-icon-wrapper">
                        <q-icon name="domain" size="md" class="domain-icon" />
                      </div>
                      <div class="domain-info">
                        <div class="domain-title">{{ data.desc }}</div>
                        <div class="domain-code">Code: {{ data.value }}</div>
                      </div>
                      <div class="domain-arrow">
                        <q-icon name="arrow_forward" size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-menu>
          </q-btn>
          
          <q-btn round flat class="transition-all duration-300 hover:-translate-y-0.5" @click="openProfileDrawer">
            <q-tooltip class="tw-bg-black/80 tw-text-white">View Profile</q-tooltip>
            <q-avatar size="40px" class="header-avatar">
              <div class="font-bold text-lg">{{ Nama }}</div>
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>

      <q-toolbar v-if="$q.screen.gt.sm && menuType == true" inset class="bg-grey-3">
        <div class="
            GL__toolbar-link
            q-ml-xs q-gutter-md
            text-body2 text-weight-light
            row
            items-center
            no-wrap
          ">
          <template v-for="(menuItem, index) in listMenu" :key="index">
            <div v-if="menuItem.children.length == 0">
              <router-link :to="menuItem.link">
                <a href="javascript:void(0)" class="text-black">
                  <!-- <q-icon size="18px" class="icon-menu" :name="fasBook" /> -->
                  <q-icon size="18px" :name="menuItem.icon" />
                  {{ menuItem.name }}
                </a>
              </router-link>
            </div>
            <div v-else>
              <a href="javascript:void(0)" class="text-black">
                <q-icon size="18px" :name="menuItem.icon" />
                {{ menuItem.name }}
                <q-menu auto-close class="q-menu-navbar">
                  <q-list dense>
                    <q-item v-for="(menuItemChild, index) in menuItem.children" :key="index" clickable
                      :to="menuItemChild.link">
                      <q-item-section>
                        {{ menuItemChild.name }} zz</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </a>
            </div>
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer elevated dense>
      <q-toolbar :class="$q.dark.mode ? `${Footer} text-white` : `${Footer} text-white`">
        <q-toolbar-title class="text-subtitle2">Copyright &#169; 2026 IT DBC
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-drawer v-if="menuType == false" v-model="drawer" show-if-above :width="320" :breakpoint="500" 
      class="modern-drawer" :class="$q.dark.mode ? 'bg-blue-grey-3 text-black' : `side-${Domain}`">
      <div class="drawer-header-fixed" :style="drawerHeaderStyle">
          <div class="logo-section">
            <img :src="`logo.png`" alt="Logo" class="drawer-logo" />
          </div>
          
          <div class="user-profile-section">
            <div class="profile-background relative" :style="profileBackgroundStyle">
              <q-avatar size="60px" class="user-avatar relative z-[2]" :class="`user-avatar-bg-${Domain}`">
                <div class="user-initial tw-bg-black/30 tw-backdrop-blur-sm tw-border-2 tw-border-white/80 tw-rounded-full tw-text-xl tw-font-bold">{{ Nama }}</div>
              </q-avatar>
              <div class="tw-text-white tw-relative tw-z-[2]">
                <div class="tw-inline-block tw-bg-white/[0.07] tw-backdrop-blur-md tw-px-3 tw-py-1.5 tw-rounded-full tw-border tw-border-white/50 tw-mb-2 tw-shadow-lg">
                  <div class="tw-text-xs tw-font-semibold tw-text-white tw-drop-shadow-[1px_1px_3px_rgba(0,0,0,0.8)]">{{ userLevel }}</div>
                </div>
                <div class="tw-font-bold tw-text-lg tw-drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] tw-drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                  {{ userUsername }}
                </div>
              </div>
            </div>
          </div>
          <div class="search-section">
            <q-input 
              v-model="searchQuery" 
              placeholder="Search menu..."
              dense
              outlined
              class="search-input"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" class="search-icon" />
              </template>
            </q-input>
          </div>
      </div>
      
      <div style="height: 400px;"></div>
      
      <q-scroll-area style="height: calc(100vh - 400px);">
        
        <div class="navigation-section">
          <div v-if="!listMenu || listMenu.length === 0" class="no-menu-message">
            <q-icon name="menu" size="2rem" color="grey-5" />
            <div class="text-grey-6 q-mt-sm">No menu items available</div>
          </div>
          <q-list v-else class="modern-menu-list">
            <template v-for="(menuItem, index) in filteredMenu" :key="index">
              <div v-if="menuItem.children.length == 0">
                <q-item clickable :to="menuItem.link?.startsWith('/') ? menuItem.link : '/' + menuItem.link" class="menu-item" :class="[`menu-item-domain-${Domain}`, $q.dark.mode ? 'bg-blue-grey-9 text-black' : `side-${Domain}-1`, currentRoute === (menuItem.link?.startsWith('/') ? menuItem.link : '/' + menuItem.link) ? 'menu-item-active' : '']">
                  <q-item-section avatar class="menu-icon-section">
                    <q-icon :name="menuItem.icon || 'circle'" class="menu-icon" :style="iconBubbleStyle" />
                  </q-item-section>
                  <q-item-section class="menu-text-section">
                    <span class="menu-text text-dark" v-html="highlightText(menuItem.name)"></span>
                  </q-item-section>
                </q-item>
              </div>
              <div v-else>
                <q-expansion-item class="menu-expansion" :class="`menu-expansion-domain-${Domain}`" :content-inset-level="0.5" expand-separator :default-opened="hasMatchingChildren(menuItem)">
                  <template #header>
                    <q-item class="expansion-header" :class="`expansion-header-domain-${Domain}`">
                      <q-item-section avatar class="menu-icon-section">
                        <q-icon :name="menuItem.icon || 'folder'" class="menu-icon" :style="iconBubbleStyle" />
                      </q-item-section>
                      <q-item-section>
                        <span class="menu-text text-dark" v-html="highlightText(menuItem.name)"></span>
                      </q-item-section>
                    </q-item>
                  </template>
                  
                  <template v-for="(menuItemChild, index) in menuItem.filteredChildren" :key="index">
                    <q-item clickable :to="menuItemChild.link?.startsWith('/') ? menuItemChild.link : '/' + menuItemChild.link" 
                      :class="[currentRoute.includes(menuItemChild.link) ? 'menu-child-active' : 'menu-child', `menu-child-domain-${Domain}`]"
                      class="menu-child-item">
                      <q-item-section avatar class="child-icon-section">
                        <q-icon :name="menuItemChild.icon || 'chevron_right'" class="child-icon" :style="iconBubbleStyle" />
                      </q-item-section>
                      <q-item-section>
                        <span class="child-text" v-html="highlightText(menuItemChild.name)"></span>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-expansion-item>
              </div>
            </template>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <ProfileDrawer 
      v-model="profileDrawer" 
      :domain="Domain" 
      :user-name="userName" 
      :user-level="userLevel"
      :user-initial="Nama"
    />

    <q-page-container style="overflow-x: auto;">
      <!-- <q-page padding> -->
      <router-view />
      <!-- </q-page> -->
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref,computed,onMounted  } from "vue";
import { useQuasar } from "quasar";
import axios from "axios"
import { empid, nama, nik, ParseError, domain,unit,idleTime, spinnerBall, role, decryptMessage } from "./../utils";
import { useRouter, useRoute } from "vue-router";
import { useBrowserLocation,useTimeoutFn } from '@vueuse/core'
import ProfileDrawer from './../components/ProfileDrawer.vue';

const $q = useQuasar();
const drawer = ref(false);
const profileDrawer = ref(false);
const listMenu = ref([]);
const searchQuery = ref('');
const mode = ref(false);
const menuType = ref(false); /*false untuk sidemenu & true untuk topmenu*/
const listDomain = ref([]);
const domainSearchQuery = ref('');
const Domain = ref(domain());
const pattern = `${domain()} - `;
const Unit = ref(unit()?.startsWith(pattern) ? unit().substring(pattern.length) : (unit() || ''));
const userName = ref(window.localStorage.getItem('name') || window.localStorage.getItem('username') || '');
const userLevel = ref(window.localStorage.getItem('level') || '');
const userUsername = ref(window.localStorage.getItem('username') || '');
const Nama = ref(userUsername.value ? userUsername.value.substring(0, 1).toUpperCase() : '?');
const Header= ref(false);
const Footer= ref(false);
const timeout = ref(idleTime());
const location = useBrowserLocation();
const Color = ref();
const router = useRouter();
const colorBrand = ref([]);

const currentRoute = computed(() => {
        return router.currentRoute.value.path
    });

const drawerHeaderStyle = computed(() => {
  return {
    background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)'
  };
});

const filteredMenu = computed(() => {
  if (!listMenu.value || !Array.isArray(listMenu.value)) {
    return [];
  }
  
  if (!searchQuery.value) {
    return listMenu.value.map(item => ({
      ...item,
      filteredChildren: item.children || []
    }));
  }
  
  const query = searchQuery.value.toLowerCase();
  return listMenu.value.filter(item => {
    const matchesParent = item.name.toLowerCase().includes(query);
    const filteredChildren = (item.children || []).filter(child => 
      child.name.toLowerCase().includes(query)
    );
    
    if (matchesParent || filteredChildren.length > 0) {
      return {
        ...item,
        filteredChildren: matchesParent ? item.children : filteredChildren
      };
    }
    return false;
  }).map(item => {
    const matchesParent = item.name.toLowerCase().includes(query);
    const filteredChildren = (item.children || []).filter(child => 
      child.name.toLowerCase().includes(query)
    );
    
    return {
      ...item,
      filteredChildren: matchesParent ? item.children : filteredChildren
    };
  });
});

const highlightText = (text) => {
  if (!searchQuery.value) return text;
  const regex = new RegExp(`(${searchQuery.value})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
};

const hasMatchingChildren = (menuItem) => {
  if (!searchQuery.value) return false;
  const query = searchQuery.value.toLowerCase();
  return (menuItem.children || []).some(child => 
    child.name.toLowerCase().includes(query)
  );
};

const filteredDomains = computed(() => {
  if (!listDomain.value || !Array.isArray(listDomain.value)) return [];
  if (!domainSearchQuery.value) return listDomain.value;
  
  const query = domainSearchQuery.value.toLowerCase();
  return listDomain.value.filter(domain => 
    domain.desc.toLowerCase().includes(query) || 
    domain.value.toLowerCase().includes(query)
  );
});

const iconBubbleStyle = computed(() => {
  return {
    background: 'linear-gradient(135deg, #1565C0, #42A5F5)'
  };
});

const randomColor = () => {
  const randomValue = () => Math.floor(Math.random() * 128); // Values between 0 and 127 for darker tones
  const toHex = (value) => value.toString(16).padStart(2, '0'); // Convert to hex and pad with 0
  const r = randomValue();
  const g = randomValue();
  const b = randomValue();
  Color.value =`#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const profileBackgroundStyle = computed(() => {
  return {};
});

const openProfileDrawer = () => {
  profileDrawer.value = true;
};

/* const setListDomain = () => {
  listDomain.value = domains();
};
 */
const setDomain = async (value) => {
  spinnerBall();
  window.localStorage.setItem("domain", value.value);
  window.localStorage.setItem("unit", value.desc);
  Domain.value = value.value;
  const pattern = `${value.value} - `;
  Unit.value = value.desc?.startsWith(pattern) ? value.desc.substring(pattern.length) : (value.desc || '');
  await getMenuAksesUser();
  await getSite();
  setHeaderFooter();
  router.push("/");
  let timer = setTimeout(() => {
          $q.loading.hide()
          timer = void 0
  }, 1000) 
};

const setHeaderFooter = () => {
  Header.value='tw-bg-[#1565C0] tw-h-24'
  Footer.value='tw-bg-gradient-to-r tw-from-[#1565C0] tw-to-[#0D47A1]'
}

const getSite = async () => {
 try{
     const res = await axios.get(`${import.meta.env.VITE_API}getUserSite`,{
        params: {
            domain:domain(),
            empid:empid(),
        }
    });
    window.localStorage.removeItem("ListSite");
    window.localStorage.setItem("ListSite", JSON.stringify(res.data));
 }catch(error){
      $q.notify({
      type: "negative",
      message: error,
    });
 }
};

const getMenuAksesUser = async () => {
  try {
    const token = window.localStorage.getItem('token');
    if (!token) return;

    const res = await axios.get(`${import.meta.env.VITE_API}recruitment/menu`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    listMenu.value = res.data?.data || [];
  } catch (error) { 
    console.log('Failed to load menu:', error.message);
  }
};

const getDomain = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}getAksesDomains`, {
      params: {
        empid: empid()
      },
    });
    listDomain.value = res.data;
  } catch (error) {
    console.log(error.message);
    /* $q.notify({
      type: "negative",
      message: ParseError(error),
    }); */
  }
  const localDomain = domain();
};

const logoutUser = async () => {
  try {
    spinnerBall();
    const res = await axios.post(`${import.meta.env.VITE_API}logout`, {
      params:{
        empid:empid(),
        note:'user',
        url:location.value.origin,
      }
    });
    $q.loading.hide()
    if (typeof res.data!== "undefined") {
      window.localStorage.clear();
      window.sessionStorage.clear();
      let environment = `${import.meta.env.VITE_ENV}`;
      if (environment == 'LOCAL'){
          router.push("/login");
      }else{
          window.location.replace(`${import.meta.env.VITE_APPDBC}`);
      }
      //router.push("https://app.dbc.co.id");
      //router.push("/");
    }
  } catch (error) {
    console.log(error);
    $q.loading.hide()
   /*  $q.notify({
      type: "negative",
      message: ParseError(error),
    }); */
  }
}


const logoutSystem = async () => {
  try {
    spinnerBall()
    const res = await axios.post(`${import.meta.env.VITE_API}logout`, {
      params:{
        empid:empid(),
        note:'system',
        url:location.value.origin,
      }
    });
    $q.loading.hide()
    if (typeof res.data!== "undefined") {
      window.localStorage.clear();
      window.sessionStorage.clear();
      let environment = `${import.meta.env.VITE_ENV}`;
      if (environment == 'LOCAL'){
          router.push("/login");
      }else{
           window.location.replace(`${import.meta.env.VITE_APPDBC}`);
      }
      //router.push("https://app.dbc.co.id");
      //router.push("/");
    }
  } catch (error) {
    $q.loading.hide()
    console.log(error);
   /*  $q.notify({
      type: "negative",
      message: ParseError(error),
    }); */
  }
}

//console.log(timeout.value);
// const { start, stop } = useTimeoutFn(logoutSystem, timeout.value)

if (window.localStorage.getItem("menu")) {
  if (window.localStorage.getItem("menu") == "true") {
    menuType.value = true;
  } else {
    menuType.value = false;
  }
}

if (window.localStorage.getItem("dark")) {
  if (window.localStorage.getItem("dark") == "true") {
    menuType.value = true;

    $q.dark.set(true);
  } else {
    $q.dark.set(false);
  }
}

if (window.localStorage.getItem("token")) {
  // api.defaults.headers.common["Authorization"] = window.localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = 'Bearer ' + window.localStorage.getItem("token");
}

//setListDomain();

/*
setInterval(() => {
  if (window.localStorage.getItem("token") !== null) {
    refreshToken();
  }
}, 120000);*/
setHeaderFooter();
onMounted(async() => {
  randomColor();
  await getMenuAksesUser();
  // await getDomain();
  // await getSite();
  // await getProfileImages();
});
  
// const resetTimer = () => {
//   stop()
//   start()
// }

// window.addEventListener('mousemove', resetTimer)
// window.addEventListener('keypress', resetTimer)
</script>

<style lang="scss" scoped>
@import './../assets/styles/main-layout.scss';
</style>

<style lang="sass">
@import './../assets/styles/main-layout.sass'
</style>

<style>
@import './../assets/styles/main-layout.css';
</style>