<template>
  <div class="w-full h-full flex flex-col gap-4 pb-8">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
      <router-link to="/teacher/session-manage" class="hover:text-primary transition-colors">
        Tổ chức ca thi
      </router-link>
      <span>/</span>
      <span class="text-gray-800 font-semibold truncate">Theo dõi ca thi</span>
    </div>

    <div class="w-full flex-1 flex gap-5">
    <!-- Detail exam session-->
    <div class="border-2 border-blue-300 rounded-lg overflow-hidden">
      <div
        class="flex items-center gap-2 text-blue-700 bg-[rgb(227,241,254)] p-6 shadow-sm shadow-blue-300 relative z-10"
      >
        <Icon name="calendar-alt" size="24"></Icon>
        <span class="font-bold text-xl">Thông tin ca thi</span>
      </div>

      <div class="h-fit px-4 py-5 bg-white">
        <div class="flex flex-col gap-4">
          <div class="flex-1 rounded-lg">
            <div class="text-[15px] font-normal">Tên ca thi:</div>
            <div class="mt-1 text-[17px] font-semibold text-black/80">Test 01</div>
          </div>
          <div class="flex-1 rounded-lg">
            <div class="text-[15px] font-normal whitespace-nowrap">Môn thi:</div>
            <div
              class="mt-1 text-[13px] font-medium px-2 py-1 w-fit text-white rounded-md bg-[rgb(15,109,233)]"
            >
              Lập trình Web nâng cao
            </div>
          </div>

          <div class="flex-1 rounded-lg">
            <div class="text-[15px] font-normal">Đề thi:</div>
            <div class="mt-1 text-base font-semibold text-black/80 flex items-center gap-2">
              <Icon name="book-open" size="18" class="text-blue"></Icon>
              <span> Đề thi 01</span>
            </div>
          </div>
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex-1 rounded-lg">
              <div class="text-[15px] font-normal whitespace-nowrap">Mật khẩu:</div>
              <div class="mt-1 text-base font-semibold text-black/80 flex items-center gap-2">
                <Icon name="lock" size="18" class="text-blue"></Icon>
                <span> 123456</span>
              </div>
            </div>
            <div class="flex-1 rounded-lg">
              <div class="text-[15px] font-normal whitespace-nowrap">Thời gian làm bài:</div>
              <div class="mt-1 text-base font-normal text-black/80 flex items-center gap-2">
                <Icon name="hourglass" size="18" class="text-blue"></Icon>
                <span> 60 phút</span>
              </div>
            </div>
            <div class="flex-1 rounded-lg">
              <div class="text-[15px] font-normal whitespace-nowrap">Số câu hỏi:</div>
              <div class="mt-1 text-base font-normal text-black/80 flex items-center gap-2">
                <Icon name="message-question" size="18" class="text-blue"></Icon>
                <span> 40</span>
              </div>
            </div>
          </div>
          <div class="rounded-lg">
            <div class="text-[15px] font-normal whitespace-nowrap">Lớp học:</div>
            <div
              class="mt-1 text-[13px] font-medium border-2 border-blue-300 text-blue-700 rounded-lg w-fit px-2 py-1"
            >
              D18CNPM1
            </div>
          </div>
          <div class="flex-1 rounded-lg">
            <div class="text-[15px] font-normal">Ngày thi:</div>
            <div class="mt-1 text-base font-normal text-black/80 flex items-center gap-2">
              <Icon name="calendar-event" size="18" class="text-blue"></Icon>
              <span> Thứ 5, 20/10/2023</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex-1 rounded-lg">
              <div class="text-[15px] font-normal">Giờ bắt đầu:</div>
              <div class="mt-1 text-base font-normal text-black/80 flex items-center gap-2">
                <Icon name="clock" size="18" class="text-blue"></Icon>
                <span> 08:00</span>
              </div>
            </div>
            <div class="flex-1 rounded-lg">
              <div class="text-[15px] font-normal">Giờ kết thúc:</div>
              <div class="mt-1 text-base font-normal text-black/80 flex items-center gap-2">
                <Icon name="clock" size="18" class="text-blue"></Icon>
                <span> 12:00</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex-1 rounded-lg text-black/80">
              <div class="text-[15px] font-normal">Xem lời giải và đáp án:</div>
              <div class="mt-1 text-base font-normal text-green-700 flex items-center gap-2">
                <Icon name="eye" size="18"></Icon>
                <span> Hiển thị</span>
              </div>
            </div>
            <div class="flex-1 rounded-lg text-black/80">
              <div class="text-[15px] font-normal">Đảo câu hỏi và đáp án:</div>
              <div class="mt-1 text-base font-normal text-green-700 flex items-center gap-2">
                <Icon name="checks" size="20"></Icon>
                <span> Có</span>
              </div>
            </div>
          </div>
          <div class="flex-1 rounded-lg text-black/80">
            <div class="text-[15px] font-normal">Ghi chú:</div>
            <div
              class="mt-1 text-sm flex items-center gap-2 rounded-xl bg-amber-100 p-3 font-normal"
            >
              <Icon name="document" size="18" class="text-amber-700"></Icon>
              <span>Sinh viên cần mang theo máy tính cá nhân</span>
            </div>
          </div>
          <div class="flex-1 rounded-lg text-black/80">
            <div class="text-[15px] font-normal">Trạng thái:</div>
            <div
              class="mt-1 text-sm font-medium text-green-700 bg-green-100 py-1 px-3 rounded-xl w-fit shadow"
            >
              Đang diễn ra
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Follow exam session-->
    <div
      class="flex-1 w-full border-2 border-blue-300 rounded-lg overflow-hidden bg-[rgb(227,241,254)]"
    >
      <div
        class="flex items-center justify-between w-full p-6 shadow-sm shadow-blue-300 relative z-10"
      >
        <div class="flex items-center gap-2 text-blue-700">
          <Icon name="group" size="24"></Icon>
          <span class="font-bold text-xl">Danh sách thí sinh</span>
        </div>
        <div
          class="mt-2 flex items-center gap-2 text-white bg-[rgb(15,109,233)] w-fit px-2 py-1 rounded-lg"
        >
          <Icon name="user-line" size="18"></Icon>
          <span>50/60</span>
        </div>
      </div>
      <div class="h-full px-4 py-2 bg-white flex flex-col gap-4">
        <!-- Search -->
        <Search placeholder="Tìm kiếm thí sinh" class="w-62.5 ml-auto" />
        <!--Table-->
        <Table :listTitle="titletable1" :listBody="listStudent">
          <template #action="{ item }">
            <Icon name="dots-menu" size="22" class="text-gray-600 text-center"></Icon>
          </template>
          <template #countViolation="{ item }">
            <span
              :class="
                item.countViolation > 0
                  ? 'text-red-600 text-sm inline-flex items-center justify-center w-7 h-7 border border-red-300 bg-red-50  rounded-full'
                  : ''
              "
              >{{ item.countViolation }}</span
            >
          </template>
          <template #status="{ item }">
            <span
              :class="
                item.status == 'Đã nộp bài'
                  ? 'inline-flex text-[13px] text-green-700 items-center justify-center px-3 py-1 border border-green-300 bg-green-50 rounded-lg'
                  : 'inline-flex text-[13px] text-blue-700 items-center justify-center px-3 py-1 border border-blue-300 bg-blue-50 rounded-lg'
              "
              >{{ item.status }}</span
            >
          </template>
        </Table>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/components/custom/Icon.vue'
import Search from '@/components/custom/Search.vue'
import { useRouter } from 'vue-router'
import Table from '@/components/custom/Table.vue'
const router = useRouter()

const titletable1 = ref([
  { title: 'Họ và tên', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Trạng thái', key: 'status' },
  {
    title: 'Số lần vi phạm',
    key: 'countViolation',
    tdClass: 'text-center ',
    thClass: 'text-center',
  },
  { title: 'Thao tác', key: 'action', tdClass: 'text-center ', thClass: 'text-center' },
])

const listStudent = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    status: 'Đã nộp bài',
    countViolation: 1,
  },
  {
    id: 2,
    name: 'Nguyễn Văn B',
    email: 'emailstudent@gmail.com',
    status: 'Đã nộp bài',
    countViolation: 2,
  },
  {
    id: 3,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    countViolation: 1,
    status: 'Đang làm',
  },
  {
    id: 4,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    countViolation: 0,
    status: 'Đã nộp bài',
  },
  {
    id: 5,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    countViolation: 1,
    status: 'Đã nộp bài',
  },
  {
    id: 6,
    name: 'Nguyễn Văn A',
    email: 'emailstudent@gmail.com',
    countViolation: 0,
    status: 'Đã nộp bài',
  },
]
</script>

<style lang="css">
.test {
  background-color: rgb(217, 236, 255);
}
</style>
