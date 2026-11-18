<template>
  <div class="w-full h-full flex flex-col gap-6 sm:gap-8 lg:gap-10 pb-8 sm:pb-10">
    <!-- Header -->
    <div
      class="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 lg:gap-10 bg-header px-5 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-8 rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow"
    >
      <div class="flex flex-col flex-1 items-start gap-4 sm:gap-6 lg:gap-7 min-w-0">
        <h1 class="text-4xl font-bold text-primary">Chào {{ timeOfDay }}, Giáo viên</h1>
        <p class="text-secondary font-medium text-lg">
          Hãy cùng kiến tạo những trải nghiệm học tập tuyệt vời cho học sinh của bạn ngày hôm nay.
        </p>
        <div
          class="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 lg:gap-10 text-primary text-lg font-semibold"
        >
          <div class="flex items-center gap-3 shrink-0">
            <Icon name="calendar" size="24"></Icon>
            <span>{{ formatDate }}</span>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <Icon name="calendar-event" size="24"></Icon>
            <span>Ca thi hôm nay: </span>
          </div>
        </div>
      </div>
      <div
        class="w-full md:w-72 lg:w-95 h-44 sm:h-52 md:h-52.5 shrink-0 object-cover rounded-2xl sm:rounded-3xl overflow-hidden"
      >
        <img
          class="w-full h-full object-cover"
          src="https://img.meta.com.vn/Data/image/2021/09/22/anh-meo-cute-de-thuong-dang-yeu-16.jpg"
          alt=""
        />
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      <!-- Quản lý lớp học -->
      <router-link
        to="/teacher/class-manage"
        class="group hover:-translate-y-1 transition-all duration-200 flex flex-row sm:flex-col items-center gap-3.5 sm:gap-0 bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-md sm:shadow-lg cursor-pointer select-none"
      >
        <div
          class="p-2.5 sm:px-3 sm:py-3 rounded-xl sm:rounded-2xl bg-primary/10 w-fit group-hover:scale-110 transition-all duration-300 shrink-0 flex items-center justify-center"
        >
          <Icon name="community" size="24" color="#0c6a9e"></Icon>
        </div>
        <div class="flex flex-col min-w-0 text-left sm:text-center sm:items-center">
          <span
            class="sm:mt-4 lg:mt-6 text-black font-semibold text-base sm:text-lg truncate sm:whitespace-normal"
          >
            Quản lý lớp học
          </span>
          <p
            class="text-medium text-sm text-black/60 sm:text-inherit text-left sm:text-center mt-0.5 sm:mt-2 lg:mt-3 truncate sm:whitespace-normal"
          >
            Theo dõi tiến độ, quản lý danh sách và phê duyệt học sinh tham gia.
          </p>
        </div>
        <div
          class="hidden sm:block mt-4 sm:mt-auto w-full text-center text-sm bg-primary text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 group-hover:bg-primary/90"
        >
          Xem chi tiết
        </div>
      </router-link>

      <!-- Quản lý đề thi -->
      <router-link
        to="/teacher/exam-manage"
        class="group hover:-translate-y-1 transition-all duration-200 flex flex-row sm:flex-col items-center gap-3.5 sm:gap-0 sm:bg-button bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-md sm:shadow-lg cursor-pointer select-none"
      >
        <div
          class="p-2.5 sm:px-3 sm:py-3 rounded-xl sm:rounded-2xl sm:bg-white/10 max-md:bg-green-100 w-fit group-hover:scale-110 transition-all duration-300 shrink-0 flex items-center justify-center"
        >
          <Icon
            name="document"
            :class="isMobile ? 'text-green-400' : 'text-white'"
            size="24"
          ></Icon>
        </div>
        <div class="flex flex-col min-w-0 text-left sm:text-center sm:items-center">
          <span
            class="sm:text-white text-black/80 font-semibold text-base sm:text-lg sm:mt-4 lg:mt-6 truncate sm:whitespace-normal"
          >
            Quản lý đề thi
          </span>
          <p
            class="text-medium text-sm text-left sm:text-center text-black/60 sm:text-white/80 mt-0.5 sm:mt-2 lg:mt-3 truncate sm:whitespace-normal"
          >
            Tạo đề thi chuyên nghiệp bằng AI OCR từ ảnh hoặc file PDF.
          </p>
        </div>
        <div
          class="hidden sm:block mt-4 sm:mt-auto w-full text-center text-sm bg-white text-primary font-medium py-2.5 px-6 rounded-xl transition-all duration-200 group-hover:bg-gray-200"
        >
          Tạo đề ngay
        </div>
      </router-link>

      <!-- Tổ chức ca thi -->
      <router-link
        to="/teacher/session-manage"
        class="group hover:-translate-y-1 transition-all duration-200 flex flex-row sm:flex-col items-center gap-3.5 sm:gap-0 bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-md sm:shadow-lg cursor-pointer select-none sm:col-span-2 lg:col-span-1"
      >
        <div
          class="p-2.5 sm:px-3 sm:py-3 rounded-xl sm:rounded-2xl bg-orange/10 w-fit group-hover:scale-110 transition-all duration-300 shrink-0 flex items-center justify-center"
        >
          <Icon name="calendar-check" size="24" color="#FF835D"></Icon>
        </div>
        <div class="flex flex-col min-w-0 text-left sm:text-center sm:items-center">
          <span
            class="sm:mt-4 lg:mt-6 text-black font-semibold text-base sm:text-lg truncate sm:whitespace-normal"
          >
            Tổ chức ca thi
          </span>
          <p
            class="text-medium text-sm text-black/60 sm:text-inherit text-left sm:text-center mt-0.5 sm:mt-2 lg:mt-3 truncate sm:whitespace-normal"
          >
            Lên lịch, thiết lập mật khẩu và giám sát quá trình làm bài.
          </p>
        </div>
        <div
          class="hidden sm:block mt-4 sm:mt-auto w-full text-center text-sm bg-white text-orange font-medium py-2.5 px-6 rounded-xl transition-all duration-200 border border-[#FF835D] group-hover:bg-orange group-hover:text-white"
        >
          Lên lịch
        </div>
      </router-link>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-10">
      <div class="bg-white shadow-sm rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6">
        <div class="text-xl text-black/80 font-bold">Tính năng nổi bật</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5">
          <div
            v-for="(feature, index) in listFeature"
            :key="index"
            class="p-4 sm:p-6 lg:p-8 bg-primary/4 hover:bg-primary/6 transition-all duration-200 cursor-pointer rounded-2xl flex items-center gap-4 sm:gap-6 lg:gap-8"
          >
            <div class="p-3 rounded-xl shrink-0" :class="feature.bgicon">
              <Icon :name="feature.icon" :color="feature.color" size="24"></Icon>
            </div>
            <div class="flex flex-col gap-1.5 sm:gap-3 min-w-0">
              <span class="text-base font-semibold text-black/90 truncate">{{
                feature.title
              }}</span>
              <p class="text-sm">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="h-full flex flex-col mt-4 lg:mt-0">
        <div class="text-xl text-black/80 font-bold">Thống kê nhanh</div>
        <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 mt-4 sm:mt-5 flex-1">
          <div
            v-for="(item, index) in listStatistic"
            :key="index"
            class="p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between shadow-sm text-black/70 gap-2"
            :class="item.bgColor"
          >
            <Icon :name="item.icon" size="24"></Icon>
            <span class="font-bold uppercase text-xs truncate">{{ item.title }}</span>
            <span class="font-bold text-xl sm:text-2xl">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.03)] gap-4 sm:gap-5"
    >
      <div class="flex justify-between items-center gap-2">
        <span class="text-xl text-black/80 font-bold">Ca thi gần đây</span>
        <router-link
          to="/teacher/session-manage"
          class="flex items-center gap-1 sm:gap-2 text-primary text-sm font-semibold hover:underline cursor-pointer transition-all duration-300 shrink-0"
          >Xem tất cả <Icon name="chevron-right" size="20"></Icon
        ></router-link>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="text-left w-full min-w-[500px]">
          <thead class="border-b-2 border-black/5">
            <tr class="uppercase text-xs text-gray-400 [&>th]:py-3 sm:[&>th]:py-4">
              <th>Tên ca thi</th>
              <th>Môn học</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in listExam" :key="index" class="[&>td]:py-3 sm:[&>td]:py-4">
              <td class="text-black/90 font-semibold text-sm">{{ item.name }}</td>
              <td>
                <span
                  class="w-fit inline-block bg-gray-100 rounded-3xl text-xs px-3 py-1.5 text-black/70 font-semibold truncate max-w-[180px]"
                  >{{ item.class }}</span
                >
              </td>
              <td class="text-sm text-black/80 font-medium">{{ item.time }}</td>
              <td>
                <span
                  class="w-fit inline-block bg-gray-100 rounded-3xl text-xs px-3.5 py-1.5 text-black/50 font-semibold"
                  >{{ item.status }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/custom/Icon.vue'
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 640) // 640px tương ứng với breakpoint 'sm' của Tailwind
const currentTime = ref(new Date())

const timeOfDay = computed(() => {
  const hour = currentTime.value.getHours()
  if (hour < 12) return 'buổi sáng'
  else if (hour >= 12 && hour < 18) return 'buổi chiều'
  else return 'buổi tối'
})

const formatTime = computed(() => {
  return currentTime.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const formatDate = computed(() => {
  return currentTime.value.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})

const listFeature = ref([
  {
    title: 'Tạo đề bằng AI (OCR)',
    icon: 'magic',
    bgicon: 'bg-[#0369A1]/20',
    color: '#0369A1',
    description: 'Chuyển đổi ảnh chụp đề thi thành văn bản số hóa tức thì.',
  },
  {
    title: 'Giám sát chống gian lận',
    icon: 'shield-quarter',
    bgicon: 'bg-[#EF4444]/20',
    color: '#EF4444',
    description: 'Đảo câu hỏi, đảo đáp án và cảnh báo khi chuyển tab.',
  },

  {
    title: 'Báo cáo thông minh',
    icon: 'chart',
    bgicon: 'bg-[#006B28]/20',
    color: '#006B28',
    description: 'Tự động tổng hợp kết quả và phân tích học lực ngay sau ca thi.',
  },
  {
    title: 'Tìm kiếm siêu tốc',
    icon: 'search',
    bgicon: 'bg-[#FBBB01]/20',
    color: '#FBBB01',
    description: 'Truy xuất dữ liệu đề thi, học sinh, ca thi ngay lập tức.',
  },
])

const listStatistic = ref([
  {
    title: 'Tổng số lớp học',
    icon: 'education',
    bgColor: 'bg-[#E1F0FF]',
    value: 0,
  },
  {
    title: 'Đề thi đã tạo',
    icon: 'document',
    bgColor: 'bg-[#FFE1EB]',
    value: 0,
  },
  {
    title: 'Ca thi đang diễn ra',
    icon: 'broadcast',
    bgColor: 'bg-[#00C248]/10',
    value: 0,
  },
  {
    title: 'Ca thi sắp tới',
    icon: 'calendar-event',
    bgColor: 'bg-[#FFF9E1]',
    value: 0,
  },
])

const listExam = ref([
  {
    id: '1',
    name: 'Ca thi Web Frontend React',
    class: 'Web Forntend React - D18CNPM5',
    time: '13:30 - 14:15',
    status: 'Đã kết thúc',
  },
  {
    id: '2',
    name: 'Ca thi Phân tích hệ thống',
    class: 'Phân tích hệ thống - D18CNPM2',
    time: '14:00 - 16:00',
    status: 'Đang diễn ra',
  },
  {
    id: '3',
    name: 'Ca thi Kỹ thuật phần mềm',
    class: 'Kỹ thuật phần mềm - D18CNPM4',
    time: '13:30 - 14:15',
    status: 'Sắp diễn ra',
  },
])
</script>
