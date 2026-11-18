<template>
  <div class="w-full h-full flex flex-col gap-5 sm:gap-6 pb-12">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
      <router-link to="/student/join-class" class="hover:text-primary transition-colors">
        Danh sách lớp học
      </router-link>
      <span class="text-gray-400">/</span>
      <span class="text-gray-800 font-semibold truncate">Chi tiết: {{ classInfo.nameClass }}</span>
    </div>

    <!-- Class Info Banner Card -->
    <div
      class="w-full bg-gradient-to-br from-white via-white to-sky-50/60 rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 lg:p-7 relative overflow-hidden"
    >
      <div
        class="absolute -right-10 -bottom-10 w-44 h-44 bg-primary/5 rounded-full blur-2xl pointer-events-none"
      ></div>

      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <!-- Left: Class Title, Badges & Details -->
        <div class="flex flex-col gap-3 max-w-2xl">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200"
            >
              Đang tham gia
            </span>
            <span
              class="text-xs px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 font-medium border border-sky-200"
            >
              Sĩ số: {{ studentList.length }} học sinh
            </span>
          </div>

          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            {{ classInfo.nameClass }} - {{ classInfo.description }}
          </h1>

          <div
            class="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 text-xs sm:text-sm text-gray-600 pt-1"
          >
            <div class="flex items-center gap-2">
              <Icon name="user" size="16" class="text-primary shrink-0" />
              <span
                >GV: <strong class="text-gray-800">{{ classInfo.nameTeacher }}</strong></span
              >
            </div>
            <div class="flex items-center gap-2">
              <Icon name="community" size="16" class="text-primary shrink-0" />
              <span
                >Sĩ số:
                <strong class="text-gray-800">{{ studentList.length }} học sinh</strong></span
              >
            </div>
            <div class="flex items-center gap-2">
              <Icon name="book" size="16" class="text-primary shrink-0" />
              <span
                >Môn học: <strong class="text-gray-800">{{ classInfo.subject }}</strong></span
              >
            </div>
            <div class="flex items-center gap-2">
              <Icon name="calendar-event" size="16" class="text-primary shrink-0" />
              <span
                >Ngày tham gia:
                <strong class="text-gray-800">{{ classInfo.joinDate }}</strong></span
              >
            </div>
            <div class="flex items-center gap-2">
              <Icon name="task" size="16" class="text-primary shrink-0" />
              <span
                >Số ca thi:
                <strong class="text-gray-800">{{ classInfo.quantitySession }} bài thi</strong></span
              >
            </div>
          </div>
        </div>

        <!-- Right: Teacher Contact Card -->
        <div
          class="shrink-0 flex items-center gap-3.5 bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs lg:w-72"
        >
          <div
            class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-bg to-secondary text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-2xs"
          >
            {{ getInitials(classInfo.nameTeacher) }}
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-xs text-gray-400 font-medium">Giáo viên phụ trách</span>
            <span class="text-sm font-bold text-gray-900 truncate">{{
              classInfo.nameTeacher
            }}</span>
            <span class="text-xs text-gray-500 truncate">{{ classInfo.teacherEmail }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Tabs & Content Area -->
    <div
      class="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col"
    >
      <!-- Tabs Navigation Header -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 px-4 sm:px-6 pt-3 sm:pt-4 pb-2 gap-3"
      >
        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <!-- Tab 1: Danh sách học sinh -->
          <button
            type="button"
            @click="activeTab = 'students'"
            class="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
            :class="
              activeTab === 'students'
                ? 'bg-button-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-primary-bg hover:bg-gray-100'
            "
          >
            <Icon name="community" size="16" />
            <span>Danh sách học sinh</span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="
                activeTab === 'students' ? 'bg-white/25 text-white' : 'bg-gray-200/80 text-gray-700'
              "
            >
              {{ filteredStudents.length }}
            </span>
          </button>

          <!-- Tab 2: Danh sách ca thi của lớp -->
          <button
            type="button"
            @click="activeTab = 'sessions'"
            class="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
            :class="
              activeTab === 'sessions'
                ? 'bg-button-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-primary-bg hover:bg-gray-100'
            "
          >
            <Icon name="calendar-check" size="16" />
            <span>Ca thi của lớp</span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="
                activeTab === 'sessions' ? 'bg-white/25 text-white' : 'bg-gray-200/80 text-gray-700'
              "
            >
              {{ classSessions.length }}
            </span>
          </button>

          <!-- Tab 3: Thông báo lớp học -->
          <button
            type="button"
            @click="activeTab = 'announcements'"
            class="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
            :class="
              activeTab === 'announcements'
                ? 'bg-button-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-primary-bg hover:bg-gray-100'
            "
          >
            <Icon name="document" size="16" />
            <span>Thông báo lớp</span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="
                activeTab === 'announcements'
                  ? 'bg-white/25 text-white'
                  : 'bg-gray-200/80 text-gray-700'
              "
            >
              {{ announcements.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- TAB 1 CONTENT: DANH SÁCH HỌC SINH -->
      <div v-if="activeTab === 'students'" class="flex flex-col">
        <!-- Search bar for students -->
        <div
          class="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/50"
        >
          <Search
            v-model="studentSearch"
            placeholder="Tìm kiếm học sinh theo tên, mã học sinh, email..."
            class="w-full sm:max-w-md"
          />
        </div>

        <!-- Student Table -->
        <div class="w-full overflow-x-auto">
          <table class="w-full border-collapse text-left text-xs sm:text-sm min-w-[700px]">
            <thead>
              <tr
                class="bg-[#F8FAFC] text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200"
              >
                <th class="py-3 px-4 text-center w-14">STT</th>
                <th class="py-3 px-4">Học sinh</th>
                <th class="py-3 px-4">Mã học sinh</th>
                <th class="py-3 px-4 text-center">Ngày tham gia</th>
                <th class="py-3 px-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(st, index) in filteredStudents"
                :key="st.id"
                :class="[
                  'hover:bg-primary/5 transition-colors',
                  st.isCurrentUser ? 'bg-sky-50/50' : '',
                ]"
              >
                <!-- STT -->
                <td class="py-3.5 px-4 text-center text-gray-500 font-medium">
                  {{ index + 1 }}
                </td>

                <!-- Học sinh info (Avatar + Tên + Tag Bạn) -->
                <td class="py-3.5 px-4">
                  <div class="flex items-center gap-3">
                    <div
                      :class="[
                        'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0',
                        st.isCurrentUser
                          ? 'bg-sky-600 text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-600',
                      ]"
                    >
                      {{ getInitials(st.name) }}
                    </div>
                    <div class="flex flex-col">
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-gray-900">{{ st.name }}</span>
                        <span
                          v-if="st.isCurrentUser"
                          class="px-2 py-0.2 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200"
                        >
                          Bạn
                        </span>
                      </div>
                      <span class="text-xs text-gray-400">{{ st.email }}</span>
                    </div>
                  </div>
                </td>

                <!-- Mã HS -->
                <td class="py-3.5 px-4 font-mono font-medium text-gray-700">
                  {{ st.studentCode }}
                </td>

                <!-- Ngày tham gia -->
                <td class="py-3.5 px-4 text-center text-xs text-gray-500 font-medium">
                  {{ st.joinDate }}
                </td>

                <!-- Trạng thái -->
                <td class="py-3.5 px-4 text-center">
                  <span
                    :class="[
                      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
                      st.status === 'Đang học'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200',
                    ]"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="st.status === 'Đang học' ? 'bg-emerald-500' : 'bg-gray-400'"
                    ></span>
                    <span>{{ st.status }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty Search State -->
          <div
            v-if="filteredStudents.length === 0"
            class="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-2"
          >
            <Icon name="search" size="28" class="text-gray-400" />
            <p class="font-medium text-sm">Không tìm thấy học sinh nào phù hợp với từ khóa.</p>
          </div>
        </div>
      </div>

      <!-- TAB 2 CONTENT: CA THI CỦA LỚP -->
      <div v-else-if="activeTab === 'sessions'" class="p-5 flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="session in classSessions"
            :key="session.id"
            class="p-5 rounded-2xl border border-gray-200/80 bg-white hover:border-primary-bg/50 hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span
                  :class="[
                    'px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider',
                    session.status === 'Đang diễn ra'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse'
                      : session.status === 'Sắp diễn ra'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200',
                  ]"
                >
                  {{ session.status }}
                </span>
                <span class="text-xs text-gray-400 font-medium">{{ session.duration }}</span>
              </div>

              <h3 class="font-bold text-base text-gray-900 leading-snug">
                {{ session.title }}
              </h3>

              <div class="flex flex-col gap-1 text-xs text-gray-500 mt-1">
                <div class="flex items-center gap-2">
                  <Icon name="calendar-event" size="14" class="text-primary-bg shrink-0" />
                  <span>Bắt đầu: {{ session.startTime }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Icon name="task" size="14" class="text-primary-bg shrink-0" />
                  <span>Số lượng: {{ session.questionCount }} câu trắc nghiệm</span>
                </div>
              </div>
            </div>

            <!-- Action button based on session status -->
            <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div v-if="session.myScore !== null" class="flex items-baseline gap-1">
                <span class="text-xs text-gray-400">Điểm của bạn:</span>
                <span class="text-lg font-bold text-emerald-600">{{ session.myScore }}</span>
                <span class="text-xs text-gray-400">/ 10</span>
              </div>
              <div v-else class="text-xs text-gray-400 italic">Chưa làm bài</div>

              <router-link v-if="session.myScore !== null" :to="`/student/results/${session.id}`">
                <Button variant="outline" customClass="py-1.5 px-3 text-xs rounded-lg">
                  Xem kết quả
                </Button>
              </router-link>
              <router-link
                v-else-if="session.status === 'Đang diễn ra'"
                :to="`/student/take-exam/${session.id}`"
              >
                <Button variant="primary" customClass="py-1.5 px-3 text-xs rounded-lg">
                  Vào thi ngay
                </Button>
              </router-link>
              <Button
                v-else
                variant="disabled"
                customClass="py-1.5 px-3 text-xs rounded-lg cursor-not-allowed"
              >
                Chưa mở
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3 CONTENT: THÔNG BÁO LỚP HỌC -->
      <div v-else-if="activeTab === 'announcements'" class="p-5 flex flex-col gap-4">
        <div
          v-for="ann in announcements"
          :key="ann.id"
          class="p-4 sm:p-5 rounded-2xl border border-gray-200/80 bg-white hover:border-gray-300 transition-all flex flex-col gap-2.5"
        >
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-primary-bg"></span>
              <h3 class="font-bold text-sm sm:text-base text-gray-900">{{ ann.title }}</h3>
            </div>
            <span class="text-xs text-gray-400 font-medium">{{ ann.createdAt }}</span>
          </div>
          <p
            class="text-xs sm:text-sm text-gray-700 leading-relaxed pl-4.5 border-l-2 border-gray-200"
          >
            {{ ann.content }}
          </p>
          <div class="flex items-center gap-2 text-xs text-gray-500 pl-4.5">
            <span
              >Đăng bởi: <strong>{{ ann.author }}</strong></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '@/components/custom/Icon.vue'
import Button from '@/components/custom/Button.vue'
import Search from '@/components/custom/Search.vue'

const route = useRoute()

// Tabs State: 'students' | 'sessions' | 'announcements'
const activeTab = ref<'students' | 'sessions' | 'announcements'>('students')

// Filter state for students
const studentSearch = ref('')

// Class Detailed Information Map
const classListMap: Record<number, any> = {
  1: {
    id: 1,
    nameClass: 'Lớp 12A1',
    code: '12A1-2026',
    description: 'Chuyên Toán & Khoa học Tự nhiên',
    nameTeacher: 'ThS. Trần Văn A',
    teacherEmail: 'tranvana.c3@edu.vn',
    subject: 'Toán học 12',
    joinDate: '01/01/2023 22:07',
    quantitySession: 10,
  },
  2: {
    id: 2,
    nameClass: 'Trí tuệ nhân tạo',
    code: 'AI-2026',
    description: 'Học phần AI & Xử lý ngôn ngữ tự nhiên',
    nameTeacher: 'TS. Trần Văn B',
    teacherEmail: 'tranvanb.ai@edu.vn',
    subject: 'Trí tuệ nhân tạo',
    joinDate: '01/01/2025 10:30',
    quantitySession: 15,
  },
  3: {
    id: 3,
    nameClass: 'Lập trình C++',
    code: 'CPP-2026',
    description: 'Lập trình hướng đối tượng C++',
    nameTeacher: 'TS. Trần Văn C',
    teacherEmail: 'tranvanc.cntt@edu.vn',
    subject: 'Lập trình C++',
    joinDate: '11/11/2025 12:00',
    quantitySession: 20,
  },
}

const classId = computed(() => Number(route.params.id) || 1)
const classInfo = computed(() => classListMap[classId.value] || classListMap[1])

// Helper to get avatar initials
const getInitials = (name: string) => {
  if (!name) return 'HS'
  const parts = name.trim().split(' ').filter(Boolean)
  const first = parts[0]
  if (!first) return 'HS'
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1]
  if (!last) return first.slice(0, 2).toUpperCase()
  const c1 = first[0] || ''
  const c2 = last[0] || ''
  return (c1 + c2).toUpperCase()
}

// Detailed Mock Student List (42 Students participating in class)
interface Student {
  id: number
  name: string
  studentCode: string
  email: string
  joinDate: string
  status: 'Đang học' | 'Nghỉ học'
  isCurrentUser?: boolean
}

const studentList = ref<Student[]>([
  {
    id: 1,
    name: 'Nguyễn Minh Khoa',
    studentCode: 'HS12001',
    email: 'minhkhoa.12a1@school.edu.vn',
    joinDate: '01/01/2023',
    status: 'Đang học',
    isCurrentUser: true, // Current User
  },
  {
    id: 2,
    name: 'Trần Thị Mai Anh',
    studentCode: 'HS12002',
    email: 'maianh.12a1@school.edu.vn',
    joinDate: '01/01/2023',
    status: 'Đang học',
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    studentCode: 'HS12003',
    email: 'hoangnam.12a1@school.edu.vn',
    joinDate: '01/01/2023',
    status: 'Đang học',
  },
  {
    id: 4,
    name: 'Phạm Quỳnh Nga',
    studentCode: 'HS12004',
    email: 'quynhnga.12a1@school.edu.vn',
    joinDate: '02/01/2023',
    status: 'Đang học',
  },
  {
    id: 5,
    name: 'Vũ Đức Thịnh',
    studentCode: 'HS12005',
    email: 'ducthinh.12a1@school.edu.vn',
    joinDate: '02/01/2023',
    status: 'Đang học',
  },
  {
    id: 6,
    name: 'Đặng Thảo Vy',
    studentCode: 'HS12006',
    email: 'thaovy.12a1@school.edu.vn',
    joinDate: '02/01/2023',
    status: 'Đang học',
  },
  {
    id: 7,
    name: 'Bùi Gia Huy',
    studentCode: 'HS12007',
    email: 'giahuy.12a1@school.edu.vn',
    joinDate: '03/01/2023',
    status: 'Đang học',
  },
  {
    id: 8,
    name: 'Đỗ Phương Linh',
    studentCode: 'HS12008',
    email: 'phuonglinh.12a1@school.edu.vn',
    joinDate: '03/01/2023',
    status: 'Đang học',
  },
  {
    id: 9,
    name: 'Hồ Tuấn Kiệt',
    studentCode: 'HS12009',
    email: 'tuankiet.12a1@school.edu.vn',
    joinDate: '03/01/2023',
    status: 'Đang học',
  },
  {
    id: 10,
    name: 'Dương Bảo Ngọc',
    studentCode: 'HS12010',
    email: 'baongoc.12a1@school.edu.vn',
    joinDate: '04/01/2023',
    status: 'Đang học',
  },
  {
    id: 11,
    name: 'Võ Minh Quân',
    studentCode: 'HS12011',
    email: 'minhquan.12a1@school.edu.vn',
    joinDate: '04/01/2023',
    status: 'Đang học',
  },
  {
    id: 12,
    name: 'Ngô Thanh Hà',
    studentCode: 'HS12012',
    email: 'thanhha.12a1@school.edu.vn',
    joinDate: '04/01/2023',
    status: 'Đang học',
  },
  {
    id: 13,
    name: 'Lý Quốc Bảo',
    studentCode: 'HS12013',
    email: 'quocbao.12a1@school.edu.vn',
    joinDate: '05/01/2023',
    status: 'Đang học',
  },
  {
    id: 14,
    name: 'Phan Thu Trang',
    studentCode: 'HS12014',
    email: 'thutrang.12a1@school.edu.vn',
    joinDate: '05/01/2023',
    status: 'Đang học',
  },
  {
    id: 15,
    name: 'Đinh Trọng Hiếu',
    studentCode: 'HS12015',
    email: 'tronghieu.12a1@school.edu.vn',
    joinDate: '05/01/2023',
    status: 'Đang học',
  },
  {
    id: 16,
    name: 'Mai Khánh Linh',
    studentCode: 'HS12016',
    email: 'khanhlinh.12a1@school.edu.vn',
    joinDate: '06/01/2023',
    status: 'Đang học',
  },
  {
    id: 17,
    name: 'Lương Hoàng Long',
    studentCode: 'HS12017',
    email: 'hoanglong.12a1@school.edu.vn',
    joinDate: '06/01/2023',
    status: 'Đang học',
  },
  {
    id: 18,
    name: 'Trịnh Thùy Dung',
    studentCode: 'HS12018',
    email: 'thuydung.12a1@school.edu.vn',
    joinDate: '06/01/2023',
    status: 'Đang học',
  },
  {
    id: 19,
    name: 'Chu Tiến Đạt',
    studentCode: 'HS12019',
    email: 'tiendat.12a1@school.edu.vn',
    joinDate: '07/01/2023',
    status: 'Đang học',
  },
  {
    id: 20,
    name: 'Tạ Minh Anh',
    studentCode: 'HS12020',
    email: 'minhanh.12a1@school.edu.vn',
    joinDate: '07/01/2023',
    status: 'Đang học',
  },
])

// Filtered Students Computed
const filteredStudents = computed(() => {
  return studentList.value.filter((st) => {
    // Search by name or code
    if (studentSearch.value) {
      const q = studentSearch.value.toLowerCase().trim()
      const matchName = st.name.toLowerCase().includes(q)
      const matchCode = st.studentCode.toLowerCase().includes(q)
      const matchEmail = st.email.toLowerCase().includes(q)
      if (!matchName && !matchCode && !matchEmail) return false
    }

    return true
  })
})

// Class Exam Sessions Mock Data
const classSessions = ref([
  {
    id: 1,
    title: 'Kiểm tra giữa kì 2 - Toán học 12',
    startTime: '15/10/2026 08:30',
    duration: '45 phút',
    questionCount: 25,
    status: 'Đã kết thúc',
    myScore: 8.8,
  },
  {
    id: 2,
    title: 'Kiểm tra 15 phút - Tích phân & Nguyên hàm',
    startTime: '20/10/2026 09:15',
    duration: '15 phút',
    questionCount: 15,
    status: 'Đã kết thúc',
    myScore: 9.0,
  },
  {
    id: 3,
    title: 'Luyện tập chuyên đề Hình học không gian Oxyz',
    startTime: '25/10/2026 14:00',
    duration: '60 phút',
    questionCount: 30,
    status: 'Đang diễn ra',
    myScore: null,
  },
  {
    id: 4,
    title: 'Khảo sát chất lượng Toán học cuối kỳ 1',
    startTime: '10/11/2026 08:00',
    duration: '90 phút',
    questionCount: 50,
    status: 'Sắp diễn ra',
    myScore: null,
  },
])

// Class Announcements Mock Data
const announcements = ref([
  {
    id: 1,
    title: 'Lịch thi khảo sát chất lượng giữa kì đợt 2',
    content:
      'Các em học sinh chuẩn bị đầy đủ máy tính cầm tay và giấy nháp cho ca thi giữa kỳ đợt 2 diễn ra vào tuần tới. Đề thi gồm 25 câu trắc nghiệm thời gian 45 phút.',
    createdAt: '12/10/2026 14:20',
    author: 'ThS. Trần Văn A',
  },
  {
    id: 2,
    title: 'Đã mở đề ôn tập chuyên đề Hình học không gian Oxyz',
    content:
      'Thầy đã kích hoạt ca luyện tập chuyên đề Oxyz trên hệ thống. Các bạn có thể vào thi thử để rèn luyện tốc độ làm bài trước khi kiểm tra chính thức.',
    createdAt: '08/10/2026 10:15',
    author: 'ThS. Trần Văn A',
  },
])
</script>
