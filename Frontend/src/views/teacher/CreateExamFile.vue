<template>
  <div class="grid grid-cols-2 gap-10 w-full h-full">
    <div class="flex flex-col">
      <!--Tiêu đề-->
      <div class="text-black/80 text-2xl font-bold">Tạo đề thi mới</div>
      <div class="mt-1 text-sm text-black/70">
        Chuyển đổi hình ảnh, file PDF, file docx, thành bộ câu hỏi trắc nghiệm thông minh chỉ trong
        vài giây.
      </div>
      <!--@click="triggerFileInput": Khi người dùng click vào bất kỳ đâu trong khung thì sẽ gọi hàm triggerFileInput mở cửa sổ để chọn file
      @dragover.prevent: mặc định khi kéo 1 file thả vào trình duyệt, trình duyệt sẽ tự động mở file đó lên sang 1tab mới, .prevent là để ngân chặn điều đó
      @drop.prevent="handleDrop": Khi người dùng nhả chuột (drop) cái file vào khung, gọi hàm handleDrop để bắt lấy cái file đó.
      -->
      <div
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="mt-5 flex flex-col items-center justify-center gap-4 h-90 rounded-3xl bg-white border-2 border-dashed border-gray-300 hover:bg-primary/5 hover:border-primary/80 transition-all duration-300 cursor-pointer"
      >
        <input
          type="file"
          ref="fileInputRef"
          @change="handleFileSelect"
          class="hidden"
          accept=".pdf, .png, .jpg, .jpeg, .docx"
        />
        <div class="bg-blue-200 w-16 h-16 rounded-xl flex items-center justify-center">
          <Icon name="folder-upload" class="text-primary/90" size="30"></Icon>
        </div>
        <div class="text-base font-semibold text-black/80">Tải tệp tin của bạn lên</div>
        <div class="text-sm text-black/80">Kéo và thả tài liệu vào đây hoặc Click để chọn tệp</div>
        <Button variant="primary" icon="plus-circle">Chọn tệp từ máy tính</Button>
        <div class="flex items-center gap-6">
          <div
            class="flex items-center gap-3 text-black/80 font-semibold text-xs uppercase bg-gray-200 p-2 rounded-md"
          >
            <Icon name="file" size="16" color="currentColor"></Icon>
            PDF
          </div>
          <div
            class="flex items-center gap-3 text-black/80 font-semibold text-xs uppercase bg-gray-200 p-2 rounded-sm"
          >
            <Icon name="file" size="16" color="currentColor"></Icon>
            png/jpg
          </div>
          <div
            class="flex items-center gap-3 text-black/80 font-semibold text-xs uppercase bg-gray-200 p-2 rounded-sm"
          >
            <Icon name="file" size="16" color="currentColor"></Icon>
            docx
          </div>
        </div>
      </div>
      <div class="mt-5 bg-white px-5 py-6 rounded-xl shadow-sm">
        <div>
          <span class="text-base text-black/80 font-medium">Tên đề thi</span>
          <Input
            v-model="nameExam"
            placeholder="Nhập tên đề thi"
            icon="clipboard"
            variant="required"
          >
          </Input>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="mt-5">
            <span class="text-base text-black/80 font-medium">Môn học</span>
            <Input v-model="subject" placeholder="Nhập môn học" icon="book" variant="required">
            </Input>
          </div>
          <div class="mt-5">
            <span class="text-base text-black/80 font-medium">Thời gian</span>
            <Input v-model="time" placeholder="Thời gian(phút): " icon="book" variant="required">
            </Input>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-full py-4 px-6 custom-scrollbar">
      <div class="text-black/80 font-semibold uppercase text-xl flex items-center">
        <span class="w-1.5 h-6 bg-blue-500 mr-3 rounded-full"></span>
        Câu hỏi đã nhận diện ( {{ parsedQuestion.length }} )
      </div>
      <!--empty-->
      <div class="w-full h-full">
        <div
          v-if="!parsedQuestion.length"
          class="w-full h-full flex items-center justify-center text-center text-base text-gray-400"
        >
          Chưa có câu hỏi nào. Hãy tải lên tệp tin của bạn
        </div>
      </div>
    </div>
    <ToastMessage
      v-model="isOpenToastMessage"
      :type="type"
      :label="label"
      :content="message"
    ></ToastMessage>
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
    // kiểm tra xem đã tồn tại thẻ input chưa
    fileInputRef.value.click()
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files?.length > 0) {
    // target.files là 1 danh sách (tương tự mảng) chứa thông tin chi tiết về file (tên, kích thuowsc, định dạng...)
    const file = target.files[0] // trình duyệt luôn trả về 1 danh sách file ngay cả khi người dùng chọn 1 cái trong khi thẻ input không cho phép chọn nhiều file cùng lúc nên file duy nhất người dùng chọn sẽ ở vị trí đầu tiên trong danh sách (vị trí số [0])
    if (file) {
      processFile(file)
    }
    target.value = '' //reset thẻ input để cho phép người dùng chọn cùng 1 file đó 1 lần nữa nếu muốn
  }
}

const handleDrop = (event: DragEvent) => {
  // khi kéo 1 file từ hệ điều hành vào trình duyệt thì file sẽ được chứa tại dataTransfer
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    // kiểm tra xem dataTransfer có tồn tại không và xem bên tỏng nó có chứa file nào không
    const file = event.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }
}

const processFile = (file: File) => {
  const allowedExtendtions = ['pdf', 'png', 'jpg', 'jpeg', 'docx']
  // file.name: lấy ra chuỗi tên file
  // .split('.'): cắt chuỗi tên đó tại các dấu chấm
  // .pop(): bốc lấy đuôi file
  // .toLowerCase(): chuyển đuôi file sang chữ thường để tiện so sánh
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
</script>
