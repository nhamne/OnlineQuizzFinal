<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Desktop Sidebar -->
    <Sidebar :listMenu="menu" class="hidden md:flex shrink-0" />

    <!-- Main Wrapper -->
    <div class="flex flex-col flex-1 min-w-0 bg-[#f5f6fb] relative h-full">
      <!-- Header -->
      <div
        class="px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between gap-3 shrink-0 relative z-20"
      >
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-1.5 -ml-1 text-gray-700 hover:text-secondary hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Icon :name="isMobileMenuOpen ? 'x' : 'menu'" size="24" />
          </button>
          <span class="text-lg sm:text-xl font-bold text-gray-800 truncate">{{ $route.meta.title || 'Quản trị hệ thống' }}</span>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <div class="hidden sm:flex flex-col text-right">
            <span class="text-xs font-bold text-gray-800">Quản trị viên</span>
            <span class="text-[11px] text-gray-500">admin@onlinequizz.edu.vn</span>
          </div>
          <router-link
            to="/student/profile"
            class="border border-gray-200 bg-gray-100 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer shrink-0 text-gray-600 hover:text-primary hover:border-primary/40 transition-colors"
          >
            <Icon name="user" size="20" />
          </router-link>
        </div>
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
            <Icon name="education" size="32" color="white" class="shrink-0" />
            <span class="font-bold text-xl whitespace-nowrap">Admin Portal</span>
          </div>
          <button
            @click="isMobileMenuOpen = false"
            class="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <Icon name="x" size="22" color="white" />
          </button>
        </div>

        <!-- Navigation items -->
        <div class="flex flex-col gap-2 mt-6">
          <router-link
            v-for="item in menu"
            :key="item.key"
            :to="item.route"
            @click="isMobileMenuOpen = false"
            class="flex items-center gap-3.5 p-3 hover:bg-white/10 transition-colors duration-200 cursor-pointer rounded-xl outline-none"
            :class="$route.path === item.route ? 'bg-secondary font-bold text-white shadow-md' : 'text-white/80'"
          >
            <Icon :name="item.icon" size="20" color="white" />
            <span class="text-sm">{{ item.title }}</span>
          </router-link>
        </div>
      </div>

      <!-- Main Content Area -->
      <div
        id="main-scroll-area"
        class="w-full flex-1 overflow-y-auto custom-scrollbar"
      >
        <div class="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <router-view :key="$route.fullPath"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar, { type MenuItem } from '@/components/custom/Sidebar.vue'
import Icon from '@/components/custom/Icon.vue'
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const menu: MenuItem[] = [
  { key: 'dashboard', title: 'Tổng quan', icon: 'dashboard', route: '/admin/dashboard' },
  { key: 'users', title: 'Quản lý người dùng', icon: 'community', route: '/admin/users' },
  {
    key: 'content-review',
    title: 'Kiểm duyệt nội dung',
    icon: 'message-question-mark',
    route: '/admin/content-review',
  },
]
</script>
