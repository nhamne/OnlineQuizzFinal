<template>
  <div class="w-full flex items-center">
    <div
      class="flex flex-col justify-between items-start px-18 py-30 bg-auth-grid w-1/2 h-screen border-r border-zinc-800"
    >
      <div class="flex flex-col items-start gap-5">
        <h3 class="text-[#A5F3FC] font-semibold text-xs uppercase tracking-[3px]">
          {{ layoutContent.subtitle }}
        </h3>
        <div class="text-6xl font-bold text-white">{{ layoutContent.title }}</div>
        <p class="text-white text-lg">{{ layoutContent.description }}</p>
      </div>
      <div
        class="flex px-5 py-6 bg-rgba(255,255,255,0.06) items-center gap-3 w-fit border border-gray-500 rounded-2xl bg-gray-500/40"
      >
        <Icon name="check-shield" color="#BEF264" size="20" />
        <span class="text-sm text-white font-semibold"
          >Đăng nhập an toàn cho {{ layoutContent.role }} với xác thực phiên bằng cookie.</span
        >
      </div>
    </div>

    <div class="flex justify-center items-center w-1/2 h-screen">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/custom/Icon.vue'
import { ref, provide, computed } from 'vue'

const currentRole = ref<'student' | 'teacher'>('student')

provide('authrole', currentRole)

const layoutContent = computed(() => {
  if (currentRole.value === 'student') {
    return {
      subtitle: 'Student Workspace',
      title: 'Không gian học tập tập trung',
      description: 'Làm bài thi, theo dõi tiến độ và phát triển năng lực học tập mỗi ngày.',
      role: 'Học sinh',
    }
  } else {
    return {
      subtitle: 'Teacher Workspace',
      title: 'Không gian giảng dạy hiện đại',
      description:
        'Tạo đề thi, quản lý lớp học và theo dõi tiến trình học sinh trong một hệ thống duy nhất.',
      role: 'Giáo viên',
    }
  }
})
</script>
