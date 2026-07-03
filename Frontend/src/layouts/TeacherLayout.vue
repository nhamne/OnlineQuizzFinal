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
  { key: 'dashboard', title: 'Tổng quan', icon: 'dashboard', route: '/teacher/dashboard' },
  { key: 'class', title: 'Quản lý lớp học', icon: 'community', route: '/teacher/class-manage' },
  { key: 'exam', title: 'Quản lý đề thi', icon: 'document', route: '/teacher/exam-manage' },
  {
    key: 'test',
    title: 'Tổ chức ca thi',
    icon: 'calendar-check',
    route: '/teacher/session-manage',
  },
  { key: 'report', title: 'Báo cáo thống kê', icon: 'chart', route: '/teacher/reports' },
]
</script>
