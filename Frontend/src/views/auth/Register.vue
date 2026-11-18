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
      <div v-if="errorMessage" class="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="handleRegister" class="mt-8">
        <div class="flex flex-col items-start gap-2">
          <label for="fullName" class="font-semibold text-xs text-[#62738B] uppercase"
            >Họ và tên</label
          >
          <!-- <input
            type="text"
            id="fullName"
            class="w-full border border-[#a0b0c6] rounded-lg px-4 py-3 outline-none focus:border-[#0369A1]"
            placeholder="Nguyễn Văn A"
          /> -->
          <Input v-model="fullName" placeholder="Nguyễn Văn A" class="w-full"></Input>
        </div>
        <div class="flex flex-col items-start gap-2 mt-2">
          <label for="email" class="font-semibold text-xs text-[#62738B] uppercase">Email</label>
          <!-- <input
            type="email"
            id="email"
            class="w-full border border-[#a0b0c6] rounded-lg px-4 py-3 outline-none focus:border-[#0369A1]"
            placeholder="name@edu.vn"
          /> -->
          <Input v-model="email" placeholder="name@edu.vn" class="w-full"></Input>
        </div>
        <div class="flex flex-col items-start gap-2 mt-2">
          <label for="password" class="font-semibold text-xs text-[#62738B] uppercase"
            >Mật khẩu</label
          >
          <!-- <input
            type="password"
            id="password"
            class="w-full border border-[#a0b0c6] rounded-lg px-4 py-3 outline-none focus:border-[#0369A1]"
            placeholder="••••••••"
          /> -->
          <Input
            v-model="password"
            placeholder="••••••••"
            variant="password"
            type="password"
            class="w-full"
          ></Input>
        </div>
        <div class="flex flex-col items-start gap-2 mt-2">
          <label for="confirmPassword" class="font-semibold text-xs text-[#62738B] uppercase"
            >Xác nhận mật khẩu</label
          >
          <!-- <input
            type="password"
            id="confirmPassword"
            class="w-full border border-[#a0b0c6] rounded-lg px-4 py-3 outline-none focus:border-[#0369A1]"
            placeholder="••••••••"
          /> -->
          <Input
            v-model="confirmPassword"
            placeholder="••••••••"
            variant="password"
            type="password"
            class="w-full"
          ></Input>
        </div>

        <button
          :disabled="isLoading"
          class="flex items-center justify-center gap-1 w-full mt-8 py-4 rounded-xl text-white font-semibold bg-[#0369A1] hover:bg-[#005380] transition-colors duration-300"
          :type="'submit'"
        >
          {{ isLoading ? 'Đang xử lý...' : 'Tạo tài khoản' }}
          <Icon :name="isLoading ? 'loading' : 'arrow-right'" color="white" size="24" />
        </button>
      </form>
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
    <ToastMessage
      v-model="isOpenToastMessage"
      type="success"
      label="Đăng ký thành công"
      content="Vui lòng đăng nhập lại!"
    ></ToastMessage>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/custom/Icon.vue'
import Input from '@/components/custom/Input.vue'
import ToastMessage from '@/components/custom/ToastMessage.vue'
import { type Ref, inject, ref } from 'vue'
import { registerApi } from '@/api/auth.api'
import { useRouter } from 'vue-router'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const currentRole = inject<Ref<'student' | 'teacher'>>('authrole')
const isOpenToastMessage = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp. Vui lòng nhập lại'
    return
  }
  isLoading.value = true
  errorMessage.value = ''

  try {
    await registerApi(email.value, password.value, fullName.value, currentRole?.value || 'student')
    isOpenToastMessage.value = true
    router.push('/auth/login')
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>
