<template>
  <div class="w-full h-screen relative overflow-hidden bg-slate-50 sm:bg-transparent">
    <!-- Background Image: Hidden on mobile, shown on desktop -->
    <img
      src="/src/assets/images/bg-admin-login-2.png"
      alt="Admin login background"
      class="hidden sm:block w-full h-full object-cover"
    />

    <!-- Login Container: Card with background, border, shadow on mobile only; original look on desktop -->
    <div
      class="absolute top-1/2 -translate-y-1/2 left-4 right-4 sm:left-auto sm:right-1/6 max-w-md mx-auto sm:max-w-none sm:mx-0 p-6 sm:p-0 bg-white sm:bg-transparent rounded-2xl sm:rounded-none shadow-xl sm:shadow-none border border-gray-100 sm:border-none"
    >
      <div class="text-3xl sm:text-4xl text-primary-bg font-bold">Đăng nhập</div>
      <div class="mt-1 text-sm sm:text-base font-normal text-gray-600 sm:text-black">
        Đăng nhập để quản lý và giám sát hoạt động hệ thống.
      </div>
      <div class="mt-4 font-semibold text-primary-bg">Email</div>
      <Input placeholder="Nhập email" class="w-full sm:w-110 mt-1" v-model="userName"></Input>
      <div class="mt-3 font-semibold text-primary-bg">Mật khẩu</div>
      <Input
        placeholder="Nhập mật khẩu"
        class="w-full sm:w-110 mt-1"
        v-model="passWord"
        variant="password"
      ></Input>
      <Button class="mt-6 sm:mt-8 w-full sm:w-40">Đăng nhập</Button>
    </div>
  </div>
</template>

<script setup>
import Icon from '@/components/custom/Icon.vue'
import { ref, inject, computed } from 'vue'
import Input from '@/components/custom/Input.vue'
import Button from '@/components/custom/Button.vue'

const currentRole = inject('authrole')
const userName = ref('')
const passWord = ref('')
</script>
