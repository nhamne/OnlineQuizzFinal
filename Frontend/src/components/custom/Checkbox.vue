<template>
  <label class="flex items-center gap-2 text-[15px] font-semibold hover:text-secondary">
    <input type="checkbox" v-model="model" class="w-3.5 h-3.5" />
    <slot></slot>
  </label>
</template>
<script setup lang="ts">
const model = defineModel()
</script>
