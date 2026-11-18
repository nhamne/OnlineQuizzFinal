<template>
  <div class="flex flex-col gap-2">
    <div
      :class="[
        'mt-2 px-3 py-2 border rounded-lg bg-primary/5 flex items-center gap-2 transition-all duration-200',
        isEmpty
          ? 'border-red-500'
          : ' border-gray-300 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.15)] focus-within:bg-primary/5',
      ]"
    >
      <slot name="icon1">
        <Icon v-if="icon" :name="icon" size="20" :color="iconColor"></Icon>
      </slot>
      <input
        :type="variant === 'password' ? (isHidden ? 'password' : 'text') : type"
        :placeholder="placeholder"
        v-model="modelValue"
        @blur="isTouched = true"
        class="outline-none w-full"
      />

      <slot name="icon2">
        <span v-if="variant === 'required'" class="text-red-500">*</span>
        <span v-if="variant === 'password'"
          ><Icon
            class="cursor-pointer"
            @click="isHidden = !isHidden"
            :name="isHidden ? 'eye' : 'eye-slash'"
          ></Icon
        ></span>
      </slot>
    </div>
    <div v-show="isEmpty" class="text-[#c81a1a]/90 transition-all duration-200">
      Trường thông tin này là bắt buộc
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from './Icon.vue'

const isHidden = ref(true)
const isTouched = ref(false)
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
  // message: {
  //   type: String,
  //   default: '',
  // },
})

const modelValue = defineModel()
const isEmpty = computed(() => {
  return props.variant === 'required' && isTouched.value && !modelValue.value
})
</script>
