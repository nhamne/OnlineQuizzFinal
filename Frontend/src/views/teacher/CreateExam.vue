<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-[2fr_1fr] gap-3">
      <div class="bg-white px-5 py-6 rounded-xl shadow-sm">
        <div class="uppercase text-base text-black/80 font-semibold">Thông tin cơ bản</div>
        <div class="mt-5">
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
      <div class="bg-secondary px-10 py-12 rounded-xl shadow-sm flex flex-col justify-between">
        <div class="text-white font-semibold">Chế độ thủ công</div>
        <p class="text-white/60 text-sm">
          Bạn đang tự soạn thảo nội dung câu hỏi và đáp án cho đề thi này
        </p>
        <div class="flex items-center gap-2">
          <div
            class="border border-white rounded-lg h-7.5 w-7.5 bg-white/10 flex items-center justify-center"
          >
            <Icon name="bulb" size="20" color="white"></Icon>
          </div>
          <p class="text-white text-sm">Mẹo bạn có thể nhập nhanh từ file Excel hoặc file Word</p>
        </div>
      </div>
    </div>
    <div
      class="mt-5 bg-white h-fit border border-gray-200 rounded-t-xl overflow-hidden grid grid-cols-2"
    >
      <div>
        <div class="w-full h-full py-4 px-6">
          <textarea
            ref="textareaRef"
            v-model="rawText"
            @input="resizeTextarea"
            class="outline-none w-full min-h-75 font-mono text-black/80 resize-none overflow-hidden"
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
        <!-- <div class="h-full w-full bg-gray-200 py-4 px-6"></div> -->
      </div>
      <div class="w-full h-full bg-gray-100 py-4 px-6 custom-scrollbar">
        <!--empty-->
        <div
          v-if="!rawText || rawText.trim() === ''"
          class="w-full h-full flex items-center justify-center"
        >
          <div class="flex justify-center items-center text-center text-base text-gray-400">
            Chưa có câu hỏi nào. Hãy nhập câu hỏi theo gợi ý ở khung bên trái
          </div>
        </div>
        <div v-else>
          <!-- {{ parsedQuestion }} -->
          <div
            v-for="(item, index) in parsedQuestion"
            :key="index"
            class="bg-white px-6 py-5 rounded-3xl mb-4 border border-gray-200"
          >
            <div>
              <div class="font-semibold text-blue">Câu {{ item.number }}:</div>
              <div class="mt-4 text-black/80 font-semibold">{{ item.content }}</div>
            </div>
            <ul class="grid grid-cols-2 gap-4 mt-4">
              <li
                v-for="(option, index) in item.options"
                :key="index"
                class="cursor-pointer border border-gray-200 p-3 rounded-xl flex items-center gap-2 text-sm font-semibold text-black/80"
                :class="option.isCorrected ? 'bg-blue/5 text-blue' : ''"
              >
                <div
                  :class="
                    option.isCorrected
                      ? 'text-white bg-blue h-7.5 w-7.5 shrink-0 rounded-full flex items-center justify-center'
                      : ' bg-gray-200 h-7.5 w-7.5 shrink-0 rounded-full flex items-center justify-center'
                  "
                >
                  {{ option.label }}
                </div>

                <span>{{ option.content }}</span>
              </li>
            </ul>
          </div>
          <!--hiển thị câu hỏi-->
        </div>
      </div>
    </div>
    <div
      class="bg-white px-10 py-6 rounded-b-xl border border-t-0 border-gray-200 grid grid-cols-2"
    >
      <div>
        <p class="text-sm text-black/80 font-semibold uppercase">Tổng số câu hỏi</p>
        <p class="text-sm font-medium mt-2">
          <span class="text-xl text-blue font-bold">{{ parsedQuestion.length }} </span> câu hỏi
        </p>
      </div>
      <div class="flex items-center gap-3 w-[60%] ml-auto">
        <Button variant="secondary" class="px-4 flex-1" icon="save">Lưu bản nháp</Button>
        <Button variant="primary" class="px-4 flex-1" icon="publish" @click="publishExam"
          >Xuất bản</Button
        >
      </div>
    </div>
    <!--Toast message-->
    <ToastMessage
      v-model="isOpenToastMessage"
      type="warning"
      label="Cảnh báo"
      content="Vui lòng nhập đủ thông tin!"
    ></ToastMessage>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/custom/Button.vue'
import Icon from '@/components/custom/Icon.vue'
import Input from '@/components/custom/Input.vue'
import ToastMessage from '@/components/custom/ToastMessage.vue'

// interface Option {
//   id: string
//   content: string
//   isCorrected: boolean
// }

// interface Question {
//   title: string
//   options: Option[]
// }

const isOpenToastMessage = ref<boolean>(false)

const publishExam = () => {
  if (nameExam.value.trim() === '' || subject.value.trim() === '' || time.value === undefined) {
    isOpenToastMessage.value = true
  } else {
    return
  }
}

const nameExam = ref<string>('')
const subject = ref<string>('')
const time = ref<number>()
const rawText = ref<string>('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const resizeTextarea = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
}

const parsedQuestion = computed(() => {
  // Tạo hàm theo dõi rawText, mỗi khi rawText thay đổi thì chạy lại toàn bộ hàm

  if (!rawText.value?.trim()) return []
  const result = [] // mảng kết quả trả về cuối cùng
  const blocks = rawText.value.split(/(?=Câu\s+\d+:)/i) // split là làm cắt chuỗi trả về 1 mảng các chuỗi ,
  // ở đây blocks là 1 mảng chứa tất cả các câu hỏi. VD:
  // [ "Câu 1: Môn nào khó nhất?\nA. Toán\nB. Văn",  // Lát cắt thứ 1
  // "Câu 2: 1+1 bằng mấy?\nA. 2\nB. 3",          // Lát cắt thứ 2
  // "Câu 3: Hôm nay ăn gì?\nA. Cơm\nB. Phở" ]     // Lát cắt thứ 3

  // /(...)/: Cặp dấu gạch chéo bao bọc biểu thức Regex.
  // (?=...): cắt chuỗi nhưng không làm mất đi ký tự ở vị trí cắt. dv với Câu 1: thì nó sẽ cắt ngay trước chữ "Câu 1" đến vị trí ngay trước chữ "Câu 2"
  // Câu: Tìm đúng chữ "Câu".
  // \s+: \s là dấu cách (space/tab), + là 1 hoặc nhiều. Nghĩa là người dùng gõ "Câu 1" hay "Câu    1" đều hiểu.
  // \d+: \d là số (digit) từ 0-9, + là 1 hoặc nhiều chữ số. Để bắt được "Câu 1", "Câu 10", hay "Câu 999".
  // :: Tìm đúng dấu hai chấm.
  // i (ở cuối): Cờ Case-insensitive (Không phân biệt hoa thường). Dù gõ "câu 1:", "CÂU 1:" hay "Câu 1:" đều bắt được tuốt.
  for (const block of blocks) {
    // duyệt qua từng chuỗi câu hỏi trong mảng câu hỏi
    if (!block.trim()) continue // bỏ qua các phần tử rỗng
    const lines = block.trim().split('\n') // tách chuỗi thành mảng các dòng
    let qNumber = '' // lưu số câu hỏi
    let qContent = '' // lưu nội dung câu hỏi
    const options = [] // lưu mảng các đáp án
    let isParsingOptions = false // cờ để kiểm tra xem đã đến phần đáp án chưa
    for (let i = 0; i < lines.length; i++) {
      // duyệt qua từng dòng trong mảng các dòng
      const line = lines[i]?.trim() // cắt khoảng trắng 2 đầu dòng
      if (!line) continue // bỏ qua các dòng rỗng
      const optionMatch = line.match(/^(\*?)([A-Z])\.\s+(.*)/i) // kiểm tra xem dòng hiện tại có phải đáp án không
      // ^: Bắt đầu tính từ đầu dòng (không cho phép có ký tự khác nằm trước).
      // (\*?) - Nhóm 1: Bắt dấu sao. \* là tìm dấu sao, ? là có thể có hoặc không. (Đưa vào ngoặc tròn để tí nữa trích xuất dữ liệu).
      // ([A-Z]) - Nhóm 2: Tìm MỘT chữ cái từ A đến Z.
      // \.: Tìm đúng dấu chấm .
      // \s+: Cần ít nhất 1 dấu cách sau dấu chấm.
      // (.*) - Nhóm 3: Lấy TẤT CẢ những ký tự còn lại của dòng đó.
      if (optionMatch) {
        isParsingOptions = true // bật cờ để biết đã đến phần đáp án
        options.push({
          isCorrected: optionMatch[1] === '*', // gán true cho đáp án có *
          label: optionMatch[2]?.toUpperCase(), // lấy ký tự in hoa (A, B, C, D)
          content: optionMatch[3]?.trim(), // lấy nội dung đáp án
        })
      } else {
        // nếu không phải phần đáp án
        if (!isParsingOptions) {
          // nếu chưa đến phần đáp án
          const titleMatch = line.match(/Câu\s+(\d+):\s*(.*)/i) // kiểm tra xem dòng đó có chứa chữ "Câu số:" không
          //(\d+) - Nhóm 1: Gom cái số câu hỏi lại.
          //(.*) - Nhóm 2: Gom tất cả nội dung phía sau dấu hai chấm.

          if (titleMatch) {
            qNumber = titleMatch[1] || '' // lấy số câu hỏi
            qContent += (titleMatch[2] || '') + '\n' // lấy nội dung câu hỏi
          } else {
            qContent += line + '\n' // cộng dồn tiếp vào phần nội dung câu hỏi
          }
        }
      }
    }
    if (qNumber && qContent) {
      // lưu thành kết quả và trả về
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
