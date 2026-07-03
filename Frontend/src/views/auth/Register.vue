<template>
  <div class="w-[50%]">
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
    <div class="w-full">
      <h1 class="mt-8 font-semibold text-3xl text-[#001e2f]">
        Tạo tài khoản {{ currentRole === 'teacher' ? 'Giáo viên' : 'Học sinh' }}
      </h1>
      <p class="text-[#334155] mt-2">Hoàn tất thông tin để bắt đầu sử dụng hệ thống.</p>
      <form action="" class="mt-8">
        <div class="flex flex-col items-start gap-2">
          <label for="fullName" class="font-semibold text-xs text-[#62738B] uppercase"
            >Họ và tên</label
          >
          <input
            type="text"
            id="fullName"
            class="w-full border border-[#a0b0c6] rounded-lg px-4 py-3 outline-none focus:border-[#0369A1]"
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div class="flex flex-col items-start gap-2 mt-2">
          <label for="email" class="font-semibold text-xs text-[#62738B] uppercase">Email</label>
          <input
            type="email"
            id="email"
            class="w-full border border-[#a0b0c6] rounded-lg px-4 py-3 outline-none focus:border-[#0369A1]"
            placeholder="name@edu.vn"
          />
        </div>
        <div class="flex flex-col items-start gap-2 mt-2">
          <label for="password" class="font-semibold text-xs text-[#62738B] uppercase"
            >Mật khẩu</label
          >
          <input
            type="password"
            id="password"
            class="w-full border border-[#a0b0c6] rounded-lg px-4 py-3 outline-none focus:border-[#0369A1]"
            placeholder="••••••••"
          />
        </div>
        <div class="flex flex-col items-start gap-2 mt-2">
          <label for="confirmPassword" class="font-semibold text-xs text-[#62738B] uppercase"
            >Xác nhận mật khẩu</label
          >
          <input
            type="password"
            id="confirmPassword"
            class="w-full border border-[#a0b0c6] rounded-lg px-4 py-3 outline-none focus:border-[#0369A1]"
            placeholder="••••••••"
          />
        </div>
      </form>

      <button
        class="flex items-center justify-center gap-1 w-full mt-8 py-4 rounded-xl text-white font-semibold bg-[#0369A1] hover:bg-[#005380] transition-colors duration-300"
        :type="'submit'"
      >
        Tạo tài khoản
        <Icon name="arrow-right" color="white" size="24" />
      </button>
      <div class="mt-6 flex justify-center items-center gap-2 text-sm">
        <span>Đã có tài khoản? </span>
        <router-link to="/auth/login" class="text-[#0369A1] font-semibold"
          >Đăng nhập ngay</router-link
        >
      </div>
      <div class="mt-6 text-[#9298a0] uppercase text-xs tracking-widest text-center">
        Nền tảng thi trực tuyến
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/custom/Icon.vue'
import { type Ref, inject } from 'vue'

const currentRole = inject<Ref<'student' | 'teacher'>>('authrole')
</script>
