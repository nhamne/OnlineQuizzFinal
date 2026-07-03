<template>
  <!-- Tìm kiếm -->

  <div>
    <div :class="mergedClasses">
      <Icon name="search" class="text-gray-400" />
      <input type="text" :placeholder="placeholder" class="text-black outline-none w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/custom/Icon.vue'
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'
interface Props {
  placeholder?: string
  customClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Tìm kiếm...',
  customClass: '',
})

const mergedClasses = computed(() => {
  return twMerge(
    'mt-2 flex gap-2 items-center border border-gray-300 rounded-lg p-2 bg-primary/5 transition-all duration-200 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.15)]',
    props.customClass,
  )
})
</script>
