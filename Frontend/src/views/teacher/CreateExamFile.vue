<template>
  <div class="flex flex-col w-full pb-8">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium mb-4 sm:mb-5">
      <router-link to="/teacher/exam-manage" class="hover:text-primary transition-colors">
        Danh sách đề thi
      </router-link>
      <span>/</span>
      <span class="text-gray-800 font-semibold truncate">Tạo đề thi từ file</span>
    </div>

    <div class="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 w-full">
    <!-- Left Column: Upload & Basic Info -->
    <div class="flex flex-col">
      <!-- Title -->
      <div class="text-xl sm:text-2xl font-bold text-black/80">Tạo đề thi mới</div>
      <div class="mt-1 text-xs sm:text-sm text-black/60 leading-relaxed">
        Chuyển đổi hình ảnh, file PDF, file docx, thành bộ câu hỏi trắc nghiệm thông minh chỉ trong vài giây.
      </div>

      <!-- Upload Dropzone -->
      <div
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="mt-4 sm:mt-5 flex flex-col items-center justify-center gap-3 sm:gap-4 p-5 sm:p-8 min-h-[250px] sm:h-80 rounded-2xl sm:rounded-3xl bg-white border-2 border-dashed border-gray-300 hover:bg-primary/5 hover:border-primary/80 transition-all duration-300 cursor-pointer shadow-sm text-center"
      >
        <input
          type="file"
          ref="fileInputRef"
          @change="handleFileSelect"
          class="hidden"
          accept=".pdf, .png, .jpg, .jpeg, .docx"
        />
        <div class="bg-blue-100 text-primary w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0">
          <Icon name="folder-upload" size="30" />
        </div>
        <div>
          <div class="text-sm sm:text-base font-semibold text-black/80 px-2">
            {{ selecetedFile ? selecetedFile.name : 'Tải tệp tin của bạn lên' }}
          </div>
          <div class="text-xs sm:text-sm text-gray-500 mt-1">
            {{ selecetedFile ? `${(selecetedFile.size / 1024).toFixed(1)} KB` : 'Kéo và thả tài liệu vào đây hoặc click để chọn tệp' }}
          </div>
        </div>
        <Button variant="primary" icon="plus-circle" class="w-full sm:w-auto text-xs sm:text-sm py-2.5">
          {{ selecetedFile ? 'Chọn tệp khác' : 'Chọn tệp từ máy tính' }}
        </Button>
        <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-1">
          <div class="flex items-center gap-1.5 text-gray-600 font-semibold text-[11px] uppercase bg-gray-100 px-2.5 py-1 rounded-md">
            <Icon name="file" size="14" />
            PDF
          </div>
          <div class="flex items-center gap-1.5 text-gray-600 font-semibold text-[11px] uppercase bg-gray-100 px-2.5 py-1 rounded-md">
            <Icon name="file" size="14" />
            PNG/JPG
          </div>
          <div class="flex items-center gap-1.5 text-gray-600 font-semibold text-[11px] uppercase bg-gray-100 px-2.5 py-1 rounded-md">
            <Icon name="file" size="14" />
            DOCX
          </div>
        </div>
      </div>

      <!-- Basic Info Box -->
      <div class="mt-4 sm:mt-5 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
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
            <Input v-model="time" placeholder="Thời gian (phút)" icon="book" variant="required" />
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Detected Questions & Actions -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col min-h-[340px] lg:min-h-full">
      <div class="text-black/80 font-bold uppercase text-base sm:text-lg flex items-center justify-between pb-3 border-b border-gray-100">
        <div class="flex items-center">
          <span class="w-1.5 h-5 bg-blue-500 mr-2.5 rounded-full"></span>
          <span>Câu hỏi đã nhận diện</span>
        </div>
        <span class="text-xs sm:text-sm font-semibold text-blue bg-blue-50 px-2.5 py-1 rounded-lg">
          {{ parsedQuestion.length }} câu hỏi
        </span>
      </div>

      <!-- Questions List or Empty State -->
      <div class="flex-1 flex flex-col justify-center py-6 custom-scrollbar">
        <div
          v-if="!parsedQuestion.length"
          class="flex flex-col items-center justify-center text-center p-6 text-gray-400 gap-2.5 my-auto"
        >
          <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Icon name="file" size="24" />
          </div>
          <p class="text-xs sm:text-sm max-w-xs text-gray-500 leading-relaxed">
            Chưa có câu hỏi nào. Hãy tải lên tệp tin của bạn để hệ thống nhận diện tự động.
          </p>
        </div>

        <div v-else class="space-y-3 sm:space-y-4">
          <div
            v-for="(item, index) in parsedQuestion"
            :key="index"
            class="bg-gray-50/80 p-4 rounded-xl border border-gray-200"
          >
            <div class="font-bold text-sm text-blue">Câu {{ (item as any).number || index + 1 }}:</div>
            <div class="mt-1 text-xs sm:text-sm text-black/80 font-medium">{{ (item as any).content }}</div>
          </div>
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 mt-auto">
        <Button variant="secondary" class="w-full sm:w-auto" icon="save">Lưu bản nháp</Button>
        <Button variant="primary" class="w-full sm:w-auto" icon="publish" @click="publishExam">Xuất bản</Button>
      </div>
    </div>
  </div>

    <!-- Toast Message -->
    <ToastMessage
      v-model="isOpenToastMessage"
      :type="type"
      :label="label"
      :content="message"
    />
  </div>
</template>

<script lang="ts" setup>
import Button from '@/components/custom/Button.vue'
import Icon from '@/components/custom/Icon.vue'
import Input from '@/components/custom/Input.vue'
import ToastMessage from '@/components/custom/ToastMessage.vue'
import { ref } from 'vue'

const nameExam = ref<string>('')
const subject = ref<string>('')
const time = ref<number>()
const parsedQuestion = ref([])

const type = ref<string>('')
const label = ref<string>('')
const message = ref<string>('')

const fileInputRef = ref<HTMLInputElement | null>(null)
const selecetedFile = ref<File | null>(null)
const isOpenToastMessage = ref<boolean>(false)

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files?.length > 0) {
    const file = target.files[0]
    if (file) {
      processFile(file)
    }
    target.value = ''
  }
}

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }
}

const processFile = (file: File) => {
  const allowedExtendtions = ['pdf', 'png', 'jpg', 'jpeg', 'docx']
  const fileExtendtions = file.name.split('.').pop()?.toLowerCase()
  if (!fileExtendtions || !allowedExtendtions.includes(fileExtendtions)) {
    isOpenToastMessage.value = true
    type.value = 'error'
    label.value = 'Lỗi'
    message.value = 'Định dạng file không hỗ trợ'
    return
  }
  selecetedFile.value = file
  isOpenToastMessage.value = true
  type.value = 'success'
  label.value = 'Thành công'
  message.value = `Đã tải tệp lên: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
}

const publishExam = () => {
  if (nameExam.value.trim() === '' || subject.value.trim() === '' || time.value === undefined) {
    isOpenToastMessage.value = true
    type.value = 'warning'
    label.value = 'Cảnh báo'
    message.value = 'Vui lòng nhập đủ thông tin!'
  }
}
</script>
