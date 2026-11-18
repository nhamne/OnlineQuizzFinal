<template>
  <div class="w-full h-full flex flex-col gap-6 sm:gap-8 pb-8">
    <!-- Stat Cards Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 w-full">
      <!-- Card 1: Tổng người dùng -->
      <div class="flex flex-col gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-center">
          <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500">Tổng người dùng</span>
          <div class="w-10 h-10 rounded-xl text-primary flex items-center justify-center bg-blue-50">
            <Icon name="community" size="22"></Icon>
          </div>
        </div>
        <span class="text-2xl sm:text-3xl font-bold text-black/85">1,268</span>
        <div class="border-t border-gray-100 pt-3 mt-auto flex items-center gap-1.5 text-green-600 text-xs sm:text-sm font-semibold">
          <Icon name="trending-up" size="18"></Icon>
          <span>+15%</span>
          <span class="text-gray-400 font-normal">so với tháng trước</span>
        </div>
      </div>

      <!-- Card 2: Ca thi hôm nay -->
      <div class="flex flex-col gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-center">
          <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500">Ca thi hôm nay</span>
          <div class="w-10 h-10 rounded-xl text-purple-700 flex items-center justify-center bg-purple-50">
            <Icon name="calendar-alt" size="20"></Icon>
          </div>
        </div>
        <span class="text-2xl sm:text-3xl font-bold text-black/85">12</span>
        <div class="border-t border-gray-100 pt-3 mt-auto flex items-center gap-1.5 text-purple-700 text-xs sm:text-sm font-semibold">
          <span>+5</span>
          <span class="text-gray-400 font-normal">ca thi đang diễn ra</span>
        </div>
      </div>

      <!-- Card 3: Báo cáo chờ xử lý -->
      <div class="flex flex-col gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-center">
          <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500">Báo cáo chờ xử lý</span>
          <div class="w-10 h-10 rounded-xl text-red-600 flex items-center justify-center bg-red-50">
            <Icon name="alert" size="22"></Icon>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-2xl sm:text-3xl font-bold text-red-600">24</span>
          <div class="text-red-700 font-bold bg-red-100/70 text-[11px] px-2 py-0.5 rounded-md">
            Cần xử lý ngay
          </div>
        </div>
        <div class="border-t border-gray-100 pt-3 mt-auto flex items-center gap-1.5 text-red-600 text-xs sm:text-sm font-semibold">
          <span>+5</span>
          <span class="text-gray-400 font-normal">báo cáo mới hôm nay</span>
        </div>
      </div>

      <!-- Card 4: Dung lượng lưu trữ -->
      <div class="flex flex-col gap-3.5 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-center">
          <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500">Dung lượng lưu trữ</span>
          <div class="w-10 h-10 rounded-xl text-cyan-700 flex items-center justify-center bg-cyan-50">
            <Icon name="hard-drive" size="22"></Icon>
          </div>
        </div>
        <div>
          <span class="text-2xl sm:text-3xl font-bold text-black/85">4.85</span>
          <span class="text-xs sm:text-sm font-medium text-gray-400"> / 10 TB</span>
        </div>
        <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div class="bg-cyan-600 h-2 w-[48.5%] rounded-full"></div>
        </div>
        <div class="border-t border-gray-100 pt-3 mt-auto flex items-center gap-1.5 text-cyan-700 text-xs sm:text-sm font-semibold">
          <span>5.15 TB</span>
          <span class="text-gray-400 font-normal">còn trống</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="flex flex-col xl:flex-row w-full gap-4 sm:gap-6">
      <!-- Area Chart (Tăng trưởng hệ thống) -->
      <div class="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 sm:p-5 overflow-hidden">
        <apexchart
          ref="chart1Ref"
          type="area"
          :height="chart1Height"
          width="100%"
          :options="chartOptions1"
          :series="series1"
        ></apexchart>
      </div>

      <!-- Donut Chart (Câu hỏi theo môn) -->
      <div class="w-full xl:w-[380px] shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 sm:p-5 overflow-hidden flex flex-col items-center">
        <div class="w-full">
          <apexchart
            ref="chart2Ref"
            type="donut"
            :height="chart2Height"
            width="100%"
            :options="chartOptions2"
            :series="series2"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Icon from '@/components/custom/Icon.vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

const apexchart = VueApexCharts

const chart1Ref = ref<any>(null)
const chart2Ref = ref<any>(null)

const chart1Height = ref(380)
const chart2Height = ref(320)

const updateChartHeights = () => {
  if (window.innerWidth < 640) {
    chart1Height.value = 290
    chart2Height.value = 290
  } else if (window.innerWidth < 1024) {
    chart1Height.value = 340
    chart2Height.value = 320
  } else {
    chart1Height.value = 400
    chart2Height.value = 340
  }
}

onMounted(async () => {
  updateChartHeights()
  window.addEventListener('resize', handleResize)
  await nextTick()
  window.dispatchEvent(new Event('resize'))
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  updateChartHeights()
}

// 1. DỮ LIỆU: Số lượng câu hỏi của từng môn
const series2 = ref([342, 198, 275, 164, 141, 88])

// 2. CẤU HÌNH BIỂU ĐỒ DONUT
const chartOptions2 = ref<ApexOptions>({
  title: {
    text: 'Câu hỏi theo môn',
    align: 'left',
    margin: 15,
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#1e293b',
    },
  },
  chart: {
    type: 'donut',
    fontFamily: 'inherit',
  },
  labels: ['Toán', 'Văn', 'Anh', 'Lý', 'Hóa', 'Sinh'],
  colors: ['#5B67F6', '#34D399', '#F59E0B', '#F43F5E', '#A78BFA', '#38BDF8'],
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '58%',
      },
    },
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['#fff'],
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    labels: {
      colors: '#64748b',
    },
    markers: {
      shape: 'circle',
      size: 5,
      offsetX: -4,
    },
    itemMargin: {
      horizontal: 12,
      vertical: 6,
    },
    formatter: function (seriesName: string, opts: any) {
      const value = opts.w.globals.series[opts.seriesIndex]
      return seriesName + ' <span style="color: #94a3b8; font-weight: 600; margin-left: 4px;">' + value + '</span>'
    },
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: function (val: number) {
        return val + ' câu'
      },
    },
  },
})

const series1 = ref([
  {
    name: 'Số lượng giáo viên',
    type: 'area',
    data: [12, 15, 13, 11, 18, 19, 20, 16, 21],
  },
  {
    name: 'Số lượng học sinh',
    type: 'area',
    data: [40, 45, 42, 44, 40, 47, 42, 49, 46],
  },
])

const chartOptions1 = ref<ApexOptions>({
  title: {
    text: 'Tăng trưởng hệ thống',
    align: 'left',
    margin: 15,
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#1e293b',
    },
  },
  chart: {
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  colors: ['#4C6BFA', '#00E396'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100],
    },
  },
  stroke: {
    width: [2.5, 2.5],
    curve: 'smooth',
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: [0, 0],
  },
  xaxis: {
    categories: [
      'Thg 1',
      'Thg 2',
      'Thg 3',
      'Thg 4',
      'Thg 5',
      'Thg 6',
      'Thg 7',
      'Thg 8',
      'Thg 9',
    ],
    labels: {
      style: {
        fontSize: '11px',
        colors: '#94a3b8',
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: [
    {
      title: {
        text: 'Giáo viên',
        style: { color: '#4C6BFA', fontSize: '12px', fontWeight: 'bold' },
      },
      min: 0,
      max: 60,
      labels: {
        style: { fontSize: '11px', colors: '#94a3b8' },
      },
    },
    {
      opposite: true,
      title: {
        text: 'Học sinh',
        style: { color: '#00E396', fontSize: '12px', fontWeight: 'bold' },
      },
      min: 0,
      max: 60,
      labels: {
        style: { fontSize: '11px', colors: '#94a3b8' },
      },
    },
  ],
  legend: {
    position: 'bottom',
    markers: { shape: 'circle' },
    labels: { colors: '#64748b' },
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
})
</script>
