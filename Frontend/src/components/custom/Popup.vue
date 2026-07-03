<template>
  <div v-if="isOpen" class="w-full fixed inset-0 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-2xl shadow-2xl" :style="{ width: width }">
      <!--header-->
      <div class="py-6 px-10 border-b border-gray-200 relative">
        <div class="flex gap-4 items-center">
          <div class="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary">
            <Icon :name="icon" color="white" size="24"></Icon>
          </div>
          <span class="text-2xl font-semibold text-black">{{ title }}</span>
        </div>
        <p v-if="desc" class="text-sm font-medium mt-2">
          {{ desc }}
        </p>
        <Icon
          name="x"
          size="24"
          class="absolute top-5 right-4 cursor-pointer"
          @click="isOpen = false"
        ></Icon>
      </div>
      <!--body-->
      <slot name="custom-body">
        <div class="px-6 py-10">
          <span class="text-xs uppercase font-semibold tracking-[1px]">{{ labelInput }}</span>

          <Input
            :placeholder="placeholder"
            class="rounded-lg bg-white"
            v-model="inputValue"
          ></Input>
        </div>
      </slot>
      <!--footer-->
      <div class="p-6 flex gap-3 justify-end bg-primary/5 border-t border-gray-200">
        <slot name="custom-footer">
          <Button variant="secondary" @click="handleCancel" :icon="btnCancelIcon">{{
            btnCancelText
          }}</Button>
          <Button variant="primary" @click="handleAccept" :icon="btnAcceptIcon" size="18">{{
            btnAcceptText
          }}</Button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Input from './Input.vue'
import Icon from './Icon.vue'
import Button from './Button.vue'
const isOpen = defineModel()
const inputValue = defineModel('inputValue', { type: String, default: '' })
const props = defineProps({
  width: {
    type: String,
    default: '450px',
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'home-add',
  },
  btnCancelText: {
    type: String,
    default: 'Hủy',
  },
  btnAcceptText: {
    type: String,
    default: 'Tạo lớp học',
  },
  btnCancelIcon: {
    type: String,
    default: '',
  },
  btnAcceptIcon: {
    type: String,
    default: '',
  },
  labelInput: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['cancel', 'accept'])
const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
const handleAccept = () => {
  emit('accept')
  // isOpen.value = false
}
</script>
