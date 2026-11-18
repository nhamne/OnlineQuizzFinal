<template>
  <div class="relative" ref="dropdownRef" :type="type">
    <!-- ref="dropdownRef" này để khai báo toàn bộ cái div bao bọc component đó tên là dropdownRef -->
    <slot name="button" :toggle="toggleDropdown" :isOpen="isOpenFilter" :label="renderItem">
      <div
        @click="toggleDropdown"
        :class="
          isOpenFilter == true
            ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.15)]'
            : 'border-gray-300'
        "
        class="flex items-center justify-between p-2 border mt-2 cursor-pointer rounded-lg bg-white"
      >
        <div class="flex items-center gap-2 overflow-hidden mr-1 min-w-0">
          <Icon v-if="icon" :name="icon" size="20" class="shrink-0"></Icon>
          <span class="truncate text-[15px] font-normal text-gray-500 shrink-0">{{
            renderItem
          }}</span>
        </div>
        <Icon
          name="chevron-down"
          class="shrink-0"
          :custom-class="isOpenFilter ? 'rotate-180' : ''"
        />
      </div>
    </slot>
    <div
      v-if="isOpenFilter"
      class="absolute z-50 mt-2 w-full min-w-[150px] right-0 bg-white shadow-lg rounded-md border border-gray-300 overflow-hidden"
      :class="menuClass"
    >
      <div
        v-for="item in list"
        :key="item.key"
        @click="handleSelect(item.key)"
        class="px-4 py-2 hover:bg-primary/10 hover:text-black transition-colors duration-200 cursor-pointer flex items-center gap-2 min-w-0"
        :class="
          renderItem === item.name && props.type === 'filter' ? 'bg-dropdownitem! text-white!' : ''
        "
      >
        <slot name="icon">
          <Icon v-if="item.icon" :name="item.icon" size="18" class="shrink-0"></Icon>
        </slot>
        <span class="text-base truncate min-w-0" :title="item.name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Icon from '@/components/custom/Icon.vue'

const props = withDefaults(
  defineProps<{
    list: any[] //list là 1 mảng dữ liệu truyền vào
    menuClass?: string
    type?: 'filter' | 'action'
    icon?: string
  }>(),
  {
    type: 'filter',
  },
)
const model = defineModel<string>() //model là giá trị hiện tại được chọn

const isOpenFilter = ref<boolean>(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpenFilter.value = !isOpenFilter.value
}

const handleSelect = (key: string) => {
  model.value = key // Gán giá trị mới, Vue tự động báo cho cha biết
  isOpenFilter.value = false // Đóng menu
}

//hàm này để kiểm tra xem có click vào bên ngoài dropdown không, nếu có thì đóng dropdown lại
const handleClickOutside = (event: MouseEvent) => {
  //nếu dropdownRef có giá trị và không chứa (contains) sự kiện click (tức là click ra bên ngoài)
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpenFilter.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const renderItem = computed(() => {
  const activeItem = props.list.find((item) => item.key === model.value)
  return activeItem ? activeItem.name : props.list[0]?.name
})
</script>
