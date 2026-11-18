<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
        :style="{ maxWidth: width }"
      >
        <!--header-->
        <div class="py-3.5 px-4 sm:py-4 sm:px-6 border-b border-gray-200 relative shrink-0">
          <div class="flex gap-3 sm:gap-4 items-center pr-8">
            <div class="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl bg-secondary shrink-0">
              <Icon :name="icon" color="white" size="22"></Icon>
            </div>
            <div class="min-w-0">
              <span class="text-lg sm:text-xl font-bold sm:font-semibold text-black block truncate">{{ title }}</span>
              <p v-if="desc" class="text-xs sm:text-sm text-gray-500 truncate">
                {{ desc }}
              </p>
            </div>
          </div>

          <Icon
            name="x"
            size="22"
            class="absolute top-4 right-3 sm:top-5 sm:right-4 cursor-pointer text-gray-400 hover:text-gray-700 transition-colors"
            @click="isOpen = false"
          ></Icon>
        </div>
        <!--body-->
        <slot name="custom-body">
          <div class="px-4 py-6 sm:px-6 sm:py-10">
            <span class="text-xs uppercase font-semibold tracking-[1px] block mb-2">{{ labelInput }}</span>

            <Input
              :placeholder="placeholder"
              class="rounded-lg bg-white"
              v-model="inputValue"
            ></Input>
          </div>
        </slot>
        <!--footer-->
        <div class="p-3.5 sm:p-6 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 justify-end bg-primary/5 border-t border-gray-200 shrink-0">
          <slot name="custom-footer">
            <Button variant="secondary" class="w-full sm:w-auto" @click="handleCancel" :icon="btnCancelIcon">{{
              btnCancelText
            }}</Button>
            <Button variant="primary" class="w-full sm:w-auto" @click="handleAccept" :icon="btnAcceptIcon" size="18">{{
              btnAcceptText
            }}</Button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
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
