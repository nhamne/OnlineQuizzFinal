<template>
  <div class="w-full h-full flex flex-col gap-10">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <span class="text-3xl font-semibold text-primary-bg">Danh sách lớp học</span>
        <span class="text-sm"
          >Tổng số lớp học:
          <span class="font-semibold text-black/80">{{ listClasses.length }}</span></span
        >
      </div>
      <div class="flex gap-3">
        <Button v-if="listClasses.length !== 0" icon="plus" @click="isOpen = true"
          >Tham gia lớp học</Button
        >
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
    <!--empty-->
    <div
      v-if="listClasses.length === 0"
      class="w-[80%] mx-auto rounded-2xl flex flex-col items-center justify-center p-20"
    >
      <div
        class="flex items-center justify-center p-3 rounded-xl bg-blue-100 text-primary/80 border-2 border-blue-200"
      >
        <Icon name="landmark" size="50" variant="subtle"></Icon>
      </div>
      <h1 class="mt-6 text-xl uppercase font-semibold text-black/80">
        Bạn chưa tham gia lớp học nào
      </h1>
      <p class="mt-4 text-center">
        Không gian học tập của bạn đang chờ đợi những kiến thức mới. <br />Hãy tham gia lớp học ngay
        hôm nay để kết nối với giảng viên và thảo luận với các bạn học tại Online Quizz.
      </p>
      <Button class="mt-6" icon="plus-circle" @click="isOpen = true">Tham gia lớp học ngay</Button>
    </div>
    <!--Danh sách lớp học-->
    <div class="grid gap-8" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))">
      <div
        v-for="item in listClasses"
        :key="item.id"
        class="group rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      >
        <div class="bg-secondary relative w-full h-30 flex justify-center items-center">
          <Icon name="education" color="white" size="80"></Icon>
          <div
            class="absolute top-0 right-0 m-4 bg-white/20 px-3 py-1 rounded-full text-white text-[13px] font-semibold"
          >
            {{ item.quantitySession }} bài thi
          </div>
        </div>
        <div class="bg-white p-10 flex flex-col">
          <span class="text-lg font-semibold text-black/80">{{ item.nameClass }}</span>
          <span class="text-sm mt-1 text-gray-400">Ngày tham gia: {{ item.joinDate }}</span>
          <div class="mt-4 flex items-center justify-between bg-secondary/5 rounded-xl py-3 px-4">
            <div class="flex flex-col">
              <span class="uppercase text-xs tracking-[1px] font-semibold">Giáo viên</span>
              <span class="text-base mt-1 text-secondary font-semibold">{{
                item.nameTeacher
              }}</span>
            </div>
            <button class="p-2 rounded-lg bg-white text-secondary">
              <Icon name="user" size="20"></Icon>
            </button>
          </div>
          <div class="mt-6">
            <span class="uppercase font-semibold text-[13px] tracking-wider">Bài thi gần đây</span>
            <div
              class="hover:-translate-y-1 transition-all duration-200 p-4 shadow-md border border-gray-200 rounded-xl mt-3 flex justify-between items-start"
            >
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-black/80">{{ item.nameSessionRecent }}</span>
                <span class="text-sm text-gray-500">{{ item.timeSessionRecent }}</span>
              </div>
              <div
                class="text-sm text-[10px] bg-secondary/10 px-3 py-1 rounded-full text-black/80 font-semibold"
              >
                {{ item.statusSessionRecent }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--Modal tham gia lớp học-->
    <Popup
      v-model="isOpen"
      v-model:inputValue="codeJoin"
      title="Tham gia lớp học"
      desc="Nhập mã tham gia để tham gia lớp học."
      icon="home-add"
      labelInput="Mã tham gia (bắt buộc)"
      placeholder="Ví dụ: 123456"
      btnAcceptText="Tham gia"
      btnAcceptIcon="plus"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Button from '@/components/custom/Button.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Search from '@/components/custom/Search.vue'
import Icon from '@/components/custom/Icon.vue'
import Popup from '@/components/custom/Popup.vue'

const router = useRouter()
const isOpen = ref<boolean>(false)
const codeJoin = ref<string>('')

const selectedSort = ref<string>('')

interface Class {
  id: number
  nameClass: string
  nameTeacher: string
  joinDate: string
  nameSessionRecent: string
  timeSessionRecent: string
  statusSessionRecent: string
  quantitySession: number
}

const listClasses = ref<Class[]>([
  {
    id: 1,
    nameClass: 'Lớp 12A1',
    nameTeacher: 'Trần Văn A',
    joinDate: '2023-01-01 22:07',
    nameSessionRecent: 'Lập trình C++',
    timeSessionRecent: '24/05/2026 18:07',
    statusSessionRecent: 'Đang diễn ra',
    quantitySession: 10,
  },
  {
    id: 2,
    nameClass: 'Trí tuệ nhân tạo',
    nameTeacher: 'Trần Văn B',
    joinDate: '2025-01-01 10:30',
    nameSessionRecent: 'Lập trình C++',
    timeSessionRecent: '24/05/2026 18:07',
    statusSessionRecent: 'Sắp diễn ra',
    quantitySession: 15,
  },
  {
    id: 3,
    nameClass: 'Lập trình C++',
    nameTeacher: 'Trần Văn C',
    joinDate: '2025-11-11 12:00',
    nameSessionRecent: 'Lập trình C++',
    timeSessionRecent: '24/05/2026 18:07',
    statusSessionRecent: 'Đã kết thúc',
    quantitySession: 20,
  },
  // {
  //   id: 4,
  //   nameClass: 'Lập trình Java',
  //   nameTeacher: 'Trần Văn D',
  //   joinDate: '2025-11-11',
  //   nameSessionRecent: 'Lập trình C++',
  // },
  // {
  //   id: 5,
  //   nameClass: 'Lập trình C++',
  //   nameTeacher: 'Trần Văn E',
  //   joinDate: '2025-11-11',
  //   nameSessionRecent: 'Lập trình C++',
  // },
  // {
  //   id: 6,
  //   nameClass: 'Lập trình C++',
  //   nameTeacher: 'Trần Văn F',
  //   joinDate: '2025-11-11',
  //   nameSessionRecent: 'Lập trình C++',
  // },
])
const listSort = [
  {
    key: 'new',
    name: 'Mới nhất',
  },
  {
    key: 'old',
    name: 'Cũ nhất',
  },
  {
    key: 'atoz',
    name: 'Tên lớp học (A-Z)',
  },
]
</script>
