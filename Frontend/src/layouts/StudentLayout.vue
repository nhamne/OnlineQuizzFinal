<template>
  <div class="flex h-screen">
    <Sidebar :listMenu="menu" />
    <div class="flex flex-col w-full bg-[#f5f6fb]">
      <div class="px-8 py-6 bg-white shadow-lg flex items-center justify-between">
        <span class="text-xl font-semibold">{{ $route.meta.title }}</span>
        <div
          class="border border-gray-200 bg-gray-100 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
        >
          <Icon name="user" size="24" />
        </div>
      </div>
      <div
        id="main-scroll-area"
        class="py-8 w-full mx-auto overflow-y-auto custom-scrollbar h-[calc(100dvh-92px)]"
      >
        <div class="w-[80%] mx-auto">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Sidebar, { type MenuItem } from '@/components/custom/Sidebar.vue'
import Icon from '@/components/custom/Icon.vue'
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
