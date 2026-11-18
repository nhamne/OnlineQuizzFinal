<template>
  <div class="flex flex-col pb-10 w-full min-h-screen">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium mb-3">
      <router-link to="/teacher/exam-manage" class="hover:text-primary transition-colors">
        Danh sách đề thi
      </router-link>
      <span>/</span>
      <span class="text-gray-800 font-semibold truncate">Tạo đề thi từ ngân hàng</span>
    </div>

    <!-- 1. Header (Top Bar) -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-[#1E293B]">Tạo đề thi từ ngân hàng</h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-0.5">
          Thiết lập cấu trúc ma trận để hệ thống chọn ngẫu nhiên
        </p>
      </div>

      <!-- 2. Top Right Actions (Xem trước, Lưu nháp, Tạo đề thi) -->
      <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        <Button
          variant="secondary"
          icon="eye"
          class="!rounded-xl px-4 py-2 text-xs sm:text-sm border-primary/40 text-primary hover:bg-primary/5 shadow-2xs"
          @click="isOpenPreview = true"
        >
          Xem trước
        </Button>
        <Button
          variant="secondary"
          icon="save"
          class="!rounded-xl px-4 py-2 text-xs sm:text-sm hidden md:flex"
          @click="handleSaveDraft"
        >
          Lưu nháp
        </Button>
        <Button
          variant="primary"
          icon="publish"
          class="!rounded-xl px-5 py-2 text-xs sm:text-sm"
          @click="handleCreateExam"
        >
          Tạo đề thi
        </Button>
      </div>
    </div>

    <!-- Main 2-Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[330px_1fr] gap-5 items-start">
      <!-- CỘT TRÁI (3 & 4): Môn học & Nội dung kiến thức -->
      <div class="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs flex flex-col gap-4">
        <!-- 3. Môn học dropdown -->
        <div>
          <label class="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">
            Môn học
          </label>
          <DropdownFilter
            v-model="selectedSubjectKey"
            :list="listSubjects"
            icon="book"
            class="w-full"
          />
        </div>

        <!-- 4. Nội dung kiến thức (Danh sách chương/bài học) -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between pb-2 border-b border-gray-200">
            <span class="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Nội dung kiến thức
            </span>
            <span class="text-[11px] font-semibold text-gray-400">
              {{ currentChapters.length }} chương
            </span>
          </div>

          <!-- Danh sách các chương để thêm vào ma trận -->
          <div class="flex flex-col gap-2 mt-3 max-h-[560px] overflow-y-auto custom-scrollbar pr-1">
            <div
              v-for="chap in currentChapters"
              :key="chap.id"
              class="group p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-2.5"
              :class="
                isChapterSelected(chap.id)
                  ? 'bg-blue-50/50 border-blue-200 text-primary'
                  : 'bg-gray-50/70 border-gray-200/70 hover:bg-gray-100/70 text-gray-700'
              "
            >
              <div class="flex flex-col min-w-0">
                <span class="text-xs sm:text-[13px] font-semibold truncate" :title="chap.name">
                  {{ chap.name }}
                </span>
                <span class="text-[11px] text-gray-400 mt-0.5">
                  Kho: {{ getChapterTotalAvailable(chap) }} câu
                </span>
              </div>

              <!-- Nút [+] thêm vào ma trận -->
              <button
                type="button"
                @click="toggleChapter(chap)"
                class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-2xs"
                :class="
                  isChapterSelected(chap.id)
                    ? 'bg-primary text-white hover:bg-red-500'
                    : 'bg-white border border-gray-200 text-gray-500 hover:text-primary hover:border-primary'
                "
                :title="isChapterSelected(chap.id) ? 'Bỏ chọn khỏi ma trận' : 'Thêm vào ma trận đề thi'"
              >
                <Icon
                  :name="isChapterSelected(chap.id) ? 'check' : 'plus'"
                  size="14"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CỘT PHẢI (5, 6, 7, 8, 9, 10): Tên đề thi, Thời gian, Ma trận đề thi -->
      <div class="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-xs flex flex-col gap-5">
        <!-- 5 & 6: Hàng thông tin Tên đề thi và Thời gian -->
        <div class="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3.5 sm:gap-4 items-end">
          <!-- 5. Tên đề thi -->
          <div>
            <label class="text-xs font-bold text-gray-700 block mb-1.5">
              Tên đề thi <span class="text-red-500">*</span>
            </label>
            <Input
              v-model="nameExam"
              placeholder="Nhập tên đề thi (Ví dụ: Đề thi thử số 1)"
              icon="clipboard"
              class="w-full"
            />
          </div>

          <!-- 6. Thời gian (Phút) -->
          <div>
            <label class="text-xs font-bold text-gray-700 block mb-1.5">
              Thời gian (Phút) <span class="text-red-500">*</span>
            </label>
            <Input
              v-model="duration"
              placeholder="45"
              icon="clock"
              class="w-full"
            />
          </div>
        </div>

        <!-- 7. Ma trận đề thi Section -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-bold text-[#0F172A]">Ma trận đề thi</h2>
            <div class="text-xs font-semibold text-gray-500">
              Tổng số câu hỏi: <span class="text-primary font-bold text-sm">{{ grandTotal }}</span> câu
            </div>
          </div>

          <!-- Table Container with horizontal scroll for mobile/tablet -->
          <div class="w-full overflow-x-auto rounded-xl border border-gray-200">
            <table class="w-full border-collapse text-left min-w-[700px]">
              <!-- Table Headers -->
              <thead>
                <!-- Hàng Header 1 -->
                <tr class="bg-[#F8FAFC] text-[#334155] text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                  <th rowspan="2" class="py-3 px-2 text-center w-12 border-r border-gray-200">
                    STT
                  </th>
                  <th rowspan="2" class="py-3 px-4 text-left min-w-[170px] border-r border-gray-200">
                    NỘI DUNG KIẾN THỨC
                  </th>
                  <th colspan="4" class="py-2.5 px-3 text-center border-r border-gray-200 text-primary">
                    MỨC ĐỘ NHẬN THỨC (SỐ CÂU)
                  </th>
                  <th rowspan="2" class="py-3 px-3 text-center w-20 border-r border-gray-200">
                    TỔNG
                  </th>
                  <th rowspan="2" class="py-3 px-2 text-center w-12">
                    X
                  </th>
                </tr>

                <!-- Hàng Header 2 (Các mức độ con) -->
                <tr class="bg-[#F8FAFC] text-[#475569] text-[11px] font-semibold text-center border-b border-gray-200">
                  <th class="py-2 px-3 border-r border-gray-200 min-w-[110px]">
                    NHẬN BIẾT
                  </th>
                  <th class="py-2 px-3 border-r border-gray-200 min-w-[110px]">
                    THÔNG HIỂU
                  </th>
                  <th class="py-2 px-3 border-r border-gray-200 min-w-[110px]">
                    VẬN DỤNG
                  </th>
                  <th class="py-2 px-3 border-r border-gray-200 min-w-[110px]">
                    VẬN DỤNG CAO
                  </th>
                </tr>
              </thead>

              <!-- Table Body (Selected Matrix Rows) -->
              <tbody class="divide-y divide-gray-200 bg-white">
                <!-- Empty state khi chưa chọn chương nào -->
                <tr v-if="matrixRows.length === 0">
                  <td colspan="8" class="py-12 text-center text-gray-400 text-xs sm:text-sm">
                    <Icon name="clipboard" size="32" class="mx-auto mb-2 text-gray-300" />
                    Chưa có nội dung kiến thức nào trong ma trận.
                    <span class="block text-gray-400 text-xs mt-1">
                      Hãy nhấn nút <b class="text-primary font-bold">[+]</b> ở danh mục bên trái để thêm chương vào ma trận.
                    </span>
                  </td>
                </tr>

                <!-- 8 & 9: Các hàng dữ liệu chương đã chọn -->
                <tr
                  v-for="(row, idx) in matrixRows"
                  :key="row.id"
                  class="hover:bg-slate-50/70 transition-colors"
                >
                  <!-- STT -->
                  <td class="py-3 px-2 text-center font-medium text-xs text-gray-500 border-r border-gray-200">
                    {{ idx + 1 }}
                  </td>

                  <!-- NỘI DUNG KIẾN THỨC -->
                  <td class="py-3 px-4 font-semibold text-xs sm:text-sm text-gray-800 border-r border-gray-200">
                    {{ row.name }}
                  </td>

                  <!-- NHẬN BIẾT -->
                  <td class="py-2.5 px-2.5 text-center border-r border-gray-200">
                    <div class="flex flex-col items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        :max="row.bank.easy"
                        v-model.number="row.questions.easy"
                        placeholder="0"
                        class="w-14 h-8 text-center text-xs font-bold outline-none border border-gray-200 rounded-lg bg-white focus:border-primary text-primary shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span class="text-[10px] text-gray-400 whitespace-nowrap">
                        Kho: <strong class="text-primary font-medium">{{ row.bank.easy }}</strong> câu
                      </span>
                    </div>
                  </td>

                  <!-- THÔNG HIỂU -->
                  <td class="py-2.5 px-2.5 text-center border-r border-gray-200">
                    <div class="flex flex-col items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        :max="row.bank.medium"
                        v-model.number="row.questions.medium"
                        placeholder="0"
                        class="w-14 h-8 text-center text-xs font-bold outline-none border border-gray-200 rounded-lg bg-white focus:border-primary text-primary shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span class="text-[10px] text-gray-400 whitespace-nowrap">
                        Kho: <strong class="text-primary font-medium">{{ row.bank.medium }}</strong> câu
                      </span>
                    </div>
                  </td>

                  <!-- VẬN DỤNG -->
                  <td class="py-2.5 px-2.5 text-center border-r border-gray-200">
                    <div class="flex flex-col items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        :max="row.bank.hard"
                        v-model.number="row.questions.hard"
                        placeholder="0"
                        class="w-14 h-8 text-center text-xs font-bold outline-none border border-gray-200 rounded-lg bg-white focus:border-primary text-primary shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span class="text-[10px] text-gray-400 whitespace-nowrap">
                        Kho: <strong class="text-primary font-medium">{{ row.bank.hard }}</strong> câu
                      </span>
                    </div>
                  </td>

                  <!-- VẬN DỤNG CAO -->
                  <td class="py-2.5 px-2.5 text-center border-r border-gray-200">
                    <div class="flex flex-col items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        :max="row.bank.veryHard"
                        v-model.number="row.questions.veryHard"
                        placeholder="0"
                        class="w-14 h-8 text-center text-xs font-bold outline-none border border-gray-200 rounded-lg bg-white focus:border-primary text-primary shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span class="text-[10px] text-gray-400 whitespace-nowrap">
                        Kho: <strong class="text-primary font-medium">{{ row.bank.veryHard }}</strong> câu
                      </span>
                    </div>
                  </td>

                  <!-- TỔNG CÂU CỦA HÀNG -->
                  <td class="py-3 px-3 text-center font-bold text-xs sm:text-sm text-gray-900 border-r border-gray-200">
                    {{ getRowTotal(row) }}
                  </td>

                  <!-- 9. NÚT XÓA HÀNG (TRASH ICON) -->
                  <td class="py-3 px-2 text-center">
                    <button
                      type="button"
                      @click="removeRow(row.id)"
                      class="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Xóa chương này khỏi ma trận"
                    >
                      <Icon name="trash" size="16" />
                    </button>
                  </td>
                </tr>
              </tbody>

              <!-- 10. Table Footer (TỔNG CỘNG) -->
              <tfoot v-if="matrixRows.length > 0" class="bg-[#F8FAFC] border-t-2 border-gray-200 font-bold text-xs">
                <tr>
                  <td colspan="2" class="py-3 px-4 uppercase text-gray-800 border-r border-gray-200 text-right">
                    TỔNG CỘNG
                  </td>
                  <!-- Nhận biết tổng -->
                  <td class="py-3 px-2.5 text-center border-r border-gray-200 text-primary font-bold text-xs sm:text-sm">
                    {{ totalsByLevel.easy }}
                  </td>
                  <!-- Thông hiểu tổng -->
                  <td class="py-3 px-2.5 text-center border-r border-gray-200 text-primary font-bold text-xs sm:text-sm">
                    {{ totalsByLevel.medium }}
                  </td>
                  <!-- Vận dụng tổng -->
                  <td class="py-3 px-2.5 text-center border-r border-gray-200 text-primary font-bold text-xs sm:text-sm">
                    {{ totalsByLevel.hard }}
                  </td>
                  <!-- Vận dụng cao tổng -->
                  <td class="py-3 px-2.5 text-center border-r border-gray-200 text-primary font-bold text-xs sm:text-sm">
                    {{ totalsByLevel.veryHard }}
                  </td>
                  <!-- Grand total -->
                  <td class="py-3 px-3 text-center text-primary font-bold text-sm border-r border-gray-200">
                    {{ grandTotal }}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Ghi chú chân bảng -->
          <div class="mt-3 text-[11px] text-gray-500 space-y-1">
            <p>* STT: Số thứ tự của nội dung kiến thức được chọn.</p>
            <p>* Nội dung kiến thức: Lấy từ tên Chương/Bài học có sẵn trong kho tùy theo Môn học.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Popup "Xem trước" (Preview) -->
    <Popup
      v-model="isOpenPreview"
      title="Xem trước cấu trúc đề thi"
      desc="Kiểm tra cấu trúc ma trận và nội dung câu hỏi được bốc ngẫu nhiên từ ngân hàng."
      icon="eye"
      width="780px"
      btnAcceptText="Tạo đề thi ngay"
      btnCancelText="Đóng"
      btnAcceptIcon="publish"
      @accept="handleCreateExam"
      @cancel="isOpenPreview = false"
    >
      <template #custom-body>
        <div class="p-5 flex flex-col gap-4 text-xs sm:text-sm">
          <!-- Thông tin tóm tắt đề thi -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div>
              <span class="text-gray-400 text-xs block">Tên đề thi:</span>
              <span class="font-bold text-gray-800 truncate block">{{ nameExam || 'Chưa đặt tên' }}</span>
            </div>
            <div>
              <span class="text-gray-400 text-xs block">Môn học:</span>
              <span class="font-bold text-primary truncate block">{{ currentSubjectName }}</span>
            </div>
            <div>
              <span class="text-gray-400 text-xs block">Thời gian:</span>
              <span class="font-bold text-gray-800">{{ duration || 45 }} phút</span>
            </div>
            <div>
              <span class="text-gray-400 text-xs block">Tổng số câu:</span>
              <span class="font-bold text-primary">{{ grandTotal }} câu</span>
            </div>
          </div>

          <!-- Danh sách câu hỏi mẫu ngẫu nhiên mô phỏng -->
          <div>
            <span class="font-bold text-gray-800 text-xs sm:text-sm block mb-2">
              Danh sách câu hỏi dự kiến theo ma trận:
            </span>
            <div class="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
              <div
                v-for="(q, qIdx) in previewSampleQuestions"
                :key="qIdx"
                class="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs"
              >
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-bold text-primary">Câu {{ qIdx + 1 }}: [{{ q.type }}]</span>
                  <div class="flex items-center gap-1.5">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-600">
                      {{ q.chapter }}
                    </span>
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700">
                      {{ q.level }}
                    </span>
                  </div>
                </div>
                <p class="text-gray-700 text-xs">{{ q.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Popup>

    <!-- Toast Message -->
    <ToastMessage
      v-model="isOpenToast"
      :type="toastType"
      :label="toastTitle"
      :content="toastMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/custom/Button.vue'
import Input from '@/components/custom/Input.vue'
import Icon from '@/components/custom/Icon.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Popup from '@/components/custom/Popup.vue'
import ToastMessage from '@/components/custom/ToastMessage.vue'

const router = useRouter()

// Top form fields
const nameExam = ref<string>('Test')
const duration = ref<number | string>(45)
const selectedSubjectKey = ref<string>('cpp')

// Modal preview & Toast state
const isOpenPreview = ref<boolean>(false)
const isOpenToast = ref<boolean>(false)
const toastType = ref<'warning' | 'success'>('warning')
const toastTitle = ref<string>('')
const toastMessage = ref<string>('')

// Danh sách các môn học
const listSubjects = [
  { key: 'cpp', name: 'Lập trình C++' },
  { key: 'java', name: 'Lập trình Java cơ bản' },
  { key: 'network', name: 'Mạng máy tính' },
  { key: 'ml', name: 'Học máy nâng cao' },
  { key: 'win', name: 'Lập trình Windows' },
]

const currentSubjectName = computed(() => {
  return listSubjects.find((s) => s.key === selectedSubjectKey.value)?.name || 'Lập trình C++'
})

interface ChapterData {
  id: string
  name: string
  bank: {
    easy: number
    medium: number
    hard: number
    veryHard: number
  }
}

const subjectChaptersMap: Record<string, ChapterData[]> = {
  cpp: [
    {
      id: 'cpp-1',
      name: 'Chương 1: Tổng quan',
      bank: { easy: 1, medium: 0, hard: 0, veryHard: 0 },
    },
    {
      id: 'cpp-2',
      name: 'Chương 2: Biến và toán tử',
      bank: { easy: 10, medium: 7, hard: 4, veryHard: 2 },
    },
    {
      id: 'cpp-3',
      name: 'Chương 3: Cấu trúc điều khiển',
      bank: { easy: 12, medium: 10, hard: 7, veryHard: 4 },
    },
    {
      id: 'cpp-4',
      name: 'Chương 4: Con trỏ',
      bank: { easy: 8, medium: 11, hard: 8, veryHard: 5 },
    },
    {
      id: 'cpp-5',
      name: 'Chương 5: OOP',
      bank: { easy: 11, medium: 13, hard: 9, veryHard: 7 },
    },
    {
      id: 'cpp-6',
      name: 'Chương 6: Xử lý chuỗi',
      bank: { easy: 6, medium: 5, hard: 4, veryHard: 2 },
    },
  ],
  java: [
    {
      id: 'java-1',
      name: 'Chương 1: Cú pháp Java cơ bản',
      bank: { easy: 12, medium: 10, hard: 5, veryHard: 2 },
    },
    {
      id: 'java-2',
      name: 'Chương 2: Lập trình hướng đối tượng trong Java',
      bank: { easy: 15, medium: 13, hard: 8, veryHard: 5 },
    },
    {
      id: 'java-3',
      name: 'Chương 3: Java Collections Framework',
      bank: { easy: 10, medium: 9, hard: 6, veryHard: 4 },
    },
  ],
  network: [
    {
      id: 'net-1',
      name: 'Chương 1: Tổng quan mô hình OSI & TCP/IP',
      bank: { easy: 15, medium: 10, hard: 6, veryHard: 3 },
    },
    {
      id: 'net-2',
      name: 'Chương 2: Tầng Giao vận (Transport Layer)',
      bank: { easy: 12, medium: 10, hard: 8, veryHard: 4 },
    },
  ],
  ml: [
    {
      id: 'ml-1',
      name: 'Chương 1: Hồi quy tuyến tính (Linear Regression)',
      bank: { easy: 10, medium: 8, hard: 5, veryHard: 3 },
    },
    {
      id: 'ml-2',
      name: 'Chương 2: Phân loại & Cây quyết định',
      bank: { easy: 12, medium: 10, hard: 7, veryHard: 4 },
    },
  ],
  win: [
    {
      id: 'win-1',
      name: 'Chương 1: Thiết kế giao diện Windows Forms',
      bank: { easy: 12, medium: 9, hard: 5, veryHard: 2 },
    },
  ],
}

// Danh sách chương của môn hiện tại
const currentChapters = computed(() => {
  return subjectChaptersMap[selectedSubjectKey.value] || []
})

// Hàng dữ liệu ma trận (các chương được chọn)
interface MatrixRow extends ChapterData {
  questions: {
    easy: number | string
    medium: number | string
    hard: number | string
    veryHard: number | string
  }
}

const matrixRows = ref<MatrixRow[]>([])

// Khởi tạo hàng mẫu mặc định giống ảnh (Chương 1: Tổng quan với 1 câu Nhận biết)
const initDefaultRows = () => {
  const ch1 = currentChapters.value[0]
  if (ch1) {
    matrixRows.value = [
      {
        ...ch1,
        questions: {
          easy: 1,
          medium: '',
          hard: '',
          veryHard: '',
        },
      },
    ]
  } else {
    matrixRows.value = []
  }
}

// Tự động khởi tạo khi load trang hoặc khi đổi môn học
initDefaultRows()

watch(selectedSubjectKey, () => {
  initDefaultRows()
})

// Kiểm tra chương đã được thêm vào ma trận chưa
const isChapterSelected = (chapId: string) => {
  return matrixRows.value.some((r) => r.id === chapId)
}

// Bật/tắt thêm chương vào ma trận
const toggleChapter = (chap: ChapterData) => {
  const existingIdx = matrixRows.value.findIndex((r) => r.id === chap.id)
  if (existingIdx !== -1) {
    matrixRows.value.splice(existingIdx, 1)
  } else {
    matrixRows.value.push({
      ...chap,
      questions: {
        easy: '',
        medium: '',
        hard: '',
        veryHard: '',
      },
    })
  }
}

// Xóa hàng khỏi ma trận
const removeRow = (rowId: string) => {
  matrixRows.value = matrixRows.value.filter((r) => r.id !== rowId)
}

// Tính tổng số câu hỏi có sẵn trong kho của một chương
const getChapterTotalAvailable = (chap: ChapterData) => {
  const b = chap.bank
  return b.easy + b.medium + b.hard + b.veryHard
}

// Tính tổng câu trong 1 hàng
const getRowTotal = (row: MatrixRow) => {
  const q = row.questions
  return (
    (Number(q.easy) || 0) +
    (Number(q.medium) || 0) +
    (Number(q.hard) || 0) +
    (Number(q.veryHard) || 0)
  )
}

// Tính tổng theo từng mức độ cho footer
const totalsByLevel = computed(() => {
  const res = {
    easy: 0,
    medium: 0,
    hard: 0,
    veryHard: 0,
  }
  matrixRows.value.forEach((r) => {
    res.easy += Number(r.questions.easy) || 0
    res.medium += Number(r.questions.medium) || 0
    res.hard += Number(r.questions.hard) || 0
    res.veryHard += Number(r.questions.veryHard) || 0
  })
  return res
})

// Tổng cộng số câu hỏi toàn bài
const grandTotal = computed(() => {
  const t = totalsByLevel.value
  return t.easy + t.medium + t.hard + t.veryHard
})

interface PreviewQuestion {
  type: string
  chapter: string
  level: string
  content: string
}

// Danh sách câu hỏi mẫu mô phỏng cho Preview modal
const previewSampleQuestions = computed<PreviewQuestion[]>(() => {
  const list: PreviewQuestion[] = []
  matrixRows.value.forEach((r) => {
    const q = r.questions
    const easyCount = Number(q.easy) || 0
    for (let i = 0; i < easyCount; i++) {
      list.push({
        type: 'Trắc nghiệm',
        chapter: r.name,
        level: 'Nhận biết',
        content: `Trong ${r.name}, khái niệm cơ bản nào sau đây được sử dụng để khởi tạo và định nghĩa cấu trúc dữ liệu?`,
      })
    }

    const medCount = Number(q.medium) || 0
    for (let i = 0; i < medCount; i++) {
      list.push({
        type: 'Trắc nghiệm',
        chapter: r.name,
        level: 'Thông hiểu',
        content: `Hãy phân tích đoạn mã nguồn sau trong ${r.name} và cho biết kết quả xuất ra màn hình là gì?`,
      })
    }

    const hardCount = Number(q.hard) || 0
    for (let i = 0; i < hardCount; i++) {
      list.push({
        type: 'Trắc nghiệm',
        chapter: r.name,
        level: 'Vận dụng',
        content: `Áp dụng kiến thức ${r.name} để tối ưu hóa thời gian thực thi của thuật toán xử lý luồng dữ liệu.`,
      })
    }

    const veryHardCount = Number(q.veryHard) || 0
    for (let i = 0; i < veryHardCount; i++) {
      list.push({
        type: 'Trắc nghiệm',
        chapter: r.name,
        level: 'Vận dụng cao',
        content: `Giải quyết bài toán tối ưu hóa nâng cao và thiết kế kiến trúc chương trình áp dụng ${r.name}.`,
      })
    }
  })
  return list
})

// Lưu nháp
const handleSaveDraft = () => {
  if (!nameExam.value.trim()) {
    showToast('warning', 'Thiếu thông tin', 'Vui lòng nhập tên đề thi trước khi lưu nháp.')
    return
  }
  showToast('success', 'Đã lưu nháp', 'Bản nháp cấu trúc ma trận đề thi đã được lưu thành công.')
}

// Tạo đề thi
const handleCreateExam = () => {
  if (!nameExam.value.trim()) {
    showToast('warning', 'Thiếu thông tin', 'Vui lòng nhập tên đề thi!')
    return
  }
  if (!duration.value || Number(duration.value) <= 0) {
    showToast('warning', 'Thời gian không hợp lệ', 'Vui lòng nhập thời gian làm bài lớn hơn 0 phút!')
    return
  }
  if (matrixRows.value.length === 0) {
    showToast('warning', 'Chưa chọn nội dung', 'Vui lòng thêm ít nhất 1 chương vào ma trận đề thi!')
    return
  }
  if (grandTotal.value <= 0) {
    showToast('warning', 'Chưa nhập số câu', 'Vui lòng nhập số câu hỏi cho ít nhất một chương!')
    return
  }

  isOpenPreview.value = false
  showToast('success', 'Thành công', `Đã tạo đề thi '${nameExam.value}' gồm ${grandTotal.value} câu hỏi từ ngân hàng!`)
  setTimeout(() => {
    router.push('/teacher/exam-manage')
  }, 1200)
}

const showToast = (type: 'warning' | 'success', title: string, message: string) => {
  toastType.value = type
  toastTitle.value = title
  toastMessage.value = message
  isOpenToast.value = true
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
