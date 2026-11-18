<template>
  <div class="w-full h-full pb-8 sm:pb-10">
    <div class="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex flex-col gap-1">
        <span class="text-2xl sm:text-3xl font-semibold text-primary-bg">Danh sách đề thi</span>
        <p class="text-xs sm:text-sm text-gray-500">Lưu trữ và quản lý hệ thống đề thi tập trung.</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
        <Button
          icon="plus"
          class="w-full sm:w-auto"
          @click="router.push('/teacher/exam-manage/create-exam')"
        >
          Tạo đề thi thủ công
        </Button>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            icon="magic"
            class="flex-1 sm:w-auto text-xs sm:text-sm whitespace-nowrap"
            @click="router.push('/teacher/exam-manage/create-exam-file')"
          >
            <span class="hidden sm:inline">Tạo đề thi </span>từ file
          </Button>
          <Button
            variant="secondary"
            icon="database"
            class="flex-1 sm:w-auto text-xs sm:text-sm whitespace-nowrap"
            @click="router.push('/teacher/exam-manage/create-exam-question')"
          >
            <span class="hidden sm:inline">Tạo </span>từ ngân hàng<span class="hidden sm:inline"> câu hỏi</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Thanh tìm kiếm & lọc & hành động -->
    <div class="mt-4 sm:mt-6 w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
      <!-- Row 1 trên mobile: Tìm kiếm + Nút reload -->
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <Search placeholder="Tìm kiếm đề thi..." class="flex-1 min-w-0" />
        <Button
          variant="secondary"
          custom-class="w-[42px] h-[42px] p-0 shrink-0 mt-2 flex items-center justify-center sm:hidden"
        >
          <Icon name="reload" size="20"></Icon>
        </Button>
      </div>

      <!-- Row 2 trên mobile: Lọc môn + Lọc trạng thái + Export/Settings + Reload trên desktop -->
      <div class="flex items-center gap-2 shrink-0">
        <DropdownFilter
          icon="book"
          class="flex-1 sm:w-40 lg:w-44 shrink-0 min-w-0"
          v-model="selecedSubject"
          :list="listSubject"
        />
        <DropdownFilter
          icon="clock"
          class="flex-1 sm:w-36 lg:w-40 shrink-0 min-w-0"
          v-model="selecedStatus"
          :list="listStatus"
        />

        <!-- Export & Settings -->
        <div class="flex items-center mt-2 shrink-0">
          <div
            class="relative flex items-center border border-gray-300 bg-primary/5 h-10.5 rounded-lg"
          >
            <button
              class="px-3 sm:px-4 flex items-center gap-1.5 justify-center h-full bg-white hover:bg-white/60 hover:text-primary/80 transition-colors duration-200 cursor-pointer rounded-l-lg"
              title="Xuất file"
            >
              <Icon name="download" size="20"></Icon>
              <span class="text-sm font-medium hidden md:inline">Export file</span>
            </button>
            <DropdownFilter
              class="h-full static!"
              type="action"
              v-model="selecedSetting"
              :list="listConfig"
              menu-class="!w-max !min-w-[195px] [&_span]:whitespace-nowrap right-0 top-full"
            >
              <template #button="{ toggle, isOpen }">
                <div
                  @click="toggle"
                  class="flex items-center justify-center border-l border-gray-300 px-3 bg-white hover:bg-white/60 hover:text-primary/80 transition-colors duration-200 cursor-pointer rounded-r-lg h-full"
                >
                  <Icon name="settings" size="20"></Icon>
                </div>
              </template>
            </DropdownFilter>
          </div>
        </div>

        <!-- Reload trên màn hình sm trở lên -->
        <Button
          variant="secondary"
          custom-class="w-[42px] h-[42px] p-0 shrink-0 mt-2 hidden sm:flex items-center justify-center"
        >
          <Icon name="reload" size="20"></Icon>
        </Button>
      </div>
    </div>

    <!-- Bảng danh sách đề thi -->
    <div class="mt-6 sm:mt-8 overflow-x-auto shadow-lg rounded-2xl border border-gray-200 bg-white">
      <table class="w-full min-w-[620px] text-left">
        <thead>
          <tr class="uppercase text-xs text-gray-500 [&>th]:px-4 [&>th]:py-3.5 whitespace-nowrap bg-gray-50/70 border-b border-gray-200">
            <th class="w-12 text-center">
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
            @click="router.push(`/teacher/exam-manage/${item.id}`)"
            class="[&>td]:px-4 [&>td]:py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <td class="w-12 text-center" @click.stop>
              <input
                type="checkbox"
                class="w-4 h-4 cursor-pointer accent-primary rounded border-gray-300"
              />
            </td>
            <td>
              <div class="flex flex-col gap-0.5">
                <span class="text-black/80 text-sm sm:text-base font-semibold whitespace-nowrap">{{ item.nameExam }}</span>
                <span class="text-gray-400 text-[11px] sm:text-xs uppercase whitespace-nowrap">Thời gian thi: {{ item.time }}</span>
              </div>
            </td>
            <td class="text-sm text-gray-600 font-normal whitespace-nowrap">{{ item.nameSubject }}</td>
            <td class="whitespace-nowrap">
              <span
                class="px-2.5 py-1 rounded-full text-[11px] uppercase font-semibold whitespace-nowrap"
                :class="
                  item.status === 'Xuất bản'
                    ? ' bg-green-100/80 text-green-700 '
                    : 'bg-amber-100/80 text-amber-600'
                "
                >{{ item.status }}</span
              >
            </td>
            <td class="whitespace-nowrap">
              <div class="flex justify-end items-center gap-3">
                <button
                  type="button"
                  @click.stop="router.push(`/teacher/exam-manage/${item.id}`)"
                  class="text-gray-500 hover:text-primary transition-colors cursor-pointer"
                  title="Xem chi tiết đề thi"
                >
                  <Icon name="eye" size="18"></Icon>
                </button>
                <button
                  type="button"
                  @click.stop
                  class="text-gray-500 hover:text-primary transition-colors cursor-pointer"
                  title="Sao chép"
                >
                  <Icon name="copy" size="18"></Icon>
                </button>
                <button type="button" @click.stop="handleDeleteExam(item.id)" class="text-gray-500 hover:text-red-500 transition-colors cursor-pointer" title="Xóa">
                  <Icon name="trash" size="18"></Icon>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PopupConfirm
      v-model="isOpen"
      variant="warning"
      :message="`Bạn có chắc chắn muốn xóa đề thi ${nameExam} không?`"
      title="Xóa đề thi"
    ></PopupConfirm>

    <!-- Tổng quan trang -->
    <div class="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
      <div class="flex flex-col gap-1 sm:gap-2 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200">
        <span class="text-sm sm:text-base text-gray-600">Tổng đề thi: </span>
        <span class="text-black/80 font-bold text-xl sm:text-2xl">100</span>
      </div>
      <div class="flex flex-col gap-1 sm:gap-2 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200">
        <span class="text-sm sm:text-base text-gray-600">Phổ biến nhất: </span>
        <span class="text-black/80 font-bold text-xl sm:text-2xl">Toán</span>
      </div>
      <div class="flex flex-col gap-1 sm:gap-2 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200">
        <span class="text-sm sm:text-base text-gray-600">Tổng số câu hỏi: </span>
        <span class="text-black/80 font-bold text-xl sm:text-2xl">100</span>
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
