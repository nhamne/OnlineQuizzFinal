<template>
  <div class="w-full h-full flex flex-col gap-5 sm:gap-8 pb-8">
    <!-- Class Header & Back button -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
        <router-link to="/teacher/class-manage" class="hover:text-primary transition-colors">
          Danh sách lớp học
        </router-link>
        <span>/</span>
        <span class="text-gray-800 font-semibold truncate">Chi tiết lớp học</span>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
        <div>
          <h1 class="font-bold text-xl sm:text-2xl lg:text-3xl text-black/85">
            Kiểm thử và đảm bảo chất lượng phần mềm
          </h1>
          <div class="mt-1.5 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span>Mã tham gia:</span>
            <span class="inline-flex items-center gap-1.5 font-bold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-lg">
              <span>XZYZ4321</span>
              <Icon
                :name="isCopied ? 'check' : 'copy'"
                size="14"
                class="cursor-pointer hover:text-primary transition-colors"
                @click="copyCode('XZYZ4321')"
              />
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs sm:text-sm bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-xl border border-blue-200/60">
            Sĩ số: 41 Sinh viên
          </span>
        </div>
      </div>
    </div>

    <!-- Main Card Tabs & Tables -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Tabs Navigation -->
      <div class="flex border-b border-gray-100 overflow-x-auto">
        <div
          v-for="item in listtitle"
          :key="item.key"
          @click="currentitem = item.key"
          class="relative flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 sm:px-6 font-semibold cursor-pointer transition-all text-xs sm:text-sm shrink-0 whitespace-nowrap"
          :class="currentitem === item.key ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary/80'"
        >
          <Icon :name="item.icon" size="18" />
          <span>{{ item.label }}</span>
          <div
            class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-all duration-300"
            :class="currentitem === item.key ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
          ></div>
        </div>
      </div>

      <!-- Action Search Bar -->
      <div class="p-3 sm:p-5 flex items-center justify-between gap-3 border-b border-gray-100">
        <Search
          v-model="searchQuery"
          class="flex-1 min-w-0"
          :placeholder="currentitem === 'student' ? 'Tìm kiếm sinh viên...' : 'Tìm kiếm ca thi...'"
        />
        <button
          type="button"
          class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
          title="Tùy chọn khác"
        >
          <Icon name="dots-circle" size="22" />
        </button>
      </div>

      <!-- Table Content (Horizontal scrollable on mobile) -->
      <div class="p-2 sm:p-4">
        <div class="overflow-x-auto custom-scrollbar">
          <div class="min-w-[620px]">
            <Transition name="fade" mode="out-in">
              <!-- Student Table -->
              <Table v-if="currentitem === 'student'" :listTitle="titletable1" :listBody="filteredStudents">
                <template #action="{ item }">
                  <span
                    @click.stop="handleRemoveStudent(item.id)"
                    class="inline-flex justify-center items-center group p-1.5 rounded-lg transition-all duration-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                    title="Xóa học sinh khỏi lớp"
                  >
                    <Icon name="user-minus" size="18" />
                  </span>
                </template>
              </Table>

              <!-- Exam Table -->
              <Table v-else-if="currentitem === 'exam'" :listTitle="titletable2" :listBody="filteredExams">
                <template #status="{ item }">
                  <span
                    :class="
                      item.status === 'Đang diễn ra'
                        ? 'text-green-700 bg-green-50 border-green-200'
                        : item.status === 'Sắp diễn ra'
                          ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
                          : 'text-gray-600 bg-gray-50 border-gray-200'
                    "
                    class="inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                  >
                    {{ item.status }}
                  </span>
                </template>
                <template #averageScore="{ item }">
                  <span class="font-bold text-primary">{{ item.averageScore }}</span>
                </template>
              </Table>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Remove Student Popup -->
    <PopupConfirm
      v-model="isOpenPopupConfirm"
      variant="warning"
      :message="`Bạn có chắc chắn muốn xóa học sinh ${nameStudent} khỏi lớp?`"
      title="Xóa học sinh"
    ></PopupConfirm>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/custom/Icon.vue'
import { ref, computed } from 'vue'
import Search from '@/components/custom/Search.vue'
import Table from '@/components/custom/Table.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'

const currentitem = ref<string>('student')
const isOpenPopupConfirm = ref<boolean>(false)
const nameStudent = ref<string>('')
const searchQuery = ref<string>('')
const isCopied = ref(false)

const copyCode = (code: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 1500)
  }
}

const listtitle = ref([
  { label: 'Danh sách Sinh viên', key: 'student', icon: 'form' },
  { label: 'Danh sách ca thi', key: 'exam', icon: 'task' },
])

const titletable1 = ref([
  { title: 'Họ và tên', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Ngày tham gia', key: 'joinDate', tdClass: 'text-xs sm:text-sm text-gray-500' },
  { title: 'Thao tác', key: 'action', thClass: 'text-center', tdClass: 'text-center' },
])

const titletable2 = ref([
  { title: 'Tên ca thi', key: 'name' },
  {
    title: 'Số học sinh tham gia',
    key: 'participantCount',
    tdClass: 'text-center text-xs sm:text-sm',
    thClass: 'text-center',
  },
  { title: 'Trạng thái', key: 'status', tdClass: 'text-center', thClass: 'text-center' },
  { title: 'Điểm trung bình', key: 'averageScore', tdClass: 'text-center font-bold', thClass: 'text-center' },
])

const listStudent = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    joinDate: '22/06/2025',
  },
  {
    id: 2,
    name: 'Nguyễn Văn B',
    email: 'emailstudent@gmail.com',
    joinDate: '22/06/2025',
  },
  {
    id: 3,
    name: 'Trần Thị C',
    email: 'tranthic@gmail.com',
    joinDate: '22/06/2025',
  },
  {
    id: 4,
    name: 'Lê Văn D',
    email: 'levand@gmail.com',
    joinDate: '22/06/2025',
  },
  {
    id: 5,
    name: 'Phạm Thị E',
    email: 'phamthie@gmail.com',
    joinDate: '22/06/2025',
  },
  {
    id: 6,
    name: 'Hoàng Văn F',
    email: 'hoangvanf@gmail.com',
    joinDate: '22/06/2025',
  },
]

const listExam = [
  {
    id: 1,
    name: 'Ca thi số 01 - Kiểm tra 15p',
    participantCount: '41',
    status: 'Đã kết thúc',
    averageScore: '8.5',
  },
  {
    id: 2,
    name: 'Ca thi số 02 - Giữa kỳ',
    participantCount: '29',
    status: 'Sắp diễn ra',
    averageScore: '---',
  },
  {
    id: 3,
    name: 'Ca thi số 03 - Thực hành',
    participantCount: '40',
    status: 'Đang diễn ra',
    averageScore: '---',
  },
  {
    id: 4,
    name: 'Ca thi số 04 - Cuối kỳ',
    participantCount: '31',
    status: 'Đã kết thúc',
    averageScore: '8.2',
  },
]

const filteredStudents = computed(() => {
  if (!searchQuery.value.trim()) return listStudent
  const q = searchQuery.value.toLowerCase().trim()
  return listStudent.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
})

const filteredExams = computed(() => {
  if (!searchQuery.value.trim()) return listExam
  const q = searchQuery.value.toLowerCase().trim()
  return listExam.filter((e) => e.name.toLowerCase().includes(q) || e.status.toLowerCase().includes(q))
})

const handleRemoveStudent = (id: number) => {
  nameStudent.value = listStudent.find((item) => item.id === id)?.name || ''
  isOpenPopupConfirm.value = true
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(15px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}
</style>
