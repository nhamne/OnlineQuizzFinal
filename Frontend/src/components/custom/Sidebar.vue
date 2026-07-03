<template>
  <div
    class="flex flex-col h-screen bg-primary-bg text-white py-6 px-4 transition-all duration-300 overflow-hidden shadow-[0_10px_20px_-5px_rgba(3,_105,_161,_0.5)]"
    :class="isExpanded ? 'w-75 delay-200' : 'w-25 delay-0'"
    @mouseenter="isExpanded = true"
    @mouseleave="isExpanded = false"
  >
    <div class="flex items-center gap-4 px-4 py-2">
      <Icon name="education" size="36" color="white" class="shrink-0" />
      <!--shrink-0: không để thẻ flex bóp méo icon trong mọi TH-->
      <span
        :class="isExpanded ? 'opacity-100 delay-200' : 'opacity-0 delay-0'"
        class="font-bold text-2xl whitespace-nowrap"
        >Thi online</span
      >
    </div>
    <div class="flex flex-col gap-6 mt-8">
      <router-link
        :to="menu.route"
        :class="checkActive(menu) ? ' bg-white/20 border-white shadow-lg font-bold' : ''"
        class="flex items-center gap-4 p-4 hover:bg-white/10 transition-colors duration-300 cursor-pointer rounded-xl outline-none"
        v-for="menu in listMenu"
        :key="menu.key"
      >
        <Icon :name="menu.icon" size="32" color="white" class="shrink-0" />
        <span
          :class="isExpanded ? 'opacity-100 delay-200' : 'opacity-0 delay-0'"
          class="font-medium whitespace-nowrap"
          >{{ menu.title }}</span
        >
      </router-link>
    </div>
    <div
      class="flex items-center gap-4 p-4 mt-auto mb-6 hover:bg-white/10 transition-colors duration-300 cursor-pointer rounded-xl cursor-pointer"
    >
      <Icon name="arrow-out-right" size="32" class="shrink-0"></Icon>
      <span
        :class="isExpanded ? 'opacity-100 delay-200' : 'opacity-0 delay-0'"
        class="font-medium whitespace-nowrap"
        >Đăng xuất</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/custom/Icon.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

export interface MenuItem {
  key: string
  title: string
  icon: string
  route: string
}

const { listMenu = [] } = defineProps<{
  // câu lệnh const { listMenu = [] }: mở props ra , lấy biến tên là listMenu , nếu cha không truyền gì cả thì tự động gán nó bằng mảng rỗng []
  listMenu: MenuItem[]
}>()

const checkActive = (menu: MenuItem) => {
  return route.path.startsWith(menu.route)
}
const isExpanded = ref<boolean>(false)
</script>
