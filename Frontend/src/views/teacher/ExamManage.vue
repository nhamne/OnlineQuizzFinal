<template>
  <div class="w-full h-full flex flex-col gap-10">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <span class="text-3xl font-semibold text-primary-bg">Quản lý đề thi</span>
        <p class="text-sm">Lưu trữ và quản lý hệ thống đề thi tập trung.</p>
      </div>
      <div class="flex gap-3">
        <Button icon="plus" @click="router.push('/teacher/exam-manage/create-exam')"
          >Tạo đề thi mới</Button
        >
        <Button
          variant="secondary"
          icon="magic"
          @click="router.push('/teacher/exam-manage/create-exam-file')"
          >Tạo đề thi từ file</Button
        >
      </div>
    </div>
    <div
      class="w-full grid grid-cols-[2fr_2fr_2fr_1.2fr_auto] gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <!-- Tìm kiếm -->

      <div>
        <span class="text-[13px] font-semibold uppercase">Tìm kiếm đề thi</span>
        <Search placeholder="Tìm kiếm đề thi" class="w-full" />
      </div>
      <!--Lọc theo môn học-->
      <div>
        <span class="text-[13px] font-semibold uppercase">Lọc theo môn học</span>
        <DropdownFilter v-model="selecedSubject" :list="listSubject" />
      </div>
      <!--Lọc theo trạng thái -->
      <div>
        <span class="text-[13px] font-semibold uppercase">Lọc trạng thái</span>
        <DropdownFilter v-model="selecedStatus" :list="listStatus" />
      </div>
      <!--Cấu hình-->

      <div class="flex items-center mt-auto w-full">
        <div
          class="relative flex items-center border border-gray-300 bg-primary/5 h-10.5 rounded-lg w-full"
        >
          <button
            class="flex-1 flex items-center gap-2 justify-center h-full hover:bg-white hover:text-primary/80 transition-colors duration-200 cursor-pointer rounded-l-lg"
          >
            <Icon name="download" size="20"></Icon>
            <span class="text-sm font-medium">Export file</span>
          </button>
          <!-- <button
            class="flex items-center justify-center border-l px-3 py-2.5 bg-primary/5 border-gray-300 hover:bg-white hover:text-primary/80 transition-colors duration-200 cursor-pointer"
          >
            <Icon name="settings" size="20"></Icon>
          </button> -->
          <DropdownFilter
            class="h-full static!"
            type="action"
            v-model="selecedSetting"
            :list="listConfig"
            menu-class="left-0 top-full"
          >
            <template #button="{ toggle, isOpen }">
              <div
                @click="toggle"
                class="flex items-center justify-center border-l border-gray-300 px-2 hover:bg-white hover:text-primary/80 transition-colors duration-200 cursor-pointer rounded-r-lg h-full"
              >
                <Icon name="settings" size="20"></Icon>
              </div>
            </template>
          </DropdownFilter>
        </div>
      </div>
      <Button variant="secondary" custom-class="w-fit h-[42px] mt-auto">
        <Icon name="reload" size="20"></Icon>
      </Button>
    </div>
    <!--Bảng danh sách đề thi-->
    <div class="overflow-x-auto shadow-lg rounded-2xl border border-gray-200">
      <table class="w-full text-left overflow-hidden bg-white">
        <thead>
          <tr class="uppercase text-xs [&>th]:p-4">
            <th class="w-12 p-4 text-center">
              <input
                type="checkbox"
                class="w-4 h-4 cursor-pointer accent-primary rounded border-gray-300"
              />
            </th>
            <th>Tên đề thi</th>
            <th>Môn học</th>
            <th>Trạng thái</th>
            <th class="text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in listExam"
            :key="item.id"
            class="[&>td]:px-4 [&>td]:py-2 border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <td class="w-12 p-4 text-center">
              <input
                type="checkbox"
                class="w-4 h-4 cursor-pointer accent-primary rounded border-gray-300"
              />
            </td>
            <td>
              <div class="flex flex-col gap-1">
                <span class="text-black/80 text-base font-semibold">{{ item.nameExam }}</span>
                <span class="text-gray-400 text-xs uppercase">Thời gian thi: {{ item.time }}</span>
              </div>
            </td>
            <td class="text-sm text-gray-400 font-normal">{{ item.nameSubject }}</td>
            <td>
              <span
                class="px-2 py-1 rounded-full text-[10px] uppercase font-semibold"
                :class="
                  item.status === 'Xuất bản'
                    ? ' bg-green-100/80 text-green-700 '
                    : 'bg-amber-100/80 text-amber-600'
                "
                >{{ item.status }}</span
              >
            </td>
            <td>
              <div class="flex justify-end items-center gap-3">
                <Icon name="eye" size="18"></Icon>
                <!-- <Icon name="edit" size="18"></Icon> -->
                <Icon name="copy" size="18"></Icon>
                <Icon @click="handleDeleteExam(item.id)" name="trash" size="18"></Icon>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PopupConfirm
      v-model="isOpen"
      :message="`Bạn có chắc chắn muốn xóa đề thi ${nameExam} không?`"
      title="Xóa đề thi"
    ></PopupConfirm>
    <!--Tổng quan trang-->
    <div class="grid grid-cols-3 gap-5">
      <div class="flex flex-col gap-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <span class="text-bases text-gray-600">Tổng đề thi: </span>
        <span class="text-black/80 font-bold text-xl">100</span>
      </div>
      <div class="flex flex-col gap-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <span class="text-bases text-gray-600">Phổ biến nhất: </span>
        <span class="text-black/80 font-bold text-xl">Toán</span>
      </div>
      <div class="flex flex-col gap-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <span class="text-bases text-gray-600">Tổng số câu hỏi: </span>
        <span class="text-black/80 font-bold text-xl">100</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from '@/components/custom/Button.vue'
import Search from '@/components/custom/Search.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Icon from '@/components/custom/Icon.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const isOpen = ref(false)
const router = useRouter()
interface Exam {
  id: number
  nameExam?: string
  nameSubject?: string
  status?: string
  time?: string
}

const selecedSubject = ref('all')
const selecedStatus = ref('all')
const selecedSetting = ref('')

const listSubject = [
  {
    key: 'all',
    name: 'Tất cả các môn',
  },
  {
    key: '001',
    name: 'Lập trình Web nâng cao',
  },
  {
    key: '002',
    name: 'Trí tuệ nhân tạo',
  },
  {
    key: '003',
    name: 'Lập trình C++',
  },
  {
    key: '004',
    name: 'Lập trình C#',
  },
  {
    key: '005',
    name: 'Cấu trúc dữ liệu và giải thuật',
  },
]

const listStatus = [
  {
    key: 'all',
    name: 'Tất cả',
  },
  {
    key: 'published',
    name: 'Xuất bản',
  },
  {
    key: 'draft',
    name: 'Bản nháp',
  },
]

const listExam = ref<Exam[]>([
  {
    id: 1,
    nameExam: 'Đề thi 1',
    nameSubject: 'Lập trình Web nâng cao',
    status: 'Xuất bản',
    time: '120 phút',
  },
  {
    id: 2,
    nameExam: 'Đề thi 2',
    nameSubject: 'Trí tuệ nhân tạo',
    status: 'Bản nháp',
    time: '90 phút',
  },
  {
    id: 3,
    nameExam: 'Đề thi 3',
    nameSubject: 'Lập trình C++',
    status: 'Xuất bản',
    time: '60 phút',
  },
  {
    id: 4,
    nameExam: 'Đề thi 4',
    nameSubject: 'Lập trình C#',
    status: 'Bản nháp',
    time: '120 phút',
  },
  {
    id: 5,
    nameExam: 'Đề thi 5',
    nameSubject: 'Cấu trúc dữ liệu và giải thuật',
    status: 'Xuất bản',
    time: '90 phút',
  },
  {
    id: 6,
    nameExam: 'Đề thi 6',
    nameSubject: 'Lập trình Web nâng cao',
    status: 'Bản nháp',
    time: '60 phút',
  },
  {
    id: 7,
    nameExam: 'Đề thi 7',
    nameSubject: 'Trí tuệ nhân tạo',
    status: 'Xuất bản',
    time: '120 phút',
  },
  {
    id: 8,
    nameExam: 'Đề thi 8',
    nameSubject: 'Lập trình C++',
    status: 'Bản nháp',
    time: '90 phút',
  },
  {
    id: 9,
    nameExam: 'Đề thi 9',
    nameSubject: 'Lập trình C#',
    status: 'Xuất bản',
    time: '60 phút',
  },
  {
    id: 10,
    nameExam: 'Đề thi 10',
    nameSubject: 'Cấu trúc dữ liệu và giải thuật',
    status: 'Bản nháp',
    time: '120 phút',
  },
])

const listConfig = ref([
  {
    key: 'delete',
    name: 'Xóa mục đã chọn',
    icon: 'trash',
  },
  {
    key: 'copy',
    name: 'Sao chép nhanh',
    icon: 'copy',
  },
])

const nameExam = ref('')

const handleDeleteExam = (id: number) => {
  nameExam.value = listExam.value.find((item) => item.id === id)?.nameExam || ''
  isOpen.value = true
}
</script>
