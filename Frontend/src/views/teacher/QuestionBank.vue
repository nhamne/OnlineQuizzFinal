<template>
  <div
    class="w-full h-[calc(100dvh-92px)] flex flex-col md:flex-row border-t border-gray-200 overflow-hidden relative"
  >
    <!-- Toast Notification -->
    <Teleport to="body">
      <ToastMessage
        v-model="toastState.isOpen"
        :type="toastState.type"
        :label="toastState.label"
        :content="toastState.content"
        class="!fixed !top-5 !right-5 !z-[70]"
      />
    </Teleport>

    <!-- Desktop Left Sidebar (Danh mục kho câu hỏi & Chương) -->
    <div
      class="hidden md:flex flex-col w-72 lg:w-80 bg-white border-r border-gray-200 shrink-0 h-full overflow-y-auto custom-scrollbar"
    >
      <div
        class="w-full h-16 lg:h-20 px-4 bg-white border-b border-gray-200 flex justify-between items-center shrink-0"
      >
        <div>
          <span class="text-base lg:text-lg font-bold text-primary-bg">Danh mục kho câu hỏi</span>
          <p class="text-xs text-gray-500">Tổng số câu hỏi: {{ listQuestionBank.length }}</p>
        </div>
        
      </div>

      <!-- All Subjects Reset -->
      <div class="px-2.5 pt-3">
        <div
          @click="selectSubject('')"
          :class="
            selectedSubject === ''
              ? 'bg-primary/10 text-primary font-bold'
              : 'text-gray-700 hover:bg-gray-50 font-medium'
          "
          class="flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs lg:text-sm"
        >
          <div class="flex items-center gap-2.5">
            <Icon name="folder" size="18" />
            <span>Tất cả môn học</span>
          </div>
          <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {{ listQuestionBank.length }}
          </span>
        </div>
      </div>

      <!-- Môn học của tôi -->
      <div class="px-2.5 py-2 pb-6">
        <div class="flex items-center justify-between ml-2 mr-1 mb-1">
          <div class="text-[11px] uppercase font-bold tracking-wider text-gray-400">
            Môn học của tôi
          </div>
          <button
            type="button"
            @click="isOpenAddSubject = true"
            class="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            + Môn mới
          </button>
        </div>

        <div
          v-if="listSubject.length === 0"
          class="mx-1 mt-2 p-3.5 rounded-xl border border-dashed border-gray-200 bg-gray-50/70 text-center"
        >
          <p class="text-xs text-gray-500">Chưa có môn học nào</p>
          <button
            type="button"
            @click="isOpenAddSubject = true"
            class="mt-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            + Tạo môn học đầu tiên
          </button>
        </div>

        <div v-for="subject in listSubject" :key="subject.key" class="mt-0.5">
          <div
            @click="toggleOrSelectSubject(subject.name)"
            :class="
              selectedSubject === subject.name && selectedChapter === ''
                ? 'bg-primary/10 text-primary font-bold'
                : selectedSubject === subject.name
                  ? 'bg-primary/5 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 font-medium'
            "
            class="group flex items-center justify-between gap-1.5 p-2 rounded-xl cursor-pointer transition-all text-xs lg:text-sm"
          >
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <Icon
                name="chevron-right"
                size="14"
                class="shrink-0 text-gray-400 transition-transform duration-200"
                :class="expandedSubjects.includes(subject.name) ? 'rotate-90 text-primary' : ''"
              />
              <Icon name="book-mark" size="17" class="shrink-0" />
              <span class="truncate">{{ subject.name }}</span>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button
                type="button"
                @click.stop="startInlineAddChapter(subject.name)"
                class="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-primary hover:bg-white transition-all cursor-pointer"
                title="Thêm chương mới vào môn này"
              >
                <Icon name="plus" size="14" />
              </button>
              <span class="text-[11px] text-gray-400 font-medium px-1">
                {{ getSubjectQuestionCount(subject.name) }}
              </span>
            </div>
          </div>

          <!-- Chapters Tree under Subject -->
          <div
            v-if="expandedSubjects.includes(subject.name)"
            class="ml-5 pl-2.5 border-l-2 border-gray-200/80 my-1 space-y-0.5"
          >
            <div
              v-for="chap in getChaptersForSubject(subject.name)"
              :key="chap.id"
              @click="selectChapter(subject.name, chap.name)"
              :class="
                selectedSubject === subject.name && selectedChapter === chap.name
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              "
              class="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors text-xs"
            >
              <span class="truncate" :title="chap.name">{{ chap.name }}</span>
              <span class="text-[10px] text-gray-400 shrink-0">
                {{ getChapterQuestionCount(subject.name, chap.name) }}
              </span>
            </div>

            <div
              v-if="inlineAddingSubject === subject.name"
              @click.stop
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/5"
            >
              <Icon name="plus" size="13" class="text-primary shrink-0" />
              <input
                v-focus
                v-model="inlineChapterName"
                type="text"
                placeholder="Nhập tên chương..."
                @keydown="handleInlineChapterKeydown($event, subject.name)"
                @blur="handleInlineChapterBlur(subject.name)"
                class="w-full min-w-0 bg-transparent border-0 p-0 text-xs font-medium text-gray-800 placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 shadow-none"
              />
            </div>
            <button
              v-else
              type="button"
              @click.stop="startInlineAddChapter(subject.name)"
              class="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-primary/80 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Icon name="plus" size="13" />
              <span>Thêm chương mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Left Sidebar Drawer (Teleported) -->
    <Teleport to="body">
      <div v-if="isOpenMobileSidebar" class="fixed inset-0 z-50 md:hidden flex">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          @click="isOpenMobileSidebar = false"
        ></div>

        <!-- Drawer Content -->
        <div
          class="relative w-[300px] max-w-[85vw] h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200"
        >
          <!-- Drawer Header -->
          <div
            class="h-16 px-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/70 shrink-0"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center"
              >
                <Icon name="folder" size="18" />
              </div>
              <div>
                <span class="text-sm font-bold text-black">Danh mục câu hỏi</span>
                <p class="text-[11px] text-gray-500">{{ listQuestionBank.length }} câu hỏi</p>
              </div>
            </div>
            <button
              type="button"
              @click="isOpenMobileSidebar = false"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Icon name="x" size="20" />
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
            <!-- All Subjects -->
            <div>
              <div
                @click="selectMobileSubject('')"
                :class="
                  selectedSubject === ''
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                "
                class="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all text-sm"
              >
                <Icon name="folder" size="18" />
                <span>Tất cả môn học</span>
              </div>
            </div>

            <!-- Môn học của tôi -->
            <div>
              <div class="flex items-center justify-between ml-2 mr-1 mb-1.5">
                <div class="text-[11px] uppercase font-bold tracking-wider text-gray-400">
                  Môn học của tôi
                </div>
                <div
                  @click="
                    () => {
                      isOpenMobileSidebar = false
                      isOpenAddSubject = true
                    }
                  "
                  class="p-1 rounded-md text-gray-400 hover:text-secondary hover:bg-gray-100 cursor-pointer flex items-center justify-center"
                  title="Thêm môn học"
                >
                  <Icon name="folder-plus" size="16" />
                </div>
              </div>
              <div
                v-if="listSubject.length === 0"
                class="mt-2 p-3.5 rounded-xl border border-dashed border-gray-200 bg-gray-50/70 text-center"
              >
                <p class="text-xs text-gray-500">Chưa có môn học nào</p>
                <button
                  type="button"
                  @click="
                    () => {
                      isOpenMobileSidebar = false
                      isOpenAddSubject = true
                    }
                  "
                  class="mt-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  + Tạo môn học đầu tiên
                </button>
              </div>
              <div v-for="subject in listSubject" :key="subject.key" class="mt-1">
                <div
                  @click="toggleOrSelectSubject(subject.name)"
                  :class="
                    selectedSubject === subject.name
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-gray-700 hover:bg-gray-50 font-medium'
                  "
                  class="flex items-center justify-between gap-2 p-2.5 rounded-xl cursor-pointer transition-all text-sm"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <Icon
                      name="chevron-right"
                      size="14"
                      class="shrink-0 transition-transform duration-200"
                      :class="expandedSubjects.includes(subject.name) ? 'rotate-90 text-primary' : 'text-gray-400'"
                    />
                    <Icon name="book-mark" size="17" class="shrink-0" />
                    <span class="truncate">{{ subject.name }}</span>
                  </div>
                  <button
                    type="button"
                    @click.stop="startInlineAddChapter(subject.name)"
                    class="p-1 rounded text-primary hover:bg-primary/10"
                    title="Thêm chương"
                  >
                    <Icon name="plus" size="14" />
                  </button>
                </div>

                <div
                  v-if="expandedSubjects.includes(subject.name)"
                  class="ml-5 pl-2.5 border-l-2 border-gray-200 my-1 space-y-1"
                >
                  <div
                    v-for="chap in getChaptersForSubject(subject.name)"
                    :key="chap.id"
                    @click="selectMobileChapter(subject.name, chap.name)"
                    :class="
                      selectedSubject === subject.name && selectedChapter === chap.name
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-gray-600'
                    "
                    class="px-2.5 py-1.5 rounded-lg text-xs cursor-pointer truncate"
                  >
                    {{ chap.name }}
                  </div>
                  <div
                    v-if="inlineAddingSubject === subject.name"
                    @click.stop
                    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/5"
                  >
                    <Icon name="plus" size="13" class="text-primary shrink-0" />
                    <input
                      v-focus
                      v-model="inlineChapterName"
                      type="text"
                      placeholder="Nhập tên chương..."
                      @keydown="handleInlineChapterKeydown($event, subject.name)"
                      @blur="handleInlineChapterBlur(subject.name)"
                      class="w-full min-w-0 bg-transparent border-0 p-0 text-xs font-medium text-gray-800 placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 shadow-none"
                    />
                  </div>
                  <button
                    v-else
                    type="button"
                    @click.stop="startInlineAddChapter(subject.name)"
                    class="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-primary/80 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <Icon name="plus" size="13" />
                    <span>Thêm chương mới</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Main Content Area (Right) -->
    <div class="flex-1 h-full overflow-hidden flex flex-col">
      <!-- Main Header -->
      <div
        class="w-full bg-white px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 sm:gap-4 shrink-0"
      >
        <div class="flex flex-col gap-0.5 min-w-0">
          <div class="flex items-center gap-2">
            <!-- Mobile drawer trigger button -->
            <button
              type="button"
              @click="isOpenMobileSidebar = true"
              class="md:hidden p-1.5 -ml-1 text-gray-600 hover:text-secondary rounded-lg hover:bg-gray-100 transition-colors"
              title="Danh mục câu hỏi"
            >
              <Icon name="folder" size="22" />
            </button>
            <span class="text-xl sm:text-2xl font-bold text-primary-bg truncate">Ngân hàng câu hỏi</span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 truncate">
            Tổng số câu hỏi:
            <span class="font-semibold text-primary">{{ filteredQuestions.length }}</span>
            <span v-if="selectedSubject" class="text-secondary font-medium">
              • {{ selectedSubject }}</span
            >
            <span v-if="selectedChapter" class="text-gray-700 font-medium">
              • {{ selectedChapter }}</span
            >
          </p>
        </div>

        <div class="w-full sm:w-auto shrink-0">
          <Button
            icon="plus"
            class="w-full sm:w-auto text-xs sm:text-sm py-2 sm:py-2.5 cursor-pointer"
            @click="openAddQuestionModal"
          >
            Thêm câu hỏi
          </Button>
        </div>
      </div>

      <!-- Scrollable Questions Container -->
      <div class="overflow-y-auto custom-scrollbar px-3 py-3 sm:px-6 sm:py-4 flex-1">
        <!-- Toolbar Actions: Search, Chapter Filter (when subject selected), Level Filter, Reload -->
        <div class="w-full flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <!-- Search input -->
          <Search
            v-model="searchQuery"
            class="flex-1 min-w-[200px]"
            placeholder="Tìm theo nội dung, môn học, chương..."
          />

          <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <!-- Chapter Filter Dropdown (when subject is selected) -->
            <DropdownFilter
              v-if="selectedSubject"
              class="flex-1 sm:w-48 lg:w-56 shrink-0 min-w-0"
              icon="folder"
              v-model="selectedChapterFilterModel"
              :list="chapterFilterOptions"
            />

            <!-- Level filter dropdown -->
            <DropdownFilter
              class="flex-1 sm:w-44 lg:w-52 shrink-0 min-w-0"
              icon="tachometer"
              v-model="selectedSort"
              :list="listSort"
            />

            <!-- Mobile drawer shortcut button -->
            <Button
              variant="secondary"
              custom-class="md:hidden w-[42px] h-[42px] p-0 shrink-0 mt-2 flex items-center justify-center cursor-pointer"
              @click="isOpenMobileSidebar = true"
              title="Danh mục môn học"
            >
              <Icon name="folder" size="20" />
            </Button>

            <!-- Reload button -->
            <Button
              variant="secondary"
              custom-class="w-[42px] h-[42px] p-0 shrink-0 mt-2 flex items-center justify-center cursor-pointer"
              @click="resetFilter"
              title="Tải lại"
            >
              <Icon name="reload" size="18" />
            </Button>
          </div>
        </div>

        <!-- Active Filter Badges (Subject & Chapter) -->
        <div v-if="selectedSubject || selectedChapter" class="mt-3 flex flex-wrap items-center gap-2">
          <span class="text-xs text-gray-500">Đang lọc:</span>
          <div
            v-if="selectedSubject"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
          >
            <span>Môn: {{ selectedSubject }}</span>
            <Icon
              name="x"
              size="14"
              class="cursor-pointer hover:text-red-500 transition-colors"
              @click="selectSubject('')"
            />
          </div>
          <div
            v-if="selectedChapter"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-800"
          >
            <span>{{ selectedChapter }}</span>
            <Icon
              name="x"
              size="14"
              class="cursor-pointer hover:text-red-500 transition-colors"
              @click="selectedChapter = ''"
            />
          </div>
        </div>

        <!-- Result count -->
        <div class="mt-3.5 sm:mt-4 text-xs sm:text-sm text-gray-500 font-medium">
          Hiển thị {{ filteredQuestions.length }}/{{ listQuestionBank.length }} câu hỏi
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredQuestions.length === 0"
          class="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 mt-4 shadow-sm"
        >
          <div
            class="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400 mb-2"
          >
            <Icon :name="listSubject.length === 0 ? 'folder-plus' : 'search'" size="22" />
          </div>
          <p class="text-sm font-medium text-gray-600">
            {{
              listSubject.length === 0
                ? 'Chưa có môn học nào trong kho của bạn'
                : 'Không tìm thấy câu hỏi phù hợp'
            }}
          </p>
          <p class="text-xs text-gray-400 mt-1">
            {{
              listSubject.length === 0
                ? 'Hãy tạo môn học đầu tiên và thêm các chương để bắt đầu xây dựng ngân hàng câu hỏi'
                : 'Hãy thử tìm kiếm với từ khóa khác hoặc thêm câu hỏi mới vào chương này'
            }}
          </p>
          <div class="flex items-center justify-center gap-2.5 mt-4">
            <template v-if="listSubject.length === 0">
              <Button variant="primary" icon="folder-plus" class="text-xs cursor-pointer" @click="isOpenAddSubject = true"
                >Tạo môn học mới</Button
              >
            </template>
            <template v-else>
              <Button variant="secondary" class="text-xs cursor-pointer" @click="resetFilter"
                >Đặt lại bộ lọc</Button
              >
              <Button variant="primary" icon="plus" class="text-xs cursor-pointer" @click="openAddQuestionModal"
                >Thêm câu hỏi</Button
              >
            </template>
          </div>
        </div>

        <!-- Question Cards List -->
        <div class="w-full pb-8">
          <div
            @click="handleSelectQuestion(item.id)"
            class="group p-3.5 sm:p-5 mt-3 sm:mt-4 bg-white rounded-2xl border border-gray-200 hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer"
            v-for="item in filteredQuestions"
            :key="item.id"
          >
            <div class="w-full flex justify-between items-start gap-2">
              <!-- Subject, Chapter & Level Tags -->
              <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <div
                  class="flex gap-1.5 font-medium items-center text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 sm:py-1 rounded-full text-xs"
                >
                  <Icon name="book-open" size="13" />
                  <span>{{ item.subject }}</span>
                </div>
                <div
                  v-if="item.chapter"
                  class="flex gap-1.5 font-medium items-center text-slate-700 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 sm:py-1 rounded-full text-xs"
                >
                  <Icon name="folder" size="13" class="text-slate-500" />
                  <span>{{ item.chapter }}</span>
                </div>
                <div
                  :class="
                    item.level === 'Dễ'
                      ? 'text-green-700 bg-green-50 border border-green-200'
                      : item.level === 'Trung bình'
                        ? 'text-yellow-700 bg-yellow-50 border border-yellow-200'
                        : item.level === 'Khó'
                          ? 'text-orange-700 bg-orange-50 border border-orange-200'
                          : 'text-red-700 bg-red-50 border border-red-200'
                  "
                  class="font-medium px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs"
                >
                  {{ item.level }}
                </div>
              </div>

              <!-- Action Icons -->
              <div
                class="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 sm:gap-2 shrink-0"
              >
                <button
                  type="button"
                  @click.stop="openEditQuestionModal(item)"
                  class="p-1 sm:p-1.5 text-gray-400 hover:text-secondary hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="Chỉnh sửa"
                >
                  <Icon name="edit" size="18" />
                </button>
                <button
                  type="button"
                  @click.stop="handleDelete(item.id)"
                  class="p-1 sm:p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Xóa"
                >
                  <Icon name="trash" size="18" />
                </button>
              </div>
            </div>

            <!-- Question name & content -->
            <div class="mt-2.5 text-sm sm:text-base text-black/85 font-medium leading-snug">
              <span class="font-bold text-primary">{{ item.name }}:</span> {{ item.content }}
            </div>

            <!-- Tap hint -->
            <div class="mt-2 flex items-center gap-1 text-[11px] sm:text-xs text-gray-400">
              <Icon name="info-circle" size="14" />
              <span>{{
                selectedQuestion.includes(item.id) ? 'Thu gọn đáp án' : 'Xem các đáp án'
              }}</span>
            </div>

            <!-- Expanded Answers -->
            <div
              v-if="selectedQuestion.includes(item.id)"
              class="mt-3 pt-3 border-t border-gray-100 space-y-2"
            >
              <div
                v-for="answer in item.answers"
                :key="answer.id"
                :class="
                  answer.isCorrect
                    ? 'bg-green-50/80 border-green-300 text-green-900 font-medium'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                "
                class="text-xs sm:text-sm p-2.5 rounded-xl border flex items-center gap-2.5 transition-all"
              >
                <span
                  :class="
                    answer.isCorrect
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600 font-bold'
                  "
                  class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                >
                  {{
                    answer.id === '1'
                      ? 'A'
                      : answer.id === '2'
                        ? 'B'
                        : answer.id === '3'
                          ? 'C'
                          : 'D'
                  }}
                </span>
                <span class="flex-1">{{ answer.text }}</span>
                <span v-if="answer.isCorrect" class="text-xs text-green-600 font-bold shrink-0"
                  >Đáp án đúng</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Question Popup -->
    <PopupConfirm
      v-model="isOpenPopupConfirm"
      variant="warning"
      :message="`Bạn có chắc chắn muốn xóa ${deletingQuestionName} khỏi ngân hàng?`"
      title="Xóa câu hỏi"
      @confirm="confirmDeleteQuestion"
    />

    <!-- Add / Edit Question Popup -->
    <Popup
      v-model="isOpenAddQuestion"
      :title="editingQuestionId ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'"
      :desc="editingQuestionId ? 'Cập nhật môn học, chương, nội dung và đáp án' : 'Chọn môn học, chương và nhập nội dung câu hỏi'"
      width="620px"
      :icon="editingQuestionId ? 'edit' : 'folder-plus'"
      :btnAcceptText="editingQuestionId ? 'Lưu thay đổi' : 'Lưu câu hỏi'"
      btnAcceptIcon="save"
      @accept="saveQuestion"
    >
      <template #custom-body>
        <div class="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar max-h-[65vh]">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <!-- Môn học -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-semibold uppercase tracking-wider text-black/80"
                  >Môn học <span class="text-red-500">*</span></span
                >
                <button
                  type="button"
                  @click="isOpenAddSubject = true"
                  class="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Icon name="plus" size="13" />
                  <span>Tạo môn mới</span>
                </button>
              </div>
              <DropdownFilter
                v-if="subjectDropdownOptions.length > 0"
                v-model="questionForm.subject"
                :list="subjectDropdownOptions"
                icon="book-mark"
              />
              <div
                v-else
                class="mt-2 p-2.5 rounded-lg border border-dashed border-amber-300 bg-amber-50/70 text-xs text-amber-800 flex items-center justify-between gap-2"
              >
                <span>Chưa có môn học nào.</span>
                <button
                  type="button"
                  @click="isOpenAddSubject = true"
                  class="font-bold text-primary hover:underline cursor-pointer shrink-0"
                >
                  + Tạo môn ngay
                </button>
              </div>
            </div>

            <!-- Mức độ -->
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-black/80 block mb-1"
                >Mức độ <span class="text-red-500">*</span></span
              >
              <DropdownFilter v-model="questionForm.level" :list="levelDropdownOptions" icon="tachometer" />
            </div>
          </div>

          <!-- Chương trong môn học -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-semibold uppercase tracking-wider text-black/80"
                >Chương / Chủ đề <span class="text-red-500">*</span></span
              >
              <button
                type="button"
                @click="openAddChapterModal(questionForm.subject)"
                class="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                <Icon name="plus" size="13" />
                <span>Tạo chương mới</span>
              </button>
            </div>
            <DropdownFilter
              v-if="modalChapterOptions.length > 0"
              v-model="questionForm.chapter"
              :list="modalChapterOptions"
              icon="folder"
            />
            <div
              v-else
              class="mt-2 p-3 rounded-lg border border-dashed border-amber-300 bg-amber-50/70 text-xs text-amber-800 flex items-center justify-between gap-2"
            >
              <span>Môn học này chưa có chương nào.</span>
              <button
                type="button"
                @click="openAddChapterModal(questionForm.subject)"
                class="font-bold text-primary hover:underline cursor-pointer shrink-0"
              >
                + Tạo chương ngay
              </button>
            </div>
          </div>

          <!-- Nội dung câu hỏi -->
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-black/80 block mb-1.5"
              >Nội dung câu hỏi <span class="text-red-500">*</span></span
            >
            <textarea
              v-model="questionForm.content"
              rows="3"
              class="w-full outline-none p-3 text-xs sm:text-sm border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 resize-y"
              placeholder="Nhập nội dung câu hỏi..."
            ></textarea>
          </div>

          <!-- 4 Phương án trả lời -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-black/80"
                >Các đáp án <span class="text-red-500">*</span></span
              >
              <span class="text-[11px] text-gray-500">Click chữ cái A/B/C/D để đặt làm đáp án đúng</span>
            </div>
            <div class="space-y-2">
              <div
                v-for="(ans, idx) in questionForm.answers"
                :key="ans.id"
                :class="[
                  'flex items-center gap-2.5 p-2 rounded-xl border transition-all',
                  ans.isCorrect ? 'border-emerald-400 bg-emerald-50/40' : 'border-gray-200 bg-white',
                ]"
              >
                <button
                  type="button"
                  @click="setCorrectAnswer(ans.id)"
                  :class="[
                    'w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer transition-colors',
                    ans.isCorrect ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  ]"
                  title="Đặt làm đáp án đúng"
                >
                  {{ ['A', 'B', 'C', 'D'][idx] }}
                </button>
                <input
                  v-model="ans.text"
                  type="text"
                  :placeholder="`Nhập đáp án ${['A', 'B', 'C', 'D'][idx]}...`"
                  class="flex-1 min-w-0 text-xs sm:text-sm bg-transparent outline-none text-gray-800 py-1"
                />
                <span
                  v-if="ans.isCorrect"
                  class="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0"
                >
                  Đúng
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Popup>

    <!-- Add Subject Popup -->
    <Popup
      v-model="isOpenAddSubject"
      v-model:inputValue="newSubjectName"
      title="Thêm môn học mới"
      desc="Nhập tên môn học để thêm vào danh mục kho câu hỏi của bạn."
      icon="folder-plus"
      labelInput="Tên môn học"
      placeholder="Ví dụ: Cấu trúc dữ liệu và giải thuật"
      btnAcceptText="Thêm môn học"
      btnAcceptIcon="plus"
      @accept="handleAddSubject"
    />

    <!-- Add Chapter Popup -->
    <Popup
      v-model="isOpenAddChapter"
      title="Tạo chương mới"
      desc="Thêm chương / chủ đề mới vào môn học để phân loại câu hỏi khoa học hơn."
      width="480px"
      icon="folder-plus"
      btnAcceptText="Tạo chương"
      btnAcceptIcon="plus"
      @accept="handleAddChapter"
    >
      <template #custom-body>
        <div class="p-4 sm:p-6 space-y-4">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-black/80 block mb-1"
              >Thuộc môn học <span class="text-red-500">*</span></span
            >
            <DropdownFilter
              v-model="chapterForm.subject"
              :list="subjectDropdownOptions"
              icon="book-mark"
            />
          </div>
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-black/80 block mb-1.5"
              >Tên chương <span class="text-red-500">*</span></span
            >
            <input
              v-model="chapterForm.name"
              type="text"
              placeholder="Ví dụ: Chương 4: Học tăng cường (Reinforcement Learning)"
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              @keyup.enter="handleAddChapter"
            />
          </div>
        </div>
      </template>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
import Button from '@/components/custom/Button.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Icon from '@/components/custom/Icon.vue'
import Search from '@/components/custom/Search.vue'
import PopupConfirm from '@/components/custom/PopupConfirm.vue'
import Popup from '@/components/custom/Popup.vue'
import ToastMessage from '@/components/custom/ToastMessage.vue'
import { ref, computed, watch, nextTick } from 'vue'

interface SubjectItem {
  key: string
  name: string
}

interface ChapterItem {
  id: string
  name: string
}

interface AnswerOption {
  id: string
  text: string
  isCorrect: boolean
}

interface BankQuestion {
  id: number
  name: string
  subject: string
  chapter: string
  level: string
  type: string
  content: string
  answers: AnswerOption[]
  createdAt: string
  updatedAt: string
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

// Navigation & Filters
const selectedSubject = ref('')
const selectedChapter = ref('')
const expandedSubjects = ref<string[]>(['Học máy nâng cao'])
const selectedSort = ref('all')
const searchQuery = ref('')
const isOpenMobileSidebar = ref(false)

// Computed model for toolbar Chapter DropdownFilter
const selectedChapterFilterModel = computed({
  get: () => selectedChapter.value || 'all',
  set: (val: string) => {
    selectedChapter.value = val === 'all' ? '' : val
  },
})

// Subjects List (teacher-managed)
const listSubject = ref<SubjectItem[]>([
  { key: '001', name: 'Học máy nâng cao' },
  { key: '002', name: 'Mạng máy tính' },
  { key: '003', name: 'Lập trình Windows' },
  { key: '004', name: 'Lập trình Java cơ bản' },
  { key: '005', name: 'Lập trình C++' },
])

const subjectDropdownOptions = computed(() =>
  listSubject.value.map((s) => ({
    key: s.name,
    name: s.name,
  })),
)

// Chapters Map per Subject
const chaptersBySubject = ref<Record<string, ChapterItem[]>>({
  'Học máy nâng cao': [
    { id: 'ml-1', name: 'Chương 1: Tổng quan & Hồi quy' },
    { id: 'ml-2', name: 'Chương 2: Cây quyết định & SVM' },
    { id: 'ml-3', name: 'Chương 3: Mạng Nơ-ron & Học sâu' },
  ],
  'Mạng máy tính': [
    { id: 'net-1', name: 'Chương 1: Mô hình OSI & TCP/IP' },
    { id: 'net-2', name: 'Chương 2: Tầng mạng & Định tuyến' },
    { id: 'net-3', name: 'Chương 3: Tầng giao vận & Ứng dụng' },
  ],
  'Lập trình Windows': [
    { id: 'win-1', name: 'Chương 1: WinForms & Giao diện' },
    { id: 'win-2', name: 'Chương 2: Lập trình sự kiện & CSDL' },
  ],
  'Lập trình Java cơ bản': [
    { id: 'java-1', name: 'Chương 1: Cú pháp & Hướng đối tượng' },
    { id: 'java-2', name: 'Chương 2: Collections & Ngoại lệ' },
  ],
  'Lập trình C++': [
    { id: 'cpp-1', name: 'Chương 1: Con trỏ & Bộ nhớ động' },
    { id: 'cpp-2', name: 'Chương 2: Kế thừa & Đa hình' },
    { id: 'cpp-3', name: 'Chương 3: Thư viện chuẩn STL' },
  ],
})

const getChaptersForSubject = (subjectName: string): ChapterItem[] => {
  return chaptersBySubject.value[subjectName] || []
}

const chapterFilterOptions = computed(() => {
  const chaps = getChaptersForSubject(selectedSubject.value)
  return [
    { key: 'all', name: 'Tất cả các chương' },
    ...chaps.map((c) => ({ key: c.name, name: c.name })),
  ]
})

const listSort = [
  { key: 'all', name: 'Tất cả mức độ' },
  { key: 'Dễ', name: 'Dễ' },
  { key: 'Trung bình', name: 'Trung bình' },
  { key: 'Khó', name: 'Khó' },
  { key: 'Rất khó', name: 'Rất khó' },
]

const levelDropdownOptions = listSort.slice(1)

// Mock Question Bank Data with `chapter` property
const listQuestionBank = ref<BankQuestion[]>([
  {
    id: 1,
    name: 'Câu hỏi 1',
    subject: 'Học máy nâng cao',
    chapter: 'Chương 1: Tổng quan & Hồi quy',
    level: 'Dễ',
    type: 'Câu hỏi trắc nghiệm',
    content: 'Hàm mất mát (Loss Function) phổ biến nhất được sử dụng trong bài toán Hồi quy tuyến tính (Linear Regression) là gì?',
    answers: [
      { id: '1', text: 'Cross-Entropy Loss', isCorrect: false },
      { id: '2', text: 'Mean Squared Error (MSE)', isCorrect: true },
      { id: '3', text: 'Hinge Loss', isCorrect: false },
      { id: '4', text: 'Kullback-Leibler Divergence', isCorrect: false },
    ],
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
  {
    id: 2,
    name: 'Câu hỏi 2',
    subject: 'Mạng máy tính',
    chapter: 'Chương 1: Mô hình OSI & TCP/IP',
    level: 'Trung bình',
    type: 'Câu hỏi trắc nghiệm',
    content: 'Trong mô hình OSI gồm 7 tầng, giao thức IP hoạt động chủ yếu ở tầng nào?',
    answers: [
      { id: '1', text: 'Tầng Mạng (Network Layer)', isCorrect: true },
      { id: '2', text: 'Tầng Liên kết dữ liệu (Data Link Layer)', isCorrect: false },
      { id: '3', text: 'Tầng Giao vận (Transport Layer)', isCorrect: false },
      { id: '4', text: 'Tầng Ứng dụng (Application Layer)', isCorrect: false },
    ],
    createdAt: '2026-10-02',
    updatedAt: '2026-10-02',
  },
  {
    id: 3,
    name: 'Câu hỏi 3',
    subject: 'Lập trình Java cơ bản',
    chapter: 'Chương 1: Cú pháp & Hướng đối tượng',
    level: 'Trung bình',
    type: 'Câu hỏi trắc nghiệm',
    content: 'Từ khóa nào trong Java được sử dụng để ngăn không cho một lớp (Class) bị lớp khác kế thừa?',
    answers: [
      { id: '1', text: 'static', isCorrect: false },
      { id: '2', text: 'abstract', isCorrect: false },
      { id: '3', text: 'final', isCorrect: true },
      { id: '4', text: 'private', isCorrect: false },
    ],
    createdAt: '2026-10-03',
    updatedAt: '2026-10-03',
  },
  {
    id: 4,
    name: 'Câu hỏi 4',
    subject: 'Lập trình C++',
    chapter: 'Chương 1: Con trỏ & Bộ nhớ động',
    level: 'Khó',
    type: 'Câu hỏi trắc nghiệm',
    content: 'Toán tử nào dùng để giải phóng vùng nhớ của một mảng đã được cấp phát động bằng new[] trong C++?',
    answers: [
      { id: '1', text: 'delete[]', isCorrect: true },
      { id: '2', text: 'free()', isCorrect: false },
      { id: '3', text: 'remove[]', isCorrect: false },
      { id: '4', text: 'dispose()', isCorrect: false },
    ],
    createdAt: '2026-10-04',
    updatedAt: '2026-10-04',
  },
  {
    id: 5,
    name: 'Câu hỏi 5',
    subject: 'Học máy nâng cao',
    chapter: 'Chương 3: Mạng Nơ-ron & Học sâu',
    level: 'Rất khó',
    type: 'Câu hỏi trắc nghiệm',
    content: 'Hiện tượng Vanishing Gradient (Triệt tiêu đạo hàm) thường xảy ra khi sử dụng hàm kích hoạt nào trong mạng nơ-ron sâu?',
    answers: [
      { id: '1', text: 'ReLU', isCorrect: false },
      { id: '2', text: 'Leaky ReLU', isCorrect: false },
      { id: '3', text: 'GELU', isCorrect: false },
      { id: '4', text: 'Sigmoid', isCorrect: true },
    ],
    createdAt: '2026-10-05',
    updatedAt: '2026-10-05',
  },
  {
    id: 6,
    name: 'Câu hỏi 6',
    subject: 'Mạng máy tính',
    chapter: 'Chương 3: Tầng giao vận & Ứng dụng',
    level: 'Dễ',
    type: 'Câu hỏi trắc nghiệm',
    content: 'Giao thức nào sau đây sử dụng cổng (port) mặc định là 443 để truyền tải dữ liệu web được mã hóa?',
    answers: [
      { id: '1', text: 'HTTP', isCorrect: false },
      { id: '2', text: 'FTP', isCorrect: false },
      { id: '3', text: 'HTTPS', isCorrect: true },
      { id: '4', text: 'SSH', isCorrect: false },
    ],
    createdAt: '2026-10-06',
    updatedAt: '2026-10-06',
  },
])

// Sidebar & Tree Helpers
const getSubjectQuestionCount = (subjectName: string) => {
  return listQuestionBank.value.filter((q) => q.subject === subjectName).length
}

const getChapterQuestionCount = (subjectName: string, chapterName: string) => {
  return listQuestionBank.value.filter(
    (q) => q.subject === subjectName && q.chapter === chapterName,
  ).length
}

const selectSubject = (name: string) => {
  selectedSubject.value = name
  selectedChapter.value = ''
}

const toggleOrSelectSubject = (name: string) => {
  if (selectedSubject.value === name) {
    // Toggle collapse/expand when clicking already-selected subject
    if (expandedSubjects.value.includes(name)) {
      expandedSubjects.value = expandedSubjects.value.filter((s) => s !== name)
    } else {
      expandedSubjects.value.push(name)
    }
    selectedChapter.value = ''
  } else {
    selectedSubject.value = name
    selectedChapter.value = ''
    if (!expandedSubjects.value.includes(name)) {
      expandedSubjects.value.push(name)
    }
  }
}

const selectChapter = (subjectName: string, chapterName: string) => {
  selectedSubject.value = subjectName
  selectedChapter.value = chapterName
  if (!expandedSubjects.value.includes(subjectName)) {
    expandedSubjects.value.push(subjectName)
  }
}

const selectMobileSubject = (name: string) => {
  selectSubject(name)
  isOpenMobileSidebar.value = false
}

const selectMobileChapter = (subjectName: string, chapterName: string) => {
  selectChapter(subjectName, chapterName)
  isOpenMobileSidebar.value = false
}

const resetFilter = () => {
  selectedSubject.value = ''
  selectedChapter.value = ''
  selectedSort.value = 'all'
  searchQuery.value = ''
}

// Filtering Computed
const filteredQuestions = computed(() => {
  return listQuestionBank.value.filter((item) => {
    if (selectedSubject.value && item.subject !== selectedSubject.value) {
      return false
    }
    if (selectedChapter.value && item.chapter !== selectedChapter.value) {
      return false
    }
    if (selectedSort.value && selectedSort.value !== 'all') {
      if (item.level !== selectedSort.value) {
        return false
      }
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchName = item.name.toLowerCase().includes(q)
      const matchContent = item.content.toLowerCase().includes(q)
      const matchSubject = item.subject.toLowerCase().includes(q)
      const matchChapter = (item.chapter || '').toLowerCase().includes(q)
      if (!matchName && !matchContent && !matchSubject && !matchChapter) {
        return false
      }
    }
    return true
  })
})

// Expand/Collapse Answers
const selectedQuestion = ref<number[]>([])

const handleSelectQuestion = (id: number) => {
  if (selectedQuestion.value.includes(id)) {
    selectedQuestion.value = selectedQuestion.value.filter((item) => item !== id)
  } else {
    selectedQuestion.value.push(id)
  }
}

// Add Subject Logic
const isOpenAddSubject = ref(false)
const newSubjectName = ref('')

const handleAddSubject = () => {
  const trimmed = newSubjectName.value.trim()
  if (!trimmed) {
    showToast('warning', 'Thiếu thông tin', 'Vui lòng nhập tên môn học mới!')
    return
  }
  const exists = listSubject.value.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
  if (exists) {
    showToast('warning', 'Trùng tên', `Môn học "${trimmed}" đã tồn tại!`)
    return
  }
  listSubject.value.push({
    key: `sub-${Date.now()}`,
    name: trimmed,
  })
  chaptersBySubject.value[trimmed] = []
  expandedSubjects.value.push(trimmed)
  if (isOpenAddQuestion.value) {
    questionForm.value.subject = trimmed
  } else {
    selectedSubject.value = trimmed
    selectedChapter.value = ''
  }
  if (isOpenAddChapter.value) {
    chapterForm.value.subject = trimmed
  }
  newSubjectName.value = ''
  isOpenAddSubject.value = false
  showToast('success', 'Thành công', `Đã thêm môn học "${trimmed}". Hãy tạo các chương cho môn học này!`)
}

// Add Chapter Logic
const vFocus = {
  mounted: (el: HTMLElement) => {
    nextTick(() => el.focus())
  },
}

const isOpenAddChapter = ref(false)
const chapterForm = ref({
  subject: '',
  name: '',
})
const inlineAddingSubject = ref<string | null>(null)
const inlineChapterName = ref('')

const openAddChapterModal = (subjectName?: string) => {
  const defaultSubject =
    subjectName || selectedSubject.value || listSubject.value[0]?.name || ''
  chapterForm.value = {
    subject: defaultSubject,
    name: '',
  }
  isOpenAddChapter.value = true
}

const startInlineAddChapter = (subjectName: string) => {
  if (!expandedSubjects.value.includes(subjectName)) {
    expandedSubjects.value.push(subjectName)
  }
  inlineAddingSubject.value = subjectName
  inlineChapterName.value = ''
}

const cancelInlineChapter = () => {
  inlineAddingSubject.value = null
  inlineChapterName.value = ''
}

const addChapterToSubject = (subjectName: string, rawName: string): boolean => {
  const chapName = rawName.trim()
  if (!subjectName) {
    showToast('warning', 'Thiếu thông tin', 'Vui lòng chọn môn học!')
    return false
  }
  if (!chapName) {
    showToast('warning', 'Thiếu tên chương', 'Vui lòng nhập tên chương!')
    return false
  }
  if (!chaptersBySubject.value[subjectName]) {
    chaptersBySubject.value[subjectName] = []
  }
  const exists = chaptersBySubject.value[subjectName].some(
    (c) => c.name.toLowerCase() === chapName.toLowerCase(),
  )
  if (exists) {
    showToast('warning', 'Trùng tên', `Chương "${chapName}" đã tồn tại trong môn ${subjectName}!`)
    return false
  }
  chaptersBySubject.value[subjectName].push({
    id: `chap-${Date.now()}`,
    name: chapName,
  })
  if (!expandedSubjects.value.includes(subjectName)) {
    expandedSubjects.value.push(subjectName)
  }
  // If user is currently in the Add Question modal, auto-select this newly created chapter!
  if (isOpenAddQuestion.value && questionForm.value.subject === subjectName) {
    questionForm.value.chapter = chapName
  }
  showToast('success', 'Thành công', `Đã thêm "${chapName}" vào môn ${subjectName}!`)
  return true
}

const commitInlineChapter = (subjectName: string) => {
  if (inlineAddingSubject.value !== subjectName) return
  if (!inlineChapterName.value.trim()) {
    cancelInlineChapter()
    return
  }
  if (addChapterToSubject(subjectName, inlineChapterName.value)) {
    cancelInlineChapter()
  }
}

const handleInlineChapterBlur = (subjectName: string) => {
  if (inlineAddingSubject.value !== subjectName) return
  if (!inlineChapterName.value.trim()) {
    cancelInlineChapter()
    return
  }
  addChapterToSubject(subjectName, inlineChapterName.value)
  cancelInlineChapter()
}

const handleInlineChapterKeydown = (e: KeyboardEvent, subjectName: string) => {
  if (e.isComposing) return
  if (e.key === 'Enter') {
    e.preventDefault()
    commitInlineChapter(subjectName)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    cancelInlineChapter()
  }
}

const handleAddChapter = () => {
  if (addChapterToSubject(chapterForm.value.subject, chapterForm.value.name)) {
    isOpenAddChapter.value = false
  }
}

// Add / Edit Question Logic
const isOpenAddQuestion = ref(false)
const editingQuestionId = ref<number | null>(null)

const createEmptyQuestionForm = () => {
  const defaultSubj = selectedSubject.value || listSubject.value[0]?.name || ''
  const defaultChapters = getChaptersForSubject(defaultSubj)
  const defaultChap =
    selectedChapter.value && defaultSubj === selectedSubject.value
      ? selectedChapter.value
      : defaultChapters[0]?.name || ''
  return {
    subject: defaultSubj,
    chapter: defaultChap,
    level: 'Dễ',
    content: '',
    answers: [
      { id: '1', text: '', isCorrect: true },
      { id: '2', text: '', isCorrect: false },
      { id: '3', text: '', isCorrect: false },
      { id: '4', text: '', isCorrect: false },
    ],
  }
}

const questionForm = ref(createEmptyQuestionForm())

const modalChapterOptions = computed(() => {
  return getChaptersForSubject(questionForm.value.subject).map((c) => ({
    key: c.name,
    name: c.name,
  }))
})

// Auto-update chapter option when changing subject inside Add Question Modal
watch(
  () => questionForm.value.subject,
  (newSubj) => {
    const chaps = getChaptersForSubject(newSubj)
    if (!chaps.some((c) => c.name === questionForm.value.chapter)) {
      questionForm.value.chapter = chaps[0]?.name || ''
    }
  },
)

const openAddQuestionModal = () => {
  editingQuestionId.value = null
  questionForm.value = createEmptyQuestionForm()
  isOpenAddQuestion.value = true
}

const openEditQuestionModal = (item: BankQuestion) => {
  editingQuestionId.value = item.id
  questionForm.value = {
    subject: item.subject,
    chapter: item.chapter || '',
    level: item.level,
    content: item.content,
    answers: item.answers.map((a) => ({ ...a })),
  }
  isOpenAddQuestion.value = true
}

const setCorrectAnswer = (answerId: string) => {
  questionForm.value.answers.forEach((a) => {
    a.isCorrect = a.id === answerId
  })
}

const saveQuestion = () => {
  if (!questionForm.value.subject) {
    showToast('warning', 'Thiếu môn học', 'Vui lòng chọn môn học!')
    return
  }
  if (!questionForm.value.chapter) {
    showToast('warning', 'Thiếu chương', 'Vui lòng chọn hoặc tạo chương cho câu hỏi!')
    return
  }
  if (!questionForm.value.content.trim()) {
    showToast('warning', 'Thiếu nội dung', 'Vui lòng nhập nội dung câu hỏi!')
    return
  }
  if (questionForm.value.answers.some((a) => !a.text.trim())) {
    showToast('warning', 'Thiếu đáp án', 'Vui lòng nhập đầy đủ cả 4 phương án A, B, C, D!')
    return
  }

  const today = new Date().toISOString().slice(0, 10)
  if (editingQuestionId.value !== null) {
    const idx = listQuestionBank.value.findIndex((q) => q.id === editingQuestionId.value)
    if (idx !== -1 && listQuestionBank.value[idx]) {
      const target = listQuestionBank.value[idx]
      target.subject = questionForm.value.subject
      target.chapter = questionForm.value.chapter
      target.level = questionForm.value.level
      target.content = questionForm.value.content.trim()
      target.answers = questionForm.value.answers.map((a) => ({ ...a, text: a.text.trim() }))
      target.updatedAt = today
      showToast('success', 'Đã cập nhật', `Cập nhật ${target.name} thành công!`)
    }
  } else {
    const nextNum = listQuestionBank.value.length + 1
    listQuestionBank.value.unshift({
      id: Date.now(),
      name: `Câu hỏi ${nextNum}`,
      subject: questionForm.value.subject,
      chapter: questionForm.value.chapter,
      level: questionForm.value.level,
      type: 'Câu hỏi trắc nghiệm',
      content: questionForm.value.content.trim(),
      answers: questionForm.value.answers.map((a) => ({ ...a, text: a.text.trim() })),
      createdAt: today,
      updatedAt: today,
    })
    showToast('success', 'Thành công', `Đã thêm Câu hỏi ${nextNum} vào ${questionForm.value.chapter}!`)
  }
  isOpenAddQuestion.value = false
}

// Delete Question Logic
const isOpenPopupConfirm = ref(false)
const deletingQuestionId = ref<number | null>(null)
const deletingQuestionName = ref<string>('')

const handleDelete = (id: number) => {
  deletingQuestionId.value = id
  deletingQuestionName.value = listQuestionBank.value.find((item) => item.id === id)?.name || ''
  isOpenPopupConfirm.value = true
}

const confirmDeleteQuestion = () => {
  if (deletingQuestionId.value !== null) {
    listQuestionBank.value = listQuestionBank.value.filter(
      (q) => q.id !== deletingQuestionId.value,
    )
    showToast('success', 'Đã xóa', `Đã xóa ${deletingQuestionName.value} khỏi ngân hàng câu hỏi.`)
    deletingQuestionId.value = null
  }
}
</script>
