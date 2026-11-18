<template>
  <div
    class="flex flex-col h-screen bg-primary-bg text-white py-4 sm:py-6 px-2 sm:px-3 md:px-4 transition-all duration-300 overflow-hidden shadow-[0_10px_20px_-5px_rgba(3,_105,_161,_0.5)] shrink-0 z-30"
    :class="isExpanded ? 'w-64 sm:w-72 md:w-80 delay-200' : 'w-18 sm:w-22 md:w-25 delay-0'"
    @mouseenter="isExpanded = true"
    @mouseleave="isExpanded = false"
  >
    <div class="flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2">
      <Icon name="education" size="30" color="white" class="sm:hidden shrink-0" />
      <Icon name="education" size="36" color="white" class="hidden sm:block shrink-0" />
      <!--shrink-0: không để thẻ flex bóp méo icon trong mọi TH-->
      <span
        :class="isExpanded ? 'opacity-100 delay-200' : 'opacity-0 delay-0'"
        class="font-bold text-xl sm:text-2xl whitespace-nowrap"
        >Thi online</span
      >
    </div>
    <div class="flex flex-col gap-3 sm:gap-5 md:gap-6 mt-6 sm:mt-8">
      <router-link
        :to="menu.route"
        :class="checkActive(menu) ? ' bg-white/20 border-white shadow-lg font-bold' : ''"
        class="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3.5 md:p-4 hover:bg-white/10 transition-colors duration-300 cursor-pointer rounded-xl outline-none"
        v-for="menu in listMenu"
        :key="menu.key"
      >
        <Icon :name="menu.icon" size="26" color="white" class="sm:hidden shrink-0" />
        <Icon :name="menu.icon" size="32" color="white" class="hidden sm:block shrink-0" />
        <span
          :class="isExpanded ? 'opacity-100 delay-200' : 'opacity-0 delay-0'"
          class="font-medium whitespace-nowrap"
          >{{ menu.title }}</span
        >
      </router-link>
    </div>
    <div
      @click="handleLogout"
      class="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3.5 md:p-4 mt-auto mb-4 sm:mb-6 hover:bg-white/10 transition-colors duration-300 cursor-pointer rounded-xl"
    >
      <Icon name="arrow-out-right" size="26" class="sm:hidden shrink-0"></Icon>
      <Icon name="arrow-out-right" size="32" class="hidden sm:block shrink-0"></Icon>
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
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

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

const handleLogout = () => {
  authStore.reset()
  router.push('/auth/login')
}
</script>
