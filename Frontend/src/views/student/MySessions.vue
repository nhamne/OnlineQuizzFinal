<template>
  <div class="w-full h-full flex flex-col gap-10">
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <span class="text-3xl font-semibold text-primary-bg">Ca thi của tôi</span>
        <span class="text-sm"
          >Tổng số ca thi:
          <span class="font-semibold text-black/80">{{ listSession.length }}</span></span
        >
      </div>
      <!--Tab-->
      <div class="flex items-center bg-primary/5 w-28 rounded-3xl p-1 relative">
        <div
          class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-2xl bg-white transition-all duration-300 shadow"
          :class="activeTab === 'table' ? 'translate-x-full' : 'translate-x-0'"
        ></div>
        <div
          class="py-1.5 cursor-pointer flex-1 z-10 flex items-center justify-center text-sm font-medium hover:text-primary transition-all duration-300"
          @click="activeTab = 'list'"
          :class="activeTab === 'list' ? 'text-primary' : ''"
        >
          <Icon name="list" size="20"></Icon>
        </div>
        <div
          class="py-1.5 cursor-pointer flex-1 z-10 flex items-center justify-center text-sm font-medium hover:text-primary transition-all duration-300"
          @click="activeTab = 'table'"
          :class="activeTab === 'table' ? 'text-primary' : ''"
        >
          <Icon name="table" size="20"></Icon>
        </div>
      </div>
    </div>
    <div
      class="w-full grid grid-cols-[3fr_2fr_auto] gap-12 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <!-- Tìm kiếm -->
      <div class="w-full">
        <span class="text-[13px] font-semibold uppercase">Tìm kiếm lớp học</span>
        <Search placeholder="Tìm kiếm lớp học" class="w-full" />
      </div>

      <!--Sắp xếp -->
      <div class="w-full">
        <span class="text-[13px] font-semibold uppercase">Sắp xếp</span>
        <DropdownFilter v-model="selectedSort" :list="listSort" />
      </div>
      <Button variant="secondary" custom-class="w-fit h-[42px] mt-auto">
        <Icon name="reload" size="20"></Icon>
      </Button>
    </div>

    <!--Danh sách ca thi-->
    <div
      v-if="activeTab === 'list'"
      class="grid gap-6 w-full"
      style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"
    >
      <div
        v-for="item in listSession"
        :key="item.id"
        class="p-10 bg-white rounded-xl border-t-10 cursor-pointer hover:shadow-lg hover:border-t-15 transition-all duration-200 group"
        :class="[item.status === 'finished' ? 'border-t-gray-500' : 'border-t-secondary']"
      >
        <div class="flex justify-between">
          <div
            class="rounded-sm h-11 w-11 flex items-center justify-center"
            :class="[item.status === 'finished' ? 'bg-gray-300' : 'bg-secondary/15']"
          >
            <Icon
              :name="
                item.status === 'upcoming'
                  ? 'hourglass'
                  : item.status === 'ongoing'
                    ? 'clock-dashed-half'
                    : 'archive'
              "
              size="24"
              :class="[item.status === 'finished' ? 'text-gray-600' : 'text-secondary']"
            ></Icon>
          </div>
          <div
            class="px-3 py-1.5 text-[11px] uppercase font-bold rounded-full h-fit transition-all duration-200"
            :class="[
              item.status === 'finished'
                ? 'text-gray-600 bg-gray-200'
                : 'text-secondary bg-secondary/15',
            ]"
          >
            {{
              item.status === 'upcoming'
                ? 'Sắp diễn ra'
                : item.status === 'ongoing'
                  ? 'Đang diễn ra'
                  : 'Đã kết thúc'
            }}
          </div>
        </div>
        <h1 class="text-lg font-semibold mt-6 text-black/80">{{ item.nameSession }}</h1>
        <p class="mt-2 text-sm text-gray-500">{{ item.nameClass }}</p>
        <div class="flex items-center gap-3 mt-6 text-gray-600">
          <Icon name="clock" size="20"></Icon>
          <span class="text-sm font-medium">{{ item.startAt }}</span>
        </div>
        <div class="flex items-center gap-3 mt-6 text-gray-600">
          <Icon name="calendar-event" size="20"></Icon>
          <span class="text-sm font-medium">{{ item.finishAt }}</span>
        </div>
        <div class="flex items-center gap-3 mt-6 text-gray-600">
          <Icon name="stopwatch" size="20"></Icon>
          <span class="text-sm font-medium">{{ item.time }} phút</span>
        </div>
        <Button :variant="item.status === 'finished' ? 'secondary' : 'primary'" class="mt-6 w-full">
          {{
            item.status === 'upcoming'
              ? 'Xem chi tiết'
              : item.status === 'ongoing'
                ? 'Vào ca thi'
                : 'Xem kết quả'
          }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Button from '@/components/custom/Button.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Search from '@/components/custom/Search.vue'
import Icon from '@/components/custom/Icon.vue'

const activeTab = ref<'table' | 'list'>('list')

const selectedSort = ref<string>('')
const listSort = [
  {
    key: 'all',
    name: 'Tất cả trạng thái',
  },
  {
    key: 'upcoming',
    name: 'Sắp diễn ra',
  },
  {
    key: 'ongoing',
    name: 'Đang diễn ra',
  },
  {
    key: 'finished',
    name: 'Đã kết thúc',
  },
]

interface Session {
  id: number
  nameSession: string
  nameClass: string
  startAt: string
  finishAt: string
  status: string
  time: number
  duration: number
}

const listSession = ref<Session[]>([
  {
    id: 1,
    nameSession: 'Lập trình C++',
    nameClass: 'Lớp 12A1',
    startAt: '2023-01-01 22:07',
    finishAt: '2023-01-01 23:07',
    status: 'upcoming',
    time: 60,
    duration: 60,
  },
  {
    id: 2,
    nameSession: 'Lập trình C++',
    nameClass: 'Lớp 12A1',
    startAt: '2023-01-01 22:07',
    finishAt: '2023-01-01 23:07',
    status: 'ongoing',
    time: 60,
    duration: 60,
  },
  {
    id: 3,
    nameSession: 'Lập trình C++',
    nameClass: 'Lớp 12A1',
    startAt: '2023-01-01 22:07',
    finishAt: '2023-01-01 23:07',
    status: 'finished',
    time: 60,
    duration: 60,
  },
  {
    id: 4,
    nameSession: 'Lập trình C++',
    nameClass: 'Lớp 12A1',
    startAt: '2023-01-01 22:07',
    finishAt: '2023-01-01 23:07',
    status: 'ongoing',
    time: 60,
    duration: 60,
  },
])
</script>
