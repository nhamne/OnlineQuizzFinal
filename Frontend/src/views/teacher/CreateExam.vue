<template>
  <div class="flex flex-col pb-8">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium mb-4 sm:mb-5">
      <router-link to="/teacher/exam-manage" class="hover:text-primary transition-colors">
        Danh sách đề thi
      </router-link>
      <span>/</span>
      <span class="text-gray-800 font-semibold truncate">Tạo đề thi thủ công</span>
    </div>

    <!-- Top Info and Tips -->
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 sm:gap-5">
      <!-- Thông tin cơ bản -->
      <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <div class="uppercase text-sm sm:text-base text-black/80 font-bold tracking-wide">Thông tin cơ bản</div>
          <div class="mt-4">
            <span class="text-xs sm:text-sm text-black/80 font-semibold mb-1.5 block">Tên đề thi</span>
            <Input
              v-model="nameExam"
              placeholder="Nhập tên đề thi"
              icon="clipboard"
              variant="required"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
            <div>
              <span class="text-xs sm:text-sm text-black/80 font-semibold mb-1.5 block">Môn học</span>
              <Input v-model="subject" placeholder="Nhập môn học" icon="book" variant="required" />
            </div>
            <div>
              <span class="text-xs sm:text-sm text-black/80 font-semibold mb-1.5 block">Thời gian (phút)</span>
              <Input v-model="time" placeholder="Nhập thời gian (phút)" icon="book" variant="required" />
            </div>
          </div>
        </div>
      </div>

      <!-- Chế độ thủ công banner / tips -->
      <div class="bg-secondary p-5 sm:p-7 rounded-2xl shadow-sm flex flex-col justify-between gap-4 text-white">
        <div>
          <div class="font-bold text-base sm:text-lg">Chế độ thủ công</div>
          <p class="text-white/80 text-xs sm:text-sm mt-1 leading-relaxed">
            Bạn đang tự soạn thảo nội dung câu hỏi và đáp án cho đề thi này
          </p>
        </div>
        <div class="flex items-center gap-2.5 bg-white/10 p-3 rounded-xl border border-white/15">
          <div class="rounded-lg h-7 w-7 bg-white/20 flex items-center justify-center shrink-0">
            <Icon name="bulb" size="18" color="white" />
          </div>
          <p class="text-white/90 text-xs sm:text-sm leading-snug">Mẹo: Bạn có thể nhập nhanh từ file Excel hoặc file Word</p>
        </div>
      </div>
    </div>

    <!-- Mobile Switch Tabs (Soạn câu hỏi vs Xem trước) -->
    <div class="flex lg:hidden mt-4 bg-white p-1 rounded-xl shadow-sm border border-gray-200 gap-1">
      <button
        type="button"
        @click="activeMobileTab = 'editor'"
        :class="activeMobileTab === 'editor' ? 'bg-secondary text-white font-bold shadow-sm' : 'text-gray-600 font-medium hover:bg-gray-50'"
        class="flex-1 py-2 text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1.5 transition-all"
      >
        <Icon name="edit" size="16" />
        <span>Soạn câu hỏi</span>
      </button>
      <button
        type="button"
        @click="activeMobileTab = 'preview'"
        :class="activeMobileTab === 'preview' ? 'bg-secondary text-white font-bold shadow-sm' : 'text-gray-600 font-medium hover:bg-gray-50'"
        class="flex-1 py-2 text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1.5 transition-all"
      >
        <Icon name="eye" size="16" />
        <span>Xem trước ({{ parsedQuestion.length }})</span>
      </button>
    </div>

    <!-- Editor and Preview container -->
    <div
      class="mt-3 lg:mt-5 bg-white h-fit border border-gray-200 rounded-t-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200"
    >
      <!-- Editor Column -->
      <div :class="activeMobileTab === 'editor' ? 'block' : 'hidden lg:block'">
        <div class="w-full h-full p-4 sm:p-6">
          <textarea
            ref="textareaRef"
            v-model="rawText"
            @input="resizeTextarea"
            class="outline-none w-full min-h-[300px] lg:min-h-[420px] font-mono text-xs sm:text-sm text-black/80 resize-none leading-relaxed"
            placeholder="Nhập câu hỏi tại đây...

Quy tắc:

Câu [SỐ]: Nội dung câu hỏi

A. Đáp án 1
B. Đáp án 2
C. Đáp án 3
D. Đáp án 4

Thêm dấu * trước đáp án đúng (*A. Đáp án 1)"
          ></textarea>
        </div>
      </div>

      <!-- Preview Column -->
      <div
        :class="activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'"
        class="w-full h-full bg-gray-50/70 p-4 sm:p-6 custom-scrollbar max-h-[600px] overflow-y-auto"
      >
        <!-- Empty state -->
        <div
          v-if="!rawText || rawText.trim() === ''"
          class="w-full min-h-[220px] lg:h-full flex items-center justify-center p-6"
        >
          <div class="text-center text-xs sm:text-sm text-gray-400 max-w-xs">
            Chưa có câu hỏi nào. Hãy nhập câu hỏi theo gợi ý ở khung bên trái
          </div>
        </div>

        <!-- Question List -->
        <div v-else class="space-y-3 sm:space-y-4">
          <div
            v-for="(item, index) in parsedQuestion"
            :key="index"
            class="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div>
              <div class="font-bold text-sm sm:text-base text-blue">Câu {{ item.number }}:</div>
              <div class="mt-2 text-xs sm:text-sm text-black/80 font-medium whitespace-pre-wrap">{{ item.content }}</div>
            </div>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-3">
              <li
                v-for="(option, optIdx) in item.options"
                :key="optIdx"
                class="border border-gray-200 p-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-medium transition-all"
                :class="option.isCorrected ? 'bg-blue/5 border-blue/40 text-blue font-semibold' : 'text-gray-700 bg-white'"
              >
                <div
                  :class="
                    option.isCorrected
                      ? 'text-white bg-blue h-6 w-6 sm:h-7 sm:w-7 text-xs'
                      : 'bg-gray-100 text-gray-600 h-6 w-6 sm:h-7 sm:w-7 text-xs'
                  "
                  class="shrink-0 rounded-full flex items-center justify-center font-bold"
                >
                  {{ option.label }}
                </div>
                <span class="break-words line-clamp-2">{{ option.content }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Bar -->
    <div
      class="bg-white p-4 sm:px-8 sm:py-5 rounded-b-2xl border border-t-0 border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-5 shadow-sm"
    >
      <div class="flex items-center justify-between sm:justify-start sm:gap-3">
        <p class="text-xs sm:text-sm text-black/70 font-semibold uppercase">Tổng số câu hỏi:</p>
        <p class="text-sm font-medium">
          <span class="text-lg sm:text-xl text-blue font-bold">{{ parsedQuestion.length }}</span> câu hỏi
        </p>
      </div>
      <div class="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
        <Button variant="secondary" class="flex-1 sm:flex-none" icon="save">Lưu bản nháp</Button>
        <Button variant="primary" class="flex-1 sm:flex-none" icon="publish" @click="publishExam">Xuất bản</Button>
      </div>
    </div>

    <!-- Toast Message -->
    <ToastMessage
      v-model="isOpenToastMessage"
      type="warning"
      label="Cảnh báo"
      content="Vui lòng nhập đủ thông tin!"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/custom/Button.vue'
import Icon from '@/components/custom/Icon.vue'
import Input from '@/components/custom/Input.vue'
import ToastMessage from '@/components/custom/ToastMessage.vue'

const isOpenToastMessage = ref<boolean>(false)
const activeMobileTab = ref<'editor' | 'preview'>('editor')

const nameExam = ref<string>('')
const subject = ref<string>('')
const time = ref<number>()
const rawText = ref<string>('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const publishExam = () => {
  if (nameExam.value.trim() === '' || subject.value.trim() === '' || time.value === undefined) {
    isOpenToastMessage.value = true
  } else {
    return
  }
}

const resizeTextarea = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
}

const parsedQuestion = computed(() => {
  if (!rawText.value?.trim()) return []
  const result = []
  const blocks = rawText.value.split(/(?=Câu\s+\d+:)/i)

  for (const block of blocks) {
    if (!block.trim()) continue
    const lines = block.trim().split('\n')
    let qNumber = ''
    let qContent = ''
    const options = []
    let isParsingOptions = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim()
      if (!line) continue
      const optionMatch = line.match(/^(\*?)([A-Z])\.\s+(.*)/i)
      if (optionMatch) {
        isParsingOptions = true
        options.push({
          isCorrected: optionMatch[1] === '*',
          label: optionMatch[2]?.toUpperCase(),
          content: optionMatch[3]?.trim(),
        })
      } else {
        if (!isParsingOptions) {
          const titleMatch = line.match(/Câu\s+(\d+):\s*(.*)/i)
          if (titleMatch) {
            qNumber = titleMatch[1] || ''
            qContent += (titleMatch[2] || '') + '\n'
          } else {
            qContent += line + '\n'
          }
        }
      }
    }
    if (qNumber && qContent) {
      result.push({
        number: qNumber,
        content: qContent.trim(),
        options: options,
      })
    }
  }
  return result
})
</script>
