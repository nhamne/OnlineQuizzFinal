<template>
  <div class="w-full h-full pb-8">
    <!-- Header -->
    <div class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-bg">Quản lý người dùng</h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Danh sách và phân quyền tài khoản hệ thống ({{ filteredUsers.length }}/{{ listUser.length }})</p>
      </div>
    </div>

    <!-- Toolbar: Search & Filters -->
    <div class="mt-4 sm:mt-5 w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
      <!-- Row 1 trên mobile: Tìm kiếm + Export + Reload -->
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <Search v-model="searchQuery" class="flex-1 min-w-0" placeholder="Tìm kiếm tên, email..." />
        <Button
          variant="secondary"
          custom-class="w-[42px] h-[42px] p-0 shrink-0 mt-2 flex items-center justify-center text-gray-600 sm:hidden"
          title="Export file"
        >
          <Icon name="download" size="18" />
        </Button>
        <Button
          variant="secondary"
          custom-class="w-[42px] h-[42px] p-0 shrink-0 mt-2 flex items-center justify-center text-gray-600 sm:hidden"
          @click="resetFilter"
          title="Tải lại"
        >
          <Icon name="reload" size="18" />
        </Button>
      </div>

      <!-- Row 2 trên mobile: Lọc vai trò + Lọc trạng thái + Buttons trên Desktop -->
      <div class="flex items-center gap-2 shrink-0">
        <DropdownFilter
          class="flex-1 sm:w-40 lg:w-44 shrink-0 min-w-0"
          v-model="selectedRole"
          :list="listRole"
          icon="filter"
        />

        <DropdownFilter
          class="flex-1 sm:w-40 lg:w-44 shrink-0 min-w-0"
          v-model="selectedStatus"
          :list="listStatus"
          icon="slider"
        />

        <Button
          variant="secondary"
          icon="download"
          custom-class="hidden sm:flex h-[42px] mt-2 font-medium text-gray-600 shrink-0"
        >
          Export File
        </Button>

        <Button
          variant="secondary"
          custom-class="hidden sm:flex w-[42px] h-[42px] p-0 shrink-0 mt-2 items-center justify-center text-gray-600"
          @click="resetFilter"
          title="Tải lại"
        >
          <Icon name="reload" size="18" />
        </Button>
      </div>
    </div>

    <!-- Confirm Popup -->
    <PopupConfirm
      v-model="isOpenPopupConfirm"
      variant="warning"
      :message="`Bạn có chắc chắn muốn khóa tài khoản ${nameUser}?`"
      title="Khóa tài khoản"
    />

    <!-- Table Container (Horizontal Scrollable on Mobile) -->
    <div
      class="relative w-full mt-4 sm:mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto custom-scrollbar">
        <div class="min-w-[680px] p-2">
          <Table :listTitle="titletable" :listBody="filteredUsers">
            <template #role="{ item }">
              <span
                :class="
                  item.role === 'Học sinh'
                    ? 'inline-flex text-xs font-semibold text-green-700 items-center justify-center px-2.5 py-0.5 border border-green-200 bg-green-50 rounded-full'
                    : 'inline-flex text-xs font-semibold text-blue-700 items-center justify-center px-2.5 py-0.5 border border-blue-200 bg-blue-50 rounded-full'
                "
              >
                {{ item.role }}
              </span>
            </template>

            <template #action="{ item }">
              <div class="relative inline-block text-left">
                <button
                  type="button"
                  @click.stop="toggleDropdown(item.id)"
                  class="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors mx-auto"
                >
                  <Icon name="dots-menu" size="20" />
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="currentId === item.id"
                  class="absolute z-50 mt-1 w-44 py-1.5 shadow-xl right-0 bg-white rounded-xl border border-gray-200"
                >
                  <div
                    @click.stop="handleAction(action.key, item)"
                    v-for="action in listAction"
                    :key="action.key"
                    :class="action.key === 'lock' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'"
                    class="px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-2.5 text-xs sm:text-sm font-medium"
                  >
                    <Icon
                      :name="action.icon"
                      size="16"
                      :class="action.key === 'lock' ? 'text-red-500' : 'text-gray-500'"
                    ></Icon>
                    <span>{{ action.name }}</span>
                  </div>
                </div>
              </div>
            </template>
          </Table>
        </div>
      </div>

      <!-- Empty state if search has no results -->
      <div v-if="filteredUsers.length === 0" class="p-8 text-center text-gray-400">
        <p class="text-sm font-medium text-gray-600">Không tìm thấy người dùng phù hợp</p>
        <p class="text-xs text-gray-400 mt-1">Vui lòng thử lại với từ khóa tìm kiếm hoặc bộ lọc khác</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Button from '@/components/custom/Button.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Search from '@/components/custom/Search.vue'
import Icon from '@/components/custom/Icon.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'
import Table from '@/components/custom/Table.vue'

const searchQuery = ref<string>('')
const selectedRole = ref<string>('all')
const selectedStatus = ref<string>('all')

const resetFilter = () => {
  searchQuery.value = ''
  selectedRole.value = 'all'
  selectedStatus.value = 'all'
}

const listRole = [
  { key: 'all', name: 'Tất cả vai trò' },
  { key: 'student', name: 'Học sinh' },
  { key: 'teacher', name: 'Giáo viên' },
]

const listStatus = [
  { key: 'all', name: 'Tất cả trạng thái' },
  { key: 'online', name: 'Hoạt động' },
  { key: 'offline', name: 'Bị khóa' },
]

const titletable = ref([
  { title: 'Người dùng', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Vai trò', key: 'role' },
  {
    title: 'Ngày tham gia',
    key: 'datejoin',
    tdClass: 'text-center text-xs sm:text-sm',
    thClass: 'text-center',
  },
  { title: 'Thao tác', key: 'action', tdClass: 'text-center', thClass: 'text-center' },
])

const listUser = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'emailteacher@gmail.com',
    role: 'Giáo viên',
    datejoin: '19/09/2026',
  },
  {
    id: 2,
    name: 'Nguyễn Văn B',
    email: 'emailstudent@gmail.com',
    role: 'Học sinh',
    datejoin: '20/09/2026',
  },
  {
    id: 3,
    name: 'Trần Thị C',
    email: 'tranthic@gmail.com',
    datejoin: '19/09/2026',
    role: 'Giáo viên',
  },
  {
    id: 4,
    name: 'Lê Văn D',
    email: 'levand@gmail.com',
    datejoin: '19/09/2026',
    role: 'Học sinh',
  },
  {
    id: 5,
    name: 'Phạm Văn E',
    email: 'phamvane@gmail.com',
    datejoin: '19/09/2026',
    role: 'Học sinh',
  },
  {
    id: 6,
    name: 'Hoàng Thị F',
    email: 'hoangthif@gmail.com',
    datejoin: '19/09/2026',
    role: 'Học sinh',
  },
]

const filteredUsers = computed(() => {
  return listUser.filter((u) => {
    if (selectedRole.value !== 'all') {
      const targetRole = selectedRole.value === 'student' ? 'Học sinh' : 'Giáo viên'
      if (u.role !== targetRole) return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchName = u.name.toLowerCase().includes(q)
      const matchEmail = u.email.toLowerCase().includes(q)
      if (!matchName && !matchEmail) return false
    }
    return true
  })
})

const currentId = ref<number | null>(null)
const toggleDropdown = (id: number) => {
  currentId.value = currentId.value === id ? null : id
}

const listAction = [
  { key: 'info', name: 'Xem chi tiết', icon: 'eye' },
  { key: 'reset', name: 'Đặt lại mật khẩu', icon: 'reload' },
  { key: 'lock', name: 'Khóa tài khoản', icon: 'block' },
]

const isOpenPopupConfirm = ref<boolean>(false)
const nameUser = ref<string>('')

const handleAction = (key: string, item: any) => {
  currentId.value = null
  if (key === 'lock') {
    nameUser.value = item.name
    isOpenPopupConfirm.value = true
  }
}

const handleClickOutside = () => {
  currentId.value = null
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
