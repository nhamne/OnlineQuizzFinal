<template>
  <div class="w-full h-full flex flex-col gap-6 sm:gap-8 lg:gap-10 pb-8 sm:pb-10">
    <!-- Header -->
    <div class="w-full flex rounded-2xl sm:rounded-3xl shadow overflow-hidden relative z-0">
      <div class="bg-[#085D96]/85 absolute inset-0 z-10"></div>
      <div
        class="flex flex-col flex-1 items-start justify-center gap-4 sm:gap-6 lg:gap-7 px-5 py-8 sm:px-8 sm:py-14 lg:px-10 lg:py-20 relative z-10"
      >
        <h1 class="text-4xl font-bold text-white">Chào {{ timeOfDay }}, Học viên</h1>
        <p class="text-white font-medium text-lg">
          Đây là nơi bạn theo dõi tiến độ học tập, điểm số trung bình và các kết quả thi gần đây.
        </p>
      </div>
      <img
        class="absolute right-0 bottom-0 h-full w-48 sm:w-80 md:w-110 lg:w-150 object-cover z-0 opacity-40 sm:opacity-70 lg:opacity-100"
        src="https://img.meta.com.vn/Data/image/2021/09/22/anh-meo-cute-de-thuong-dang-yeu-16.jpg"
        alt=""
      />
    </div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-6 lg:px-10 mt-0 sm:-mt-10 md:-mt-14 lg:-mt-16 xl:-mt-20 relative z-20"
    >
      <router-link
        to="/student/join-class"
        class="group flex items-center gap-3 sm:gap-4 bg-white/90 sm:bg-white/70 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-md rounded-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer select-none"
      >
        <div
          class="bg-primary/20 flex items-center justify-center p-2 rounded-lg text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-200 shrink-0"
        >
          <Icon name="plus-circle" size="24"></Icon>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-semibold text-lg text-black/90 truncate">Tham gia lớp học</span>
          <span class="font-normal text-sm text-black/60 truncate">Nhập mã định danh lớp</span>
        </div>
      </router-link>
      <router-link
        to="/student/my-sessions"
        class="group flex items-center gap-3 sm:gap-4 bg-white/90 sm:bg-white/70 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-md rounded-xl cursor-pointer hover:-translate-y-1 transition-all duration-200 select-none"
      >
        <div
          class="bg-green-700/20 text-green-700/90 flex items-center justify-center p-2 rounded-lg group-hover:bg-green-700 group-hover:text-white transition-all duration-200 shrink-0"
        >
          <Icon name="play-circle" size="24"></Icon>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-semibold text-lg text-black/90 truncate">Ca thi đang diễn ra</span>
          <span class="font-normal text-sm text-black/60 truncate">Làm bài thi trực tuyến</span>
        </div>
      </router-link>
      <router-link
        to="/student/results"
        class="group flex items-center gap-3 sm:gap-4 bg-white/90 sm:bg-white/70 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-md rounded-xl cursor-pointer hover:-translate-y-1 transition-all duration-200 select-none sm:col-span-2 lg:col-span-1"
      >
        <div
          class="bg-yellow-700/20 text-yellow-700/90 flex items-center justify-center p-2 rounded-lg group-hover:bg-yellow-700 group-hover:text-white transition-all duration-200 shrink-0"
        >
          <Icon name="star" size="24"></Icon>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-semibold text-lg text-black/90 truncate">Xem kết quả thi</span>
          <span class="font-normal text-sm text-black/60 truncate">Thống kê điểm số kỳ thi</span>
        </div>
      </router-link>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-[3fr_1.5fr] gap-6 lg:gap-8">
      <!--Tiến độ học tập -->
      <div class="w-full h-full grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10">
        <div class="bg-white shadow-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
          <!--header-->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div class="flex flex-1 flex-col gap-1 min-w-0">
              <span class="text-xl text-black/80 font-bold truncate">Tiến độ học tập</span>
              <span class="text-sm text-black/60">Phổ điểm qua các ca thi gần nhất</span>
            </div>
            <DropdownFilter
              class="w-full sm:w-65 shrink-0"
              v-model="selecedClass"
              :list="listClass"
            ></DropdownFilter>
          </div>
          <!--Biểu đồ-->
          <div class="relative w-full h-75 mt-4">
            <apexchart
              type="area"
              height="300"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
          <div
            class="group flex flex-col justify-between items-start p-5 sm:p-6 lg:py-10 bg-primary/5 shadow-md rounded-2xl sm:rounded-3xl cursor-pointer border-2 border-secondary/20 text-primary hover:bg-primary/90 hover:text-white transition-all duration-300 gap-3"
          >
            <Icon name="document" size="30"></Icon>
            <h1
              class="group-hover:text-white text-black/80 font-semibold transition-all duration-300"
            >
              Lịch thi sắp tới
            </h1>
            <p class="text-sm text-gray-600 group-hover:text-white transition-all duration-300">
              Theo dõi và tham gia các ca thi mới nhất
            </p>
          </div>
          <div
            class="group flex flex-col justify-between items-start p-5 sm:p-6 lg:py-10 bg-green-700/5 shadow-md rounded-2xl sm:rounded-3xl cursor-pointer border-2 border-green-700/20 text-green-700 hover:bg-green-700 hover:text-white transition-all duration-300 gap-3"
          >
            <Icon name="history" size="30"></Icon>
            <h1
              class="group-hover:text-white text-black/80 font-semibold transition-all duration-300"
            >
              Lịch sử làm bài
            </h1>
            <p class="text-sm text-gray-600 group-hover:text-white transition-all duration-300">
              Xem lại danh sách các ca thi đã làm
            </p>
          </div>
          <div
            class="group flex flex-col justify-between items-start p-5 sm:p-6 lg:py-10 bg-yellow-700/5 shadow-md rounded-2xl sm:rounded-3xl cursor-pointer border-2 border-yellow-700/20 text-yellow-700 hover:bg-yellow-700 hover:text-white transition-all duration-300 gap-3 sm:col-span-2 lg:col-span-1"
          >
            <Icon name="start-2" size="30"></Icon>
            <h1
              class="group-hover:text-white text-black/80 font-semibold transition-all duration-300"
            >
              Kết quả thi
            </h1>
            <p class="text-sm text-gray-600 group-hover:text-white transition-all duration-300">
              Xem lại điểm số của bạn
            </p>
          </div>
        </div>
      </div>
      <!--Ca thi gần đây-->
      <div>
        <div class="flex items-center justify-between gap-2">
          <span class="text-xl text-black/80 font-bold">Ca thi gần đây</span>
          <router-link
            to="/student/my-sessions"
            class="text-primary font-medium cursor-pointer hover:underline transiton-all duration-200 shrink-0"
            >Xem tất cả</router-link
          >
        </div>
        <div>
          <!-- Thẻ ca thi -->
          <div
            v-for="(session, index) in listSession"
            :key="index"
            class="mt-4 sm:mt-5 flex flex-col gap-3 sm:gap-4 bg-white p-4 sm:py-5 border-l-4 border-secondary rounded-xl shadow-lg"
          >
            <div class="flex items-center justify-between gap-2">
              <h1 class="font-bold text-black/80 truncate">{{ session.title }}</h1>
              <div
                class="text-[10px] bg-secondary/20 p-1 rounded-sm uppercase text-secondary font-bold shrink-0"
              >
                {{ session.status }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="clock" size="20" class="shrink-0"></Icon>
              <span class="text-sm text-black/70">{{ session.time }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="calendar-alt" size="20" class="shrink-0"></Icon>
              <span class="text-sm text-black/70">{{ session.date }}</span>
            </div>
            <Button variant="secondary" class="w-full">Chi tiết ca thi</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import Icon from '@/components/custom/Icon.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import Button from '@/components/custom/Button.vue'

const apexchart = VueApexCharts
const currentTime = ref(new Date())

const timeOfDay = computed(() => {
  const hour = currentTime.value.getHours()
  if (hour < 12) return 'buổi sáng'
  else if (hour >= 12 && hour < 18) return 'buổi chiều'
  else return 'buổi tối'
})

// const formatTime = computed(() => {
//   return currentTime.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
// })

// const formatDate = computed(() => {
//   return currentTime.value.toLocaleDateString('vi-VN', {
//     weekday: 'long',
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   })
// })

const selecedClass = ref('001')

const listClass = [
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

// DỮ LIỆU ĐIỂM SỐ (Trục Y)
const series = ref([
  {
    name: 'Điểm của bạn',
    data: [6.0, 6.8, 7.5, 8.5, 9.4, 9.8, 9.2], // Giả lập các mốc điểm
  },
])
// CẤU HÌNH BIỂU ĐỒ (Linh hồn để giống y hệt ảnh)
const chartOptions = ref<ApexOptions>({
  chart: {
    type: 'area', // Loại biểu đồ có đổ màu bên dưới
    fontFamily: 'inherit',
    toolbar: { show: false }, // Ẩn menu tải ảnh của ApexChart
    zoom: { enabled: false }, // Ẩn zoom biểu đồ
  },
  colors: ['#2563EB'], // Màu xanh blue-600 của đường line
  dataLabels: {
    enabled: false, // Ẩn các con số hiện trực tiếp trên đường
  },
  stroke: {
    curve: 'smooth', // Bo cong đường line mềm mại thay vì gấp khúc thẳng
    width: 5, // Độ dày của đường kẻ
  },
  fill: {
    type: 'gradient', //loang màu thay vì 1 màu như solid
    gradient: {
      shadeIntensity: 0.5, // độ sáng của dài màu đổ xuống
      opacityFrom: 0.5, // Tăng độ đậm ở trên cùng để dễ nhìn thấy màu
      opacityTo: 0, // Độ mờ ở dưới cùng
      stops: [0, 100], // hiệu ứng chuyển màu bắt đầu từ trên cùng 0% đến dưới cùng 100%
    },
  },
  markers: {
    size: 5, // Kích thước cái chấm tròn
    colors: ['#ffffff'], // Lõi màu trắng
    strokeColors: '#2563eb', // Viền màu xanh
    strokeWidth: 2, // độ dày của viền quanh cái chấm
    hover: { size: 7 }, // Khi di chuột vào thì to lên
  },
  grid: {
    show: true,
    borderColor: '#f1f5f9', // Đường lưới ngang màu xám rất nhạt
    strokeDashArray: 0, // quyết định xem đường lưới kẻ ngang nét liền hay nét đứt: 0-> nét liền , 4,5-> nét đứt
    xaxis: { lines: { show: false } }, // Ẩn đường lưới dọc
    yaxis: { lines: { show: true } }, // Hiện đường lưới ngang
    padding: { top: 10, right: 20, bottom: 10, left: 20 }, // Tăng khoảng cách để chữ không bị che khuất
  },
  xaxis: {
    categories: ['Ca 1', 'Ca 2', 'Ca 3', 'Ca 4', 'Ca 5', 'Ca 6', 'Ca 7'],
    labels: {
      show: true,
      offsetY: 5, // Đẩy chữ trục X xuống một chút để cách xa trục hơn
    },
    axisBorder: { show: true }, // Hiện đường kẻ ngang trục X
    axisTicks: { show: true }, // Hiện đường kẻ dọc trục X
  },
  yaxis: {
    min: 0, // min, max là điểm bắt đầu và kết thúc của trục Y
    max: 10,
    tickAmount: 5, // Chia trục Y thành 10 khoảng (0, 2, 4, 6, 8, 10)
    labels: {
      offsetX: -10, // Đẩy chữ trục Y sang trái một chút để cách xa trục hơn
      style: { colors: '#64748b', fontSize: '12px', fontWeight: 500 },
      formatter: (val: number) => val.toFixed(1).replace('.0', ''), // Xóa số .0 cho đẹp (VD: 10.0 thành 10)
    },

    // val.toFixed(1): Ép các số lẻ hiển thị 1 chữ số thập phân (VD: 2.5)
    // .replace('.0', ''): Xóa số .0 cho đẹp (VD: 10.0 thành 10)
  },
  tooltip: {
    theme: 'light', // màu sắc cái bảng hiện lên khi hover vào biểu đồ
    y: { formatter: (val: number) => val + ' điểm' }, // nối thêm chữ "điểm" vào sau số
  },
})

const listSession = ref([
  {
    id: '1',
    title: 'Ca thi Lập trình Web nâng cao',
    time: '08:00 - 09:00',
    date: '2024-01-01',
    status: 'Đang diễn ra',
  },
  {
    id: '2',
    title: 'Ca thi Trí tuệ nhân tạo',
    time: '09:00 - 10:00',
    date: '2024-01-02',
    status: 'Sắp diễn ra',
  },
  {
    id: '3',
    title: 'Ca thi Lập trình C++',
    time: '10:00 - 11:00',
    date: '2024-01-03',
    status: 'Đã hoàn thành',
  },
])
</script>
