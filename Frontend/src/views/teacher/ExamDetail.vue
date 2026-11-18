<template>
  <div class="w-full h-full flex flex-col gap-5 sm:gap-6 pb-16 relative">
    <!-- Toast Notification -->
    <ToastMessage
      v-model="toastState.isOpen"
      :type="toastState.type"
      :label="toastState.label"
      :content="toastState.content"
      class="!fixed !top-5 !right-5 !z-50"
    />

    <!-- 1. Breadcrumb -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
        <router-link to="/teacher/exam-manage" class="hover:text-primary transition-colors">
          Danh sách đề thi
        </router-link>
        <span class="text-gray-400">/</span>
        <span class="text-gray-800 font-semibold truncate">Chi tiết: {{ examData.nameExam }}</span>
      </div>
    </div>

    <!-- 2. Exam Info Banner Card (View Mode & Inline Edit Mode) -->
    <div
      class="w-full bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 lg:p-7 transition-all"
    >
      <!-- VIEW MODE -->
      <div
        v-if="!isEditingExamInfo"
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <!-- Left: Title, Badges & Key Metadata -->
        <div class="flex flex-col gap-2.5 max-w-2xl">
          <!-- Badges & Tags Row -->
          <div class="flex items-center gap-2 flex-wrap">
            <span
              :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
                examData.status === 'Xuất bản'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                  : 'bg-amber-50 text-amber-700 border-amber-200/60',
              ]"
            >
              <span
                :class="[
                  'w-1.5 h-1.5 rounded-full',
                  examData.status === 'Xuất bản' ? 'bg-emerald-500' : 'bg-amber-500',
                ]"
              ></span>
              {{ examData.status }}
            </span>

            <span
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60"
            >
              <Icon name="book" size="14" class="text-blue-600" />
              <span>{{ examData.nameSubject }}</span>
            </span>

            <span
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200/60 font-mono"
            >
              Mã đề: {{ examData.code }}
            </span>
          </div>

          <!-- Exam Title -->
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
            {{ examData.nameExam }}
          </h1>

          <!-- Subtitle / Description -->
          <p
            v-if="examData.description"
            class="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed -mt-0.5"
          >
            {{ examData.description }}
          </p>

          <!-- Key Metadata Strip -->
          <div
            class="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-5 text-xs sm:text-sm text-gray-500 pt-1"
          >
            <div class="flex items-center gap-1.5">
              <Icon name="clock" size="15" class="text-primary shrink-0" />
              <span
                >Thời gian:
                <strong class="text-gray-800 font-semibold">{{ examData.time }}</strong></span
              >
            </div>
            <span class="text-gray-300 hidden sm:inline">•</span>
            <div class="flex items-center gap-1.5">
              <Icon name="document" size="15" class="text-primary shrink-0" />
              <span
                >Số lượng:
                <strong class="text-gray-800 font-semibold">{{ examData.questions.length }} câu hỏi</strong></span
              >
            </div>
            <span class="text-gray-300 hidden sm:inline">•</span>
            <div class="flex items-center gap-1.5">
              <Icon name="checks" size="15" class="text-primary shrink-0" />
              <span
                >Tổng điểm:
                <strong class="text-gray-800 font-semibold">{{ totalExamScore }} điểm</strong></span
              >
            </div>
            <span class="text-gray-300 hidden sm:inline">•</span>
            <div class="flex items-center gap-1.5">
              <Icon name="calendar-event" size="15" class="text-primary shrink-0" />
              <span
                >Ngày tạo:
                <strong class="text-gray-800 font-semibold">{{ examData.createdAt }}</strong></span
              >
            </div>
          </div>
        </div>

        <!-- Right: Teacher Quick Action Buttons -->
        <div class="shrink-0 flex flex-wrap items-center gap-2.5 self-start lg:self-center no-print">
          <Button
            variant="outline"
            icon="edit"
            customClass="h-10 px-4 text-xs sm:text-sm rounded-xl cursor-pointer"
            @click="startEditExamInfo"
          >
            Sửa thông tin
          </Button>
          <Button
            variant="secondary"
            icon="download"
            customClass="h-10 px-4 text-xs sm:text-sm rounded-xl cursor-pointer"
            @click="handlePrintExam"
          >
            In / Xuất PDF
          </Button>
          <Button
            v-if="examData.status === 'Bản nháp'"
            variant="primary"
            icon="publish"
            customClass="h-10 px-4 text-xs sm:text-sm rounded-xl cursor-pointer"
            @click="handlePublishExam"
          >
            Xuất bản đề
          </Button>
          
        </div>
      </div>

      <!-- INLINE EDIT MODE FOR EXAM INFO -->
      <div v-else class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Icon name="edit" size="18" />
            </div>
            <span class="font-bold text-base sm:text-lg text-gray-900">Chỉnh sửa thông tin đề thi</span>
          </div>
          <span class="text-xs text-gray-400">Thay đổi sẽ được áp dụng ngay sau khi lưu</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Tên đề thi <span class="text-red-500">*</span>
            </label>
            <input
              v-model="examInfoForm.nameExam"
              type="text"
              placeholder="Nhập tên đề thi..."
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Môn học <span class="text-red-500">*</span>
            </label>
            <input
              v-model="examInfoForm.nameSubject"
              type="text"
              placeholder="Nhập môn học..."
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Mã đề thi
            </label>
            <input
              v-model="examInfoForm.code"
              type="text"
              placeholder="VD: EX-WEB-01"
              class="w-full px-3.5 py-2.5 text-sm font-mono border border-gray-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Thời gian làm bài <span class="text-red-500">*</span>
            </label>
            <input
              v-model="examInfoForm.time"
              type="text"
              placeholder="VD: 90 phút"
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Trạng thái
            </label>
            <select
              v-model="examInfoForm.status"
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 cursor-pointer transition-all"
            >
              <option value="Xuất bản">Xuất bản</option>
              <option value="Bản nháp">Bản nháp</option>
            </select>
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Mô tả đề thi
            </label>
            <input
              v-model="examInfoForm.description"
              type="text"
              placeholder="Mô tả ngắn về phạm vi kiến thức của đề thi..."
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
          <Button
            variant="secondary"
            customClass="h-9 px-4 text-xs sm:text-sm rounded-xl cursor-pointer"
            @click="isEditingExamInfo = false"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            icon="save"
            customClass="h-9 px-5 text-xs sm:text-sm rounded-xl cursor-pointer"
            @click="saveExamInfo"
          >
            Lưu thông tin
          </Button>
        </div>
      </div>
    </div>

    <!-- 3. Main Content: Left (Questions) & Right (Sidebar) -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-start">
      <!-- LEFT: Filter Toolbar + Questions List -->
      <div class="flex flex-col gap-4 sm:gap-5 min-w-0">
        <!-- Toolbar: Search + Difficulty Filter + Add Question Button -->
        <div
          class="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 no-print"
        >
          <Search
            v-model="questionSearch"
            placeholder="Tìm kiếm nội dung câu hỏi, đáp án..."
            custom-class="mt-0"
            class="flex-1 min-w-0"
          />

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <DropdownFilter
              icon="tachometer"
              class="-mt-2 flex-1 sm:w-44 shrink-0 min-w-0"
              menu-class="!min-w-[175px]"
              v-model="difficultyFilter"
              :list="difficultyOptions"
            />

            <!-- Mobile Answer Key Toggle Button -->
            <button
              type="button"
              @click="showAnswerKey = !showAnswerKey"
              :class="[
                'lg:hidden h-[42px] px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap',
                showAnswerKey
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200',
              ]"
            >
              {{ showAnswerKey ? 'Hiện đáp án' : 'Ẩn đáp án' }}
            </button>

            <!-- Button Thêm câu hỏi -->
            <Button
              variant="primary"
              icon="plus"
              customClass="h-[42px] px-4 text-xs sm:text-sm rounded-xl cursor-pointer shrink-0"
              @click="openAddQuestionModal"
            >
              Thêm câu hỏi
            </Button>
          </div>
        </div>

        <!-- Questions List -->
        <div v-if="filteredQuestions.length > 0" class="flex flex-col gap-4 sm:gap-5">
          <div
            v-for="q in filteredQuestions"
            :key="q.id"
            :id="`question-${q.questionNumber}`"
            :class="[
              'bg-white rounded-2xl border shadow-2xs p-5 sm:p-6 transition-all duration-300 scroll-mt-20 flex flex-col gap-4 group',
              activeQuestionNumber === q.questionNumber
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-gray-200/80 hover:border-gray-300',
            ]"
          >
            <!-- Question Header Row -->
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-sm sm:text-base text-gray-900">
                  Câu {{ q.questionNumber }}
                </span>
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200/70"
                >
                  {{ q.score }} điểm
                </span>
                <span
                  :class="getDifficultyBadgeClass(q.difficulty)"
                  class="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                >
                  {{ q.difficulty }}
                </span>
                <span v-if="q.chapter" class="text-xs text-gray-400 font-medium hidden sm:inline">
                  • {{ q.chapter }}
                </span>
              </div>

              <!-- Question Action Buttons (Edit & Delete) -->
              <div class="flex items-center gap-1.5 no-print">
                <button
                  type="button"
                  @click="openEditQuestionModal(q)"
                  class="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                  title="Chỉnh sửa câu hỏi này"
                >
                  <Icon name="edit" size="16" />
                  <span class="hidden sm:inline">Sửa</span>
                </button>
                <button
                  type="button"
                  @click="confirmDeleteQuestion(q)"
                  class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                  title="Xóa câu hỏi này"
                >
                  <Icon name="trash" size="16" />
                  <span class="hidden sm:inline">Xóa</span>
                </button>
              </div>
            </div>

            <!-- Question Body -->
            <div class="flex flex-col gap-3">
              <div class="font-bold text-sm sm:text-base text-gray-900 leading-relaxed whitespace-pre-line">
                {{ q.content }}
              </div>

              <!-- Code Snippet (if applicable) -->
              <pre
                v-if="q.codeSnippet"
                class="bg-slate-900 text-slate-100 rounded-xl p-3.5 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed border border-slate-800"
              ><code>{{ q.codeSnippet }}</code></pre>
            </div>

            <!-- 4 Options in 2x2 Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                v-for="opt in q.options"
                :key="opt.id"
                :class="getOptionBoxClass(q, opt.id)"
                class="flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border transition-all"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <!-- Option Letter Badge (A, B, C, D) -->
                  <div
                    :class="getOptionBadgeClass(q, opt.id)"
                    class="w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-colors"
                  >
                    {{ opt.id }}
                  </div>
                  <!-- Option Content -->
                  <span
                    :class="[
                      'text-xs sm:text-sm leading-normal break-words',
                      showAnswerKey && q.correctAnswer === opt.id
                        ? 'text-gray-900 font-semibold'
                        : 'text-gray-700 font-medium',
                    ]"
                  >
                    {{ opt.content }}
                  </span>
                </div>

                <!-- Right Checkmark Icon for Correct Answer -->
                <div v-if="showAnswerKey && q.correctAnswer === opt.id" class="shrink-0 flex items-center pl-1">
                  <svg
                    class="w-5 h-5 text-emerald-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Add Question Quick Card -->
          <button
            type="button"
            @click="openAddQuestionModal"
            class="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-500 hover:text-primary font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer no-print"
          >
            <Icon name="plus-circle" size="20" />
            <span>Thêm câu hỏi mới vào đề thi</span>
          </button>
        </div>

        <!-- Empty Filtered / Empty Exam State -->
        <div
          v-else
          class="bg-white rounded-2xl border border-gray-200/80 p-10 text-center flex flex-col items-center gap-3"
        >
          <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Icon name="search" size="24" />
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-bold text-gray-800 text-sm sm:text-base">
              {{ examData.questions.length === 0 ? 'Đề thi chưa có câu hỏi nào' : 'Không tìm thấy câu hỏi phù hợp' }}
            </span>
            <span class="text-xs sm:text-sm text-gray-400">
              {{
                examData.questions.length === 0
                  ? 'Hãy nhấn nút Thêm câu hỏi để bắt đầu xây dựng nội dung đề thi.'
                  : 'Thử thay đổi từ khóa tìm kiếm hoặc chọn lại bộ lọc mức độ câu hỏi.'
              }}
            </span>
          </div>
          <div class="flex items-center gap-2.5 mt-1">
            <Button
              v-if="examData.questions.length > 0"
              variant="outline"
              customClass="h-9 px-4 text-xs rounded-xl cursor-pointer"
              @click="resetFilters"
            >
              Đặt lại bộ lọc
            </Button>
            <Button
              variant="primary"
              icon="plus"
              customClass="h-9 px-4 text-xs rounded-xl cursor-pointer"
              @click="openAddQuestionModal"
            >
              Thêm câu hỏi
            </Button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Sticky Sidebar -->
      <div class="flex flex-col gap-4 lg:sticky lg:top-4 no-print">
        <!-- Card 1: Question Navigator & Difficulty Structure -->
        <div class="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 flex flex-col gap-4">
          <div class="flex items-start justify-between">
            <div class="flex flex-col">
              <h2 class="font-bold text-base text-gray-900 leading-tight">Sơ đồ đề thi</h2>
              <span class="text-xs text-gray-400 mt-0.5">Chọn câu để xem nhanh</span>
            </div>
            <div
              class="px-2.5 py-0.5 rounded-full text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100"
            >
              {{ examData.questions.length }} câu
            </div>
          </div>

          <!-- Numbers Grid (5 Columns) -->
          <div v-if="examData.questions.length > 0" class="grid grid-cols-5 gap-2">
            <button
              v-for="q in examData.questions"
              :key="q.id"
              type="button"
              @click="scrollToQuestion(q.questionNumber)"
              :class="getPaletteButtonClass(q)"
              class="rounded-xl aspect-square flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              :title="`Câu ${q.questionNumber} (${q.difficulty})`"
            >
              {{ q.questionNumber }}
            </button>
          </div>
          <div v-else class="text-xs text-gray-400 italic py-2 text-center bg-gray-50 rounded-xl">
            Chưa có câu hỏi nào
          </div>

          <!-- Difficulty Matrix Distribution -->
          <div class="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
            <span class="text-xs font-bold text-gray-700 uppercase tracking-wider">Cấu trúc mức độ</span>
            <div class="flex flex-col gap-2">
              <div
                v-for="stat in difficultyStats"
                :key="stat.label"
                class="flex flex-col gap-1"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-600 font-medium">{{ stat.label }}</span>
                  <span class="font-bold text-gray-800">{{ stat.count }} câu ({{ stat.percent }}%)</span>
                </div>
                <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    :class="stat.barClass"
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: `${stat.percent}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Show/Hide Answer Key Toggle -->
        <div
          class="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-4 sm:p-5 flex items-center justify-between gap-3"
        >
          <div class="flex flex-col">
            <span class="font-bold text-sm text-gray-900 leading-tight">Hiện đáp án đúng</span>
            <span class="text-xs text-gray-400 mt-0.5">Tắt để xem dưới góc nhìn học sinh</span>
          </div>

          <button
            type="button"
            @click="showAnswerKey = !showAnswerKey"
            :class="[
              'w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center outline-none shrink-0',
              showAnswerKey ? 'bg-primary' : 'bg-gray-300',
            ]"
            :aria-checked="showAnswerKey"
            role="switch"
          >
            <div
              :class="[
                'w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition-transform duration-200',
                showAnswerKey ? 'translate-x-5.5' : 'translate-x-0',
              ]"
            ></div>
          </button>
        </div>

        <!-- Card 3: Usage History in Sessions -->
        <div class="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-gray-900">Lịch sử sử dụng đề</h3>
            <span class="text-xs font-semibold text-gray-500">{{ examData.usedSessions.length }} ca thi</span>
          </div>
          <div v-if="examData.usedSessions.length > 0" class="flex flex-col gap-2.5">
            <div
              v-for="session in examData.usedSessions"
              :key="session.id"
              @click="router.push(`/teacher/session-manage/${session.id}`)"
              class="p-3 rounded-xl bg-gray-50 hover:bg-primary/5 border border-gray-200/60 hover:border-primary/30 transition-all cursor-pointer flex flex-col gap-1"
            >
              <span class="text-xs font-bold text-gray-800 line-clamp-1">{{ session.title }}</span>
              <div class="flex items-center justify-between text-[11px] text-gray-500">
                <span>{{ session.className }}</span>
                <span>{{ session.date }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400 italic py-2">
            Đề thi này chưa được dùng trong ca thi nào.
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Add / Edit Question -->
    <Popup
      v-model="isQuestionModalOpen"
      width="680px"
      :title="editingQuestionId ? `Chỉnh sửa câu hỏi ${questionForm.questionNumber}` : 'Thêm câu hỏi mới'"
      :desc="editingQuestionId ? 'Cập nhật nội dung và đáp án cho câu hỏi' : 'Nhập đầy đủ nội dung câu hỏi và chọn 1 đáp án đúng'"
      :icon="editingQuestionId ? 'edit' : 'plus-circle'"
      :btnAcceptText="editingQuestionId ? 'Lưu thay đổi' : 'Thêm vào đề thi'"
      btnAcceptIcon="save"
      @accept="saveQuestionForm"
    >
      <template #custom-body>
        <div class="p-4 sm:p-6 overflow-y-auto custom-scrollbar max-h-[65vh] space-y-4">
          <!-- Meta row: Difficulty, Score, Chapter -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Mức độ
              </label>
              <select
                v-model="questionForm.difficulty"
                class="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 cursor-pointer"
              >
                <option value="Nhận biết">Nhận biết</option>
                <option value="Thông hiểu">Thông hiểu</option>
                <option value="Vận dụng">Vận dụng</option>
                <option value="Vận dụng cao">Vận dụng cao</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Điểm số
              </label>
              <input
                v-model="questionForm.score"
                type="number"
                step="0.25"
                min="0.25"
                placeholder="1.0"
                class="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Chương / Chủ đề
              </label>
              <input
                v-model="questionForm.chapter"
                type="text"
                placeholder="VD: Chương 1: HTTP"
                class="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>

          <!-- Question Content -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Nội dung câu hỏi <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="questionForm.content"
              rows="3"
              placeholder="Nhập câu hỏi tại đây..."
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-y"
            ></textarea>
          </div>

          <!-- Optional Code Snippet -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Đoạn mã nguồn / Code minh họa (Tùy chọn)
              </label>
              <button
                type="button"
                @click="showCodeInput = !showCodeInput"
                class="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                {{ showCodeInput ? 'Ẩn khung code' : '+ Thêm đoạn code' }}
              </button>
            </div>
            <textarea
              v-if="showCodeInput"
              v-model="questionForm.codeSnippet"
              rows="4"
              placeholder="Nhập đoạn code minh họa nếu có..."
              class="w-full px-3.5 py-2.5 font-mono text-xs bg-slate-900 text-slate-100 border border-slate-700 rounded-xl outline-none focus:border-primary resize-y"
            ></textarea>
          </div>

          <!-- 4 Options with Correct Answer Selector -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Các phương án trả lời <span class="text-red-500">*</span>
              </label>
              <span class="text-[11px] text-gray-500">Click chữ cái A/B/C/D để chọn đáp án đúng</span>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="opt in questionForm.options"
                :key="opt.id"
                :class="[
                  'flex items-center gap-2.5 p-2 rounded-xl border transition-all',
                  questionForm.correctAnswer === opt.id
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-gray-200 bg-white',
                ]"
              >
                <button
                  type="button"
                  @click="questionForm.correctAnswer = opt.id"
                  :class="[
                    'w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer transition-all',
                    questionForm.correctAnswer === opt.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  ]"
                  :title="`Đặt ${opt.id} là đáp án đúng`"
                >
                  {{ opt.id }}
                </button>
                <input
                  v-model="opt.content"
                  type="text"
                  :placeholder="`Nhập nội dung đáp án ${opt.id}...`"
                  class="flex-1 min-w-0 text-xs sm:text-sm bg-transparent outline-none text-gray-800 py-1"
                />
                <span
                  v-if="questionForm.correctAnswer === opt.id"
                  class="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0"
                >
                  Đáp án đúng
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Popup>

    <!-- Confirm Delete Question Popup -->
    <PopupConfirm
      v-model="isDeleteConfirmOpen"
      variant="warning"
      title="Xóa câu hỏi khỏi đề thi"
      :message="`Bạn có chắc chắn muốn xóa Câu ${deletingQuestion?.questionNumber || ''} khỏi đề thi này? Thứ tự các câu hỏi còn lại sẽ được cập nhật tự động.`"
      @confirm="executeDeleteQuestion"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/custom/Icon.vue'
import Button from '@/components/custom/Button.vue'
import Search from '@/components/custom/Search.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Popup from '@/components/custom/Popup.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'
import ToastMessage from '@/components/custom/ToastMessage.vue'

const route = useRoute()
const router = useRouter()

type DifficultyLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao'

interface ExamQuestion {
  id: number
  questionNumber: number
  score: string
  difficulty: DifficultyLevel
  chapter?: string
  content: string
  codeSnippet?: string
  options: { id: string; content: string }[]
  correctAnswer: string
}

interface UsedSession {
  id: number
  title: string
  className: string
  date: string
}

interface ExamMeta {
  id: number
  code: string
  nameExam: string
  nameSubject: string
  description: string
  status: 'Xuất bản' | 'Bản nháp'
  time: string
  createdAt: string
  usedSessions: UsedSession[]
  questions: ExamQuestion[]
}

// Toast state
const toastState = ref({
  isOpen: false,
  type: 'success' as 'info' | 'success' | 'warning' | 'error',
  label: '',
  content: '',
})

const showToast = (type: 'info' | 'success' | 'warning' | 'error', label: string, content: string) => {
  toastState.value = { isOpen: true, type, label, content }
}

// View states
const showAnswerKey = ref(true)
const questionSearch = ref('')
const difficultyFilter = ref<string>('all')
const activeQuestionNumber = ref<number>(1)

const difficultyOptions = [
  { key: 'all', name: 'Tất cả mức độ' },
  { key: 'Nhận biết', name: 'Nhận biết' },
  { key: 'Thông hiểu', name: 'Thông hiểu' },
  { key: 'Vận dụng', name: 'Vận dụng' },
  { key: 'Vận dụng cao', name: 'Vận dụng cao' },
]

// Mock Question Sets by Subject
const webQuestions: ExamQuestion[] = [
  {
    id: 101,
    questionNumber: 1,
    score: '1.0',
    difficulty: 'Nhận biết',
    chapter: 'Chương 1: HTTP & RESTful API',
    content: 'Mã trạng thái HTTP 201 (Created) thường được server trả về trong trường hợp nào?',
    options: [
      { id: 'A', content: 'Yêu cầu GET dữ liệu thành công' },
      { id: 'B', content: 'Tài nguyên mới đã được tạo thành công trên server' },
      { id: 'C', content: 'Client không có quyền truy cập tài nguyên' },
      { id: 'D', content: 'Server gặp lỗi nội bộ không xử lý được' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 102,
    questionNumber: 2,
    score: '1.0',
    difficulty: 'Thông hiểu',
    chapter: 'Chương 2: JavaScript Bất đồng bộ',
    content: 'Kết quả in ra màn hình console khi thực thi đoạn mã JavaScript sau là gì?',
    codeSnippet: `console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');`,
    options: [
      { id: 'A', content: 'A -> B -> C -> D' },
      { id: 'B', content: 'A -> D -> B -> C' },
      { id: 'C', content: 'A -> D -> C -> B' },
      { id: 'D', content: 'A -> C -> D -> B' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 103,
    questionNumber: 3,
    score: '1.0',
    difficulty: 'Nhận biết',
    chapter: 'Chương 3: Vue 3 Composition API',
    content: 'Trong Vue 3 Composition API, sự khác biệt chính giữa computed() và watch() là gì?',
    options: [
      { id: 'A', content: 'computed() có cơ chế cache theo dependency và trả về giá trị mới, còn watch() dùng để chạy side-effect khi dữ liệu thay đổi' },
      { id: 'B', content: 'computed() chỉ dùng cho kiểu nguyên thủy, watch() dùng cho object' },
      { id: 'C', content: 'watch() chạy đồng bộ trước khi render, computed() chạy bất đồng bộ' },
      { id: 'D', content: 'Không có sự khác biệt, có thể thay thế hoàn toàn cho nhau' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 104,
    questionNumber: 4,
    score: '1.0',
    difficulty: 'Thông hiểu',
    chapter: 'Chương 4: Bảo mật Web (CORS & JWT)',
    content: 'Cơ chế CORS (Cross-Origin Resource Sharing) được trình duyệt thực thi nhằm mục đích gì?',
    options: [
      { id: 'A', content: 'Mã hóa dữ liệu truyền tải giữa Client và Server bằng SSL/TLS' },
      { id: 'B', content: 'Kiểm soát việc một trang web từ origin này có được phép gọi tài nguyên từ origin khác hay không' },
      { id: 'C', content: 'Nén kích thước phản hồi HTTP để tăng tốc độ tải trang' },
      { id: 'D', content: 'Ngăn chặn hoàn toàn tấn công SQL Injection trên cơ sở dữ liệu' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 105,
    questionNumber: 5,
    score: '1.0',
    difficulty: 'Vận dụng',
    chapter: 'Chương 3: Vue 3 Composition API',
    content: 'Khi render danh sách bằng v-for trong Vue, tại sao nên truyền thuộc tính :key duy nhất (như item.id) thay vì dùng index của mảng?',
    options: [
      { id: 'A', content: 'Vì Vue bắt buộc :key phải là kiểu số nguyên' },
      { id: 'B', content: 'Giúp thuật toán Virtual DOM diffing định danh chính xác từng node khi thêm/xóa/sắp xếp phần tử' },
      { id: 'C', content: 'Để tự động sắp xếp mảng theo thứ tự tăng dần của id' },
      { id: 'D', content: 'Nếu dùng index sẽ bị lỗi biên dịch TypeScript' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 106,
    questionNumber: 6,
    score: '1.0',
    difficulty: 'Nhận biết',
    chapter: 'Chương 1: HTTP & RESTful API',
    content: 'Trong các phương thức HTTP sau, phương thức nào KHÔNG có tính chất Idempotent (thực hiện nhiều lần cho cùng một kết quả trạng thái tài nguyên)?',
    options: [
      { id: 'A', content: 'GET' },
      { id: 'B', content: 'PUT' },
      { id: 'C', content: 'DELETE' },
      { id: 'D', content: 'POST' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 107,
    questionNumber: 7,
    score: '1.0',
    difficulty: 'Vận dụng',
    chapter: 'Chương 4: Bảo mật Web (CORS & JWT)',
    content: 'Khi xác thực bằng JWT (JSON Web Token), phần nào của token chứa thông tin người dùng (userId, role, exp)?',
    options: [
      { id: 'A', content: 'Header' },
      { id: 'B', content: 'Payload' },
      { id: 'C', content: 'Signature' },
      { id: 'D', content: 'Secret Key' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 108,
    questionNumber: 8,
    score: '1.0',
    difficulty: 'Vận dụng cao',
    chapter: 'Chương 5: Tối ưu hiệu năng Web',
    content: 'Kỹ thuật Debouncing trong xử lý sự kiện ô tìm kiếm (input search) giải quyết vấn đề gì?',
    options: [
      { id: 'A', content: 'Chỉ gửi API tìm kiếm sau khi người dùng ngừng gõ một khoảng thời gian nhất định, giảm tải cho server' },
      { id: 'B', content: 'Lưu kết quả tìm kiếm vào cookie để lần sau không cần gọi API' },
      { id: 'C', content: 'Chạy song song tất cả các request tìm kiếm cùng lúc để lấy kết quả nhanh nhất' },
      { id: 'D', content: 'Tự động sửa lỗi chính tả của từ khóa trước khi gửi lên backend' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 109,
    questionNumber: 9,
    score: '1.0',
    difficulty: 'Thông hiểu',
    chapter: 'Chương 2: JavaScript Bất đồng bộ',
    content: 'Phương thức nào của Promise chờ TẤT CẢ các Promise truyền vào hoàn thành (fulfilled), hoặc reject ngay lập tức nếu có một Promise bị lỗi?',
    options: [
      { id: 'A', content: 'Promise.race()' },
      { id: 'B', content: 'Promise.all()' },
      { id: 'C', content: 'Promise.allSettled()' },
      { id: 'D', content: 'Promise.any()' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 110,
    questionNumber: 10,
    score: '1.0',
    difficulty: 'Vận dụng cao',
    chapter: 'Chương 5: Tối ưu hiệu năng Web',
    content: 'Để phòng chống tấn công XSS (Cross-Site Scripting) khi lưu và hiển thị JWT trên trình duyệt, cách tiếp cận nào an toàn hơn?',
    options: [
      { id: 'A', content: 'Lưu JWT trong biến toàn cục window.token' },
      { id: 'B', content: 'Lưu JWT trong HttpOnly, Secure Cookie và kết hợp chống CSRF' },
      { id: 'C', content: 'Lưu JWT trong sessionStorage để tự xóa khi đóng tab' },
      { id: 'D', content: 'Mã hóa JWT bằng Base64 hai lần rồi lưu trong localStorage' },
    ],
    correctAnswer: 'B',
  },
]

const aiQuestions: ExamQuestion[] = [
  {
    id: 201,
    questionNumber: 1,
    score: '1.0',
    difficulty: 'Nhận biết',
    chapter: 'Chương 1: Tìm kiếm mù (Uninformed Search)',
    content: 'Thuật toán tìm kiếm theo chiều rộng (BFS - Breadth-First Search) sử dụng cấu trúc dữ liệu nào để lưu biên tìm kiếm (Frontier)?',
    options: [
      { id: 'A', content: 'Ngăn xếp (Stack - LIFO)' },
      { id: 'B', content: 'Hàng đợi (Queue - FIFO)' },
      { id: 'C', content: 'Hàng đợi ưu tiên (Priority Queue)' },
      { id: 'D', content: 'Bảng băm (Hash Table)' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 202,
    questionNumber: 2,
    score: '1.0',
    difficulty: 'Thông hiểu',
    chapter: 'Chương 2: Tìm kiếm có thông tin (Informed Search)',
    content: 'Trong thuật toán A*, hàm đánh giá f(n) = g(n) + h(n) có ý nghĩa gì?',
    options: [
      { id: 'A', content: 'g(n) là chi phí ước lượng tới đích, h(n) là chi phí thực tế từ nút gốc đến n' },
      { id: 'B', content: 'g(n) là chi phí thực tế từ nút gốc đến n, h(n) là chi phí heuristic ước lượng từ n tới đích' },
      { id: 'C', content: 'g(n) và h(n) đều là trọng số ngẫu nhiên' },
      { id: 'D', content: 'f(n) là độ sâu tối đa của cây tìm kiếm' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 203,
    questionNumber: 3,
    score: '1.0',
    difficulty: 'Vận dụng',
    chapter: 'Chương 2: Tìm kiếm có thông tin (Informed Search)',
    content: 'Điều kiện để thuật toán A* tìm kiếm trên đồ thị đảm bảo tìm được đường đi tối ưu (optimal) là gì?',
    options: [
      { id: 'A', content: 'Hàm heuristic h(n) phải bằng 0 tại mọi nút' },
      { id: 'B', content: 'Hàm heuristic h(n) phải nhất quán (consistent / monotonic) và chấp nhận được (admissible)' },
      { id: 'C', content: 'Đồ thị không có chu trình âm và chỉ có tối đa 100 đỉnh' },
      { id: 'D', content: 'Sử dụng chiến lược tìm kiếm sâu dần (Iterative Deepening)' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 204,
    questionNumber: 4,
    score: '1.0',
    difficulty: 'Thông hiểu',
    chapter: 'Chương 3: Học máy cơ bản',
    content: 'Hiện tượng Overfitting (Quá khớp) trong học có giám sát xảy ra khi nào?',
    options: [
      { id: 'A', content: 'Mô hình có độ chính xác thấp trên cả tập huấn luyện và tập kiểm thử' },
      { id: 'B', content: 'Mô hình đạt độ chính xác rất cao trên tập huấn luyện nhưng kém trên tập kiểm thử (dữ liệu mới)' },
      { id: 'C', content: 'Thời gian huấn luyện mô hình kéo dài quá lâu' },
      { id: 'D', content: 'Tập dữ liệu huấn luyện bị thiếu nhãn đầu ra' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 205,
    questionNumber: 5,
    score: '1.0',
    difficulty: 'Vận dụng',
    chapter: 'Chương 3: Học máy cơ bản',
    content: 'Để đánh giá một mô hình phân loại nhị phân trên tập dữ liệu mất cân bằng nghiêm trọng (ví dụ: 99% lớp 0, 1% lớp 1), chỉ số nào sau đây phù hợp hơn Accuracy?',
    options: [
      { id: 'A', content: 'Mean Squared Error (MSE)' },
      { id: 'B', content: 'F1-Score hoặc PR-AUC (Precision-Recall)' },
      { id: 'C', content: 'R-Squared' },
      { id: 'D', content: 'Mean Absolute Error (MAE)' },
    ],
    correctAnswer: 'B',
  },
]

const cppQuestions: ExamQuestion[] = [
  {
    id: 301,
    questionNumber: 1,
    score: '1.0',
    difficulty: 'Nhận biết',
    chapter: 'Chương 1: Con trỏ & Tham chiếu',
    content: 'Trong C++, từ khóa nào dùng để cấp phát bộ nhớ động trên Heap cho một mảng đối tượng?',
    options: [
      { id: 'A', content: 'alloc' },
      { id: 'B', content: 'new[]' },
      { id: 'C', content: 'malloc()' },
      { id: 'D', content: 'create' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 302,
    questionNumber: 2,
    score: '1.0',
    difficulty: 'Thông hiểu',
    chapter: 'Chương 2: Lập trình hướng đối tượng (OOP)',
    content: 'Đoạn code C++ sau in ra giá trị nào khi thực thi?',
    codeSnippet: `class Base {\npublic:\n  virtual void show() { cout << "Base"; }\n};\nclass Derived : public Base {\npublic:\n  void show() override { cout << "Derived"; }\n};\nint main() {\n  Base* ptr = new Derived();\n  ptr->show();\n  delete ptr;\n}`,
    options: [
      { id: 'A', content: 'Base' },
      { id: 'B', content: 'Derived' },
      { id: 'C', content: 'BaseDerived' },
      { id: 'D', content: 'Lỗi biên dịch do khác kiểu con trỏ' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 303,
    questionNumber: 3,
    score: '1.0',
    difficulty: 'Vận dụng',
    chapter: 'Chương 2: Lập trình hướng đối tượng (OOP)',
    content: 'Tại sao hàm hủy (destructor) của lớp cơ sở (Base class) nên được khai báo là virtual khi có kế thừa đa hình?',
    options: [
      { id: 'A', content: 'Để tăng tốc độ cấp phát bộ nhớ trên Stack' },
      { id: 'B', content: 'Để đảm bảo destructor của lớp dẫn xuất cũng được gọi khi xóa đối tượng qua con trỏ lớp cơ sở, tránh rò rỉ bộ nhớ' },
      { id: 'C', content: 'Vì C++ không cho phép lớp con có destructor riêng nếu lớp cha không có virtual' },
      { id: 'D', content: 'Để ngăn lớp khác kế thừa lại lớp cơ sở' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 304,
    questionNumber: 4,
    score: '1.0',
    difficulty: 'Nhận biết',
    chapter: 'Chương 3: Thư viện chuẩn STL',
    content: 'Độ phức tạp thời gian trung bình cho thao tác tìm kiếm một phần tử theo khóa trong std::unordered_map là bao nhiêu?',
    options: [
      { id: 'A', content: 'O(1)' },
      { id: 'B', content: 'O(log n)' },
      { id: 'C', content: 'O(n)' },
      { id: 'D', content: 'O(n log n)' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 305,
    questionNumber: 5,
    score: '1.0',
    difficulty: 'Vận dụng cao',
    chapter: 'Chương 3: Con trỏ thông minh (Smart Pointers)',
    content: 'Loại Smart Pointer nào trong C++11 đảm bảo quyền sở hữu duy nhất (exclusive ownership) đối với tài nguyên và không thể copy (chỉ có thể move)?',
    options: [
      { id: 'A', content: 'std::shared_ptr' },
      { id: 'B', content: 'std::weak_ptr' },
      { id: 'C', content: 'std::unique_ptr' },
      { id: 'D', content: 'std::auto_ptr' },
    ],
    correctAnswer: 'C',
  },
]

const cloneQuestions = (list: ExamQuestion[]) =>
  list.map((q) => ({
    ...q,
    options: q.options.map((opt) => ({ ...opt })),
  }))

// Initial Mock Database matching ExamManage.vue items
const examsDatabase: Record<number, ExamMeta> = {
  1: {
    id: 1,
    code: 'EX-WEB-01',
    nameExam: 'Đề thi 1',
    nameSubject: 'Lập trình Web nâng cao',
    description: 'Kiểm tra kiến thức chuyên sâu về HTTP/RESTful API, JavaScript bất đồng bộ, Vue 3 và bảo mật ứng dụng Web.',
    status: 'Xuất bản',
    time: '120 phút',
    createdAt: '10/10/2026',
    usedSessions: [
      { id: 1, title: 'Thi giữa kỳ - Web nâng cao D18CNPM1', className: 'Lớp D18CNPM1', date: '20/10/2026' },
      { id: 2, title: 'Kiểm tra thực hành đợt 2', className: 'Lớp D18CNPM2', date: '25/10/2026' },
    ],
    questions: cloneQuestions(webQuestions),
  },
  2: {
    id: 2,
    code: 'EX-AI-02',
    nameExam: 'Đề thi 2',
    nameSubject: 'Trí tuệ nhân tạo',
    description: 'Đánh giá kiến thức về thuật toán tìm kiếm trên không gian trạng thái (BFS, A*) và các khái niệm Học máy cơ bản.',
    status: 'Bản nháp',
    time: '90 phút',
    createdAt: '12/10/2026',
    usedSessions: [],
    questions: cloneQuestions(aiQuestions),
  },
  3: {
    id: 3,
    code: 'EX-CPP-03',
    nameExam: 'Đề thi 3',
    nameSubject: 'Lập trình C++',
    description: 'Kiểm tra kỹ năng làm việc với con trỏ, tính đa hình OOP, thư viện STL và Smart Pointers trong C++ hiện đại.',
    status: 'Xuất bản',
    time: '60 phút',
    createdAt: '05/10/2026',
    usedSessions: [
      { id: 3, title: 'Khảo sát đầu vào C++ K20', className: 'Lớp K20-CNTT1', date: '15/10/2026' },
    ],
    questions: cloneQuestions(cppQuestions),
  },
}

const fallbackExamsList: Omit<ExamMeta, 'questions' | 'usedSessions' | 'code' | 'description' | 'createdAt'>[] = [
  { id: 4, nameExam: 'Đề thi 4', nameSubject: 'Lập trình C#', status: 'Bản nháp', time: '120 phút' },
  { id: 5, nameExam: 'Đề thi 5', nameSubject: 'Cấu trúc dữ liệu và giải thuật', status: 'Xuất bản', time: '90 phút' },
  { id: 6, nameExam: 'Đề thi 6', nameSubject: 'Lập trình Web nâng cao', status: 'Bản nháp', time: '60 phút' },
  { id: 7, nameExam: 'Đề thi 7', nameSubject: 'Trí tuệ nhân tạo', status: 'Xuất bản', time: '120 phút' },
  { id: 8, nameExam: 'Đề thi 8', nameSubject: 'Lập trình C++', status: 'Bản nháp', time: '90 phút' },
  { id: 9, nameExam: 'Đề thi 9', nameSubject: 'Lập trình C#', status: 'Xuất bản', time: '60 phút' },
  { id: 10, nameExam: 'Đề thi 10', nameSubject: 'Cấu trúc dữ liệu và giải thuật', status: 'Bản nháp', time: '120 phút' },
]

const resolveInitialExam = (): ExamMeta => {
  const id = Number(route.params.id) || 1
  if (examsDatabase[id]) {
    return {
      ...examsDatabase[id]!,
      questions: cloneQuestions(examsDatabase[id]!.questions),
    }
  }
  const fallback = fallbackExamsList.find((e) => e.id === id)
  if (fallback) {
    const questions =
      fallback.nameSubject.includes('Trí tuệ')
        ? aiQuestions
        : fallback.nameSubject.includes('C++')
          ? cppQuestions
          : webQuestions
    return {
      ...fallback,
      code: `EX-0${fallback.id}`,
      description: `Đề thi kiểm tra định kỳ môn ${fallback.nameSubject} gồm các câu hỏi trắc nghiệm khách quan.`,
      createdAt: '18/10/2026',
      usedSessions:
        fallback.status === 'Xuất bản'
          ? [{ id: 1, title: `Ca thi môn ${fallback.nameSubject}`, className: 'Lớp 12A1', date: '22/10/2026' }]
          : [],
      questions: cloneQuestions(questions),
    }
  }
  return {
    ...examsDatabase[1]!,
    questions: cloneQuestions(examsDatabase[1]!.questions),
  }
}

// Reactive Editable Exam State
const examData = ref<ExamMeta>(resolveInitialExam())

// Dynamic Total Score
const totalExamScore = computed(() => {
  const total = examData.value.questions.reduce((sum, q) => sum + (parseFloat(q.score) || 0), 0)
  return Number.isInteger(total) ? total : Number(total.toFixed(2))
})

// Inline Exam Info Editing State
const isEditingExamInfo = ref(false)
const examInfoForm = ref({
  nameExam: '',
  nameSubject: '',
  code: '',
  time: '',
  status: 'Xuất bản' as 'Xuất bản' | 'Bản nháp',
  description: '',
})

const startEditExamInfo = () => {
  examInfoForm.value = {
    nameExam: examData.value.nameExam,
    nameSubject: examData.value.nameSubject,
    code: examData.value.code,
    time: examData.value.time,
    status: examData.value.status,
    description: examData.value.description,
  }
  isEditingExamInfo.value = true
}

const saveExamInfo = () => {
  if (!examInfoForm.value.nameExam.trim() || !examInfoForm.value.nameSubject.trim() || !examInfoForm.value.time.trim()) {
    showToast('warning', 'Thiếu thông tin', 'Vui lòng nhập đầy đủ Tên đề thi, Môn học và Thời gian!')
    return
  }
  examData.value.nameExam = examInfoForm.value.nameExam.trim()
  examData.value.nameSubject = examInfoForm.value.nameSubject.trim()
  examData.value.code = examInfoForm.value.code.trim() || examData.value.code
  examData.value.time = examInfoForm.value.time.trim()
  examData.value.status = examInfoForm.value.status
  examData.value.description = examInfoForm.value.description.trim()
  isEditingExamInfo.value = false
  showToast('success', 'Đã lưu', 'Thông tin đề thi đã được cập nhật!')
}

// Filtering Questions
const filteredQuestions = computed(() => {
  return examData.value.questions.filter((q) => {
    if (difficultyFilter.value !== 'all' && q.difficulty !== difficultyFilter.value) {
      return false
    }
    if (questionSearch.value.trim()) {
      const kw = questionSearch.value.toLowerCase().trim()
      const matchContent = q.content.toLowerCase().includes(kw)
      const matchOptions = q.options.some((opt) => opt.content.toLowerCase().includes(kw))
      const matchChapter = (q.chapter || '').toLowerCase().includes(kw)
      if (!matchContent && !matchOptions && !matchChapter) {
        return false
      }
    }
    return true
  })
})

const filteredQuestionNumbers = computed(() => new Set(filteredQuestions.value.map((q) => q.questionNumber)))

// Difficulty Breakdown Stats
const difficultyStats = computed(() => {
  const total = examData.value.questions.length || 1
  const levels: { label: DifficultyLevel; barClass: string }[] = [
    { label: 'Nhận biết', barClass: 'bg-emerald-500' },
    { label: 'Thông hiểu', barClass: 'bg-sky-500' },
    { label: 'Vận dụng', barClass: 'bg-amber-500' },
    { label: 'Vận dụng cao', barClass: 'bg-rose-500' },
  ]
  return levels.map((lvl) => {
    const count = examData.value.questions.filter((q) => q.difficulty === lvl.label).length
    return {
      label: lvl.label,
      count,
      percent: examData.value.questions.length === 0 ? 0 : Math.round((count / total) * 100),
      barClass: lvl.barClass,
    }
  })
})

// Add / Edit Question Modal State
const isQuestionModalOpen = ref(false)
const editingQuestionId = ref<number | null>(null)
const showCodeInput = ref(false)

const createEmptyQuestionForm = (): ExamQuestion => ({
  id: 0,
  questionNumber: examData.value.questions.length + 1,
  score: '1.0',
  difficulty: 'Nhận biết',
  chapter: '',
  content: '',
  codeSnippet: '',
  options: [
    { id: 'A', content: '' },
    { id: 'B', content: '' },
    { id: 'C', content: '' },
    { id: 'D', content: '' },
  ],
  correctAnswer: 'A',
})

const questionForm = ref<ExamQuestion>(createEmptyQuestionForm())

const openAddQuestionModal = () => {
  editingQuestionId.value = null
  questionForm.value = createEmptyQuestionForm()
  showCodeInput.value = false
  isQuestionModalOpen.value = true
}

const openEditQuestionModal = (q: ExamQuestion) => {
  editingQuestionId.value = q.id
  questionForm.value = {
    ...q,
    codeSnippet: q.codeSnippet || '',
    chapter: q.chapter || '',
    options: q.options.map((opt) => ({ ...opt })),
  }
  showCodeInput.value = Boolean(q.codeSnippet && q.codeSnippet.trim() !== '')
  isQuestionModalOpen.value = true
}

const saveQuestionForm = async () => {
  if (!questionForm.value.content.trim()) {
    showToast('warning', 'Thiếu nội dung', 'Vui lòng nhập nội dung câu hỏi!')
    return
  }
  const hasEmptyOption = questionForm.value.options.some((opt) => !opt.content.trim())
  if (hasEmptyOption) {
    showToast('warning', 'Thiếu đáp án', 'Vui lòng nhập đầy đủ nội dung cho cả 4 đáp án A, B, C, D!')
    return
  }

  const formattedScore = String(parseFloat(questionForm.value.score) || 1.0)
  const cleanCode = showCodeInput.value && questionForm.value.codeSnippet?.trim()
    ? questionForm.value.codeSnippet.trim()
    : undefined

  if (editingQuestionId.value !== null) {
    // Update existing question
    const idx = examData.value.questions.findIndex((q) => q.id === editingQuestionId.value)
    if (idx !== -1) {
      examData.value.questions[idx] = {
        ...questionForm.value,
        score: formattedScore,
        codeSnippet: cleanCode,
        chapter: questionForm.value.chapter?.trim() || undefined,
        options: questionForm.value.options.map((opt) => ({ id: opt.id, content: opt.content.trim() })),
      }
      isQuestionModalOpen.value = false
      showToast('success', 'Thành công', `Đã cập nhật Câu ${questionForm.value.questionNumber}!`)
    }
  } else {
    // Add new question
    const newId = Date.now()
    const newNumber = examData.value.questions.length + 1
    examData.value.questions.push({
      id: newId,
      questionNumber: newNumber,
      score: formattedScore,
      difficulty: questionForm.value.difficulty,
      chapter: questionForm.value.chapter?.trim() || undefined,
      content: questionForm.value.content.trim(),
      codeSnippet: cleanCode,
      options: questionForm.value.options.map((opt) => ({ id: opt.id, content: opt.content.trim() })),
      correctAnswer: questionForm.value.correctAnswer,
    })
    isQuestionModalOpen.value = false
    resetFilters()
    showToast('success', 'Đã thêm câu hỏi', `Câu ${newNumber} đã được thêm vào đề thi!`)
    await nextTick()
    scrollToQuestion(newNumber)
  }
}

// Delete Question State & Actions
const isDeleteConfirmOpen = ref(false)
const deletingQuestion = ref<ExamQuestion | null>(null)

const confirmDeleteQuestion = (q: ExamQuestion) => {
  deletingQuestion.value = q
  isDeleteConfirmOpen.value = true
}

const executeDeleteQuestion = () => {
  if (!deletingQuestion.value) return
  const targetNum = deletingQuestion.value.questionNumber
  examData.value.questions = examData.value.questions
    .filter((q) => q.id !== deletingQuestion.value?.id)
    .map((q, index) => ({
      ...q,
      questionNumber: index + 1,
    }))
  deletingQuestion.value = null
  showToast('success', 'Đã xóa câu hỏi', `Đã xóa Câu ${targetNum} và cập nhật lại số thứ tự câu hỏi.`)
}

// Styling Helpers
const getDifficultyBadgeClass = (diff: DifficultyLevel) => {
  switch (diff) {
    case 'Nhận biết':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Thông hiểu':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'Vận dụng':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Vận dụng cao':
      return 'bg-rose-50 text-rose-700 border-rose-200'
  }
}

const getOptionBoxClass = (q: ExamQuestion, optId: string) => {
  if (showAnswerKey.value && q.correctAnswer === optId) {
    return 'border-emerald-500 bg-emerald-50/40 shadow-2xs'
  }
  return 'border-gray-200 bg-white'
}

const getOptionBadgeClass = (q: ExamQuestion, optId: string) => {
  if (showAnswerKey.value && q.correctAnswer === optId) {
    return 'bg-emerald-600 text-white shadow-2xs'
  }
  return 'bg-gray-100 text-gray-500'
}

const getPaletteButtonClass = (q: ExamQuestion) => {
  if (activeQuestionNumber.value === q.questionNumber) {
    return 'bg-primary text-white shadow-xs font-bold border border-primary'
  }
  if (!filteredQuestionNumbers.value.has(q.questionNumber)) {
    return 'bg-gray-50 border border-gray-200 text-gray-300 opacity-60'
  }
  return 'bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5'
}

// Actions
const scrollToQuestion = (questionNum: number) => {
  activeQuestionNumber.value = questionNum
  const el = document.getElementById(`question-${questionNum}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const resetFilters = () => {
  questionSearch.value = ''
  difficultyFilter.value = 'all'
}

const handlePrintExam = () => {
  window.print()
}

const handlePublishExam = () => {
  examData.value.status = 'Xuất bản'
  showToast('success', 'Đã xuất bản', `Đề thi "${examData.value.nameExam}" đã sẵn sàng để tổ chức ca thi!`)
}
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
