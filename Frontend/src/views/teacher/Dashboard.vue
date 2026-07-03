<template>
  <div class="w-full h-full flex flex-col gap-10">
    <!-- Header -->
    <div class="w-full flex items-center gap-10 bg-header px-10 py-6 rounded-4xl shadow">
      <div class="flex flex-col flex-1 items-start gap-7">
        <h1 class="text-4xl font-bold text-primary">Chào {{ timeOfDay }}, Giáo viên</h1>
        <p class="text-secondary font-medium text-lg">
          Hãy cùng kiến tạo những trải nghiệm học tập tuyệt vời cho học sinh của bạn ngày hôm nay.
        </p>
        <div class="w-full flex items-center gap-10 text-primary text-lg font-semibold">
          <div class="flex items-center gap-3">
            <Icon name="calendar" size="24"></Icon>
            <span>{{ formatDate }}</span>
          </div>
          <div class="flex items-center gap-3">
            <Icon name="calendar-event" size="24"></Icon>
            <span>Ca thi hôm nay: </span>
          </div>
        </div>
      </div>
      <div class="w-95 h-52.5 object-cover rounded-3xl overflow-hidden">
        <img
          src="https://img.meta.com.vn/Data/image/2021/09/22/anh-meo-cute-de-thuong-dang-yeu-16.jpg"
          alt=""
        />
      </div>
    </div>
    <div class="grid gap-5" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))">
      <div
        class="group hover:-translate-y-1 transition-all duration-200 flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg"
      >
        <div
          class="px-3 py-3 rounded-2xl bg-primary/10 w-fit group-hover:scale-110 transition-all duration-300"
        >
          <Icon name="community" size="32" color="#0c6a9e"></Icon>
        </div>
        <span class="mt-6 text-black font-semibold text-lg">Quản lý lớp học</span>
        <p class="text-medium text-sm text-center mt-3">
          Theo dõi tiến độ, quản lý danh sách và phê duyệt học sinh tham gia.
        </p>
        <button
          class="mt-auto w-full text-sm bg-primary text-white font-medium py-2.5 px-6 rounded-xl cursor-pointer transition-all duration-200 hover:bg-primary/90"
        >
          Xem chi tiết
        </button>
      </div>
      <div
        class="group hover:-translate-y-1 transition-all duration-200 flex flex-col items-center bg-button p-6 rounded-3xl shadow-lg"
      >
        <div
          class="px-3 py-3 rounded-2xl bg-white/10 w-fit group-hover:scale-110 transition-all duration-300"
        >
          <Icon name="document" color="white" size="32"></Icon>
        </div>
        <span class="text-white font-semibold text-lg mt-6">Quản lý đề thi</span>
        <p class="text-medium text-sm text-center text-white/80 mt-3">
          Tạo đề thi chuyên nghiệp bằng AI OCR từ ảnh hoặc file PDF.
        </p>
        <button
          class="mt-auto w-full text-sm bg-white text-primary font-medium py-2.5 px-6 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-200"
        >
          Tạo đề ngay
        </button>
      </div>
      <div
        class="group hover:-translate-y-1 transition-all duration-200 flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg"
      >
        <div
          class="px-3 py-3 rounded-2xl bg-orange/10 w-fit group-hover:scale-110 transition-all duration-300"
        >
          <Icon name="calendar-check" size="32" color="#FF835D"></Icon>
        </div>
        <span class="mt-6 text-black font-semibold text-lg">Tổ chức ca thi</span>
        <p class="text-medium text-sm text-center mt-3">
          Lên lịch, thiết lập mật khẩu và giám sát quá trình làm bài.
        </p>
        <button
          class="mt-6 w-full text-sm bg-white text-orange font-medium py-2.5 px-6 rounded-xl cursor-pointer transition-all duration-200 hover:bg-orange border border-[#FF835D] hover:text-white"
        >
          Lên lịch
        </button>
      </div>
    </div>
    <div class="grid grid-cols-[2fr_1fr] gap-10">
      <div class="bg-white shadow-sm rounded-3xl px-6 py-5">
        <div class="text-xl text-black/80 font-bold">Tính năng nổi bật</div>
        <div
          class="grid gap-5 mt-5"
          style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"
        >
          <div
            v-for="(feature, index) in listFeature"
            :key="index"
            class="p-10 bg-primary/4 hover:bg-primary/6 transition-all duration-200 cursor-pointer rounded-2xl flex items-center gap-10"
          >
            <div class="p-3 rounded-xl" :class="feature.bgicon">
              <Icon :name="feature.icon" :color="feature.color" size="24"></Icon>
            </div>
            <div class="flex flex-col gap-3">
              <span class="text-base font-semibold text-black/90">{{ feature.title }}</span>
              <p class="text-sm">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="h-full flex flex-col">
        <div class="text-xl text-black/80 font-bold">Thống kê nhanh</div>
        <div
          class="grid gap-5 mt-5 flex-1"
          style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))"
        >
          <div
            v-for="(item, index) in listStatistic"
            :key="index"
            class="p-4 rounded-2xl flex flex-col justify-between shadow-sm text-black/70"
            :class="item.bgColor"
          >
            <Icon :name="item.icon" size="24"></Icon>
            <span class="font-bold uppercase text-xs">{{ item.title }}</span>
            <span class="font-bold text-2xl">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col p-6 bg-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.03)] gap-5">
      <div class="flex justify-between items-center">
        <span class="text-xl text-black/80 font-bold">Ca thi gần đây</span>
        <router-link
          to="/teacher/session-manage"
          class="flex items-center gap-2 text-primary text-sm font-semibold hover:underline cursor-pointer transition-all duration-300"
          >Xem tất cả <Icon name="chevron-right" size="20"></Icon
        ></router-link>
      </div>
      <table class="text-left">
        <thead class="border-b-2 border-black/5">
          <tr class="uppercase text-xs text-gray-400 [&>th]:py-4">
            <th>Tên ca thi</th>
            <th>Môn học</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in listExam" :key="index" class="[&>td]:py-4">
            <td class="text-black/90 font-semibold text-sm">{{ item.name }}</td>
            <td>
              <span
                class="w-40 h-6 bg-gray-100 rounded-3xl text-xs px-3 py-2 text-black/70 font-semibold"
                >{{ item.class }}</span
              >
            </td>
            <td class="text-sm text-black/80 font-medium">{{ item.time }}</td>
            <td>
              <span
                class="w-40 h-6 bg-gray-100 rounded-3xl text-xs px-4 py-2 text-black/50 font-semibold"
                >{{ item.status }}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/custom/Icon.vue'
import { computed, ref } from 'vue'

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
