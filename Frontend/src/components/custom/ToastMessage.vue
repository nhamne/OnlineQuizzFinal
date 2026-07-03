<template>
  <transition name="slide-down">
    <div
      v-if="modelValue"
      class="absolute right-5 top-2.5 min-w-90 w-fit px-6 py-3 rounded-sm border flex items-center gap-4 shadow-md"
      :class="theme.wrapper"
    >
      <Icon :name="theme.icon" :color="theme.iconColor"></Icon>

      <p class="text-base font-semibold flex flex-col" :class="theme.label">
        <span>{{ label }}</span>
        <span class="text-sm font-medium" :class="theme.text">{{ content }}</span>
      </p>

      <Icon name="x" color="gray" class="ml-auto cursor-pointer hover:opacity-70" @click="close"></Icon>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import Icon from '@/components/custom/Icon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    // Thêm validator để cảnh báo nếu lúc dùng truyền sai type
    validator: (value: string) => ['info', 'success', 'error', 'warning'].includes(value),
  },
})

// 1. Khai báo "Từ điển" chứa cấu hình cho 4 loại
const themeConfig = {
  info: {
    wrapper: 'border-blue-200 bg-[#E3F2FD]',
    label: 'text-blue-800',
    text: 'text-blue-700/90',
    icon: 'info-circle', // Bạn nhớ đổi tên icon cho khớp với hệ thống của bạn nhé
    iconColor: '#1d4ed8', // blue-700
  },
  success: {
    wrapper: 'border-[#297A2D]/30 bg-[#E8F5E9]',
    label: 'text-green-800',
    text: 'text-green-700/90',
    icon: 'check-circle', // Nhớ đổi tên icon
    iconColor: '#15803d', // green-700
  },
  warning: {
    wrapper: 'border-yellow-300 bg-[#FFF9C4]',
    label: 'text-yellow-800',
    text: 'text-yellow-700/90',
    icon: 'warning-basic', // Nhớ đổi tên icon
    iconColor: '#a16207', // yellow-700
  },
  error: {
    wrapper: 'border-red-200 bg-[#FFEBEE]',
    label: 'text-[#c81a1a]',
    text: 'text-[#c81a1a]/90',
    icon: 'block', // Nhớ đổi tên icon
    iconColor: '#c81a1a',
  },
}

// 2. Dùng computed để tự động lấy đúng bộ cấu hình dựa vào props.type
const theme = computed(() => {
  // Lấy ra cấu hình tương ứng, nếu truyền bậy type thì fallback về 'info' cho khỏi lỗi
  return themeConfig[props.type as keyof typeof themeConfig] || themeConfig.info
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}

let timeout: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        close()
      }, 3000)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
