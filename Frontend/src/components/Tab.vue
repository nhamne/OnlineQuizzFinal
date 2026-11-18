<template>
  <div class="relative flex items-center bg-[#F1F5F9] rounded-2xl">
    <div
      class="absolute mx-1 w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-2xl bg-white shadow transition-transform duration-300 ease-out"
      :class="currentRole === 'teacher' ? 'translate-x-full' : 'translate-x-0'"
    ></div>
    <button
      class="text-base py-3 flex items-center w-1/2 justify-center z-10 font-semibold"
      @click="currentRole = 'student'"
      :class="currentRole === 'student' ? 'text-[#0369A1]' : 'text-[#536D91]'"
    >
      Học sinh
    </button>
    <button
      class="text-base py-3 flex items-center w-1/2 justify-center z-10 font-semibold"
      @click="currentRole = 'teacher'"
      :class="currentRole === 'teacher' ? 'text-[#0369A1]' : 'text-[#536D91]'"
    >
      Giáo viên
    </button>
  </div>
</template>

<script setup lang="ts">
import { type Ref, inject } from 'vue'

const currentRole = inject<Ref<'student' | 'teacher'>>('authrole')
</script>
