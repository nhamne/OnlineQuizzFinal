<template>
  <div
    class="mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-primary/5 flex items-center gap-2 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.15)] focus-within:bg-primary/5"
  >
    <slot name="icon1">
      <Icon v-if="icon" :name="icon" size="20" :color="iconColor"></Icon>
    </slot>
    <input
      :type="type"
      :placeholder="placeholder"
      v-model="modelValue"
      class="outline-none w-full"
    />
    <slot name="icon2">
      <span v-if="variant === 'required'" class="text-red-500">*</span>
    </slot>
  </div>
</template>
<script setup lang="ts">
import Icon from './Icon.vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  iconColor: {
    type: String,
    default: 'gray',
  },
  variant: {
    type: String,
    default: 'default',
  },
})

const modelValue = defineModel()
</script>
