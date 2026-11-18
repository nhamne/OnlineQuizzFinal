<template>
  <div class="w-full h-full flex flex-col pb-8 sm:pb-10">
    <!-- Header -->
    <div
      class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
    >
      <div class="flex flex-col gap-0.5 sm:gap-1">
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-bg">Danh sách lớp học</h1>
        <p class="text-xs sm:text-sm text-gray-500">
          Tổng số lớp học:
          <span class="font-bold text-black/80">{{ listClasses.length }}</span>
        </p>
      </div>
      <Button
        class="w-full sm:w-auto text-xs sm:text-sm py-2.5 sm:py-3"
        icon="plus"
        @click="isOpen = true"
      >
        Tạo lớp học mới
      </Button>
    </div>

    <!-- Toolbar: Single-row on mobile -->
    <div class="mt-3.5 sm:mt-4 w-full flex items-center justify-between gap-1.5 sm:gap-3">
      <!-- Tìm kiếm -->
      <Search
        v-model="searchQuery"
        class="w-[30%] sm:flex-1"
        :placeholder="isMobile ? 'Tìm kiếm' : 'Tìm kiếm lớp học, mã lớp...'"
      />

      <!-- Lọc theo sĩ số -->
      <DropdownFilter
        class="sm:w-40 lg:w-44 shrink-0"
        icon="group"
        v-model="selectedSize"
        :list="listClassSize"
      />

      <!-- Sắp xếp -->
      <DropdownFilter
        class="sm:w-40 lg:w-44 shrink-0"
        icon="slider"
        v-model="selectedSort"
        :list="listSort"
      />

      <!-- Reload -->
      <Button
        variant="secondary"
        custom-class="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] p-0 shrink-0 mt-2 flex items-center justify-center text-gray-600"
        @click="resetFilter"
        title="Tải lại"
      >
        <Icon name="reload" size="18"></Icon>
      </Button>
    </div>

    <!-- Pagination & count info -->
    <div
      class="mt-3.5 sm:mt-5 flex items-center justify-between gap-2 text-xs sm:text-sm text-gray-500 font-medium"
    >
      <div>
        Hiển thị <span class="font-bold text-black/80">{{ filteredClasses.length }}</span> trên tổng
        <span class="font-bold text-black/80">{{ listClasses.length }}</span> lớp học
      </div>
      <div>Trang <span class="font-bold text-black/80">1</span> / 1</div>
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredClasses.length === 0"
      class="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 mt-4 shadow-sm"
    >
      <div
        class="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400 mb-2"
      >
        <Icon name="search" size="22" />
      </div>
      <p class="text-sm font-semibold text-gray-700">Không tìm thấy lớp học nào</p>
      <p class="text-xs text-gray-400 mt-1">
        Hãy thử tìm kiếm với từ khóa khác hoặc đặt lại bộ lọc
      </p>
      <Button variant="secondary" class="mt-4 mx-auto text-xs" @click="resetFilter"
        >Đặt lại bộ lọc</Button
      >
    </div>

    <!-- Grid danh sách lớp học -->
    <div v-else class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div
        v-for="item in filteredClasses"
        :key="item.id"
        class="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border border-gray-100 flex flex-col bg-white"
      >
        <!-- Action Buttons (Edit / Trash) -->
        <div
          class="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        >
          <button
            type="button"
            class="p-1.5 rounded-lg bg-black/35 hover:bg-black/55 text-white transition-colors cursor-pointer"
            title="Chỉnh sửa lớp học"
            @click.stop="editClass(item.id)"
          >
            <Icon name="edit" size="16" />
          </button>
          <button
            type="button"
            class="p-1.5 rounded-lg bg-black/35 hover:bg-red-600 text-white transition-colors cursor-pointer"
            title="Xóa lớp học"
            @click.stop="deleteClass(item.id)"
          >
            <Icon name="trash" size="16" />
          </button>
        </div>

        <!-- Banner Header -->
        <div class="bg-secondary w-full h-24 sm:h-28 flex justify-center items-center shrink-0">
          <Icon name="education" color="white" size="64"></Icon>
        </div>

        <!-- Card Body -->
        <div class="p-4 sm:p-5 lg:p-6 flex flex-col flex-1 justify-between">
          <div>
            <h2
              class="text-base sm:text-lg font-bold text-black/85 truncate"
              :title="item.nameClass"
            >
              {{ item.nameClass }}
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">Ngày tạo: {{ item.createdAt }}</p>

            <!-- Join Code Box -->
            <div
              class="mt-3.5 flex items-center justify-between bg-secondary/5 border border-secondary/10 rounded-xl py-2 px-3 sm:py-2.5 sm:px-3.5"
            >
              <div class="flex flex-col min-w-0">
                <span class="uppercase text-[10px] tracking-wider font-bold text-gray-500"
                  >Mã tham gia</span
                >
                <span
                  class="text-sm sm:text-base font-bold text-secondary tracking-wide truncate"
                  >{{ item.codeJoin }}</span
                >
              </div>
              <button
                type="button"
                @click="copyCode(item.codeJoin, item.id)"
                class="p-1.5 sm:p-2 rounded-lg bg-white shadow-xs text-secondary hover:bg-secondary hover:text-white transition-all cursor-pointer shrink-0"
                :title="copiedId === item.id ? 'Đã sao chép' : 'Sao chép mã'"
              >
                <Icon :name="copiedId === item.id ? 'check' : 'copy'" size="18" />
              </button>
            </div>
          </div>

          <!-- Bottom: Student count & Manage button -->
          <div
            class="flex items-center justify-between mt-4 sm:mt-5 pt-3 border-t border-gray-100 gap-2"
          >
            <div
              class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 font-semibold truncate"
            >
              <Icon name="group" size="18" class="shrink-0 text-gray-500"></Icon>
              <span class="truncate">{{ item.quantity }} Sinh viên</span>
            </div>
            <button
              type="button"
              class="flex items-center gap-1 text-xs sm:text-sm text-secondary hover:text-primary font-bold cursor-pointer shrink-0 transition-colors"
              @click="toDetail(item.id)"
            >
              <span>Quản lý</span>
              <Icon name="arrow-right" size="18"></Icon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal tạo lớp học -->
    <Popup
      v-model="isOpen"
      v-model:inputValue="nameClass"
      title="Tạo lớp học mới"
      desc="Nhập tên lớp học, hệ thống sẽ tự động sinh mã tham gia cho học sinh."
      icon="home-add"
      labelInput="Tên lớp học (bắt buộc)"
      placeholder="Ví dụ: Lập trình Web nâng cao - D18CNPM1"
      btnAcceptIcon="plus"
      @accept="handleCreateClass"
    />

    <!-- Modal sửa lớp học -->
    <Popup
      v-model="isOpenEditClass"
      v-model:inputValue="nameClassBefore"
      title="Sửa lớp học"
      desc="Cập nhật tên lớp học. Mã tham gia sẽ được giữ nguyên."
      icon="edit"
      labelInput="Tên lớp học mới"
      btnAcceptText="Lưu"
      @accept="handleSaveEdit"
    />

    <!-- Modal xác nhận xóa -->
    <PopupConfirm
      v-model="isOpenPopupConfirm"
      variant="warning"
      title="Xóa lớp học"
      :message="`Bạn chắc chắn muốn xóa lớp học ${nameClass}?`"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/custom/Button.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Search from '@/components/custom/Search.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'
import Icon from '@/components/custom/Icon.vue'
import Popup from '@/components/custom/Popup.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => {
  return width.value < 768
})

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
    nameClass: 'Mạng máy tính',
    quantity: 0,
    createdAt: '2025-11-11',
    codeJoin: '556677',
  },
  {
    id: 6,
    nameClass: 'Hệ quản trị CSDL',
    quantity: 18,
    createdAt: '2025-11-11',
    codeJoin: '334455',
  },
])

const searchQuery = ref('')
const selectedSize = ref<string>('all')
const selectedSort = ref<string>('new')

const copiedId = ref<number | null>(null)

const copyCode = (code: string, id: number) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code)
    copiedId.value = id
    setTimeout(() => {
      if (copiedId.value === id) {
        copiedId.value = null
      }
    }, 1500)
  }
}

const resetFilter = () => {
  searchQuery.value = ''
  selectedSize.value = 'all'
  selectedSort.value = 'new'
}

const listClassSize = [
  { key: 'all', name: 'Tất cả' },
  { key: 'empty', name: 'Chưa có SV' },
  { key: 'under30', name: '1-30 SV' },
  { key: 'over30', name: 'Trên 30 SV' },
]

const listSort = [
  { key: 'new', name: 'Mới nhất' },
  { key: 'old', name: 'Cũ nhất' },
  { key: 'atoz', name: 'Tên (A-Z)' },
  { key: 'quantity', name: 'Sĩ số ↑' },
  { key: 'quantityreserved', name: 'Sĩ số ↓' },
]

const filteredClasses = computed(() => {
  let result = [...listClasses.value]

  // Filter by search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (c) => c.nameClass.toLowerCase().includes(q) || c.codeJoin.toLowerCase().includes(q),
    )
  }

  // Filter by size
  if (selectedSize.value === 'empty') {
    result = result.filter((c) => c.quantity === 0)
  } else if (selectedSize.value === 'under30') {
    result = result.filter((c) => c.quantity > 0 && c.quantity <= 30)
  } else if (selectedSize.value === 'over30') {
    result = result.filter((c) => c.quantity > 30)
  }

  // Sort
  if (selectedSort.value === 'new') {
    result.sort((a, b) => b.id - a.id)
  } else if (selectedSort.value === 'old') {
    result.sort((a, b) => a.id - b.id)
  } else if (selectedSort.value === 'atoz') {
    result.sort((a, b) => a.nameClass.localeCompare(b.nameClass))
  } else if (selectedSort.value === 'quantity') {
    result.sort((a, b) => a.quantity - b.quantity)
  } else if (selectedSort.value === 'quantityreserved') {
    result.sort((a, b) => b.quantity - a.quantity)
  }

  return result
})

const isOpen = ref(false)
const isOpenEditClass = ref(false)
const isOpenPopupConfirm = ref(false)
const nameClass = ref('')
const nameClassBefore = ref('')
const selectedClassId = ref<number | null>(null)

const handleCreateClass = () => {
  if (nameClass.value.trim()) {
    listClasses.value.unshift({
      id: Date.now(),
      nameClass: nameClass.value.trim(),
      quantity: 0,
      createdAt: new Date().toISOString().split('T')[0] || '',
      codeJoin: Math.floor(100000 + Math.random() * 900000).toString(),
    })
    nameClass.value = ''
    isOpen.value = false
  }
}

const deleteClass = (id: number) => {
  selectedClassId.value = id
  nameClass.value = listClasses.value.find((item) => item.id === id)?.nameClass || ''
  isOpenPopupConfirm.value = true
}

const handleConfirmDelete = () => {
  if (selectedClassId.value) {
    listClasses.value = listClasses.value.filter((item) => item.id !== selectedClassId.value)
    selectedClassId.value = null
  }
}

const editClass = (id: number) => {
  selectedClassId.value = id
  nameClassBefore.value = listClasses.value.find((item) => item.id === id)?.nameClass || ''
  isOpenEditClass.value = true
}

const handleSaveEdit = () => {
  if (selectedClassId.value && nameClassBefore.value.trim()) {
    const target = listClasses.value.find((item) => item.id === selectedClassId.value)
    if (target) {
      target.nameClass = nameClassBefore.value.trim()
    }
    selectedClassId.value = null
    isOpenEditClass.value = false
  }
}
</script>
