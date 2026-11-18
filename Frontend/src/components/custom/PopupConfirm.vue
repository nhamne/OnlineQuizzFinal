<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-full max-w-[440px] mx-4 h-fit px-4 py-6 animate-in zoom-in-95 duration-200 overflow-hidden relative"
    >
      <Icon name="x" color="gray" size="20" class="absolute top-4 right-4 cursor-pointer"></Icon>
      <div class="w-full h-3 flex items-center justify-center"></div>
      <div class="text-center px-6 h-full">
        <div class="mx-auto mt-6 mb-6 w-32 h-32 relative flex items-center justify-center">
          <div
            class="absolute inset-0 rounded-full animate-wave-3"
            :class="{
              'bg-red-50': props.variant === 'warning',
              'bg-secondary/10': props.variant === 'info',
            }"
          ></div>
          <div
            class="absolute w-25 h-25 rounded-full animate-wave-2"
            :class="{
              'bg-red-100': props.variant === 'warning',
              'bg-secondary/20': props.variant === 'info',
            }"
          ></div>
          <div
            class="absolute w-18 h-18 rounded-full animate-wave-1"
            :class="{
              'bg-red-200': props.variant === 'warning',
              'bg-secondary/30': props.variant === 'info',
            }"
          ></div>
          <img
            v-if="props.variant === 'warning'"
            src="@/assets/images/img-popup-warning-desktop.png"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 max-w-none z-10"
          />
          <img
            v-if="props.variant === 'info'"
            src="@/assets/images/img-popup-info-desktop.png"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 max-w-none z-10"
          />
        </div>
        <h3 class="text-base font-semibold text-gray-800 mb-3">{{ title }}</h3>
        <p class="text-gray-600 mb-6 text-sm">{{ message }}</p>
        <div class="flex items-center justify-between w-full gap-5 mt-auto">
          <Button :variant="currentVariant.buttonCancelVariant" @click="cancel" class="flex-1"
            >Hủy</Button
          >
          <Button :variant="currentVariant.buttonConfirmVariant" @click="confirm" class="flex-1"
            >Xác nhận</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue'
import Icon from './Icon.vue'
import { computed } from 'vue'

interface Props {
  title: string
  message: string
  variant?: 'info' | 'warning'
}

const isOpen = defineModel<boolean>()
const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
})

const currentVariant = computed(() => {
  const config = {
    info: {
      buttonConfirmVariant: 'primary',
      buttonCancelVariant: 'secondary',
    },
    warning: {
      buttonConfirmVariant: 'danger',
      buttonCancelVariant: 'secondary',
    },
  } as const
  return config[props.variant]
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  isOpen.value = false
  emit('confirm')
}

const cancel = () => {
  isOpen.value = false
  emit('cancel')
}
</script>

<style lang="scss" setup>
.animate-wave-1 {
  animation: waterWave 2s ease-in-out infinite;
}
.animate-wave-2 {
  animation: waterWave 2s ease-in-out infinite 0.2s;
}
.animate-wave-3 {
  animation: waterWave 2s ease-in-out infinite 0.4s;
}

@keyframes waterWave {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.7;
  }
}
</style>
