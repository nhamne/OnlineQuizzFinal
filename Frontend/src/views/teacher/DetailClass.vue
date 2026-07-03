<template>
  <div class="w-full h-full flex flex-col gap-10">
    <!-- <div class="flex justify-between items-center px-8 p-6"> -->
    <div>
      <span class="font-semibold text-3xl text-black/80"
        >Kiểm thử và đảm bảo chất lượng phần mềm</span
      >
      <div class="mt-2 text-base">
        Mã tham gia: <span class="text-secondary text-sm font-bold">XZYZ4321</span>
      </div>
    </div>
    <!-- <div class="py-2 px-4 bg-primary/5 rounded-lg">
        Sĩ số: <span class="text-black/80 text-sm font-bold">41</span>
      </div> -->
    <!-- </div> -->
    <div class="bg-white rounded-2xl shadow-sm">
      <div class="grid grid-cols-[1fr_1fr_2fr_auto] items-center gap-10 px-10 py-2">
        <div
          class="relative flex items-center gap-2 cursor-pointer p-4 font-semibold justify-center transition-colors duration-300"
          @click="currentitem = item.key"
          :class="currentitem === item.key ? 'text-primary' : 'text-gray-500 hover:text-primary/80'"
          v-for="item in listtitle"
          :key="item.key"
        >
          <Icon :name="item.icon" size="20" />
          <span class="text-base">{{ item.label }}</span>
          <div
            class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-all duration-300"
            :class="currentitem === item.key ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
          ></div>
        </div>
        <Search></Search>
        <Icon name="dots-circle" size="24" class="mt-2.5"></Icon>
      </div>
      <div class="mt-8">
        <Transition name="fade" mode="out-in">
          <Table v-if="currentitem === 'student'" :listTitle="titletable1" :listBody="listStudent">
            <template #custom-td="{ item }">
              <td class="py-4" @click.stop="handleRemoveStudent(item.id)">
                <span
                  class="flex justify-center items-center w-fit ml-auto group p-2 rounded-lg transition-all duration-200 bg-red-500/10 hover:bg-red-200"
                  ><Icon name="user-minus" size="22" class="text-red-700"></Icon
                ></span>
              </td>
            </template>
          </Table>
          <Table v-else-if="currentitem === 'exam'" :listTitle="titletable2" :listBody="listExam">
            <template #custom-td="{ item }">
              <td class="py-4 text-right">{{ item.averageScore }}</td>
            </template>
          </Table>
        </Transition>
      </div>
    </div>
    <PopupConfirm
      v-model="isOpenPopupConfirm"
      :message="`Bạn có chắc chắn muốn xóa học sinh ${nameStudent} khỏi lớp?`"
      title="Xóa học sinh"
    ></PopupConfirm>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/custom/Icon.vue'
import { ref } from 'vue'
import Search from '@/components/custom/Search.vue'
// import Button from '@/components/custom/Button.vue'
import Table from '@/components/custom/Table.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'

const currentitem = ref<string>('student')
const isOpenPopupConfirm = ref<boolean>(false)
const nameStudent = ref<string>('')
const listtitle = ref([
  { label: 'Danh sách Sinh viên', key: 'student', icon: 'form' },
  { label: 'Danh sách ca thi', key: 'exam', icon: 'task' },
])

const titletable1 = ref([
  { title: 'STT' },
  { title: 'Họ và tên' },
  { title: 'Email' },
  { title: 'Ngày tham gia' },
  { title: 'Thao tác' },
])
const titletable2 = ref([
  { title: 'STT' },
  { title: 'Tên ca thi' },
  { title: 'Số học sinh tham gia' },
  { title: 'Trạng thái' },
  { title: 'Điểm trung bình' },
])

const listStudent = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    joinDate: '22/06/2025',
  },
  {
    id: 2,
    name: 'Nguyễn Văn B',
    email: 'emailstudent@gmail.com',
    joinDate: '22/06/2025',
  },
  {
    id: 3,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    joinDate: '22/06/2025',
  },
  {
    id: 4,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    joinDate: '22/06/2025',
  },
  {
    id: 5,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    joinDate: '22/06/2025',
  },
  {
    id: 6,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    joinDate: '22/06/2025',
  },
]

const listExam = [
  {
    id: 1,
    name: 'Ca thi số 01',
    email: '41',
    joinDate: 'Đã kết thúc',
    averageScore: '8.5',
  },
  {
    id: 2,
    name: 'Ca thi số 02',
    email: '29',
    joinDate: 'Sắp diễn ra',
    averageScore: '8.5',
  },
  {
    id: 3,
    name: 'Ca thi số 03',
    email: '40',
    joinDate: 'Đang diễn ra',
    averageScore: '8.5',
  },
  {
    id: 4,
    name: 'Ca thi số 04',
    email: '31',
    joinDate: 'Đã kết thúc',
    averageScore: '8.5',
  },
]

const handleRemoveStudent = (id: number) => {
  nameStudent.value = listStudent.find((item) => item.id === id)?.name || ''
  isOpenPopupConfirm.value = true
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(15px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}
</style>
