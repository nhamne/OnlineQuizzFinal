<template>
  <div class="w-full h-full flex flex-col gap-5 sm:gap-6 pb-16 relative">
    <!-- 1. Breadcrumb & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
        <router-link
          to="/student/results"
          class="hover:text-primary-bg transition-colors flex items-center gap-1 font-semibold text-primary"
        >
          <Icon name="chevron-left" size="16" />
          <span>Kết quả của tôi</span>
        </router-link>
        <span class="text-gray-400">/</span>
        <span class="text-gray-700 font-semibold truncate">Chi tiết ca thi: {{ examInfo.title }}</span>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <Button
          variant="secondary"
          icon="download"
          customClass="h-9 px-3.5 text-xs sm:text-sm rounded-lg"
          @click="handlePrintOrExport"
        >
          In / Xuất PDF
        </Button>
        <router-link to="/student/results">
          <Button
            variant="outline"
            icon="arrow-out-right"
            customClass="h-9 px-3.5 text-xs sm:text-sm rounded-lg"
          >
            Trở lại danh sách
          </Button>
        </router-link>
      </div>
    </div>

    <!-- 2. Exam Info Banner Card (Thông tin chi tiết ca thi của học sinh) -->
    <div
      class="w-full bg-gradient-to-br from-white via-white to-sky-50/50 rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 lg:p-7 relative overflow-hidden"
    >
      <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>

      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <!-- Left: Exam Title & Details -->
        <div class="flex flex-col gap-3 max-w-2xl">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200"
            >
              Đã hoàn thành
            </span>
            <span class="text-xs px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 font-medium border border-sky-200">
              Mã ca thi: {{ examInfo.code }}
            </span>
            <span class="text-xs px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-medium border border-purple-200">
              Đề thi số: {{ examInfo.examCode }}
            </span>
            <span class="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200">
              Thí sinh: {{ examInfo.studentName }} ({{ examInfo.className }})
            </span>
          </div>

          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            {{ examInfo.title }}
          </h1>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 text-xs sm:text-sm text-gray-600 pt-1">
            <div class="flex items-center gap-2">
              <Icon name="book" size="16" class="text-primary shrink-0" />
              <span>Môn: <strong class="text-gray-800">{{ examInfo.subject }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="community" size="16" class="text-primary shrink-0" />
              <span>Lớp: <strong class="text-gray-800">{{ examInfo.className }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="user" size="16" class="text-primary shrink-0" />
              <span>GV: <strong class="text-gray-800">{{ examInfo.teacher }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="calendar-event" size="16" class="text-primary shrink-0" />
              <span>Ngày thi: <strong class="text-gray-800">{{ examInfo.submittedAt }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="alarm" size="16" class="text-primary shrink-0" />
              <span>Làm bài: <strong class="text-gray-800">{{ examInfo.duration }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="document" size="16" class="text-primary shrink-0" />
              <span>Quy mô: <strong class="text-gray-800">{{ totalQuestions }} câu ({{ correctCount }}/{{ totalQuestions }} đúng)</strong></span>
            </div>
          </div>
        </div>

        <!-- Right: Primary Score Badge -->
        <div
          class="shrink-0 flex sm:flex-row lg:flex-col items-center justify-between sm:justify-center gap-3 bg-gradient-to-br from-[#004b87] to-[#0369a1] text-white rounded-2xl p-5 sm:p-6 shadow-md min-w-[180px] lg:w-48 text-center"
        >
          <div class="text-xs uppercase tracking-wider font-semibold opacity-90">Điểm tổng kết</div>
          <div class="flex items-baseline justify-center gap-1">
            <span class="text-4xl sm:text-5xl font-black tracking-tight">{{ examInfo.score }}</span>
            <span class="text-lg opacity-80 font-medium">/ 10</span>
          </div>
          <div class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs">
            Xếp loại: {{ examInfo.grade }} ({{ accuracyPercent }}%)
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content: Left (Questions List) & Right (Sidebar) -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-start">
      <!-- LEFT: Questions List -->
      <div class="flex flex-col gap-5 min-w-0">
        <div
          v-for="question in questionList"
          :key="question.id"
          :id="`question-${question.questionNumber}`"
          :class="[
            'bg-white rounded-2xl shadow-2xs overflow-hidden transition-all duration-300 scroll-mt-20',
            question.isCorrect ? 'border border-emerald-300' : 'border border-red-300',
            activeQuestionNumber === question.questionNumber ? 'ring-2 ring-primary/40' : '',
          ]"
        >
          <!-- Question Header Row -->
          <div
            :class="[
              'px-5 py-3.5 flex items-center justify-between border-b bg-white',
              question.isCorrect ? 'border-emerald-100' : 'border-red-100',
            ]"
          >
            <!-- Left: Question Number + Points -->
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm sm:text-base text-gray-900">
                Câu {{ question.questionNumber }}
              </span>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200/70"
              >
                {{ question.score }} điểm
              </span>
            </div>

            <!-- Right: Status (Trả lời đúng / Trả lời sai) -->
            <div
              v-if="question.isCorrect"
              class="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs sm:text-sm"
            >
              <svg
                class="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12l3 3 5-5" />
              </svg>
              <span>Trả lời đúng</span>
            </div>
            <div
              v-else
              class="flex items-center gap-1.5 text-red-500 font-semibold text-xs sm:text-sm"
            >
              <svg
                class="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9l-6 6m0-6l6 6" />
              </svg>
              <span>Trả lời sai</span>
            </div>
          </div>

          <!-- Question Body -->
          <div class="p-5 flex flex-col gap-4">
            <!-- Question Content -->
            <div class="font-bold text-sm sm:text-base text-gray-900 leading-relaxed">
              {{ question.content }}
            </div>

            <!-- 4 Options in 2x2 Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                v-for="opt in question.options"
                :key="opt.id"
                :class="getOptionClass(question, opt.id)"
                class="flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border transition-all"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <!-- Option Badge (A, B, C, D) -->
                  <div
                    :class="getOptionBadgeClass(question, opt.id)"
                    class="w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-colors"
                  >
                    {{ opt.id }}
                  </div>
                  <!-- Option Text -->
                  <span
                    :class="[
                      'text-xs sm:text-sm font-medium leading-normal',
                      getOptionTextClass(question, opt.id),
                    ]"
                  >
                    {{ opt.content }}
                  </span>
                </div>

                <!-- Right Check/Cross Icon -->
                <div class="shrink-0 flex items-center pl-1">
                  <!-- Checkmark when student selected this and it's correct OR this is the correct answer -->
                  <svg
                    v-if="question.correctAnswer === opt.id"
                    class="w-5 h-5 text-emerald-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>

                  <!-- Cross icon when student selected this answer and it is WRONG -->
                  <svg
                    v-else-if="question.selectedAnswer === opt.id && !question.isCorrect"
                    class="w-5 h-5 text-red-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Explanation Box ("Lời giải") -->
            <div
              v-if="showExplanation && !question.isCorrect && question.explanation"
              class="border-l-4 border-sky-500 bg-sky-50/50 rounded-r-xl p-3.5 sm:p-4 mt-1 flex flex-col gap-1.5"
            >
              <div class="flex items-center gap-2 text-sky-600 font-bold text-xs sm:text-sm">
                <Icon name="bulb" size="16" class="text-sky-500 shrink-0" />
                <span>Lời giải</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-700 leading-relaxed pl-6">
                {{ question.explanation }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Sticky Sidebar Cards -->
      <div class="flex flex-col gap-4 sticky top-4">
        <!-- Card 1: Sơ đồ bài làm -->
        <div class="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 flex flex-col gap-4">
          <!-- Card Header with 88% Pill -->
          <div class="flex items-start justify-between">
            <div class="flex flex-col">
              <h2 class="font-bold text-base text-gray-900 leading-tight">Sơ đồ bài làm</h2>
              <span class="text-xs text-gray-400 mt-0.5">Chọn câu để xem nhanh</span>
            </div>
            <div
              class="px-2.5 py-0.5 rounded-full text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100"
            >
              {{ accuracyPercent }}%
            </div>
          </div>

          <!-- Progress Bar (Thin green bar) -->
          <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-500"
              :style="{ width: `${accuracyPercent}%` }"
            ></div>
          </div>

          <!-- Numbers Grid (5 Columns x 5 Rows) -->
          <div class="grid grid-cols-5 gap-2.5">
            <button
              v-for="q in questionList"
              :key="q.id"
              type="button"
              @click="scrollToQuestion(q.questionNumber)"
              :class="getPaletteButtonClass(q)"
              class="rounded-xl aspect-square flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              :title="`Câu ${q.questionNumber}: ${q.isCorrect ? 'Đúng' : 'Sai'}`"
            >
              {{ q.questionNumber }}
            </button>
          </div>

          <!-- Legend at Bottom -->
          <div class="pt-3 border-t border-gray-100 flex items-center gap-4 text-xs font-medium text-gray-600">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>Đúng ({{ correctCount }})</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
              <span>Sai ({{ incorrectCount }})</span>
            </div>
          </div>
        </div>

        <!-- Card 2: Hiện lời giải Toggle -->
        <div
          class="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-4 sm:p-5 flex items-center justify-between gap-3"
        >
          <div class="flex flex-col">
            <span class="font-bold text-sm text-gray-900 leading-tight">Hiện lời giải</span>
            <span class="text-xs text-gray-400 mt-0.5">Áp dụng cho câu trả lời sai</span>
          </div>

          <!-- Toggle Switch Button -->
          <button
            type="button"
            @click="showExplanation = !showExplanation"
            :class="[
              'w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center outline-none shrink-0',
              showExplanation ? 'bg-[#004b87]' : 'bg-gray-300',
            ]"
            :aria-checked="showExplanation"
            role="switch"
          >
            <div
              :class="[
                'w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition-transform duration-200',
                showExplanation ? 'translate-x-5.5' : 'translate-x-0',
              ]"
            ></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Help Button (Bottom Right) -->
    <button
      type="button"
      class="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-gray-800 text-white font-bold flex items-center justify-center shadow-lg hover:bg-gray-900 transition-transform duration-200 hover:scale-105 cursor-pointer text-sm z-30"
      title="Trợ giúp"
    >
      ?
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '@/components/custom/Icon.vue'
import Button from '@/components/custom/Button.vue'

const route = useRoute()

// Exam Session Metadata
const examInfo = ref({
  id: route.params.id || 1,
  title: 'Kiểm tra giữa kì 2 - Toán học 12',
  code: 'SES-MATH-1202',
  examCode: 'TOAN-102',
  subject: 'Toán học',
  className: '12A1',
  studentName: 'Minh Khoa',
  teacher: 'ThS. Lê Hoàng Long',
  submittedAt: '15/10/2026 09:14',
  duration: '38 phút 20 giây / 45 phút',
  totalQuestions: 25,
  score: '8.8',
  grade: 'Giỏi',
})

const handlePrintOrExport = () => {
  window.print()
}

// Toggle state for explanations
const showExplanation = ref<boolean>(true)
const activeQuestionNumber = ref<number>(1)

// Options & Question Interfaces
interface OptionItem {
  id: string // 'A' | 'B' | 'C' | 'D'
  content: string
}

interface QuestionItem {
  id: number
  questionNumber: number
  score: string
  content: string
  options: OptionItem[]
  selectedAnswer: string // Student's chosen option
  correctAnswer: string // The real correct option
  isCorrect: boolean
  explanation?: string
}

// 25 Questions Mock Data exactly matching the screenshot (22 Correct, 3 Incorrect: C3, C8, C14)
const questionList = ref<QuestionItem[]>([
  {
    id: 1,
    questionNumber: 1,
    score: '0.4',
    content: 'Tính tích phân I = ∫₀¹ (2x + 1) dx',
    options: [
      { id: 'A', content: '1' },
      { id: 'B', content: '2' },
      { id: 'C', content: '3' },
      { id: 'D', content: '4' },
    ],
    selectedAnswer: 'B',
    correctAnswer: 'B',
    isCorrect: true,
    explanation: 'Ta có: I = ∫₀¹ (2x + 1)dx = (x² + x)|₀¹ = (1² + 1) - 0 = 2. Do đó đáp án B là chính xác.',
  },
  {
    id: 2,
    questionNumber: 2,
    score: '0.4',
    content: 'Tìm nguyên hàm của f(x) = 3x² + 2x - 1',
    options: [
      { id: 'A', content: 'x³ + x² - x + C' },
      { id: 'B', content: 'x³ + x² - x' },
      { id: 'C', content: '6x + 2 + C' },
      { id: 'D', content: '3x³ + 2x + C' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'Áp dụng công thức nguyên hàm cơ bản: ∫(3x² + 2x - 1)dx = x³ + x² - x + C. Chọn đáp án A.',
  },
  {
    id: 3,
    questionNumber: 3,
    score: '0.4',
    content: 'Diện tích hình phẳng giới hạn bởi y = x² và y = x bằng:',
    options: [
      { id: 'A', content: '1/2' },
      { id: 'B', content: '1/6' },
      { id: 'C', content: '1/3' },
      { id: 'D', content: '1/4' },
    ],
    selectedAnswer: 'A', // INCORRECT CHOICE
    correctAnswer: 'B', // CORRECT ANSWER
    isCorrect: false,
    explanation: 'Áp dụng đúng công thức và rút gọn từng bước, ta thu được đáp án B. Cần chú ý điều kiện xác định và dấu của biểu thức trước khi kết luận.',
  },
  {
    id: 4,
    questionNumber: 4,
    score: '0.4',
    content: 'Trong không gian Oxyz, cho mặt phẳng (P): 2x - y + 2z - 3 = 0. Một vectơ pháp tuyến của (P) là:',
    options: [
      { id: 'A', content: 'n = (2; -1; 2)' },
      { id: 'B', content: 'n = (2; 1; 2)' },
      { id: 'C', content: 'n = (2; -1; -3)' },
      { id: 'D', content: 'n = (2; 1; -3)' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'Vectơ pháp tuyến của mặt phẳng Ax + By + Cz + D = 0 là n = (A; B; C) = (2; -1; 2).',
  },
  {
    id: 5,
    questionNumber: 5,
    score: '0.4',
    content: 'Cho hàm số y = f(x) có đạo hàm f\'(x) = x(x - 1)². Số điểm cực trị của hàm số là:',
    options: [
      { id: 'A', content: '1' },
      { id: 'B', content: '2' },
      { id: 'C', content: '0' },
      { id: 'D', content: '3' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'f\'(x) chỉ đổi dấu khi qua nghiệm bội lẻ x = 0, còn tại x = 1 là nghiệm bội chẵn nên không đổi dấu. Do đó chỉ có 1 cực trị.',
  },
  {
    id: 6,
    questionNumber: 6,
    score: '0.4',
    content: 'Giá trị nhỏ nhất của hàm số f(x) = x³ - 3x + 2 trên đoạn [0; 2] bằng:',
    options: [
      { id: 'A', content: '0' },
      { id: 'B', content: '2' },
      { id: 'C', content: '4' },
      { id: 'D', content: '-1' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'f\'(x) = 3x² - 3 = 0 <=> x = 1 (thuộc [0; 2]). Tính f(0) = 2, f(1) = 0, f(2) = 4. Giá trị nhỏ nhất là 0.',
  },
  {
    id: 7,
    questionNumber: 7,
    score: '0.4',
    content: 'Nghiệm của phương trình log₂(x - 1) = 3 là:',
    options: [
      { id: 'A', content: 'x = 7' },
      { id: 'B', content: 'x = 9' },
      { id: 'C', content: 'x = 8' },
      { id: 'D', content: 'x = 10' },
    ],
    selectedAnswer: 'B',
    correctAnswer: 'B',
    isCorrect: true,
    explanation: 'Điều kiện x > 1. log₂(x - 1) = 3 <=> x - 1 = 2³ = 8 <=> x = 9.',
  },
  {
    id: 8,
    questionNumber: 8,
    score: '0.4',
    content: 'Tập xác định D của hàm số y = (x - 2)⁻³ là:',
    options: [
      { id: 'A', content: 'D = (2; +∞)' },
      { id: 'B', content: 'D = ℝ \\ {2}' },
      { id: 'C', content: 'D = [2; +∞)' },
      { id: 'D', content: 'D = ℝ' },
    ],
    selectedAnswer: 'A', // INCORRECT CHOICE
    correctAnswer: 'B', // CORRECT ANSWER
    isCorrect: false,
    explanation: 'Hàm số lũy thừa với số mũ nguyên âm xác định khi cơ số khác 0: x - 2 ≠ 0 <=> x ≠ 2. Do đó D = ℝ \\ {2}.',
  },
  {
    id: 9,
    questionNumber: 9,
    score: '0.4',
    content: 'Thể tích khối lăng trụ có diện tích đáy B = 6 và chiều cao h = 4 là:',
    options: [
      { id: 'A', content: '24' },
      { id: 'B', content: '8' },
      { id: 'C', content: '12' },
      { id: 'D', content: '72' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'Thể tích lăng trụ: V = B * h = 6 * 4 = 24.',
  },
  {
    id: 10,
    questionNumber: 10,
    score: '0.4',
    content: 'Số phức liên hợp của số phức z = 3 - 4i là:',
    options: [
      { id: 'A', content: 'z̄ = 3 + 4i' },
      { id: 'B', content: 'z̄ = -3 - 4i' },
      { id: 'C', content: 'z̄ = -3 + 4i' },
      { id: 'D', content: 'z̄ = 4 - 3i' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'Với z = a + bi thì z̄ = a - bi. Vậy z = 3 - 4i có z̄ = 3 + 4i.',
  },
  {
    id: 11,
    questionNumber: 11,
    score: '0.4',
    content: 'Môđun của số phức z = 1 + 2i bằng:',
    options: [
      { id: 'A', content: '√5' },
      { id: 'B', content: '5' },
      { id: 'C', content: '3' },
      { id: 'D', content: '√3' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: '|z| = √(1² + 2²) = √5.',
  },
  {
    id: 12,
    questionNumber: 12,
    score: '0.4',
    content: 'Trong không gian Oxyz, tọa độ tâm I của mặt cầu (S): (x - 1)² + (y + 2)² + z² = 9 là:',
    options: [
      { id: 'A', content: 'I(1; -2; 0)' },
      { id: 'B', content: 'I(-1; 2; 0)' },
      { id: 'C', content: 'I(1; 2; 0)' },
      { id: 'D', content: 'I(-1; -2; 3)' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'Tâm I(a; b; c) = (1; -2; 0).',
  },
  {
    id: 13,
    questionNumber: 13,
    score: '0.4',
    content: 'Đạo hàm của hàm số y = 3ˣ là:',
    options: [
      { id: 'A', content: 'y\' = 3ˣ · ln 3' },
      { id: 'B', content: 'y\' = x · 3ˣ⁻¹' },
      { id: 'C', content: 'y\' = 3ˣ / ln 3' },
      { id: 'D', content: 'y\' = 3ˣ' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: '(aˣ)\' = aˣ · ln a. Suy ra (3ˣ)\' = 3ˣ · ln 3.',
  },
  {
    id: 14,
    questionNumber: 14,
    score: '0.4',
    content: 'Cho cấp số nhân (uₙ) có u₁ = 2 và công bội q = 3. Giá trị của u₃ bằng:',
    options: [
      { id: 'A', content: '8' },
      { id: 'B', content: '18' },
      { id: 'C', content: '54' },
      { id: 'D', content: '6' },
    ],
    selectedAnswer: 'A', // INCORRECT CHOICE
    correctAnswer: 'B', // CORRECT ANSWER
    isCorrect: false,
    explanation: 'Số hạng tổng quát uₙ = u₁ · qⁿ⁻¹. Vậy u₃ = 2 · 3² = 2 · 9 = 18. Bạn đã nhầm với cấp số cộng.',
  },
  {
    id: 15,
    questionNumber: 15,
    score: '0.4',
    content: 'Có bao nhiêu cách chọn 3 học sinh từ một nhóm gồm 10 học sinh?',
    options: [
      { id: 'A', content: 'C₁₀³ = 120' },
      { id: 'B', content: 'A₁₀³ = 720' },
      { id: 'C', content: '30' },
      { id: 'D', content: '100' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'Chọn không thứ tự 3 học sinh từ 10 học sinh: C₁₀³ = 120.',
  },
  {
    id: 16,
    questionNumber: 16,
    score: '0.4',
    content: 'Đường tiệm cận ngang của đồ thị hàm số y = (2x - 1) / (x + 1) là:',
    options: [
      { id: 'A', content: 'y = 2' },
      { id: 'B', content: 'x = -1' },
      { id: 'C', content: 'y = -1' },
      { id: 'D', content: 'x = 2' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'lim (x->±∞) (2x - 1)/(x + 1) = 2 => tiệm cận ngang là đường thẳng y = 2.',
  },
  {
    id: 17,
    questionNumber: 17,
    score: '0.4',
    content: 'Bán kính R của khối cầu có thể tích V = 36π là:',
    options: [
      { id: 'A', content: 'R = 3' },
      { id: 'B', content: 'R = 6' },
      { id: 'C', content: 'R = 9' },
      { id: 'D', content: 'R = 2' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'V = (4/3)πR³ = 36π => R³ = 27 => R = 3.',
  },
  {
    id: 18,
    questionNumber: 18,
    score: '0.4',
    content: 'Cho hàm số bậc ba y = ax³ + bx² + cx + d có đồ thị đi qua gốc tọa độ O(0; 0). Hệ số d bằng:',
    options: [
      { id: 'A', content: '0' },
      { id: 'B', content: '1' },
      { id: 'C', content: '-1' },
      { id: 'D', content: '2' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'Đồ thị qua gốc O(0; 0) => thay x = 0, y = 0 vào hàm số được d = 0.',
  },
  {
    id: 19,
    questionNumber: 19,
    score: '0.4',
    content: 'Hàm số y = x⁴ - 2x² + 3 nghịch biến trên khoảng nào sau đây?',
    options: [
      { id: 'A', content: '(0; 1)' },
      { id: 'B', content: '(1; +∞)' },
      { id: 'C', content: '(-1; 0)' },
      { id: 'D', content: '(-∞; -1)' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'y\' = 4x³ - 4x = 4x(x² - 1) = 0 có nghiệm x = 0, ±1. y\' < 0 trên các khoảng (-∞; -1) và (0; 1).',
  },
  {
    id: 20,
    questionNumber: 20,
    score: '0.4',
    content: 'Cho log₂ 3 = a. Khi đó log₄ 9 tính theo a bằng:',
    options: [
      { id: 'A', content: 'a' },
      { id: 'B', content: '2a' },
      { id: 'C', content: 'a²' },
      { id: 'D', content: 'a / 2' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'log₄ 9 = log_(2²) (3²) = (2/2) log₂ 3 = log₂ 3 = a.',
  },
  {
    id: 21,
    questionNumber: 21,
    score: '0.4',
    content: 'Diện tích toàn phần của hình nón có bán kính đáy r = 3 và độ dài đường sinh l = 5 là:',
    options: [
      { id: 'A', content: '24π' },
      { id: 'B', content: '15π' },
      { id: 'C', content: '9π' },
      { id: 'D', content: '30π' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'S_tp = S_xq + S_đáy = πrl + πr² = π(3)(5) + π(3²) = 15π + 9π = 24π.',
  },
  {
    id: 22,
    questionNumber: 22,
    score: '0.4',
    content: 'Trong không gian Oxyz, phương trình tham số của đường thẳng đi qua M(1; 2; 3) và có VTCP u = (2; -1; 1) là:',
    options: [
      { id: 'A', content: 'x = 1 + 2t, y = 2 - t, z = 3 + t' },
      { id: 'B', content: 'x = 2 + t, y = -1 + 2t, z = 1 + 3t' },
      { id: 'C', content: 'x = 1 - 2t, y = 2 - t, z = 3 - t' },
      { id: 'D', content: 'x = 2, y = -1, z = 1' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'Phương trình tham số: x = x₀ + at, y = y₀ + bt, z = z₀ + ct => x = 1 + 2t, y = 2 - t, z = 3 + t.',
  },
  {
    id: 23,
    questionNumber: 23,
    score: '0.4',
    content: 'Khoảng cách từ điểm M(1; 2; -1) đến mặt phẳng (P): 2x - 2y + z + 5 = 0 bằng:',
    options: [
      { id: 'A', content: '2/3' },
      { id: 'B', content: '2' },
      { id: 'C', content: '4/3' },
      { id: 'D', content: '1' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'd(M, P) = |2(1) - 2(2) + (-1) + 5| / √(2² + (-2)² + 1²) = |2| / 3 = 2/3.',
  },
  {
    id: 24,
    questionNumber: 24,
    score: '0.4',
    content: 'Giá trị của tích phân ∫₀^(π/2) cos x dx là:',
    options: [
      { id: 'A', content: '1' },
      { id: 'B', content: '0' },
      { id: 'C', content: '-1' },
      { id: 'D', content: 'π/2' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: '∫₀^(π/2) cos x dx = sin x|₀^(π/2) = sin(π/2) - sin(0) = 1 - 0 = 1.',
  },
  {
    id: 25,
    questionNumber: 25,
    score: '0.4',
    content: 'Gieo một con súc sắc cân đối và đồng chất một lần. Xác suất để xuất hiện mặt có số chấm chia hết cho 3 là:',
    options: [
      { id: 'A', content: '1/3' },
      { id: 'B', content: '1/2' },
      { id: 'C', content: '1/6' },
      { id: 'D', content: '2/3' },
    ],
    selectedAnswer: 'A',
    correctAnswer: 'A',
    isCorrect: true,
    explanation: 'Không gian mẫu n(Ω) = 6. Các mặt chia hết cho 3 là {3; 6} có 2 phần tử => P = 2/6 = 1/3.',
  },
])

// Computed Counts & Accuracy
const totalQuestions = computed(() => questionList.value.length)
const correctCount = computed(() => questionList.value.filter((q) => q.isCorrect).length)
const incorrectCount = computed(() => questionList.value.filter((q) => !q.isCorrect).length)
const accuracyPercent = computed(() =>
  totalQuestions.value > 0 ? Math.round((correctCount.value / totalQuestions.value) * 100) : 0,
)

// Dynamic Styling for Options
const getOptionClass = (question: QuestionItem, optId: string) => {
  // Option selected by student and it's CORRECT
  if (question.selectedAnswer === optId && question.correctAnswer === optId) {
    return 'border-emerald-400 bg-emerald-50/50'
  }
  // Option selected by student and it's INCORRECT
  if (question.selectedAnswer === optId && !question.isCorrect) {
    return 'border-red-400 bg-red-50/70'
  }
  // True correct answer when student selected something else
  if (question.correctAnswer === optId) {
    return 'border-emerald-400 bg-emerald-50/50'
  }
  // Normal unselected option
  return 'border-gray-200 bg-white hover:border-gray-300'
}

const getOptionBadgeClass = (question: QuestionItem, optId: string) => {
  // Option selected by student and it's CORRECT
  if (question.selectedAnswer === optId && question.correctAnswer === optId) {
    return 'bg-emerald-600 text-white shadow-2xs'
  }
  // Option selected by student and it's INCORRECT
  if (question.selectedAnswer === optId && !question.isCorrect) {
    return 'bg-red-500 text-white shadow-2xs'
  }
  // True correct answer when student selected something else
  if (question.correctAnswer === optId) {
    return 'bg-emerald-600 text-white shadow-2xs'
  }
  // Normal unselected badge
  return 'bg-gray-100 text-gray-500'
}

const getOptionTextClass = (question: QuestionItem, optId: string) => {
  if (question.correctAnswer === optId) {
    return 'text-gray-900 font-semibold'
  }
  if (question.selectedAnswer === optId && !question.isCorrect) {
    return 'text-gray-900 font-semibold'
  }
  return 'text-gray-800'
}

// Sidebar Question Button Class
const getPaletteButtonClass = (q: QuestionItem) => {
  // If actively selected
  if (activeQuestionNumber.value === q.questionNumber) {
    return 'bg-[#004b87] text-white shadow-xs font-bold'
  }
  // If correct question: white bg with green border
  if (q.isCorrect) {
    return 'bg-white border border-emerald-400 text-emerald-600 hover:bg-emerald-50'
  }
  // If incorrect question: white bg with red border
  return 'bg-white border border-red-400 text-red-500 hover:bg-red-50'
}

// Scroll to Question
const scrollToQuestion = (questionNum: number) => {
  activeQuestionNumber.value = questionNum
  const el = document.getElementById(`question-${questionNum}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<style scoped>
/* Print Media Styles */
@media print {
  .sticky,
  button {
    display: none !important;
  }
}
</style>
