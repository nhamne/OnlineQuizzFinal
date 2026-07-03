<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-96 animate-in zoom-in-95 duration-200 overflow-hidden"
    >
      <div class="bg-[#BA1A1A] w-full h-[12px] flex items-center justify-center"></div>
      <div class="text-center p-8">
        <div
          class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 warning-wrapper"
        >
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Icon name="warning" size="32" color="#BA1A1A" />
          </div>
        </div>
        <h3 class="text-base font-semibold text-gray-800 mb-3">{{ title }}</h3>
        <p class="text-gray-600 mb-6 text-sm">{{ message }}</p>
        <div class="flex items-center justify-between w-full gap-5">
          <Button variant="secondary" @click="cancel" class="flex-1">Hủy</Button>
          <Button variant="danger" @click="confirm" class="flex-1">Xác nhận</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue'
import Icon from './Icon.vue'

interface Props {
  title: string
  message: string
}

const isOpen = defineModel<boolean>()
const props = defineProps<Props>()
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
.warning-wrapper {
  animation: warningFlash 1.5s ease-in-out infinite;
}

@keyframes warningFlash {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.08);
  }
}
</style>
