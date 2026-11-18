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
        {{ currentRole === 'teacher' ? 'Giáo viên' : 'Học sinh' }} đăng nhập
      </h1>
      <p class="text-[#334155] mt-2">Đăng nhập để tiếp tục làm việc của bạn</p>
      <!-- Thông báo lỗi -->
      <div v-if="errorMessage" class="mt-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
        {{ errorMessage }}
      </div>
      <!--@submit.prevent: sự kiện chặn load trang -->
      <form @submit.prevent="handleLogin" class="mt-8">
        <div class="flex flex-col items-start gap-2">
          <Input v-model="email" placeholder="name@edu.vn" class="w-full"></Input>
        </div>
        <div class="flex flex-col items-start gap-2 mt-2">
          <Input
            v-model="password"
            placeholder="Mật khẩu"
            variant="password"
            type="password"
            class="w-full"
          ></Input>
        </div>

        <div class="flex items-center justify-between mt-4">
          <label for="remember" class="flex items-center gap-2">
            <input type="checkbox" name="remember" id="" />
            <span class="text-sm text-[#62738b]">Ghi nhớ đăng nhập</span>
          </label>
          <a href="" class="text-[#0369A1] font-medium text-sm">Quên mật khẩu?</a>
        </div>
        <button
          :disabled="isLoading"
          class="flex items-center justify-center gap-1 w-full mt-8 py-4 rounded-xl text-white font-semibold bg-[#0369A1] hover:bg-[#005380] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
        >
          <span v-if="isLoading">Đang xử lý</span>
          <span v-else>Đăng nhập</span>
          <Icon :name="isLoading ? 'loading' : 'arrow-right'" color="white" size="24" />
        </button>
      </form>
      <div class="mt-6 flex justify-center items-center gap-2 text-sm">
        <span>Chưa có tài khoản? </span>
        <router-link to="/auth/register" class="text-[#0369A1] font-semibold"
          >Đăng ký ngay</router-link
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
import { type Ref, inject, ref } from 'vue'
import Input from '@/components/custom/Input.vue'
import { useRouter } from 'vue-router'
import { loginApi } from '@/api/auth.api'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const errorMessage = ref('')
const isLoading = ref(false)

const currentRole = inject<Ref<'student' | 'teacher'>>('authrole')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    // truyền mail và password sang file auth.api.ts để thực hiện http rquest gọi len BE. Luồng thực thi sẽ tạm dừng tại đây cho đến khi Server trả về kết quả
    const data = await loginApi(email.value, password.value)
    if (currentRole && data.user.role !== currentRole.value) {
      const roleName = data.user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'
      throw new Error(`Tài khoản này là của ${roleName}. Vui lòng chuyển đúng tab`)
    }
    // nếu không có lỗi thì gọi đến hàm setAuth của file authStore.ts để đẩy thông tin người dùng vào RAM và lưu vào localStorage để duy trì phiên đăng nhập khi F5
    authStore.setAuth(data.user, data.token)
    if (data.user.role === 'teacher') {
      router.push('/teacher/dashboard')
    } else if (data.user.role === 'student') {
      router.push('/student/dashboard')
    }
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>
