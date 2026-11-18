<template>
  <div class="w-full h-screen h-100dvh flex flex-col overflow-hidden">
    <!--Header-->
    <div
      class="px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6 bg-white shadow-lg! relative z-10 flex items-center justify-between gap-3 sm:gap-4 shrink-0"
    >
      <div class="min-w-0">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
          <router-link to="/student/my-sessions" class="hover:text-primary transition-colors">
            Ca thi của tôi
          </router-link>
          <span>/</span>
          <span class="text-gray-800 font-semibold truncate">Làm bài thi</span>
        </div>
        <div class="text-xl uppercase font-semibold text-black/80 truncate">{{ examTitle }}</div>
        <div class="text-sm truncate text-gray-500">Lớp D18CNPM1 • Nguyễn Văn A</div>
      </div>
      <div class="flex items-center gap-2 sm:gap-4 shrink-0">
        <div class="flex items-center gap-1.5 sm:gap-2">
          <Icon name="clock" size="18" class="shrink-0" />
          <div id="clock"></div>
        </div>
        <Popup
          v-model="isOpenPopup"
          title="Báo cáo đề thi"
          desc="Đề thi: Kiểm tra giữa kỳ 1"
          width="600px"
          icon="calendar-alt"
          labelInput="Tên ca thi (bắt buộc)"
          placeholder="Ví dụ: Lập trình Web nâng cao - D18CNPM1"
          btnAcceptText="Gửi báo cáo"
          @accept="handlePreviewExam"
        >
          <template #custom-body>
            <div class="w-full h-fit overflow-y-auto custom-scrollbar px-4 py-3 sm:px-6 sm:py-4">
              <div class="text-sm">
                Báo cáo của bạn sẽ được chuyển đến bộ phận kiểm duyệt phù hợp để xử lý nhanh chóng
                và minh bạch.
              </div>
              <div>
                <div class="font-semibold uppercase mt-4">
                  Lý do báo cáo vi phạm<span class="text-red-500">*</span>
                </div>
                <div class="flex flex-col gap-2.5 sm:gap-3 mt-3">
                  <div class="border border-gray-300 rounded-lg px-3 py-2">
                    <div class="flex items-center gap-2">
                      <input type="radio" name="violationReason" value="1" />
                      <span class="font-semibold text-black/80"
                        >Nội dung phản cảm, thù địch hoặc không phù hợp</span
                      >
                    </div>
                    <div class="mt-1 text-sm ml-5 text-gray-400 font-normal">
                      Xúc phạm, từ ngữ bạo lực, phi văn hóa hoặc công kích cá nhân
                    </div>
                  </div>
                  <div class="border border-gray-300 rounded-lg px-3 py-2">
                    <div class="flex items-center gap-2">
                      <input type="radio" name="violationReason" value="1" />
                      <span class="font-semibold text-black/80"
                        >Spam, quảng cáo rác hoặc lừa đảo</span
                      >
                    </div>
                    <div class="mt-1 text-sm ml-5 text-gray-400 font-normal">
                      Chèn liên kết tiếp thị, bán tài liệu ngoài luồng hoặc link lạ
                    </div>
                  </div>
                  <div class="border border-gray-300 rounded-lg px-3 py-2">
                    <div class="flex items-center gap-2">
                      <input type="radio" name="violationReason" value="1" />
                      <span class="font-semibold text-black/80">Vi phạm bản quyền</span>
                    </div>
                    <div class="mt-1 text-sm ml-5 text-gray-400 font-normal">
                      Sao chép trái phép câu hỏi đề thi độc quyền chưa được cấp phép
                    </div>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="text-sm font-semibold">Chi tiết bổ sung ( Tùy chọn )</div>
                  <textarea
                    class="mt-2 px-3 py-2 w-full h-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Vui lòng mô tả rõ hơn về vi phạm (nếu có)"
                  ></textarea>
                </div>
              </div>
            </div>
          </template>
        </Popup>
        <div
          @click="isOpenPopup = true"
          class="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          <Icon name="flag-alt-3" size="14" class="shrink-0"></Icon>
          <span class="text-xs font-medium">Báo cáo đề</span>
        </div>
      </div>
      <!-- <div class="flex items-center gap-4">
        
        <Button>
          <Icon name="send" size="18" class="shrink-0" />
          Nộp bài
        </Button>
      </div> -->
    </div>

    <!--Body-->
    <div
      class="grid grid-cols-1 lg:grid-cols-[3fr_1.2fr] xl:grid-cols-[4fr_1fr] w-full flex-1 min-h-0 overflow-hidden"
    >
      <!--Left-->
      <div
        class="w-full h-full flex flex-col overflow-y-auto pt-6 sm:pt-8 lg:pt-10 pb-24 lg:pb-10 gap-6 sm:gap-8 lg:gap-10"
      >
        <div
          :id="'exam-question-' + item.id"
          class="flex flex-col w-full items-center justify-start scroll-mt-6"
          v-for="(item, index) in questionList"
          :key="item.id"
        >
          <!--Content-->
          <div
            class="w-full px-4 sm:px-6 md:w-[85%] lg:w-[80%] xl:w-[70%] 2xl:w-[60%] mx-auto py-2 sm:py-3"
          >
            <div class="flex items-center justify-between gap-2">
              <div
                class="w-fit px-3 py-1 text-[13px] font-semibold text-white bg-secondary rounded-full shrink-0"
              >
                Câu {{ index + 1 }} / {{ questionList.length }}
              </div>
              <button
                @click="item.isFlag = !item.isFlag"
                :class="
                  item.isFlag === false
                    ? 'border-secondary/80 text-secondary'
                    : 'border-amber-600 text-amber-700 bg-amber-100'
                "
                class="flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:px-4 rounded-full w-fit border hover:-translate-y-[1px] transition-all text-[13px] cursor-pointer font-medium shrink-0"
              >
                <Icon name="flag" size="18"></Icon>
                {{ item.isFlag === false ? 'Đánh dấu' : 'Bỏ đánh dấu' }}
              </button>
            </div>
            <!--Question Content-->
            <div class="text-base font-semibold mt-3 sm:mt-4">{{ item.content }}</div>
          </div>
          <!--Answer List-->
          <div class="w-full px-4 sm:px-6 md:w-[85%] lg:w-[80%] xl:w-[70%] 2xl:w-[60%] mx-auto">
            <div
              @click="handleSelectAnswer(item.id, subItem.id)"
              v-for="(subItem, i) in item.listAnswer"
              :key="subItem.id"
              class="mt-3 sm:mt-4 border-[1px_1px_1px_3px] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer hover:bg-[#f4faff] transition-colors flex items-center gap-2 sm:gap-3"
              :class="
                userAnswer[item.id] == subItem.id
                  ? 'border-secondary/80 bg-[#f4faff]'
                  : ' border-secondary/20'
              "
            >
              <div
                class="flex items-center justify-center font-semibold w-[30px] h-[30px] rounded-lg shrink-0"
                :class="
                  userAnswer[item.id] == subItem.id
                    ? 'bg-button-primary text-white'
                    : 'bg-secondary/10'
                "
              >
                {{ labelArray[i] }}
              </div>
              <span class="flex-1">{{ subItem.content }}</span>
            </div>
          </div>
          <!--action-->
          <div
            class="hidden w-full px-4 sm:px-6 md:w-[85%] lg:w-[80%] xl:w-[70%] 2xl:w-[60%] mx-auto flex items-center justify-between mt-6 sm:mt-8 lg:mt-10"
          >
            <Button
              :variant="questionList.length > 0 ? 'secondary' : 'disabled'"
              icon="chevron-left"
              class="rounded-full"
              >Câu trước</Button
            >
            <div></div>
            <Button icon="chevron-right" class="rounded-full">Câu tiếp</Button>
          </div>
        </div>
      </div>
      <!--Right-->

      <div
        class="hidden lg:flex bg-white w-full h-full flex-col border-l border-secondary/20 lg:overflow-y-auto"
      >
        <!--status-->
        <div class="hidden lg:block p-4 sm:p-5 lg:p-6">
          <div class="font-semibold uppercase text-sm">Tiến độ làm bài</div>
          <div class="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            <div
              class="flex flex-col items-center gap-1.5 sm:gap-2 bg-green-100 py-3 sm:py-4 px-1 sm:px-2 rounded-lg"
            >
              <h1 class="text-green-700 text-4xl font-bold">{{ countAnswered }}</h1>
              <span class="text-sm font-normal text-green-700">Đã làm</span>
            </div>
            <div
              class="flex flex-col items-center gap-1.5 sm:gap-2 bg-amber-100 py-3 sm:py-4 px-1 sm:px-2 rounded-lg"
            >
              <h1 class="text-amber-600 text-4xl font-bold">{{ countFlagged }}</h1>
              <span class="text-sm font-normal text-amber-700">Đánh dấu</span>
            </div>
            <div
              class="flex flex-col items-center gap-1.5 sm:gap-2 bg-gray-100 py-3 sm:py-4 px-1 sm:px-2 rounded-lg"
            >
              <h1 class="text-gray-500 text-4xl font-bold">{{ countUnanswered }}</h1>
              <span class="text-sm font-normal text-gray-700">Chưa làm</span>
            </div>
          </div>
        </div>

        <!-- <div
          class="mt-4 flex flex-wrap items-center gap-5 ßjustify-between p-6 border-t border-secondary/20"
        >
          <div class="flex items-center gap-1.5">
            <h1
              class="text-white font-semibold w-6 h-6 flex items-center justify-center rounded-sm bg-primary"
            >
              0
            </h1>
            <span class="text-sm font-normal text-gray-600">Đang xem</span>
          </div>
          <div class="flex items-center gap-1.5">
            <h1
              class="text-white font-semibold w-6 h-6 flex items-center justify-center rounded-sm bg-secondary"
            >
              0
            </h1>
            <span class="text-sm font-normal text-gray-600">Đã làm</span>
          </div>
          <div class="flex items-center gap-1.5">
            <h1
              class="font-semibold w-6 h-6 border-2 border-amber-500 flex items-center justify-center rounded-sm bg-amber-100 text-amber-700"
            >
              0
            </h1>
            <span class="text-sm font-normal text-gray-600">Đánh dấu</span>
          </div>
          <div class="flex items-center gap-1.5">
            <h1
              class="text-gray-500 border-2 border-gray-400 font-semibold w-6 h-6 flex items-center justify-center rounded-sm bg-gray-50"
            >
              0
            </h1>
            <span class="text-sm font-normal text-gray-600">Chưa làm</span>
          </div>
        </div> -->

        <!--Question List -->
        <div class="hidden lg:block p-4 sm:p-5 lg:p-6 border-t border-secondary/20">
          <div class="uppercase font-semibold text-sm">Danh sách câu hỏi</div>
          <div class="flex flex-wrap items-center gap-2 sm:gap-2.5 lg:gap-3 mt-3 sm:mt-4">
            <div
              v-for="(item, index) in questionList"
              :key="item.id"
              @click="scrollToQuestion(item.id)"
              class="cursor-pointer w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-13 xl:h-13 flex items-center justify-center rounded-lg shrink-0 relative transition-transform hover:scale-105 active:scale-95"
              :class="getQuestionBadgeClass(item)"
              :title="`Câu ${index + 1}: ${userAnswer[item.id] !== null ? 'Đã làm' : item.isFlag ? 'Đánh dấu' : 'Chưa làm'}`"
            >
              {{ index + 1 }}
              <span
                v-if="item.isFlag"
                class="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"
              ></span>
            </div>
          </div>
        </div>
        <!--Button submit-->
        <div class="w-full p-4 sm:p-5 lg:p-6 border-t border-secondary/20 mt-auto">
          <Button class="w-full" icon="send" @click="isOpen = true">Nộp bài thi</Button>
        </div>
      </div>
    </div>

    <!--Mobile Bottom Sheet Backdrop-->
    <div
      v-if="isMobileDrawerOpen"
      @click="isMobileDrawerOpen = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-2xs z-40 lg:hidden transition-opacity duration-300"
    ></div>

    <!--Mobile Bottom Sheet (Nhô lên nửa màn hình)-->
    <div
      class="fixed left-0 right-0 bottom-0 z-50 lg:hidden bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out border-t border-gray-200 flex flex-col max-h-[70vh] sm:max-h-[60vh]"
      :class="isMobileDrawerOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'"
    >
      <!-- Sheet Handle & Header -->
      <div class="px-5 pt-3 pb-3 flex flex-col shrink-0 border-b border-gray-100">
        <!-- Drag pill handle -->
        <div
          @click="isMobileDrawerOpen = false"
          class="w-12 h-1.5 bg-gray-300 hover:bg-gray-400 rounded-full mx-auto cursor-pointer mb-2.5 transition-colors"
        ></div>

        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <span class="font-bold text-base text-gray-900 leading-tight">Danh sách câu hỏi</span>
            <span class="text-xs text-gray-500 mt-0.5">Chạm vào câu hỏi để chuyển đến câu đó</span>
          </div>
          <button
            @click="isMobileDrawerOpen = false"
            class="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            title="Đóng"
          >
            <Icon name="x" size="20" />
          </button>
        </div>

        <!-- 3 Mini Status Chips -->
        <div class="grid grid-cols-3 gap-2 mt-3">
          <div class="flex items-center justify-center gap-1.5 bg-green-50 border border-green-200 py-1.5 px-2 rounded-xl text-xs font-semibold text-green-700">
            <span class="w-2.5 h-2.5 rounded-full bg-green-600 shrink-0"></span>
            <span>Đã làm ({{ countAnswered }})</span>
          </div>
          <div class="flex items-center justify-center gap-1.5 bg-amber-50 border border-amber-200 py-1.5 px-2 rounded-xl text-xs font-semibold text-amber-700">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
            <span>Đánh dấu ({{ countFlagged }})</span>
          </div>
          <div class="flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 py-1.5 px-2 rounded-xl text-xs font-semibold text-gray-600">
            <span class="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0"></span>
            <span>Chưa làm ({{ countUnanswered }})</span>
          </div>
        </div>
      </div>

      <!-- Sheet Scrollable Matrix Grid of Questions -->
      <div class="p-5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        <div class="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
          <button
            v-for="(item, index) in questionList"
            :key="item.id"
            type="button"
            @click="handleSelectQuestionMobile(item.id)"
            :class="getQuestionBadgeClass(item)"
            class="aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 relative"
            :title="`Câu ${index + 1}`"
          >
            {{ index + 1 }}
            <span
              v-if="item.isFlag"
              class="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"
            ></span>
          </button>
        </div>
      </div>

      <!-- Sheet Footer: Nộp bài thi -->
      <div class="p-4 border-t border-gray-200 bg-gray-50/70 shrink-0">
        <Button class="w-full" icon="send" @click="isOpen = true">Nộp bài thi</Button>
      </div>
    </div>

    <!--Mobile Bottom Action Bar (Cố định ở đáy màn hình, click để mở bảng câu hỏi)-->
    <div
      @click="isMobileDrawerOpen = true"
      class="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-gray-200 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3 cursor-pointer select-none"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
          <Icon name="chevron-up" size="18" />
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-gray-500 font-medium">Đã làm:</span>
            <span class="text-sm font-bold text-secondary">
              {{ countAnswered }}/{{ questionList.length }}
            </span>
            <span class="text-xs text-gray-500">câu</span>
          </div>
          <span class="text-[11px] text-primary font-semibold flex items-center gap-0.5">
            Bấm để xem danh sách câu hỏi
          </span>
        </div>
      </div>
      <Button icon="send" @click.stop="isOpen = true">Nộp bài thi</Button>
    </div>

    <!--Popup Confirm Submit-->
    <PopupConfirm
      v-model="isOpen"
      title="Xác nhận nộp bài"
      :message="`Bạn có chắc chắn muốn nộp bài &quot;${examTitle}&quot; không ?`"
    ></PopupConfirm>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from '@/components/custom/Icon.vue'
import Button from '@/components/custom/Button.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'
import Popup from '@/components/custom/Popup.vue'
import Input from '@/components/custom/Input.vue'

const examTitle = ref('Kiểm tra giữa kỳ 1')

const isOpen = ref(false)
const isMobileDrawerOpen = ref(false)

const handleSelectAnswer = (questionId, answerId) => {
  userAnswer.value[questionId] = answerId
}

const scrollToQuestion = (questionId) => {
  const el = document.getElementById('exam-question-' + questionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleSelectQuestionMobile = (questionId) => {
  isMobileDrawerOpen.value = false
  setTimeout(() => {
    scrollToQuestion(questionId)
  }, 200)
}

const getQuestionBadgeClass = (item) => {
  if (userAnswer.value[item.id] !== null) {
    if (item.isFlag) {
      return 'bg-secondary text-white ring-2 ring-amber-500 ring-offset-1 font-bold'
    }
    return 'bg-secondary text-white font-bold'
  }
  if (item.isFlag) {
    return 'bg-amber-100 text-amber-700 border-2 border-amber-500 font-bold'
  }
  return 'border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-bold'
}

const countFlagged = computed(() => {
  return questionList.value.filter((item) => item.isFlag).length
})

const countAnswered = computed(() => {
  return questionList.value.filter((item) => userAnswer.value[item.id] !== null).length
})

const countUnanswered = computed(() => {
  return questionList.value.filter((item) => userAnswer.value[item.id] === null).length
})
// const handleToggleFlag = () => {
//   isFlag.value = !isFlag.value
// }

const userAnswer = ref({
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
})
const questionList = ref([
  {
    id: 1,
    content: 'Học máy (Machine Learning) là gì?',
    isFlag: false,
    listAnswer: [
      {
        id: 1,
        content: ' Là lĩnh vực giúp máy tính học từ dữ liệu mà không cần lập trình tường minh',
      },
      {
        id: 2,
        content: ' Là việc lắp ráp phần cứng máy tính',
      },
      {
        id: 3,
        content: 'Là quá trình thiết kế giao diện website',
      },
      {
        id: 4,
        content: ' Là một hệ điều hành',
      },
    ],
    answerCorrect: 1,
  },
  {
    id: 2,
    content: 'Dữ liệu dùng để huấn luyện mô hình được gọi là gì?',
    isFlag: false,
    listAnswer: [
      {
        id: 1,
        content: 'Dữ liệu kiểm thử',
      },
      {
        id: 2,
        content: 'Dữ liệu huấn luyện',
      },
      {
        id: 3,
        content: 'Dữ liệu dự đoán',
      },
      {
        id: 4,
        content: 'Dữ liệu đầu ra',
      },
    ],
    answerCorrect: 2,
  },
  {
    id: 3,
    content: 'Học có giám sát (Supervised Learning) sử dụng loại dữ liệu nào?',
    isFlag: false,
    listAnswer: [
      {
        id: 1,
        content: 'Dữ liệu có nhãn',
      },
      {
        id: 2,
        content: 'Dữ liệu không có nhãn',
      },
      {
        id: 3,
        content: 'Dữ liệu bị thiếu',
      },
      {
        id: 4,
        content: 'Dữ liệu ngẫu nhiên',
      },
    ],
    answerCorrect: 1,
  },
  {
    id: 4,
    content: 'Bài toán dự đoán giá nhà thuộc loại nào?',
    isFlag: false,
    listAnswer: [
      {
        id: 1,
        content: 'Phân cụm',
      },
      {
        id: 2,
        content: 'Hồi quy',
      },
      {
        id: 3,
        content: 'Giảm chiều dữ liệu',
      },
      {
        id: 4,
        content: 'Khai phá luật kết hợp',
      },
    ],
    answerCorrect: 2,
  },
  {
    id: 5,
    content: 'Mục tiêu của bài toán phân cụm (Clustering) là gì?',
    isFlag: false,
    listAnswer: [
      {
        id: 1,
        content: 'Dự đoán giá trị số',
      },
      {
        id: 2,
        content: 'Phân loại dữ liệu theo nhãn có sẵn',
      },
      {
        id: 3,
        content: 'Nhóm các đối tượng tương đồng lại với nhau',
      },
      {
        id: 4,
        content: 'Loại bỏ dữ liệu nhiễu',
      },
    ],
    answerCorrect: 3,
  },
])
const labelArray = ['A', 'B', 'C', 'D']

const isOpenPopup = ref(false)
</script>
