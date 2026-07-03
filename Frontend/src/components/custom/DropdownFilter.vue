<template>
  <div class="relative" ref="dropdownRef" :type="type">
    <!-- ref="dropdownRef" này để khai báo toàn bộ cái div bao bọc component đó tên là dropdownRef -->
    <slot name="button" :toggle="toggleDropdown" :isOpen="isOpenFilter" :label="renderItem">
      <div
        @click="toggleDropdown"
        class="flex items-center justify-between p-2 border mt-2 cursor-pointer border-gray-300 rounded-lg bg-primary/5"
      >
        <span>{{ renderItem }}</span>
        <Icon name="chevron-down" :custom-class="isOpenFilter ? 'rotate-180' : ''" />
      </div>
    </slot>
    <div
      v-if="isOpenFilter"
      class="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-md border border-gray-300"
      :class="menuClass"
    >
      <div
        v-for="item in list"
        :key="item.key"
        @click="handleSelect(item.key)"
        class="px-4 py-2 hover:bg-primary/10 hover:text-black transition-colors duration-200 cursor-pointer flex items-center gap-2"
        :class="
          renderItem === item.name && props.type === 'filter' ? 'bg-dropdownitem! text-white!' : ''
        "
      >
        <slot name="icon">
          <Icon v-if="item.icon" :name="item.icon" size="18"></Icon>
        </slot>
        <span class="text-base whitespace-nowrap">{{ item.name }}</span>
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
