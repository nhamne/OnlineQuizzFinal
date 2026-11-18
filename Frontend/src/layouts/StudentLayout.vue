<template>
  <div class="flex h-screen">
    <Sidebar :listMenu="menu" class="hidden md:flex" />
    <div class="flex flex-col w-full min-w-0 bg-[#f5f6fb] relative">
      <div
        class="px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6 bg-white shadow-lg flex items-center justify-between gap-3 shrink-0 relative z-20"
      >
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-1.5 -ml-1 text-gray-700 hover:text-secondary hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            <Icon :name="isMobileMenuOpen ? 'x' : 'menu'" size="24" />
          </button>
          <span class="text-lg sm:text-xl font-semibold truncate">{{ $route.meta.title }}</span>
        </div>
        <router-link
          to="/student/profile"
          class="border border-gray-200 bg-gray-100 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer shrink-0"
        >
          <Icon name="user" size="24" />
        </router-link>
      </div>

      <!-- Mobile Drawer Backdrop -->
      <div
        v-if="isMobileMenuOpen"
        @click="isMobileMenuOpen = false"
        class="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      ></div>

      <!-- Mobile Drawer Sidebar -->
      <div
        class="md:hidden fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-primary-bg text-white flex flex-col py-6 px-4 shadow-2xl transition-transform duration-300 ease-in-out"
        :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <!-- Header of Drawer -->
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-3">
            <Icon name="education" size="36" color="white" class="shrink-0" />
            <span class="font-bold text-2xl whitespace-nowrap">Thi online</span>
          </div>
          <button
            @click="isMobileMenuOpen = false"
            class="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <Icon name="x" size="24" color="white" />
          </button>
        </div>

        <!-- Navigation items -->
        <div class="flex flex-col gap-3 mt-8">
          <router-link
            v-for="item in menu"
            :key="item.key"
            :to="item.route"
            @click="isMobileMenuOpen = false"
            class="flex items-center gap-4 p-3.5 hover:bg-white/10 transition-colors duration-200 cursor-pointer rounded-xl outline-none"
            :class="
              checkActive(item)
                ? 'bg-white/20 border border-white/30 shadow-lg font-bold'
                : 'font-medium'
            "
          >
            <Icon :name="item.icon" size="28" color="white" class="shrink-0" />
            <span class="text-base whitespace-nowrap">{{ item.title }}</span>
          </router-link>
        </div>

        <!-- Footer / Logout -->
        <div
          @click="handleLogout"
          class="flex items-center gap-4 p-3.5 mt-auto mb-4 hover:bg-white/10 transition-colors duration-200 cursor-pointer rounded-xl"
        >
          <Icon name="arrow-out-right" size="28" color="white" class="shrink-0"></Icon>
          <span class="font-medium text-base whitespace-nowrap">Đăng xuất</span>
        </div>
      </div>

      <div
        id="main-scroll-area"
        class="py-4 sm:py-6 lg:py-8 w-full mx-auto overflow-y-auto custom-scrollbar flex-1 min-h-0"
      >
        <div class="w-full px-4 sm:px-6 md:w-[92%] lg:w-[88%] xl:w-[80%] mx-auto">
          <router-view :key="$route.fullPath"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar, { type MenuItem } from '@/components/custom/Sidebar.vue'
import Icon from '@/components/custom/Icon.vue'

const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref<boolean>(false)

const checkActive = (menuItem: MenuItem) => {
  return route.path.startsWith(menuItem.route)
}

const handleLogout = () => {
  isMobileMenuOpen.value = false
  router.push('/auth/login')
}

const menu: MenuItem[] = [
  { key: 'dashboard', title: 'Tổng quan', icon: 'dashboard', route: '/student/dashboard' },
  { key: 'class', title: 'Tham gia lớp học', icon: 'community', route: '/student/join-class' },
  { key: 'exam', title: 'Ca thi của tôi', icon: 'document', route: '/student/my-sessions' },
  {
    key: 'test',
    title: 'Kết quả thi',
    icon: 'calendar-check',
    route: '/student/results',
  },
]
</script>
