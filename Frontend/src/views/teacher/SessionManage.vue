<template>
  <div class="w-full h-full flex flex-col gap-10">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <span class="text-3xl font-semibold text-primary-bg">Danh sách ca thi</span>
        <span class="text-sm"
          >Tổng số ca thi:
          <span class="font-semibold text-black/80">{{ listSession.length }}</span></span
        >
      </div>
      <Button icon="plus" @click="isOpen = true">Tạo ca thi mới</Button>
    </div>
    <div
      class="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <!-- Tìm kiếm -->

      <div class="w-[40%]">
        <span class="text-[13px] font-semibold uppercase">Tìm kiếm lớp học</span>
        <Search placeholder="Tìm kiếm lớp học" class="w-full" />
      </div>
      <!--Lọc theo sĩ số-->
      <div class="w-[25%]">
        <span class="text-[13px] font-semibold uppercase">Lọc theo trạng thái</span>
        <DropdownFilter v-model="selectedStatus" :list="listStatus" />
      </div>
      <!--Sắp xếp -->
      <div class="w-[25%]">
        <span class="text-[13px] font-semibold uppercase">Sắp xếp</span>
        <DropdownFilter v-model="selectedSort" :list="listSort" />
      </div>
      <Button variant="secondary" custom-class="w-fit h-[42px] mt-auto">
        <Icon name="reload" size="20"></Icon>
      </Button>
    </div>
    <!--Danh sách ca thi-->
    <div class="pb-6">
      <div class="flex flex-col gap-4">
        <!-- Header -->
        <div
          class="grid grid-cols-[2fr_4fr_2fr_1.5fr] gap-4 px-6 text-[11px] uppercase text-gray-500 font-bold tracking-wider"
        >
          <div>Tên ca thi / Đề thi</div>
          <div>Lớp học</div>
          <div>Trạng thái</div>
          <div class="text-center">Thao tác</div>
        </div>

        <!-- Rows -->
        <div class="flex flex-col gap-4">
          <div
            v-for="item in listSession"
            :key="item.id"
            class="grid grid-cols-[2fr_4fr_2fr_1.5fr] gap-4 items-center bg-white px-7 py-10 rounded-2xl shadow hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <!-- Tên ca thi -->
            <div class="flex items-center gap-3">
              <div
                class="text-blue-500 shrink-0 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-lg"
              >
                <Icon name="calendar-alt"></Icon>
              </div>
              <span class="text-black/80 text-[15px] font-bold">{{ item.nameSession }}</span>
            </div>

            <!-- Lớp học -->
            <div>
              <span class="text-black/70 text-[14px] font-semibold">{{ item.nameClass }}</span>
            </div>

            <!-- Trạng thái -->
            <div>
              <span
                class="px-3 py-1.5 rounded-full text-xs font-bold"
                :class="{
                  'bg-green-100 text-green-700': item.status === 'Đang diễn ra',
                  'bg-yellow-100 text-yellow-600': item.status === 'Sắp diễn ra',
                  'bg-gray-100 text-gray-500': item.status === 'Đã kết thúc',
                }"
                >{{ item.status }}</span
              >
            </div>

            <!-- Hành động -->
            <div class="flex justify-center items-center gap-2">
              <Icon
                name="chart"
                size="20"
                class="hover:text-blue transition-all duration-300 cursor-pointer"
              ></Icon>
              <Icon
                @click="isOpenDrawer"
                name="eye"
                size="20"
                class="hover:text-green-700 transition-all duration-300 cursor-pointer"
              ></Icon>
              <Icon
                name="edit"
                size="20"
                class="hover:text-yellow-700 transition-all duration-300 cursor-pointer"
              ></Icon>
              <Icon
                @click="handleDeleteSession(item.id)"
                name="trash"
                size="20"
                class="hover:text-red-700 transition-all duration-300 cursor-pointer"
              ></Icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Popup
      v-model="isOpen"
      v-model:inputValue="nameSession"
      title="Tạo ca thi mới"
      width="800px"
      icon="calendar-alt"
      labelInput="Tên ca thi (bắt buộc)"
      placeholder="Ví dụ: Lập trình Web nâng cao - D18CNPM1"
      btnAcceptText="Xem trước ca thi"
      @accept="handlePreviewExam"
    >
      <template #custom-body>
        <div class="w-full h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar px-6 py-8">
          <!--Thông tin cơ bản-->
          <div class="flex items-center gap-2 text-secondary">
            <Icon name="info-circle-fill" size="20"></Icon>
            <span class="uppercase text-sm font-semibold">Thông tin cơ bản</span>
          </div>
          <div class="mt-3">
            <span class="text-[13px] font-semibold uppercase tracking-wider"
              >Tên ca thi <span class="text-red-600">*</span></span
            >
            <Input variant="required" class="rounded-lg" placeholder="Ví dụ: Kiểm tra cuối kỳ" />
          </div>
          <div class="grid grid-cols-3 gap-4 mt-3">
            <div>
              <span class="text-[13px] font-semibold uppercase tracking-wider">Môn thi</span>
              <DropdownFilter v-model="selectedSubject" :list="listSubject" />
            </div>
            <div>
              <span class="text-[13px] font-semibold uppercase tracking-wider">Đề thi</span>
              <DropdownFilter v-model="selectedExam" :list="listExam" />
            </div>
            <div>
              <span class="text-[13px] font-semibold uppercase">Lớp thi</span>
              <DropdownFilter v-model="selectedClass" :list="listClass" />
            </div>
          </div>
          <div class="flex items-center gap-2 text-secondary mt-8">
            <Icon name="alarm-fill" size="20"></Icon>
            <span class="uppercase text-sm font-semibold">Thời gian</span>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-3">
            <div>
              <span class="text-[13px] font-semibold uppercase tracking-wider">Giờ bắt đầu</span>
              <DatePicker placeholder="dd/mm/yyyy, --:-- --" />
            </div>
            <div>
              <span class="text-[13px] font-semibold uppercase tracking-wider">Giờ kết thúc</span>
              <DatePicker placeholder="dd/mm/yyyy, --:-- --" />
            </div>
          </div>
          <div class="flex items-center gap-2 text-secondary mt-8">
            <Icon name="lock-fill" size="20"></Icon>
            <span class="uppercase text-sm font-semibold">Bảo mật và hiển thị</span>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-3">
            <div>
              <span class="text-[13px] font-semibold uppercase tracking-wider"
                >Mật khẩu ca thi (tùy chọn)</span
              >
              <Input placeholder="Nhập mã bảo mật" />
            </div>
            <div>
              <span class="text-[13px] font-semibold uppercase tracking-wider"
                >Cấu hình ca thi</span
              >
              <div
                class="mt-2 flex flex-col gap-2 bg-primary/5 px-4 py-3 rounded-2xl border border-gray-300"
              >
                <Checkbox v-model="isChecked1">Xem chi tiết bài làm</Checkbox>
                <Checkbox v-model="isChecked2">Đảo câu hỏi và đáp án</Checkbox>
                <Checkbox v-model="isChecked3">Cho phép thi lại</Checkbox>
                <Checkbox v-model="isChecked4">Hiển thị điểm số và lời giải</Checkbox>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-[13px] font-semibold uppercase tracking-wider"
              >Ghi chú (tùy chọn)</span
            >
            <textarea
              v-model="note"
              class="mt-2 h-25 outline-none px-3 py-2 border border-gray-300 rounded-lg bg-primary/5 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.15)] focus-within:bg-primary/5"
              placeholder="Ví dụ: Học sinh được phép sử dụng máy tính bỏ túi..."
            />
          </div>
        </div>
      </template>
    </Popup>

    <PopupConfirm
      v-model="isOpenPopupConfirm"
      :message="`Bạn có chắc chắn muốn xóa ca thi ${nameSession} không?`"
      title="Xóa ca thi"
    ></PopupConfirm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/custom/Button.vue'
import Search from '@/components/custom/Search.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Icon from '@/components/custom/Icon.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'
import Popup from '@/components/custom/Popup.vue'
import Input from '@/components/custom/Input.vue'
import DatePicker from '@/components/custom/DatePicker.vue'
import Checkbox from '@/components/custom/Checkbox.vue'

const selectedStatus = ref<string>('all')
const selectedSort = ref<string>('all')
const isChecked1 = ref(false)
const isChecked2 = ref(false)
const isChecked3 = ref(false)
const isChecked4 = ref(false)
const isOpenDrawer = ref(false)
const note = ref<string>('')

const listStatus = [
  { name: 'Tất cả', key: 'all' },
  { name: 'Sắp diễn ra', key: 'upcoming' },
  { name: 'Đang diễn ra', key: 'running' },
  { name: 'Đã kết thúc', key: 'finished' },
]

const listSort = [
  { name: 'Mới nhất', key: 'newest' },
  { name: 'Cũ nhất', key: 'oldest' },
  { name: 'Tên A-Z', key: 'atoz' },
  { name: 'Nhiều bài nộp nhất', key: 'much' },
  { name: 'Ít bài nộp nhất', key: 'little' },
]

const listSession = [
  {
    id: 1,
    nameClass: 'Lập trình Web nâng cao - D18CNPM1',
    nameSession: 'Test 01',
    status: 'Đang diễn ra',
    quantity: 28,
  },
  {
    id: 2,
    nameClass: 'Lập trình Web nâng cao - D18CNPM1',
    nameSession: 'Test 01',
    status: 'Đã kết thúc',
    quantity: 28,
  },
  {
    id: 3,
    nameClass: 'Lập trình Web nâng cao - D18CNPM1',
    nameSession: 'Test 01',
    status: 'Sắp diễn ra',
    quantity: 28,
  },
  {
    id: 4,
    nameClass: 'Lập trình Web nâng cao - D18CNPM1',
    nameSession: 'Test 01',
    status: 'Đang diễn ra',
    quantity: 28,
  },
  {
    id: 5,
    nameClass: 'Lập trình Web nâng cao - D18CNPM1',
    nameSession: 'Test 01',
    status: 'Đã kết thúc',
    quantity: 28,
  },
]
const isOpen = ref(false)
const isOpenPopupConfirm = ref<boolean>(false)
const nameSession = ref<string>('')

const handleDeleteSession = (id: number) => {
  isOpenPopupConfirm.value = true
  const session = listSession.find((item) => item.id === id)
  nameSession.value = session?.nameSession || ''
}

const selectedSubject = ref<string>('all')
const selectedExam = ref<string>('select')
const selectedClass = ref<string>('select')

const listSubject = [
  {
    key: 'all',
    name: 'Tất cả môn học',
  },
  {
    key: '1',
    name: 'Lập trình Web nâng cao',
  },
  {
    key: '2',
    name: 'Học máy cơ bản',
  },
  {
    key: '3',
    name: 'Kiến trúc máy tính',
  },
]
const listExam = [
  {
    key: 'select',
    name: 'Chọn đề thi từ thư viện',
  },
  {
    key: '1',
    name: 'Đề thi 01',
  },
  {
    key: '2',
    name: 'Đề thi 02',
  },
  {
    key: '3',
    name: 'Đề thi 03',
  },
]

const listClass = [
  {
    key: 'select',
    name: 'Chọn lớp học',
  },
  {
    key: '1',
    name: 'D18CNPM1',
  },
  {
    key: '2',
    name: 'D18CNPM2',
  },
  {
    key: '3',
    name: 'D18CNPM3',
  },
]

const isOpenPreviewExam = ref<boolean>(false)

const handlePreviewExam = () => {
  
}
</script>
