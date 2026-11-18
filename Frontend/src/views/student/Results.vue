<template>
  <div class="w-full h-full flex flex-col gap-4 sm:gap-6 pb-8 sm:pb-10">
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <span class="text-2xl sm:text-3xl font-semibold text-primary-bg">Kết quả của tôi</span>
        <span class="text-xs sm:text-sm text-gray-600"
          >So sánh điểm số cá nhân của bạn với điểm trung bình chung của toàn lớp theo môn học</span
        >
      </div>
    </div>
    <div class="w-full grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 sm:gap-6">
      <div class="min-w-0 bg-white rounded-xl shadow px-2 sm:px-4 py-4 sm:py-5">
        <apexchart
          type="line"
          height="400"
          width="100%"
          :options="chartOptions1"
          :series="series1"
        ></apexchart>
      </div>
      <div
        class="w-full shadow shrink-0 flex flex-col justify-center items-center bg-white rounded-xl gap-3 sm:gap-4 p-4 sm:p-6"
      >
        <div class="text-center font-semibold text-base sm:text-[18px] text-black/80">
          Tiến độ hoàn thành các ca thi
        </div>
        <apexchart
          type="radialBar"
          height="250"
          width="250"
          :options="chartOptions2"
          :series="series2"
        ></apexchart>
      </div>
    </div>
    <div class="bg-white py-3 sm:py-4 rounded-xl border border-primary/20">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-5 gap-3">
        <div class="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div class="font-semibold text-base sm:text-[17px] text-black/80">Lịch sử các ca thi đã làm</div>
          <span class="font-normal text-xs sm:text-sm text-gray-500">20/25 ca thi</span>
        </div>
        <DropdownFilter v-model="selectedSubject" :list="listSubject" class="w-full sm:w-36"></DropdownFilter>
      </div>
      <div class="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-5">
        <div
          v-for="(item, index) in listResult"
          :key="index"
          class="grid grid-cols-1 md:grid-cols-[140px_1fr_140px] lg:grid-cols-[180px_1fr_180px] xl:grid-cols-[200px_1fr_200px] border-t border-gray-300 px-4 sm:px-5 py-3 md:py-0 gap-2 md:gap-0"
        >
          <div
            :class="[
              item.score >= 8
                ? 'text-green-600'
                : item.score >= 5
                  ? 'text-yellow-600'
                  : 'text-red-600',
            ]"
            class="p-2 sm:p-3 md:p-4 font-bold text-lg text-left md:text-center my-auto"
          >
            <span class="text-2xl sm:text-3xl">{{ item.score }}</span>
            <span class="text-base sm:text-lg">/10</span>
          </div>
          <div class="p-2 sm:p-3 md:p-4 flex flex-col gap-2 border-y md:border-y-0 md:border-x border-gray-200 md:border-gray-300">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-medium text-sm text-primary">{{ item.subject }}</span>
              <span>◦</span>
              <span class="font-normal text-sm text-gray-500"> {{ item.class }}</span>
            </div>
            <div class="text-black/80 text-base font-medium">{{ item.title }}</div>
            <div class="w-full flex items-center gap-3 sm:gap-5">
              <div class="w-full sm:w-[80%] md:w-[60%] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  :style="{ width: `${item.progress}%` }"
                  :class="[
                    item.progress >= 80
                      ? 'bg-green-700'
                      : item.progress >= 50
                        ? 'bg-yellow-600'
                        : 'bg-red-600',
                  ]"
                  class="h-full rounded-full transition-all duration-300"
                ></div>
              </div>
              <span class="font-normal text-xs text-gray-500 shrink-0">{{ item.progress }}%</span>
            </div>
          </div>
          <div
            @click="router.push(`/student/results/${item.id}`)"
            class="p-2 sm:p-3 md:p-4 text-left md:text-center my-auto font-semibold text-sm sm:text-base text-primary-bg hover:underline cursor-pointer transition-all duration-300"
          >
            Xem chi tiết
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Icon from '@/components/custom/Icon.vue'

const router = useRouter()
const apexchart = VueApexCharts

const listSession = ref([])

const series1 = ref([
  {
    name: 'Điểm của bạn',
    type: 'column', // Chỉ định series này vẽ dạng CỘT
    data: [8.5, 9.4, 8.9, 8.7, 9.5, 8.7, 9.1, 10],
  },
  {
    name: 'Điểm TB lớp học phần',
    type: 'line', // Chỉ định series này vẽ dạng ĐƯỜNG
    data: [8.0, 7.7, 8.2, 8.5, 7.8, 7.5, 8.0, 9.0],
  },
])

const series2 = ref([80])
//cấu hình giao diện
const chartOptions1 = ref<ApexOptions>({
  chart: {
    toolbar: { show: false }, // Ẩn thanh công cụ tải ảnh mặc định
  },
  colors: ['#FF745A', '#F9C851'], // Màu cam cho cột, màu vàng cho đường
  fill: {
    opacity: [1, 1], // Số 1 đầu tiên cho Cột, số 1 thứ hai cho Đường line
  },
  stroke: {
    width: [0, 3], // Cột không có viền (0), Đường viền dày (3)
    curve: 'smooth', // Bo cong đường nét vàng cho mềm mại
  },

  // Cấu hình chữ số hiện trên đầu cột
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0], // Chỉ hiện số trên series 0 (Điểm của bạn)
    style: {
      colors: ['#000'],
      fontSize: '12px',
      fontWeight: 'bold',
    },

    // 2. TẮT HOÀN TOÀN BACKGROUND
    background: {
      enabled: false, // Chuyển thành false để làm biến mất cái hộp đen
    },
    offsetY: -10, // Đẩy con số lên cao một chút khỏi cột
  },
  // Hiển thị chấm tròn trên đường line
  markers: {
    size: [0, 5], // Ẩn chấm ở cột (0), hiện chấm to ở đường (5)
    colors: ['#F9C851'],
    strokeWidth: 0,
  },
  // Trục X (Tên các môn học nằm ngang)
  xaxis: {
    categories: ['Môn 1', 'Kiểm thử PM', 'Môn 3', 'Môn 4', 'Môn 5', 'Môn 6', 'Môn 7', 'Môn 8'],
    labels: { show: false }, // ẩn tên môn dưới đáy
    axisBorder: { show: true, color: 'black' }, // Thanh kẻ ngang đáy đen đậm
  },
  // Trục Y (Cấu hình 2 trục 2 bên)
  yaxis: [
    {
      // Trục bên TRÁI
      title: {
        text: 'Điểm TB của lớp học',
        style: { color: '#6A5ACD', fontSize: '14px', fontWeight: 'bold' },
      },
      min: 0,
      max: 10,
    },
    {
      // Trục bên PHẢI
      opposite: true,
      title: {
        text: 'Điểm của bạn',
        style: { color: '#38BDF8', fontSize: '14px', fontWeight: 'bold' },
      },
      min: 0,
      max: 10,
    },
  ],
  // Ghi chú dưới đáy biểu đồ
  legend: {
    position: 'bottom',
    markers: { shape: 'circle' }, // Làm icon ghi chú thành hình tròn
  },
  // Cấu hình Tooltip (Cái bảng nhỏ hiện ra khi hover)
  tooltip: {
    shared: true, // Gộp cả 2 điểm vào 1 bảng tooltip
    intersect: false,
  },
  plotOptions: {
    bar: {
      columnWidth: '50%', // Chỉnh độ rộng của cột (VD: 40% khoảng trống của mỗi mục)
      borderRadius: 6, // Bo tròn góc cột (tính bằng px, VD: 6px)
      borderRadiusApplication: 'end', // QUAN TRỌNG: Chỉ bo tròn ở trên đỉnh cột, đáy cột vẫn vuông góc
    },
  },
  states: {
    hover: {
      filter: {
        type: 'none', // Tắt hiệu ứng darken/lighten mặc định của ApexCharts
      },
    },
  },
})

const chartOptions2 = ref<ApexOptions>({
  chart: {
    type: 'radialBar',
    fontFamily: 'inherit',
  },
  colors: ['#69E2A7'], // Màu xanh ngọc của thanh điểm số
  plotOptions: {
    radialBar: {
      hollow: {
        size: '70%', // Độ rỗng ở giữa để lấy chỗ viết chữ
      },
      track: {
        background: '#D3D3D3', // Màu xanh mờ của cái rãnh phía sau
        strokeWidth: '100%',
      },
      dataLabels: {
        show: true,
        name: {
          offsetY: 30, // Đẩy chữ "điểm TB" xuống dưới một chút
          show: true,
          color: 'black/60', // Màu chữ nhạt
          fontSize: '14px',
        },
        value: {
          offsetY: -10, // Kéo số 8.0 lên trên
          color: 'black', // Số màu trắng
          fontSize: '36px',
          fontWeight: 'bold',
          show: true,
          // Phép màu ở đây: Biến 80% trở lại thành số 8.0
          // formatter: function (val: number) {
          //   return (val / 10).toFixed(1)
          // },
        },
      },
    },
  },
  labels: ['hoàn thành'], // Tên nhãn hiển thị ở giữa
  stroke: {
    lineCap: 'round', // Bo tròn 2 cái mút của thanh điểm số y hệt ảnh
  },
})

const selectedSubject = ref('all')
const listSubject = ref([
  { name: 'Tất cả', key: 'all' },
  { name: 'Môn 1', key: 'mon1' },
  { name: 'Môn 2', key: 'mon2' },
  { name: 'Môn 3', key: 'mon3' },
  { name: 'Môn 4', key: 'mon4' },
  { name: 'Môn 5', key: 'mon5' },
  { name: 'Môn 6', key: 'mon6' },
])

const listResult = ref([
  {
    id: 1,
    score: 9.0,
    subject: 'Toán học',
    class: 'Lớp 1',
    title: 'Kiểm tra 15p - Lần 1',
    progress: 90,
  },
  {
    id: 2,
    score: 8.0,
    subject: 'Toán học',
    class: 'Lớp 1',
    title: 'Kiểm tra 15p - Lần 2',
    progress: 80,
  },
  {
    id: 3,
    score: 7.0,
    subject: 'Toán học',
    class: 'Lớp 1',
    title: 'Kiểm tra 15p - Lần 3',
    progress: 70,
  },
  {
    id: 4,
    score: 7.0,
    subject: 'Toán học',
    class: 'Lớp 1',
    title: 'Kiểm tra 15p - Lần 3',
    progress: 70,
  },
  {
    id: 5,
    score: 9.0,
    subject: 'Lập trình C++',
    class: 'Lớp 1',
    title: 'Kiểm tra giữa kì - Lần 1',
    progress: 90,
  },
  {
    id: 6,
    score: 8.5,
    subject: 'Lập trình C++',
    class: 'Lớp 1',
    title: 'Kiểm tra giữa kì - Lần 2',
    progress: 85,
  },
  {
    id: 7,
    score: 4.5,
    subject: 'Vật lý đại cương',
    class: 'Lớp 1',
    title: 'Kiểm tra giữa kì - Lần 2',
    progress: 45,
  },
])
</script>

<style scoped>
/* Chỉnh màu khi hover vào cột */
:deep(.apexcharts-bar-area:hover) {
  fill: #e0533c !important; /* 👈 Thay mã màu bạn muốn khi hover vào đây */
  transition: fill 0.2s ease;
  cursor: pointer;
}
</style>
