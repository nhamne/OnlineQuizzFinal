<template>
  <!--Header-->
  <div class="w-full flex flex-col pb-8 sm:pb-10">
    <div class="w-full rounded-2xl overflow-hidden h-fit bg-white shadow-sm border border-gray-100">
      <div class="w-full h-36 sm:h-48 md:h-60 overflow-hidden relative">
        <img
          class="w-full h-full object-cover object-[50%_70%]"
          src="https://cdn-media.sforum.vn/storage/app/media/ctvseo_maihue/hinh-nen-1920-1080/hinh-nen-1920-1080-63.jpg"
          alt="Profile banner"
        />
      </div>
      <div class="-mt-14 sm:-mt-16 md:-mt-20 w-full px-4 sm:px-6 md:px-10 relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-5 pb-5">
        <div
          class="group w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full relative bg-white shadow-md p-1.5 cursor-pointer z-20 shrink-0"
          @click="triggerFileInput"
        >
          <input type="file" class="hidden" ref="fileInput" />
          <img
            src="https://img.meta.com.vn/Data/image/2021/09/22/anh-meo-cute-de-thuong-dang-yeu-16.jpg"
            class="w-full h-full object-cover rounded-full"
          />
          <!-- Lớp phủ đen sẽ hiện lên khi hover vào container (group) -->
          <div
            class="absolute inset-1.5 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Icon name="camera" color="white" size="26" />
          </div>
        </div>
        <div class="mt-2 sm:mt-8 md:mt-16 flex-1 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 w-full text-center sm:text-left sm:pb-1">
          <div class="flex flex-col gap-0.5 sm:gap-1">
            <div class="text-xl sm:text-2xl font-bold text-primary/90">Nguyễn Văn A</div>
            <div class="text-xs sm:text-sm font-medium text-gray-500">
              {{ currentRole == 'student' ? 'Sinh viên' : 'Giáo viên' }}
            </div>
          </div>
          <div class="w-full sm:w-auto flex items-center justify-center">
            <Button color="secondary" icon="save" class="w-full sm:w-auto" @click="checkValidate()">Lưu thay đổi</Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-2 sm:gap-5 mt-4 sm:mt-5 border-b border-gray-200">
      <div
        @click="currentTab = 'personal'"
        :class="
          currentTab == 'personal'
            ? 'text-secondary border-secondary font-bold'
            : 'border-transparent text-gray-500 hover:text-secondary font-medium'
        "
        class="flex-1 sm:flex-none justify-center py-3 px-3 sm:px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer text-sm sm:text-base -mb-[2px]"
      >
        <Icon name="user-line" size="20" />
        <span class="whitespace-nowrap">Thông tin cá nhân</span>
      </div>
      <div
        @click="currentTab = 'security'"
        :class="
          currentTab == 'security'
            ? 'text-secondary border-secondary font-bold'
            : 'border-transparent text-gray-500 hover:text-secondary font-medium'
        "
        class="flex-1 sm:flex-none justify-center border-b-2 py-3 px-3 sm:px-4 flex items-center gap-2 transition-all cursor-pointer text-sm sm:text-base -mb-[2px]"
      >
        <Icon name="lock" size="20" />
        <span class="whitespace-nowrap">Bảo mật</span>
      </div>
    </div>

    <!-- Tab Thông tin cá nhân -->
    <div
      v-show="currentTab === 'personal'"
      class="flex flex-col mt-4 sm:mt-5 p-4 sm:p-6 rounded-2xl bg-white shadow-sm border border-gray-100"
    >
      <div class="font-bold text-base sm:text-[17px] text-black/90">Thông tin cá nhân</div>
      <div class="text-xs sm:text-sm mt-0.5 text-gray-500">Cập nhật thông tin cá nhân của bạn</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 mt-4">
        <div>
          <div class="text-black/80 font-medium text-xs sm:text-sm mb-1.5">Họ</div>
          <Input v-model="firstName" placeholder="Nhập họ của bạn" variant="required"></Input>
        </div>
        <div>
          <div class="text-black/80 font-medium text-xs sm:text-sm mb-1.5">Tên</div>
          <Input v-model="lastName" placeholder="Nhập tên của bạn" variant="required"></Input>
        </div>
        <div>
          <div class="text-black/80 font-medium text-xs sm:text-sm mb-1.5">Ngày sinh</div>
          <DatePicker
            v-model="dateOfBirth"
            :enableTimePicker="false"
            placeholder="Nhập ngày sinh"
          />
        </div>
        <div>
          <div class="text-black/80 font-medium text-xs sm:text-sm mb-1.5">Giới tính</div>
          <DropdownFilter v-model="gender" :list="genderList"></DropdownFilter>
        </div>
        <div>
          <div class="text-black/80 font-medium text-xs sm:text-sm mb-1.5">Số điện thoại</div>
          <Input v-model="phoneNumber" placeholder="Nhập số điện thoại" variant="required"></Input>
        </div>
        <div>
          <div class="text-black/80 font-medium text-xs sm:text-sm mb-1.5">Email</div>
          <Input v-model="email" placeholder="Nhập email" variant="required"></Input>
        </div>
      </div>
    </div>

    <!-- Tab Bảo mật -->
    <div
      v-show="currentTab === 'security'"
      class="flex flex-col mt-4 sm:mt-5 p-4 sm:p-6 rounded-2xl bg-white shadow-sm border border-gray-100"
    >
      <div class="font-bold text-base sm:text-[17px] text-black/90">Đổi mật khẩu</div>
      <div class="text-xs sm:text-sm mt-0.5 text-gray-500">Cập nhật mật khẩu mới</div>
      <div class="flex flex-col gap-3.5 sm:gap-5 mt-4">
        <div>
          <div class="text-black/80 font-medium text-xs sm:text-sm mb-1.5">Mật khẩu hiện tại</div>
          <Input
            v-model="currentPassword"
            placeholder="Nhập mật khẩu hiện tại của bạn"
            variant="password"
            type="password"
          ></Input>
        </div>
        <div>
          <div class="text-black/80 font-medium text-xs sm:text-sm mb-1.5">Mật khẩu mới</div>
          <Input
            v-model="newPassword"
            placeholder="Nhập mật khẩu mới"
            variant="password"
            type="password"
            message="Mật khẩu mới"
          ></Input>
        </div>
        <div>
          <div class="text-black/80 font-medium text-xs sm:text-sm mb-1.5">Xác nhận mật khẩu mới</div>
          <Input
            v-model="confirmPassword"
            placeholder="Xác nhận mật khẩu mới"
            variant="password"
            type="password"
          ></Input>
        </div>
      </div>
    </div>
    <!-- <input type="file" class="outline-none w-full" placeholder="xinchao" /> -->
    <ToastMessage
      v-model="isOpenToastMessage"
      type="warning"
      label="Cảnh báo"
      content="Vui lòng nhập đủ thông tin!"
    ></ToastMessage>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/custom/Icon.vue'
import Button from '@/components/custom/Button.vue'
import Input from '@/components/custom/Input.vue'
import DatePicker from '@/components/custom/DatePicker.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import { type Ref, inject, ref } from 'vue'
import ToastMessage from '@/components/custom/ToastMessage.vue'

const currentRole = inject<Ref<'student' | 'teacher'>>('authrole')

const currentTab = ref('personal')

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const dateOfBirth = ref(new Date())

const isOpenToastMessage = ref<boolean>(false)

const checkValidate = () => {
  if (
    firstName.value.trim() === '' ||
    lastName.value.trim() === '' ||
    email.value.trim() === '' ||
    phoneNumber.value.trim() === ''
  ) {
    isOpenToastMessage.value = true
  }
}

const gender = ref('male')
const genderList = ref([
  { name: 'Nam', key: 'male' },
  { name: 'Nữ', key: 'female' },
  { name: 'Khác', key: 'other' },
])

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
</script>
