<template>
  <button type="button" :class="mergedClasses">
    <Icon v-if="icon" :name="icon" :size="size"></Icon>
    <span class="whitespace-nowrap"><slot></slot></span>
  </button>
</template>

<script lang="ts" setup>
import Icon from '@/components/custom/Icon.vue'
import { computed } from 'vue'
import { twMerge } from 'tailwind-merge'
interface Props {
  icon?: string
  customClass?: string
  size?: number | string
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'disabled'
}
const props = withDefaults(defineProps<Props>(), {
  icon: '',
  customClass: '',
  size: 20,
  variant: 'primary',
})

const variantClasses = {
  disabled:
    'opacity-50 !cursor-not-allowed border border-gray-300 text-gray-600 px-4 py-3 font-medium',
  primary:
    'bg-button-primary text-white hover:shadow-[0_8px_24px_rgba(3,105,161,0.4)] hover:brightness-110',
  secondary: 'bg-white text-gray-700 border border-gray-300  shadow-sm hover:shadow-lg',
  outline: 'bg-transparent text-primary-bg border border-primary-bg hover:bg-primary/5',
  danger:
    'bg-gradient-to-r from-[#e34242] to-[#BA1A1A] !text-white hover:shadow-[0_8px_24px_rgba(186,26,26,0.4)] hover:brightness-110 transition-all duration-200',
}

const mergedClasses = computed(() => {
  const baseClasses =
    'flex items-center gap-2 px-5 py-3 font-bold text-sm rounded-xl transition-all duration-200  justify-center'
  return twMerge(baseClasses, variantClasses[props.variant], props.customClass)
})
</script>

<style>
/* .x {
  background: rgb(198, 2, 2);
}rgb(205, 51, 51) */
</style>
