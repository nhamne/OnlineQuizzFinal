<template>
  <div :class="mergedClasses">
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" :fill="color">
      <use :href="`/sprites.svg#${name}`" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'
interface Props {
  name: string
  size?: string | number
  color?: string
  customClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  name: '',
  size: 24,
  color: 'currentColor',
  customClass: '',
})

const mergedClasses = computed(() => {
  return twMerge(
    'inline-flex items-center justify-center transition-transform duration-300 ease-in-out ',
    props.customClass,
  )
})
</script>
