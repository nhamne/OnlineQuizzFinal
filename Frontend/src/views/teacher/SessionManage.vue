<template>
  <div class="w-full h-full pb-8 sm:pb-10 relative">
    <!-- Lớp phủ nền đen mờ khi nhấn giữ trên mobile -->
    <div
      v-if="activeSessionId !== null"
      @click="activeSessionId = null"
      class="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-200"
    ></div>

    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col gap-1">
        <span class="text-2xl sm:text-3xl font-semibold text-primary-bg">Danh sách ca thi</span>
        <span class="text-sm text-gray-500"
          >Tổng số ca thi:
          <span class="font-semibold text-black/80">{{ listSession.length }}</span></span
        >
      </div>
      <Button class="w-full sm:w-auto" icon="plus" @click="isOpen = true">Tạo ca thi mới</Button>
    </div>
    <div class="mt-4 w-full flex items-center justify-between gap-1.5 sm:gap-4">
      <!-- Tìm kiếm -->
      <Search class="flex-1 min-w-0 sm:min-w-[180px]" placeholder="Tìm kiếm ca thi" />

      <!-- Lọc theo trạng thái -->
      <DropdownFilter
        class="w-[110px] sm:w-[25%] lg:w-[22%] shrink-0"
        icon="hourglass"
        v-model="selectedStatus"
        :list="listStatus"
      />

      <!-- Lọc theo các thuộc tính khác -->
      <DropdownFilter
        class="w-[110px] sm:w-[25%] lg:w-[22%] shrink-0"
        icon="slider"
        v-model="selectedSort"
        :list="listSort"
      />
      <Button
        variant="secondary"
        custom-class="w-[42px] h-[42px] p-0 shrink-0 mt-2 flex items-center justify-center"
      >
        <Icon name="reload" size="20"></Icon>
      </Button>
    </div>
    <!--Danh sách ca thi-->
    <div class="mt-6 sm:mt-8 md:mt-10 pb-6 flex flex-col lg:flex-row gap-6">
      <div class="flex flex-col gap-3 sm:gap-4 flex-1">
        <!-- Gợi ý thao tác trên mobile -->
        <div
          class="md:hidden flex items-center gap-2 text-xs text-blue-700 bg-blue-50/90 px-3.5 py-2.5 rounded-xl border border-blue-200"
        >
          <Icon name="info-circle" size="16" class="shrink-0 text-blue-500"></Icon>
          <span>Nhấn giữ ca thi để mở menu thao tác (Mã QR, sửa, xóa)</span>
        </div>

        <!-- Header -->
        <div
          class="grid grid-cols-[1.5fr_2fr_auto] md:grid-cols-[2fr_4fr_2fr_1.5fr] gap-3 sm:gap-4 px-4 sm:px-6 text-[11px] uppercase text-gray-500 font-bold tracking-wider"
        >
          <div>Tên ca thi</div>
          <div>Lớp học</div>
          <div class="text-right md:text-left">Trạng thái</div>
          <div class="text-center hidden md:block">Thao tác</div>
        </div>

        <!-- Rows -->
        <div class="flex flex-col gap-3 sm:gap-4">
          <div
            v-for="item in listSession"
            :key="item.id"
            @click="handleRowClick(item)"
            @touchstart="handleTouchStart(item, $event)"
            @touchmove="handleTouchMove($event)"
            @touchend="handleTouchEnd"
            @contextmenu.prevent="handleContextMenu(item, $event)"
            :class="[
              activeSessionId === item.id
                ? 'z-50 relative ring-2 ring-primary/80 shadow-2xl scale-[1.01] bg-white'
                : 'z-0 bg-white shadow hover:shadow-md hover:-translate-y-0.5',
            ]"
            class="relative grid grid-cols-[1.5fr_2fr_auto] md:grid-cols-[2fr_4fr_2fr_1.5fr] gap-3 sm:gap-4 items-center px-4 py-4 sm:px-6 sm:py-6 md:px-7 md:py-8 rounded-2xl transition-all duration-200 cursor-pointer select-none"
          >
            <!-- Tên ca thi -->
            <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div
                class="text-blue-500 shrink-0 bg-blue-50 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg"
              >
                <Icon name="calendar-alt"></Icon>
              </div>
              <span class="text-black/80 text-sm sm:text-[15px] font-bold truncate">{{
                item.nameSession
              }}</span>
            </div>

            <!-- Lớp học -->
            <div class="min-w-0">
              <span class="text-black/70 text-xs sm:text-[14px] font-semibold truncate block">{{
                item.nameClass
              }}</span>
            </div>

            <!-- Trạng thái -->
            <div class="text-right md:text-left shrink-0">
              <span
                class="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap inline-block"
                :class="{
                  'bg-green-100 text-green-700': item.status === 'Đang diễn ra',
                  'bg-yellow-100 text-yellow-600': item.status === 'Sắp diễn ra',
                  'bg-gray-100 text-gray-500': item.status === 'Đã kết thúc',
                }"
                >{{ item.status }}</span
              >
            </div>

            <!-- Hành động trên Desktop -->
            <div class="hidden md:flex justify-center items-center gap-2">
              <button
                type="button"
                @click.stop="openQrDrawer(item)"
                class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                title="Mã QR"
              >
                <Icon name="qr-scan" size="20"></Icon>
              </button>
              <button
                type="button"
                @click.stop="handleActionEdit(item)"
                class="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer"
                title="Chỉnh sửa"
              >
                <Icon name="edit" size="20"></Icon>
              </button>
              <button
                type="button"
                @click.stop="handleDeleteSession(item.id)"
                class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Xóa"
              >
                <Icon name="trash" size="20"></Icon>
              </button>
            </div>

            <!-- Ô Dropdown ở phía dưới bên phải cách ô div 5px trên Mobile -->
            <div
              v-if="activeSessionId === item.id"
              class="absolute right-0 sm:right-2 top-[calc(100%+5px)] z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden md:hidden animate-in fade-in zoom-in-95 duration-150"
              :class="activeModalType === 'qr' ? 'w-[290px] xs:w-[320px] p-4' : 'w-44 py-1.5'"
              @click.stop
            >
              <!-- Chế độ 1: Menu các action -->
              <div v-if="activeModalType === 'menu'" class="flex flex-col">
                <button
                  type="button"
                  @click.stop="openMobileQr(item)"
                  class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <Icon name="qr-scan" size="18" class="text-blue-500 shrink-0"></Icon>
                  <span class="font-medium">Mã QR</span>
                </button>
                <button
                  type="button"
                  @click.stop="handleActionEdit(item)"
                  class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors cursor-pointer"
                >
                  <Icon name="edit" size="18" class="text-yellow-500 shrink-0"></Icon>
                  <span class="font-medium">Chỉnh sửa</span>
                </button>
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  type="button"
                  @click.stop="handleActionDelete(item)"
                  class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Icon name="trash" size="18" class="text-red-500 shrink-0"></Icon>
                  <span class="font-medium">Xóa ca thi</span>
                </button>
              </div>

              <!-- Chế độ 2: Dropdown hiển thị Mã QR ca thi trên mobile -->
              <div v-else-if="activeModalType === 'qr'" class="flex flex-col gap-3">
                <!-- Header -->
                <div class="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div class="flex items-center gap-2 text-primary font-bold text-sm truncate">
                    <Icon name="qr-scan" size="18" class="shrink-0"></Icon>
                    <span class="truncate">Mã QR: {{ item.nameSession }}</span>
                  </div>
                  <button
                    type="button"
                    @click.stop="activeSessionId = null"
                    class="text-gray-400 hover:text-gray-700 p-1 -mr-1 rounded-full cursor-pointer"
                  >
                    <Icon name="x" size="16"></Icon>
                  </button>
                </div>

                <!-- Khung QR code -->
                <div
                  class="mobile-qr-box p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col items-center justify-center"
                >
                  <QRCodeVue3 :value="linkQR" :size="140" level="H" />
                  <span class="text-[11px] text-gray-500 mt-1.5 font-medium"
                    >Quét để vào phòng thi</span
                  >
                </div>

                <!-- Nút tải ảnh mã QR trên Mobile -->
                <button
                  type="button"
                  @click.stop="downloadQr(item)"
                  class="w-full py-2 px-3 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 active:scale-98 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-primary/20 shadow-xs"
                >
                  <Icon name="download" size="16"></Icon>
                  <span>Tải ảnh mã QR</span>
                </button>

                <!-- Link ca thi & nút copy -->
                <div class="flex flex-col gap-1">
                  <div class="text-[11px] font-semibold text-gray-600">Link tham gia:</div>
                  <div class="flex gap-1.5 items-center">
                    <input
                      type="text"
                      readonly
                      :value="linkQR"
                      class="p-2 text-xs border border-gray-300 rounded-lg flex-1 min-w-0 bg-gray-50 text-gray-700 outline-none select-all"
                    />
                    <button
                      type="button"
                      @click.stop="copyLink"
                      :class="copied ? 'bg-green-600' : 'bg-primary'"
                      class="px-2.5 py-2 text-xs font-semibold text-white rounded-lg hover:brightness-110 active:scale-95 transition-all shrink-0 flex items-center justify-center cursor-pointer"
                      :title="copied ? 'Đã sao chép' : 'Sao chép link'"
                    >
                      <Icon :name="copied ? 'check' : 'copy'" size="16"></Icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- QR code and Link session trên Desktop -->

      <div
        v-show="isOpenDrawerQr === true"
        class="hidden lg:block p-5 sm:p-6 border border-primary/40 h-fit rounded-2xl bg-blue-50 w-96 shrink-0 shadow-md"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-primary">
            <Icon name="share" size="24"></Icon>
            <span class="font-bold text-xl">Chia sẻ ca thi</span>
          </div>
          <Icon
            @click="isOpenDrawerQr = false"
            name="x"
            class="text-gray-500 hover:text-gray-900 transition-all duration-200 cursor-pointer"
          ></Icon>
        </div>
        <!-- Tạo link ca thi -->
        <div class="flex-1 p-3 rounded-lg bg-white text-black/80 mt-4">
          <div class="text-sm font-normal">Link thi:</div>
          <div class="w-full flex gap-3 items-center mt-2">
            <input
              type="text"
              v-model="linkQR"
              class="p-2 border-2 border-primary/80 rounded-xl flex-1"
            />
            <Button
              :icon="copied ? 'check' : 'copy'"
              :class="copied ? '!bg-green-600 !text-white' : ''"
              @click="copyLink"
            >
              {{ copied ? 'Đã sao chép' : 'Copy link' }}
            </Button>
          </div>
        </div>
        <!--QR ca thi-->
        <div
          class="desktop-qr-box flex-1 p-3 rounded-lg bg-white text-black/80 mt-4 border-2 border-blue-300"
        >
          <div class="text-base font-normal text-center">Mã QR ca thi:</div>
          <div class="w-full flex flex-col gap-3 items-center mt-2">
            <QRCodeVue3 :value="linkQR" :size="200" level="H" />
            <Button icon="download" @click="downloadDesktopQr">Tải mã QR</Button>
          </div>
        </div>
        <div class="p-3 rounded-lg bg-orange-50 border border-orange-300 text-amber-800 mt-4">
          <div class="text-sm font-semibold">Lưu ý cho học sinh:</div>
          <div class="text-sm font-normal">• Truy cập link hoặc quét mã QR để vào phòng thi</div>
          <div class="text-sm font-normal">• Nhập mật khẩu giáo viên cung cấp</div>
          <div class="text-sm font-normal">• Làm bài trong khung thời gian quy định</div>
        </div>
      </div>

      <!-- Detail exam session-->
      <!-- <div
        v-show="isOpenDrawerDetail === true"
        class="flex-1 p-6 border border-primary/40 rounded-lg bg-blue-50"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-primary">
            <Icon name="calendar-alt" size="24"></Icon>
            <span class="font-bold text-xl">Thông tin ca thi</span>
          </div>
          <Icon
            @click="isOpenDrawerDetail = false"
            name="x"
            class="text-gray-500 hover:text-gray-900 transition-all duration-200 cursor-pointer"
          ></Icon>
        </div>
        <div class="mt-4 h-fit">
          <div class="flex flex-col gap-4">
            <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
              <div class="text-sm font-normal">Tên ca thi:</div>
              <div class="text-base font-semibold">Test 01</div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Môn thi:</div>
                <div class="text-[15px] font-medium">Lập trình Web nâng cao</div>
              </div>
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Đề thi:</div>
                <div class="text-[15px] font-medium">Đề thi 01</div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Mật khẩu:</div>
                <div class="text-[15px] font-medium">123456</div>
              </div>
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Thời gian làm bài:</div>
                <div class="text-[15px] font-medium">60 phút</div>
              </div>
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Số câu hỏi:</div>
                <div class="text-[15px] font-medium">40</div>
              </div>
            </div>
            <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
              <div class="text-sm font-normal">Lớp học:</div>
              <div class="text-[15px] font-medium">D18CNPM1</div>
            </div>
            <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
              <div class="text-sm font-normal">Ngày thi:</div>
              <div class="text-[15px] font-medium">20/10/2023</div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Giờ bắt đầu:</div>
                <div class="text-[15px] font-medium">08:00</div>
              </div>
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Giờ kết thúc:</div>
                <div class="text-[15px] font-medium">123456</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Giờ bắt đầu:</div>
                <div class="text-[15px] font-medium">08:00</div>
              </div>
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Giờ kết thúc:</div>
                <div class="text-[15px] font-medium">123456</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Xem lời giải và đáp án:</div>
                <div class="text-[15px] font-medium">Hiển thị</div>
              </div>
              <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
                <div class="text-sm font-normal">Đảo câu hỏi và đáp án:</div>
                <div class="text-[15px] font-medium">Có</div>
              </div>
            </div>
            <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
              <div class="text-sm font-normal">Ghi chú:</div>
              <div class="text-[15px] font-medium">...</div>
            </div>
            <div class="flex-1 p-3 rounded-lg bg-white text-black/80">
              <div class="text-sm font-normal">Trạng thái:</div>
              <div class="text-[15px] font-medium">Sắp diễn ra</div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <Popup
      v-model="isOpen"
      v-model:inputValue="nameSession"
      title="Tạo ca thi mới"
      width="800px"
      icon="calendar-alt"
      labelInput="Tên ca thi (bắt buộc)"
      placeholder="Ví dụ: Lập trình Web nâng cao - D18CNPM1"
      btnAcceptText="Xem trước ca thi"
      @accept="handlePreviewExam"
    >
      <template #custom-body>
        <div class="w-full max-h-[72vh] sm:max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar px-4 py-5 sm:px-6 sm:py-7">
          <!--Thông tin cơ bản-->
          <div class="flex items-center gap-2 text-secondary">
            <Icon name="info-circle-fill" size="18"></Icon>
            <span class="uppercase text-xs sm:text-sm font-bold tracking-wide">Thông tin cơ bản</span>
          </div>
          <div class="mt-3">
            <span class="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-black/80 block mb-1.5"
              >Tên ca thi <span class="text-red-600">*</span></span
            >
            <Input v-model="nameSession" variant="required" class="rounded-lg" placeholder="Ví dụ: Kiểm tra cuối kỳ" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3">
            <div>
              <span class="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-black/80 block mb-1.5">Môn thi</span>
              <DropdownFilter v-model="selectedSubject" :list="listSubject" />
            </div>
            <div>
              <span class="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-black/80 block mb-1.5">Đề thi</span>
              <DropdownFilter v-model="selectedExam" :list="listExam" />
            </div>
            <div>
              <span class="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-black/80 block mb-1.5">Lớp thi</span>
              <DropdownFilter v-model="selectedClass" :list="listClass" />
            </div>
          </div>
          <div class="flex items-center gap-2 text-secondary mt-6 sm:mt-8">
            <Icon name="alarm-fill" size="18"></Icon>
            <span class="uppercase text-xs sm:text-sm font-bold tracking-wide">Thời gian</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
            <div>
              <span class="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-black/80 block mb-1.5">Giờ bắt đầu</span>
              <DatePicker placeholder="dd/mm/yyyy, --:-- --" />
            </div>
            <div>
              <span class="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-black/80 block mb-1.5">Giờ kết thúc</span>
              <DatePicker placeholder="dd/mm/yyyy, --:-- --" />
            </div>
          </div>
          <div class="flex items-center gap-2 text-secondary mt-6 sm:mt-8">
            <Icon name="lock-fill" size="18"></Icon>
            <span class="uppercase text-xs sm:text-sm font-bold tracking-wide">Bảo mật và hiển thị</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mt-3">
            <div>
              <span class="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-black/80 block mb-1.5"
                >Mật khẩu ca thi (tùy chọn)</span
              >
              <Input placeholder="Nhập mã bảo mật" />
            </div>
            <div>
              <span class="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-black/80 block mb-1.5"
                >Cấu hình ca thi</span
              >
              <div
                class="mt-1 flex flex-col gap-2.5 bg-primary/5 p-3.5 sm:px-4 sm:py-3 rounded-2xl border border-gray-200"
              >
                <Checkbox v-model="isChecked1">Xem chi tiết bài làm</Checkbox>
                <Checkbox v-model="isChecked2">Đảo câu hỏi và đáp án</Checkbox>
                <Checkbox v-model="isChecked3">Cho phép thi lại</Checkbox>
                <Checkbox v-model="isChecked4">Hiển thị điểm số và lời giải</Checkbox>
              </div>
            </div>
          </div>
          <div class="flex flex-col mt-5 sm:mt-6">
            <span class="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-black/80 block mb-1.5"
              >Ghi chú (tùy chọn)</span
            >
            <textarea
              v-model="note"
              class="mt-1 h-24 sm:h-26 outline-none p-3 text-xs sm:text-sm border border-gray-300 rounded-xl bg-primary/5 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.15)] focus-within:bg-white transition-all resize-none"
              placeholder="Ví dụ: Học sinh được phép sử dụng máy tính bỏ túi..."
            />
          </div>
        </div>
      </template>
    </Popup>

    <PopupConfirm
      v-model="isOpenPopupConfirm"
      variant="warning"
      :message="`Bạn có chắc chắn muốn xóa ca thi &quot;${nameSession}&quot; không?`"
      title="Xóa ca thi"
    ></PopupConfirm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/custom/Button.vue'
import Search from '@/components/custom/Search.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Icon from '@/components/custom/Icon.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'
import Popup from '@/components/custom/Popup.vue'
import Input from '@/components/custom/Input.vue'
import DatePicker from '@/components/custom/DatePicker.vue'
import Checkbox from '@/components/custom/Checkbox.vue'
import QRCodeVue3 from 'qrcode.vue'

const router = useRouter()
const activeSessionId = ref<number | null>(null)
const activeModalType = ref<'menu' | 'qr'>('menu')
const copied = ref(false)
let longPressTimer: any = null
let isLongPress = false
let startX = 0
let startY = 0

const copyLink = () => {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(linkQR.value)
  }
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const downloadQr = (item?: any) => {
  const container = document.querySelector('.mobile-qr-box')
  const canvas = (
    container ? container.querySelector('canvas') : document.querySelector('canvas')
  ) as HTMLCanvasElement
  if (canvas) {
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `ma-qr-${item?.nameSession || 'ca-thi'}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

const downloadDesktopQr = () => {
  const container = document.querySelector('.desktop-qr-box')
  const canvas = (
    container ? container.querySelector('canvas') : document.querySelector('canvas')
  ) as HTMLCanvasElement
  if (canvas) {
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `ma-qr-ca-thi.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

const openMobileQr = (item: any) => {
  linkQR.value = `http://localhost:5173/student/my-sessions/${item.id}`
  activeModalType.value = 'qr'
}

const handleTouchStart = (item: any, event: TouchEvent) => {
  isLongPress = false
  const touch = event.touches[0]
  if (!touch) return
  startX = touch.clientX
  startY = touch.clientY

  longPressTimer = setTimeout(() => {
    isLongPress = true
    activeSessionId.value = item.id
    activeModalType.value = 'menu'
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(50)
      } catch (e) {}
    }
  }, 450)
}

const handleTouchMove = (event: TouchEvent) => {
  const touch = event.touches[0]
  if (!touch) return
  if (Math.abs(touch.clientX - startX) > 10 || Math.abs(touch.clientY - startY) > 10) {
    clearTimeout(longPressTimer)
  }
}

const handleTouchEnd = () => {
  clearTimeout(longPressTimer)
}

const handleContextMenu = (item: any, event: MouseEvent) => {
  event.preventDefault()
  activeSessionId.value = item.id
  activeModalType.value = 'menu'
}

const handleRowClick = (item: any) => {
  if (isLongPress) {
    isLongPress = false
    return
  }
  if (activeSessionId.value !== null) {
    activeSessionId.value = null
    return
  }
  router.push(`/teacher/session-manage/${item.id}`)
}

const openQrDrawer = (item: any) => {
  activeSessionId.value = null
  linkQR.value = `http://localhost:5173/student/my-sessions/${item.id}`
  isOpenDrawerQr.value = true
}

const handleActionEdit = (item: any) => {
  activeSessionId.value = null
  nameSession.value = item.nameSession
  isOpen.value = true
}

const handleActionDelete = (item: any) => {
  activeSessionId.value = null
  handleDeleteSession(item.id)
}

const linkQR = ref('http://localhost:5173/student/my-sessions/test-01')

const selectedStatus = ref<string>('all')
const selectedSort = ref<string>('all')
const isChecked1 = ref<boolean>(false)
const isChecked2 = ref<boolean>(false)
const isChecked3 = ref<boolean>(false)
const isChecked4 = ref<boolean>(false)
const isOpenDrawerDetail = ref<boolean>(false)
const isOpenDrawerQr = ref<boolean>(false)
const note = ref<string>('')

const listStatus = [
  { name: 'Tất cả trạng thái', key: 'all' },
  { name: 'Sắp diễn ra', key: 'upcoming' },
  { name: 'Đang diễn ra', key: 'running' },
  { name: 'Đã kết thúc', key: 'finished' },
]

const listSort = [
  { name: 'Mới nhất', key: 'newest' },
  { name: 'Cũ nhất', key: 'oldest' },
  { name: 'Tên A-Z', key: 'atoz' },
  { name: 'Nhiều bài nộp nhất', key: 'much' },
  { name: 'Ít bài nộp nhất', key: 'little' },
]

const listSession = [
  {
    id: 1,
    nameClass: 'Lập trình Web nâng cao - D18CNPM1',
    nameSession: 'Test 01',
    status: 'Đang diễn ra',
    quantity: 28,
  },
  {
    id: 2,
    nameClass: 'Lập trình Web nâng cao - D18CNPM1',
    nameSession: 'Test 01',
    status: 'Đã kết thúc',
    quantity: 28,
  },
  {
    id: 3,
    nameClass: 'Lập trình Web nâng cao - D18CNPM1',
    nameSession: 'Test 01',
    status: 'Sắp diễn ra',
    quantity: 28,
  },
  {
    id: 4,
    nameClass: 'Lập trình Web nâng cao - D18CNPM1',
    nameSession: 'Test 01',
    status: 'Đang diễn ra',
    quantity: 28,
  },
  {
    id: 5,
    nameClass: 'Lập trình Web nâng cao - D18CNPM1',
    nameSession: 'Test 01',
    status: 'Đã kết thúc',
    quantity: 28,
  },
]
const isOpen = ref(false)
const isOpenPopupConfirm = ref<boolean>(false)
const nameSession = ref<string>('')

const handleDeleteSession = (id: number) => {
  isOpenPopupConfirm.value = true
  const session = listSession.find((item) => item.id === id)
  nameSession.value = session?.nameSession || ''
}

const selectedSubject = ref<string>('all')
const selectedExam = ref<string>('select')
const selectedClass = ref<string>('select')

const listSubject = [
  {
    key: 'all',
    name: 'Tất cả môn học',
  },
  {
    key: '1',
    name: 'Lập trình Web nâng cao',
  },
  {
    key: '2',
    name: 'Học máy cơ bản',
  },
  {
    key: '3',
    name: 'Kiến trúc máy tính',
  },
]
const listExam = [
  {
    key: 'select',
    name: 'Chọn đề thi từ thư viện',
  },
  {
    key: '1',
    name: 'Đề thi 01',
  },
  {
    key: '2',
    name: 'Đề thi 02',
  },
  {
    key: '3',
    name: 'Đề thi 03',
  },
]

const listClass = [
  {
    key: 'select',
    name: 'Chọn lớp học',
  },
  {
    key: '1',
    name: 'D18CNPM1',
  },
  {
    key: '2',
    name: 'D18CNPM2',
  },
  {
    key: '3',
    name: 'D18CNPM3',
  },
]

const isOpenPreviewExam = ref<boolean>(false)

const handlePreviewExam = () => {}
</script>
