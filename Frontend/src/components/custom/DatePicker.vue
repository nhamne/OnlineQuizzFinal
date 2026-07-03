<template>
  <div class="w-full">
    <VueDatePicker
      v-model="date"
      :enable-time-picker="false"
      auto-apply
      format="dd/MM/yyyy"
      :placeholder="placeholder"
    >
      <template #dp-input="{ value }">
        <div
          class="mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-primary/5 flex items-center gap-2 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.15)] focus-within:bg-primary/5 cursor-pointer"
        >
          <Icon name="calendar" size="20" color="#62738b"></Icon>
          <input
            type="text"
            :value="value"
            :placeholder="placeholder"
            readonly
            class="outline-none w-full bg-transparent cursor-pointer text-[#62738b]"
          />
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// Import component và CSS của thư viện
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Icon from './Icon.vue'

const props = defineProps<{ placeholder?: string }>()
// Biến lưu trữ giá trị ngày (Mặc định lấy ngày hôm nay)
const date = ref<Date | null>(null)
</script>
