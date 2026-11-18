<template>
  <div class="w-full h-full flex flex-col items-center justify-center pb-8">
    <!-- Breadcrumb -->
    <div class="w-full max-w-163 flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium mb-4">
      <router-link to="/student/my-sessions" class="hover:text-primary transition-colors">
        Ca thi của tôi
      </router-link>
      <span>/</span>
      <span class="text-gray-800 font-semibold truncate">{{ sessionselected?.nameSession || 'Chuẩn bị vào thi' }}</span>
    </div>

    <div
      v-if="sessionselected"
      class="w-full py-8 px-6 rounded-2xl bg-white text-black/80 flex flex-col text-center gap-4 max-w-163 shadow-sm border border-gray-100"
    >
      <div class="font-semibold text-lg">{{ sessionselected.nameSession }}</div>

      <div class="flex items-center mx-auto gap-2">
        <div class="font-semibold text-sm">Mã truy cập :</div>
        <Icon
          name="qr"
          size="25"
          class="text-primary cursor-pointer transition-all duration-300 hover:text-primary/80"
        ></Icon>
      </div>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-1">
          <Icon name="clock" size="17"></Icon>
          <div class="font-normal text-[15px]">Thời gian làm bài</div>
        </div>
        <div class="font-medium text-[15px]">{{ sessionselected.time }} phút</div>
      </div>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-1">
          <Icon name="message-question" size="17"></Icon>
          <div class="font-normal text-[15px]">Số lượng câu hỏi</div>
        </div>
        <div class="font-medium text-[15px]">40</div>
      </div>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-1">
          <Icon name="group" size="18"></Icon>
          <div class="font-normal text-[15px]">Tổng lượt làm bài</div>
        </div>
        <div class="font-medium text-[15px]">30 lượt</div>
      </div>
      <Button variant="primary" @click="handleViewSession(sessionselected)"> Vào ca thi </Button>
    </div>
    <div
      class="text-center text-sm mt-8 text-black/80 cursor-pointer hover:underline underline-offset-2 transition-all duration-300"
    >
      Xem lịch sử làm bài
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/custom/Icon.vue'
import Button from '@/components/custom/Button.vue'
import { ref, computed } from 'vue'
import router from '@/router'

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

const sessionselected = computed(() => {
  return listSession.value.find((session: Session) => session.id === 2)
})

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

const handleViewSession = (session: Session) => {
  if (session.status === 'ongoing') {
    router.push({
      name: 'student-take-exam',
      params: {
        id: session.id,
      },
    })
  }
}
</script>
