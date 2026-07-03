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
      <Button icon="plus" @click="isOpen = true">Tạo lớp học mới</Button>
    </div>
    <div
      class="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <!-- Tìm kiếm -->

      <div class="w-[40%]">
        <span class="text-[13px] font-semibold uppercase">Tìm kiếm lớp học</span>
        <Search placeholder="Tìm kiếm lớp học" class="w-full" />
      </div>
      <!--Lọc theo sĩ số-->
      <div class="w-[25%]">
        <span class="text-[13px] font-semibold uppercase">Lọc theo sĩ số</span>
        <DropdownFilter v-model="selectedSize" :list="listClassSize" />
      </div>
      <!--Sắp xếp -->
      <div class="w-[25%]">
        <span class="text-[13px] font-semibold uppercase">Sắp xếp</span>
        <DropdownFilter v-model="selectedSort" :list="listSort" />
      </div>
      <Button variant="secondary" custom-class="w-fit h-[42px] mt-auto">
        <Icon name="reload" size="20"></Icon>
      </Button>
    </div>
    <div class="flex items-center justify-between">
      <div class="text-sm">
        Hiển thị <span class="font-semibold text-black/80">1-6</span> trên tổng
        <span class="font-semibold text-black/80">{{ listClasses.length }}</span> lớp học
      </div>
      <div class="text-sm">
        Trang
        <span class="font-semibold text-black/80">1</span> / 1
      </div>
    </div>
    <!--Bảng danh sách lớp học-->
    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))">
      <div
        v-for="item in listClasses"
        :key="item.id"
        class="group relative rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      >
        <div
          class="absolute top-3 right-3 flex items-center gap-3 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Icon
            name="edit"
            size="20"
            custom-class="hover:text-white transition-all duration-200"
            @click="editClass(item.id)"
          ></Icon>
          <Icon
            name="trash"
            size="20"
            custom-class="hover:text-red-500 transition-all duration-200"
            @click="deleteClass(item.id)"
          ></Icon>
        </div>
        <div class="bg-secondary w-full h-30 flex justify-center items-center">
          <Icon name="education" color="white" size="80"></Icon>
        </div>
        <div class="bg-white p-8 flex flex-col">
          <span class="text-lg font-semibold text-black/80">{{ item.nameClass }}</span>
          <span class="text-sm mt-1 text-gray-400">Ngày tạo: {{ item.createdAt }}</span>
          <div class="mt-4 flex items-center justify-between bg-secondary/5 rounded-xl py-3 px-4">
            <div class="flex flex-col">
              <span class="uppercase text-xs tracking-[1px] font-semibold">Mã tham gia</span>
              <span class="text-base mt-1 text-secondary font-semibold">{{ item.codeJoin }}</span>
            </div>
            <button
              class="p-2 rounded-lg bg-white text-secondary hover:bg-secondary hover:text-white transition-all duration-200 cursor-pointer"
            >
              <Icon name="copy" size="20"></Icon>
            </button>
          </div>
          <div class="flex items-center justify-between mt-6">
            <div class="flex items-center gap-1 text-black/80 font-semibold">
              <Icon name="group" size="20"></Icon>
              <span>{{ item.quantity }} Sinh viên</span>
            </div>
            <div
              class="flex items-center gap-2 text-secondary cursor-pointer"
              @click="toDetail(item.id)"
            >
              <span class="text-base font-semibold hover:underline">Quản lý</span>
              <Icon name="arrow-right" size="24"></Icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--Modal tạo lớp học-->
    <Popup
      v-model="isOpen"
      v-model:inputValue="nameClass"
      title="Tạo lớp học mới"
      desc="Nhập tên lớp học, hệ thống sẽ tự động sinh mã tham gia cho học sinh."
      icon="home-add"
      labelInput="Tên lớp học (bắt buộc)"
      placeholder="Ví dụ: Lập trình Web nâng cao - D18CNPM1"
      btnAcceptIcon="plus"
    />
    <!--modal Sửa lớp học-->
    <Popup
      v-model="isOpenEditClass"
      v-model:inputValue="nameClassBefore"
      title="Sửa lớp học"
      desc="Cập nhật tên lớp học. Mã tham gia sẽ được giữ nguyên."
      icon="edit"
      labelInput="Tên lớp học mới"
      btnAcceptText="Lưu"
    ></Popup>
    <PopupConfirm
      v-model="isOpenPopupConfirm"
      title="Xóa lớp học"
      :message="`Bạn chắc chắn muốn xóa lớp học ${nameClass}`"
    />
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/custom/Button.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Search from '@/components/custom/Search.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'
import Icon from '@/components/custom/Icon.vue'
import Input from '@/components/custom/Input.vue'
import Popup from '@/components/custom/Popup.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const toDetail = (classId: number) => {
  router.push(`/teacher/class-manage/${classId}`)
}

interface Class {
  id: number
  nameClass: string
  quantity: number
  createdAt: string
  codeJoin: string
}

const listClasses = ref<Class[]>([
  {
    id: 1,
    nameClass: 'Lớp 12A1',
    quantity: 25,
    createdAt: '2023-01-01',
    codeJoin: '123456',
  },
  {
    id: 2,
    nameClass: 'Trí tuệ nhân tạo',
    quantity: 2,
    createdAt: '2025-01-01',
    codeJoin: '987654',
  },
  {
    id: 3,
    nameClass: 'Lập trình C++',
    quantity: 5,
    createdAt: '2025-11-11',
    codeJoin: '778899',
  },
  {
    id: 4,
    nameClass: 'Lập trình Java',
    quantity: 31,
    createdAt: '2025-11-11',
    codeJoin: '741258',
  },
  {
    id: 5,
    nameClass: 'Lập trình C++',
    quantity: 5,
    createdAt: '2025-11-11',
    codeJoin: '778899',
  },
  {
    id: 6,
    nameClass: 'Lập trình C++',
    quantity: 5,
    createdAt: '2025-11-11',
    codeJoin: '778899',
  },
])

const selectedSize = ref<string>('all')
const selectedSort = ref<string>('new')

const listClassSize = [
  {
    key: 'all',
    name: 'Tất cả',
  },
  {
    key: 'empty',
    name: 'Chưa có sinh viên',
  },
  {
    key: 'under30',
    name: '1-30 sinh viên',
  },
  {
    key: 'over30',
    name: 'Trên 30 sinh viên',
  },
]

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
  {
    key: 'quantity',
    name: 'Sĩ số (Tăng dần)',
  },
  {
    key: 'quantityreserved',
    name: 'Sĩ số (Giảm dần)',
  },
]

const isOpen = ref(false)
const isOpenEditClass = ref(false)
const isOpenPopupConfirm = ref(false)
const nameClass = ref('')
const nameClassBefore = ref('')

const deleteClass = (id: number) => {
  isOpenPopupConfirm.value = true
  nameClass.value = listClasses.value.find((item) => item.id === id)?.nameClass || ''
  // listClasses.value = listClasses.value.filter((item) => item.id !== id)
}

const editClass = (id: number) => {
  isOpenEditClass.value = true
  nameClassBefore.value = listClasses.value.find((item) => item.id === id)?.nameClass || ''
}
</script>
