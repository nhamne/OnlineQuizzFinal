<template>
  <div class="w-full h-full flex flex-col gap-6 sm:gap-7 pb-10">
    <!-- 1. Header & Actions -->
    <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div class="flex flex-col gap-1">
        <span class="text-2xl sm:text-3xl font-semibold text-primary-bg">Báo cáo & Thống kê</span>
        <span class="text-xs sm:text-sm text-gray-500">
          Theo dõi và phân tích toàn diện hiệu quả giảng dạy, phổ điểm thi và năng lực học sinh.
        </span>
      </div>

      <Button
        class="w-full sm:w-auto"
        icon="download"
        @click="isOpenExportModal = true"
      >
        Xuất báo cáo
      </Button>
    </div>

    <!-- 2. Search & Filter Bar (Tái sử dụng layout và component từ SessionManage.vue & ExamManage.vue) -->
    <div class="mt-4 w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
      <!-- Row 1 trên mobile: Tìm kiếm + Nút reload mobile -->
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <Search
          class="flex-1 min-w-0 sm:min-w-[180px]"
          placeholder="Tìm kiếm sinh viên, ca thi..."
          v-model="searchKeyword"
        />
        <Button
          variant="secondary"
          custom-class="w-[42px] h-[42px] p-0 shrink-0 mt-2 flex items-center justify-center sm:hidden"
          @click="handleRefresh"
          title="Làm mới dữ liệu"
        >
          <Icon name="reload" size="20"></Icon>
        </Button>
      </div>

      <!-- Row 2 trên mobile, thẳng hàng trên desktop: 3 DropdownFilter + Nút reload desktop -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
        <!-- Lọc theo Lớp học -->
        <DropdownFilter
          class="flex-1 sm:w-44 lg:w-48 shrink-0 min-w-0"
          icon="community"
          v-model="selectedClass"
          :list="classList"
        />

        <!-- Lọc theo Ca thi -->
        <DropdownFilter
          class="flex-1 sm:w-44 lg:w-48 shrink-0 min-w-0"
          icon="calendar-check"
          v-model="selectedSession"
          :list="sessionList"
        />

        <!-- Lọc theo Khoảng thời gian -->
        <DropdownFilter
          class="flex-1 sm:w-40 lg:w-44 shrink-0 min-w-0"
          icon="calendar"
          v-model="selectedPeriod"
          :list="periodList"
        />

        <!-- Nút Làm mới trên màn hình sm trở lên -->
        <Button
          variant="secondary"
          custom-class="w-[42px] h-[42px] p-0 shrink-0 mt-2 hidden sm:flex items-center justify-center cursor-pointer"
          @click="handleRefresh"
          title="Làm mới dữ liệu"
        >
          <Icon name="reload" size="20"></Icon>
        </Button>
      </div>
    </div>

    <!-- 3. Key Performance Indicators (KPI Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
      <!-- Card 1: Tổng lượt làm bài -->
      <div class="bg-white p-4.5 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Tổng lượt thi</span>
          <div class="w-10 h-10 rounded-xl text-primary flex items-center justify-center bg-blue-50/80">
            <Icon name="calendar-check" size="22" />
          </div>
        </div>
        <div class="mt-3">
          <span class="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{{ currentKpi.totalAttempts.toLocaleString() }}</span>
          <span class="text-xs text-gray-400 font-medium ml-1">lượt</span>
        </div>
        <div class="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between text-xs">
          <div class="flex items-center gap-1 font-bold text-emerald-600">
            <Icon name="trending-up" size="16" />
            <span>+14.2%</span>
          </div>
          <span class="text-gray-400">Hoàn thành: <strong class="text-gray-700">{{ currentKpi.completionRate }}%</strong></span>
        </div>
      </div>

      <!-- Card 2: Điểm trung bình -->
      <div class="bg-white p-4.5 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Điểm trung bình</span>
          <div class="w-10 h-10 rounded-xl text-emerald-600 flex items-center justify-center bg-emerald-50/80">
            <Icon name="chart-trend" size="22" />
          </div>
        </div>
        <div class="mt-3">
          <span class="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{{ currentKpi.avgScore }}</span>
          <span class="text-xs text-gray-400 font-medium ml-1">/ 10</span>
        </div>
        <div class="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between text-xs">
          <span class="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-emerald-50 text-emerald-700">
            Đạt chuẩn môn học
          </span>
          <span class="text-gray-400">Trung vị: <strong class="text-gray-700">{{ currentKpi.medianScore }}</strong></span>
        </div>
      </div>

      <!-- Card 3: Tỷ lệ đạt (>= 5.0) -->
      <div class="bg-white p-4.5 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Tỷ lệ qua môn (>= 5.0)</span>
          <div class="w-10 h-10 rounded-xl text-purple-600 flex items-center justify-center bg-purple-50/80">
            <Icon name="check-shield" size="22" />
          </div>
        </div>
        <div class="mt-3">
          <span class="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{{ currentKpi.passRate }}%</span>
          <span class="text-xs text-gray-400 font-medium ml-1">đạt</span>
        </div>
        <div class="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between text-xs">
          <span class="text-gray-600 font-medium">{{ currentKpi.passedCount }} / {{ currentKpi.totalAttempts }} SV</span>
          <span class="text-rose-500 font-semibold">Trượt: {{ currentKpi.failRate }}%</span>
        </div>
      </div>

      <!-- Card 4: Điểm xuất sắc / Điểm 10 -->
      <div class="bg-white p-4.5 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Điểm cao nhất</span>
          <div class="w-10 h-10 rounded-xl text-amber-500 flex items-center justify-center bg-amber-50/80">
            <Icon name="star" size="22" />
          </div>
        </div>
        <div class="mt-3">
          <span class="text-2xl sm:text-3xl font-extrabold text-amber-500">{{ currentKpi.maxScore }}</span>
          <span class="text-xs text-gray-400 font-medium ml-1">/ 10</span>
        </div>
        <div class="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between text-xs">
          <span class="text-gray-500">Có <strong class="text-primary font-bold">{{ currentKpi.perfectScoreCount }}</strong> bài đạt điểm 10</span>
          <span class="text-gray-400">Thấp nhất: {{ currentKpi.minScore }}</span>
        </div>
      </div>
    </div>

    <!-- 4. Charts Section (Phổ điểm & Tỷ lệ học lực) -->
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-4 sm:gap-6">
      <!-- Chart 1: Phổ điểm thi (Bar Chart) -->
      <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 flex flex-col min-w-0 overflow-hidden">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-[#0F172A]">Phổ điểm thi</h2>
            <p class="text-xs text-gray-400 mt-0.5">Phân bố số lượng học sinh theo từng thang điểm chuẩn</p>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-primary border border-blue-100">
            Tập trung cao nhất: 6.5 - 7.9
          </span>
        </div>

        <div class="w-full flex-1 min-h-[300px]">
          <div ref="chartScoreEl" class="w-full"></div>
        </div>
      </div>

      <!-- Chart 2: Tỷ lệ phân loại học lực (Donut Chart) -->
      <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 flex flex-col min-w-0 overflow-hidden">
        <div class="mb-2">
          <h2 class="text-base sm:text-lg font-bold text-[#0F172A]">Xếp loại học lực</h2>
          <p class="text-xs text-gray-400 mt-0.5">Tỷ lệ học lực theo tiêu chuẩn đào tạo</p>
        </div>

        <div class="w-full flex-1 flex items-center justify-center min-h-[290px]">
          <div ref="chartRankEl" class="w-full flex justify-center"></div>
        </div>
      </div>
    </div>

    <!-- 5. Secondary Row (Tiến trình điểm số & Phân tích mức độ nhận thức) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Chart 3: Xu hướng điểm trung bình theo thời gian (Area Chart) -->
      <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 flex flex-col min-w-0 overflow-hidden">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-[#0F172A]">Tiến trình điểm số qua các kỳ thi</h2>
            <p class="text-xs text-gray-400 mt-0.5">So sánh điểm trung bình lớp với điểm trung bình toàn khối</p>
          </div>
          <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <Icon name="trending-up" size="14" />
            +1.1 điểm
          </span>
        </div>

        <div class="w-full flex-1 min-h-[260px]">
          <div ref="chartTrendEl" class="w-full"></div>
        </div>
      </div>

      <!-- Phân tích độ khó theo Mức độ nhận thức -->
      <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base sm:text-lg font-bold text-[#0F172A]">Phân tích theo mức độ nhận thức</h2>
              <p class="text-xs text-gray-400 mt-0.5">Tỷ lệ làm đúng các câu hỏi theo 4 mức độ tư duy</p>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              Tổng quan: Rất tốt
            </span>
          </div>

          <!-- Progress bars -->
          <div class="space-y-4 my-2">
            <!-- Nhận biết -->
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="font-bold text-gray-700 flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Nhận biết
                </span>
                <span class="font-bold text-emerald-600">92.4% <span class="text-gray-400 font-normal">(480/520 câu đúng)</span></span>
              </div>
              <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" style="width: 92.4%"></div>
              </div>
            </div>

            <!-- Thông hiểu -->
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="font-bold text-gray-700 flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Thông hiểu
                </span>
                <span class="font-bold text-blue-600">81.6% <span class="text-gray-400 font-normal">(424/520 câu đúng)</span></span>
              </div>
              <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500 rounded-full transition-all duration-500" style="width: 81.6%"></div>
              </div>
            </div>

            <!-- Vận dụng -->
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="font-bold text-gray-700 flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Vận dụng
                </span>
                <span class="font-bold text-amber-600">65.2% <span class="text-gray-400 font-normal">(339/520 câu đúng)</span></span>
              </div>
              <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full transition-all duration-500" style="width: 65.2%"></div>
              </div>
            </div>

            <!-- Vận dụng cao -->
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="font-bold text-gray-700 flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  Vận dụng cao
                </span>
                <span class="font-bold text-purple-600">44.8% <span class="text-gray-400 font-normal">(233/520 câu đúng)</span></span>
              </div>
              <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-purple-500 rounded-full transition-all duration-500" style="width: 44.8%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Nhận xét sư phạm -->
        <div class="mt-4 p-3.5 rounded-xl bg-primary/5 border border-primary/15 text-xs text-primary-bg flex items-start gap-2.5">
          <Icon name="bulb" size="18" class="text-primary-bg shrink-0 mt-0.5" />
          <p class="leading-relaxed text-gray-800">
            <strong class="text-primary-bg">Gợi ý giảng dạy:</strong> Học sinh nắm rất chắc phần kiến thức nền tảng và thông hiểu. Cần tăng cường thêm các bài tập thực hành tình huống phức tạp cho phần <strong class="text-primary-bg">Vận dụng cao</strong> (đặc biệt là quản lý con trỏ và cây nhị phân).
          </p>
        </div>
      </div>
    </div>

    <!-- 6. Detailed Tables (Tabs: Ca thi | Top học sinh | Học sinh cần hỗ trợ) -->
    <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col">
      <!-- Tabs Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 px-4 sm:px-6 pt-3 sm:pt-4 pb-2 gap-3">
        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            @click="activeTab = 'sessions'"
            class="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
            :class="
              activeTab === 'sessions'
                ? 'bg-button-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-primary-bg hover:bg-gray-100'
            "
          >
            <Icon name="calendar-check" size="16" />
            <span>Thống kê theo ca thi</span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="activeTab === 'sessions' ? 'bg-white/25 text-white' : 'bg-gray-200/80 text-gray-700'"
            >
              {{ filteredSessions.length }}
            </span>
          </button>

          <button
            type="button"
            @click="activeTab = 'topStudents'"
            class="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
            :class="
              activeTab === 'topStudents'
                ? 'bg-button-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-primary-bg hover:bg-gray-100'
            "
          >
            <Icon name="star" size="16" />
            <span>Bảng vinh danh Top SV</span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="activeTab === 'topStudents' ? 'bg-white/25 text-white' : 'bg-gray-200/80 text-gray-700'"
            >
              {{ topStudents.length }}
            </span>
          </button>

          <button
            type="button"
            @click="activeTab = 'atRisk'"
            class="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
            :class="
              activeTab === 'atRisk'
                ? 'bg-button-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-primary-bg hover:bg-gray-100'
            "
          >
            <Icon name="warning" size="16" />
            <span>Cần hỗ trợ</span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="activeTab === 'atRisk' ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-700'"
            >
              {{ atRiskStudents.length }}
            </span>
          </button>
        </div>

        <span class="text-xs text-gray-400 font-medium hidden sm:inline">
          Dữ liệu được cập nhật tự động sau mỗi ca thi
        </span>
      </div>

      <!-- Tab Content 1: Thống kê ca thi -->
      <div v-if="activeTab === 'sessions'" class="w-full overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs sm:text-sm min-w-[760px]">
          <thead>
            <tr class="bg-[#F8FAFC] text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
              <th class="py-3 px-4 text-center w-12">STT</th>
              <th class="py-3 px-4">Tên ca thi / Đợt thi</th>
              <th class="py-3 px-3">Lớp & Môn học</th>
              <th class="py-3 px-3 text-center">Ngày thi</th>
              <th class="py-3 px-3 text-center">Thí sinh</th>
              <th class="py-3 px-3 text-center">Điểm TB</th>
              <th class="py-3 px-3 text-center">Cao / Thấp</th>
              <th class="py-3 px-3 text-center">Tỷ lệ đạt</th>
              <th class="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(session, idx) in filteredSessions"
              :key="session.id"
              class="hover:bg-blue-50/40 transition-colors"
            >
              <td class="py-3.5 px-4 text-center font-medium text-gray-400">
                {{ idx + 1 }}
              </td>
              <td class="py-3.5 px-4">
                <div class="font-bold text-gray-900">{{ session.name }}</div>
                <span class="text-[11px] text-gray-400">{{ session.code }}</span>
              </td>
              <td class="py-3.5 px-3">
                <span class="font-semibold text-gray-800 block">{{ session.subject }}</span>
                <span class="text-[11px] text-primary font-medium">{{ session.className }}</span>
              </td>
              <td class="py-3.5 px-3 text-center text-gray-600 font-medium">
                {{ session.date }}
              </td>
              <td class="py-3.5 px-3 text-center">
                <span class="font-bold text-gray-800">{{ session.attended }}</span>
                <span class="text-gray-400">/{{ session.total }}</span>
                <span class="block text-[10px] text-emerald-600 font-semibold">{{ session.attendanceRate }}%</span>
              </td>
              <td class="py-3.5 px-3 text-center">
                <span class="font-extrabold text-sm" :class="session.avgScore >= 7.0 ? 'text-emerald-600' : 'text-amber-600'">
                  {{ session.avgScore }}
                </span>
              </td>
              <td class="py-3.5 px-3 text-center text-xs">
                <span class="text-emerald-600 font-bold">{{ session.maxScore }}</span>
                <span class="text-gray-300 mx-1">/</span>
                <span class="text-rose-500 font-bold">{{ session.minScore }}</span>
              </td>
              <td class="py-3.5 px-3 text-center">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                  :class="session.passRate >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'">
                  {{ session.passRate }}%
                </span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <Button
                  variant="outline"
                  icon="eye"
                  :size="14"
                  customClass="py-1 px-3 text-xs rounded-lg font-semibold h-8 inline-flex cursor-pointer"
                  @click="viewSessionDetail(session)"
                >
                  Phân tích
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tab Content 2: Bảng vinh danh Top học sinh -->
      <div v-if="activeTab === 'topStudents'" class="w-full overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs sm:text-sm min-w-[760px]">
          <thead>
            <tr class="bg-[#F8FAFC] text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
              <th class="py-3 px-4 text-center w-14">Hạng</th>
              <th class="py-3 px-4">Sinh viên</th>
              <th class="py-3 px-3">Mã SV</th>
              <th class="py-3 px-3">Lớp học</th>
              <th class="py-3 px-3 text-center">Số bài đã thi</th>
              <th class="py-3 px-3 text-center">Thời gian TB</th>
              <th class="py-3 px-3 text-center">Điểm TB</th>
              <th class="py-3 px-4 text-center">Xếp loại</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(st, idx) in topStudents"
              :key="st.id"
              class="hover:bg-amber-50/30 transition-colors"
            >
              <!-- Rank Medal / Number -->
              <td class="py-3.5 px-4 text-center font-bold">
                <span
                  v-if="idx === 0"
                  class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-extrabold text-sm shadow-2xs"
                  title="Hạng Nhất (Top 1)"
                >
                  🥇
                </span>
                <span
                  v-else-if="idx === 1"
                  class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-extrabold text-sm shadow-2xs"
                  title="Hạng Nhì (Top 2)"
                >
                  🥈
                </span>
                <span
                  v-else-if="idx === 2"
                  class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-extrabold text-sm shadow-2xs"
                  title="Hạng Ba (Top 3)"
                >
                  🥉
                </span>
                <span v-else class="text-gray-500 font-bold">
                  {{ idx + 1 }}
                </span>
              </td>

              <!-- Name & Avatar -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                    {{ st.name.charAt(0) }}
                  </div>
                  <div>
                    <span class="font-bold text-gray-900 block">{{ st.name }}</span>
                    <span class="text-[11px] text-gray-400">{{ st.email }}</span>
                  </div>
                </div>
              </td>

              <td class="py-3.5 px-3 font-semibold text-gray-600">
                {{ st.studentCode }}
              </td>

              <td class="py-3.5 px-3 font-medium text-gray-700">
                {{ st.className }}
              </td>

              <td class="py-3.5 px-3 text-center font-bold text-gray-800">
                {{ st.examsCompleted }}/{{ st.totalExams }}
              </td>

              <td class="py-3.5 px-3 text-center text-gray-500 font-medium">
                {{ st.avgDuration }} phút
              </td>

              <td class="py-3.5 px-3 text-center">
                <span class="text-emerald-600 font-extrabold text-sm sm:text-base">
                  {{ st.avgScore }}
                </span>
              </td>

              <td class="py-3.5 px-4 text-center">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                  :class="st.rankType === 'Xuất sắc' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'"
                >
                  {{ st.rankType }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tab Content 3: Học sinh cần hỗ trợ -->
      <div v-if="activeTab === 'atRisk'" class="w-full overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs sm:text-sm min-w-[760px]">
          <thead>
            <tr class="bg-[#FFF1F2] text-rose-800 text-[11px] font-bold uppercase tracking-wider border-b border-rose-200">
              <th class="py-3 px-4 text-center w-12">STT</th>
              <th class="py-3 px-4">Sinh viên</th>
              <th class="py-3 px-3">Mã SV</th>
              <th class="py-3 px-3">Lớp</th>
              <th class="py-3 px-3 text-center">Điểm TB</th>
              <th class="py-3 px-3 text-center">Bài dưới chuẩn</th>
              <th class="py-3 px-4">Vấn đề chính</th>
              <th class="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(st, idx) in atRiskStudents"
              :key="st.id"
              class="hover:bg-rose-50/40 transition-colors"
            >
              <td class="py-3.5 px-4 text-center font-medium text-gray-400">
                {{ idx + 1 }}
              </td>

              <td class="py-3.5 px-4">
                <div class="font-bold text-gray-900">{{ st.name }}</div>
                <span class="text-[11px] text-gray-400">{{ st.email }}</span>
              </td>

              <td class="py-3.5 px-3 font-semibold text-gray-600">
                {{ st.studentCode }}
              </td>

              <td class="py-3.5 px-3 font-medium text-gray-700">
                {{ st.className }}
              </td>

              <td class="py-3.5 px-3 text-center">
                <span class="text-rose-600 font-extrabold text-sm">
                  {{ st.avgScore }}
                </span>
              </td>

              <td class="py-3.5 px-3 text-center font-bold text-rose-600">
                {{ st.belowPassCount }} bài
              </td>

              <td class="py-3.5 px-4 text-xs text-gray-600">
                <span class="inline-block px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-medium">
                  {{ st.issue }}
                </span>
              </td>

              <td class="py-3.5 px-4 text-center">
                <Button
                  variant="secondary"
                  icon="send"
                  :size="14"
                  customClass="py-1 px-3 text-xs rounded-lg font-semibold text-primary-bg border-primary/25 hover:bg-primary/5 hover:border-primary/50 h-8 inline-flex cursor-pointer"
                  @click="sendReminder(st)"
                >
                  Nhắc nhở
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 7. Popup Xem Phân Tích Chi Tiết Ca Thi -->
    <Popup
      v-model="isOpenDetailModal"
      title="Chi tiết phân tích ca thi"
      :desc="currentSelectedSession?.name || ''"
      icon="chart"
      width="780px"
      btnAcceptText="Đóng"
      btnCancelText=""
      @accept="isOpenDetailModal = false"
      @cancel="isOpenDetailModal = false"
    >
      <template #custom-body>
        <div v-if="currentSelectedSession" class="p-5 flex flex-col gap-5 text-xs sm:text-sm">
          <!-- Thông tin tổng quan ca thi -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <span class="text-gray-400 text-xs block">Lớp / Môn:</span>
              <span class="font-bold text-primary truncate block">{{ currentSelectedSession.className }}</span>
            </div>
            <div>
              <span class="text-gray-400 text-xs block">Thí sinh tham gia:</span>
              <span class="font-bold text-gray-800">{{ currentSelectedSession.attended }}/{{ currentSelectedSession.total }} SV</span>
            </div>
            <div>
              <span class="text-gray-400 text-xs block">Điểm trung bình:</span>
              <span class="font-bold text-emerald-600 text-base">{{ currentSelectedSession.avgScore }}</span>
            </div>
            <div>
              <span class="text-gray-400 text-xs block">Tỷ lệ đạt (>= 5.0):</span>
              <span class="font-bold text-primary text-base">{{ currentSelectedSession.passRate }}%</span>
            </div>
          </div>

          <!-- Top câu hỏi sai nhiều nhất (Học sinh hay nhầm lẫn) -->
          <div>
            <h3 class="font-bold text-gray-900 text-sm mb-2.5 flex items-center gap-2">
              <Icon name="warning" size="16" class="text-rose-500" />
              <span>Top 3 câu hỏi có tỷ lệ làm sai cao nhất</span>
            </h3>

            <div class="space-y-3">
              <div
                v-for="(q, qIdx) in mockMistakeQuestions"
                :key="qIdx"
                class="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs"
              >
                <div class="flex items-center justify-between text-xs mb-1.5">
                  <span class="font-bold text-primary">Câu hỏi {{ q.index }} [{{ q.level }}]</span>
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                    {{ q.failRate }}% học sinh chọn sai
                  </span>
                </div>
                <p class="text-gray-800 font-medium text-xs mb-2 leading-relaxed">{{ q.question }}</p>
                <div class="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <div class="text-emerald-700 font-semibold mb-0.5">✓ Đáp án đúng: {{ q.correctAnswer }}</div>
                  <div class="text-gray-500">Ghi chú: {{ q.explanation }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Popup>

    <!-- 8. Popup Xuất Báo Cáo -->
    <Popup
      v-model="isOpenExportModal"
      title="Xuất báo cáo kết quả thi"
      desc="Chọn định dạng và các trường dữ liệu cần xuất báo cáo thống kê."
      icon="download"
      width="560px"
      btnAcceptText="Tải xuống ngay"
      btnCancelText="Hủy"
      btnAcceptIcon="download"
      @accept="handleExport"
      @cancel="isOpenExportModal = false"
    >
      <template #custom-body>
        <div class="p-5 flex flex-col gap-4 text-xs sm:text-sm">
          <!-- Loại báo cáo -->
          <div>
            <label class="font-bold text-gray-700 block mb-1.5">Loại báo cáo</label>
            <div class="space-y-2">
              <label
                class="flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all"
                :class="exportType === 'summary' ? 'bg-primary/5 border-primary-bg text-primary-bg shadow-2xs font-medium' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'"
              >
                <input type="radio" v-model="exportType" value="summary" class="accent-primary-bg" />
                <div>
                  <span class="font-bold block">Báo cáo tổng hợp môn học & phổ điểm</span>
                  <span class="text-[11px] opacity-75">Bao gồm thống kê KPI, phổ điểm và tỷ lệ xếp loại</span>
                </div>
              </label>

              <label
                class="flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all"
                :class="exportType === 'detail' ? 'bg-primary/5 border-primary-bg text-primary-bg shadow-2xs font-medium' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'"
              >
                <input type="radio" v-model="exportType" value="detail" class="accent-primary-bg" />
                <div>
                  <span class="font-bold block">Bảng điểm chi tiết từng học sinh theo ca thi</span>
                  <span class="text-[11px] opacity-75">Danh sách điểm số, thời gian làm bài của toàn bộ thí sinh</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Định dạng tệp tin -->
          <div>
            <label class="font-bold text-gray-700 block mb-1.5">Định dạng tệp tin</label>
            <div class="grid grid-cols-2 gap-3">
              <label
                class="flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-bold text-xs transition-all"
                :class="exportFormat === 'excel' ? 'border-primary-bg bg-primary/5 text-primary-bg shadow-2xs' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'"
              >
                <input type="radio" v-model="exportFormat" value="excel" class="hidden" />
                <span>📊 Microsoft Excel (.xlsx)</span>
              </label>

              <label
                class="flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-bold text-xs transition-all"
                :class="exportFormat === 'pdf' ? 'border-primary-bg bg-primary/5 text-primary-bg shadow-2xs' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'"
              >
                <input type="radio" v-model="exportFormat" value="pdf" class="hidden" />
                <span>📄 Tài liệu PDF (.pdf)</span>
              </label>
            </div>
          </div>
        </div>
      </template>
    </Popup>

    <!-- 9. Toast Notification -->
    <ToastMessage
      v-model="isOpenToast"
      :type="toastType"
      :label="toastTitle"
      :content="toastMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import Button from '@/components/custom/Button.vue'
import Icon from '@/components/custom/Icon.vue'
import DropdownFilter from '@/components/custom/DropdownFilter.vue'
import Search from '@/components/custom/Search.vue'
import Popup from '@/components/custom/Popup.vue'
import ToastMessage from '@/components/custom/ToastMessage.vue'
import ApexCharts from 'apexcharts'
import type { ApexOptions } from 'apexcharts'

// Filter states
const selectedClass = ref<string>('all')
const selectedSession = ref<string>('all')
const selectedPeriod = ref<string>('sem1')
const searchKeyword = ref<string>('')
const activeTab = ref<'sessions' | 'topStudents' | 'atRisk'>('sessions')

// Modal & Toast states
const isOpenDetailModal = ref<boolean>(false)
const isOpenExportModal = ref<boolean>(false)
const exportType = ref<'summary' | 'detail'>('summary')
const exportFormat = ref<'excel' | 'pdf'>('excel')
const currentSelectedSession = ref<any>(null)

const isOpenToast = ref<boolean>(false)
const toastType = ref<'success' | 'warning'>('success')
const toastTitle = ref<string>('')
const toastMessage = ref<string>('')

const showToast = (type: 'success' | 'warning', title: string, message: string) => {
  toastType.value = type
  toastTitle.value = title
  toastMessage.value = message
  isOpenToast.value = true
}

// Danh sách bộ lọc Lớp học
const classList = [
  { key: 'all', name: 'Tất cả các lớp (4 lớp)' },
  { key: 'cpp-k65', name: 'Lập trình C++ (K65-CNTT1)' },
  { key: 'java-k65', name: 'Lập trình Java (K65-CNTT2)' },
  { key: 'net-k64', name: 'Mạng máy tính (K64-HTTT)' },
  { key: 'ds-k65', name: 'Cấu trúc dữ liệu & GT (K65-KTPM)' },
]

// Danh sách bộ lọc Ca thi
const sessionList = [
  { key: 'all', name: 'Tất cả ca thi đã diễn ra' },
  { key: 'ses-1', name: 'Thi giữa kỳ - Lập trình C++' },
  { key: 'ses-2', name: 'Kiểm tra 45p - Con trỏ & Bộ nhớ' },
  { key: 'ses-3', name: 'Thi kết thúc môn - Java cơ bản' },
  { key: 'ses-4', name: 'Kiểm tra 15p - Kiến trúc OSI' },
  { key: 'ses-5', name: 'Đánh giá năng lực OOP' },
]

// Danh sách bộ lọc Thời gian
const periodList = [
  { key: 'sem1', name: 'Học kỳ 1 (2025 - 2026)' },
  { key: 'last30', name: '30 ngày gần đây' },
  { key: 'last7', name: '7 ngày gần đây' },
  { key: 'year', name: 'Cả năm học 2025 - 2026' },
]

// KPI dynamic data
const currentKpi = computed(() => {
  if (selectedClass.value === 'net-k64') {
    return {
      totalAttempts: 270,
      completionRate: 98.9,
      avgScore: 8.12,
      medianScore: 8.2,
      passRate: 96.3,
      passedCount: 260,
      failRate: 3.7,
      maxScore: 10.0,
      perfectScoreCount: 16,
      minScore: 4.5,
    }
  }
  return {
    totalAttempts: 1420,
    completionRate: 97.8,
    avgScore: 7.48,
    medianScore: 7.5,
    passRate: 89.4,
    passedCount: 1269,
    failRate: 10.6,
    maxScore: 10.0,
    perfectScoreCount: 48,
    minScore: 2.0,
  }
})

// DOM elements refs for ApexCharts
const chartScoreEl = ref<HTMLElement | null>(null)
const chartRankEl = ref<HTMLElement | null>(null)
const chartTrendEl = ref<HTMLElement | null>(null)

let chartScoreInstance: ApexCharts | null = null
let chartRankInstance: ApexCharts | null = null
let chartTrendInstance: ApexCharts | null = null

// --- CHART 1 CONFIG: Phổ điểm thi (Bar Chart) ---
const scoreDistributionConfig: ApexOptions = {
  chart: {
    id: 'report-score-dist',
    type: 'bar',
    height: 320,
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  colors: ['#EF4444', '#F97316', '#FBBF24', '#3B82F6', '#10B981', '#8B5CF6'],
  series: [
    {
      name: 'Số lượng thí sinh',
      data: [28, 92, 310, 485, 345, 160],
    },
  ],
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '45%',
      distributed: true,
      dataLabels: {
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return String(val)
    },
    offsetY: -20,
    style: {
      fontSize: '11px',
      fontWeight: 'bold',
      colors: ['#475569'],
    },
  },
  legend: { show: false },
  xaxis: {
    categories: ['< 3.0 (Kém)', '3.0 - 4.9 (Yếu)', '5.0 - 6.4 (TB)', '6.5 - 7.9 (Khá)', '8.0 - 8.9 (Giỏi)', '9.0 - 10 (Xuất sắc)'],
    labels: {
      style: {
        fontSize: '11px',
        colors: '#64748B',
        fontWeight: 500,
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { fontSize: '11px', colors: '#94a3b8' },
    },
  },
  grid: {
    borderColor: '#F1F5F9',
    strokeDashArray: 4,
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: function (val: number) {
        return `${val} sinh viên (${((val / 1420) * 100).toFixed(1)}%)`
      },
    },
  },
}

// --- CHART 2 CONFIG: Xếp loại học lực (Donut Chart) ---
const rankDistributionConfig: ApexOptions = {
  chart: {
    id: 'report-rank-dist',
    type: 'donut',
    height: 310,
    fontFamily: 'inherit',
  },
  series: [160, 345, 485, 310, 120],
  labels: ['Xuất sắc (9-10)', 'Giỏi (8-8.9)', 'Khá (6.5-7.9)', 'Trung bình (5-6.4)', 'Chưa đạt (<5)'],
  colors: ['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '64%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Tổng SV',
            fontSize: '13px',
            fontWeight: '600',
            color: '#64748B',
            formatter: () => '1,420',
          },
        },
      },
    },
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    labels: { colors: '#64748B' },
    itemMargin: { horizontal: 8, vertical: 4 },
  },
  stroke: { show: true, width: 2, colors: ['#fff'] },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: function (val: number) {
        return `${val} SV (${((val / 1420) * 100).toFixed(1)}%)`
      },
    },
  },
}

// --- CHART 3 CONFIG: Xu hướng điểm số (Area Chart) ---
const trendConfig: ApexOptions = {
  chart: {
    id: 'report-trend',
    type: 'area',
    height: 260,
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  series: [
    {
      name: 'Điểm TB Lớp phụ trách',
      data: [6.8, 7.1, 7.3, 7.6, 7.5, 7.9],
    },
    {
      name: 'Điểm TB Toàn khoa/khối',
      data: [6.5, 6.7, 6.9, 7.0, 7.1, 7.2],
    },
  ],
  colors: ['#0c6a9e', '#94A3B8'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [20, 100],
    },
  },
  stroke: {
    width: [3, 2],
    curve: 'smooth',
    dashArray: [0, 4],
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Quiz 1', 'Quiz 2', 'Giữa kỳ', 'Quiz 3', 'Thực hành', 'Cuối kỳ'],
    labels: {
      style: { fontSize: '11px', colors: '#64748B' },
    },
    axisBorder: { show: false },
  },
  yaxis: {
    min: 5,
    max: 10,
    labels: {
      style: { fontSize: '11px', colors: '#94a3b8' },
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    labels: { colors: '#64748B' },
  },
  grid: {
    borderColor: '#F1F5F9',
    strokeDashArray: 4,
  },
}

onMounted(async () => {
  await nextTick()
  try {
    if (chartScoreEl.value && !chartScoreInstance) {
      chartScoreInstance = new ApexCharts(chartScoreEl.value, scoreDistributionConfig)
      await chartScoreInstance.render()
    }
    if (chartRankEl.value && !chartRankInstance) {
      chartRankInstance = new ApexCharts(chartRankEl.value, rankDistributionConfig)
      await chartRankInstance.render()
    }
    if (chartTrendEl.value && !chartTrendInstance) {
      chartTrendInstance = new ApexCharts(chartTrendEl.value, trendConfig)
      await chartTrendInstance.render()
    }
  } catch (err) {
    console.error('Lỗi khởi tạo ApexCharts:', err)
  }
})

onBeforeUnmount(() => {
  try {
    chartScoreInstance?.destroy()
    chartScoreInstance = null
  } catch (e) {
    console.warn('Lỗi hủy chartScoreInstance:', e)
  }
  try {
    chartRankInstance?.destroy()
    chartRankInstance = null
  } catch (e) {
    console.warn('Lỗi hủy chartRankInstance:', e)
  }
  try {
    chartTrendInstance?.destroy()
    chartTrendInstance = null
  } catch (e) {
    console.warn('Lỗi hủy chartTrendInstance:', e)
  }
})

watch(selectedClass, (newClass) => {
  if (newClass === 'net-k64') {
    chartScoreInstance?.updateSeries([{ data: [5, 12, 45, 95, 75, 38] }])
    chartRankInstance?.updateSeries([38, 75, 95, 45, 17])
    chartTrendInstance?.updateSeries([
      { name: 'Điểm TB Lớp phụ trách', data: [7.2, 7.5, 7.8, 8.0, 8.1, 8.4] },
      { name: 'Điểm TB Toàn khoa/khối', data: [6.5, 6.7, 6.9, 7.0, 7.1, 7.2] },
    ])
  } else {
    chartScoreInstance?.updateSeries([{ data: [28, 92, 310, 485, 345, 160] }])
    chartRankInstance?.updateSeries([160, 345, 485, 310, 120])
    chartTrendInstance?.updateSeries([
      { name: 'Điểm TB Lớp phụ trách', data: [6.8, 7.1, 7.3, 7.6, 7.5, 7.9] },
      { name: 'Điểm TB Toàn khoa/khối', data: [6.5, 6.7, 6.9, 7.0, 7.1, 7.2] },
    ])
  }
})

// Mock danh sách ca thi
const mockSessions = [
  {
    id: 1,
    name: 'Thi giữa kỳ - Lập trình C++',
    code: 'EXAM-CPP-GK-01',
    subject: 'Lập trình C++',
    className: 'K65-CNTT1',
    date: '18/10/2025',
    attended: 61,
    total: 62,
    attendanceRate: 98.4,
    avgScore: 7.82,
    maxScore: 10.0,
    minScore: 4.5,
    passRate: 95.1,
  },
  {
    id: 2,
    name: 'Kiểm tra 45p - Con trỏ & Bộ nhớ',
    code: 'EXAM-CPP-Q2',
    subject: 'Lập trình C++',
    className: 'K65-CNTT1',
    date: '02/10/2025',
    attended: 60,
    total: 62,
    attendanceRate: 96.8,
    avgScore: 7.15,
    maxScore: 9.5,
    minScore: 3.0,
    passRate: 86.7,
  },
  {
    id: 3,
    name: 'Thi kết thúc học phần - Java cơ bản',
    code: 'EXAM-JAVA-CK',
    subject: 'Lập trình Java',
    className: 'K65-CNTT2',
    date: '25/10/2025',
    attended: 57,
    total: 58,
    attendanceRate: 98.3,
    avgScore: 7.64,
    maxScore: 10.0,
    minScore: 3.5,
    passRate: 91.2,
  },
  {
    id: 4,
    name: 'Kiểm tra 15p - Kiến trúc OSI & TCP/IP',
    code: 'EXAM-NET-Q1',
    subject: 'Mạng máy tính',
    className: 'K64-HTTT',
    date: '12/10/2025',
    attended: 45,
    total: 45,
    attendanceRate: 100,
    avgScore: 8.20,
    maxScore: 10.0,
    minScore: 5.5,
    passRate: 100,
  },
  {
    id: 5,
    name: 'Đánh giá năng lực - Lập trình OOP',
    code: 'EXAM-CPP-OOP',
    subject: 'Lập trình C++',
    className: 'K65-CNTT1',
    date: '05/11/2025',
    attended: 59,
    total: 62,
    attendanceRate: 95.2,
    avgScore: 7.30,
    maxScore: 9.8,
    minScore: 2.0,
    passRate: 84.7,
  },
  {
    id: 6,
    name: 'Kiểm tra Cây nhị phân & Đồ thị',
    code: 'EXAM-DS-TREE',
    subject: 'Cấu trúc dữ liệu & GT',
    className: 'K65-KTPM',
    date: '28/10/2025',
    attended: 49,
    total: 50,
    attendanceRate: 98.0,
    avgScore: 6.95,
    maxScore: 9.5,
    minScore: 2.5,
    passRate: 79.6,
  },
]

// Filter sessions by search keyword & selected class
const filteredSessions = computed(() => {
  return mockSessions.filter((s) => {
    const matchClass =
      selectedClass.value === 'all' ||
      (selectedClass.value === 'cpp-k65' && s.className === 'K65-CNTT1') ||
      (selectedClass.value === 'java-k65' && s.className === 'K65-CNTT2') ||
      (selectedClass.value === 'net-k64' && s.className === 'K64-HTTT') ||
      (selectedClass.value === 'ds-k65' && s.className === 'K65-KTPM')

    const matchSearch =
      !searchKeyword.value.trim() ||
      s.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      s.className.toLowerCase().includes(searchKeyword.value.toLowerCase())

    return matchClass && matchSearch
  })
})

// Mock Top học sinh vinh danh
const topStudents = ref([
  {
    id: 1,
    name: 'Nguyễn Hoàng Nam',
    email: 'nam.nh21@school.edu.vn',
    studentCode: '20210045',
    className: 'K65-CNTT1',
    examsCompleted: 6,
    totalExams: 6,
    avgDuration: 26,
    avgScore: 9.85,
    rankType: 'Xuất sắc',
  },
  {
    id: 2,
    name: 'Trần Thị Mai Anh',
    email: 'anh.ttm21@school.edu.vn',
    studentCode: '20210112',
    className: 'K65-CNTT2',
    examsCompleted: 6,
    totalExams: 6,
    avgDuration: 28,
    avgScore: 9.60,
    rankType: 'Xuất sắc',
  },
  {
    id: 3,
    name: 'Lê Quốc Bảo',
    email: 'bao.lq21@school.edu.vn',
    studentCode: '20210234',
    className: 'K65-CNTT1',
    examsCompleted: 6,
    totalExams: 6,
    avgDuration: 31,
    avgScore: 9.50,
    rankType: 'Xuất sắc',
  },
  {
    id: 4,
    name: 'Phạm Minh Tuấn',
    email: 'tuan.pm20@school.edu.vn',
    studentCode: '20200389',
    className: 'K64-HTTT',
    examsCompleted: 6,
    totalExams: 6,
    avgDuration: 29,
    avgScore: 9.40,
    rankType: 'Giỏi',
  },
  {
    id: 5,
    name: 'Đỗ Thuỳ Dung',
    email: 'dung.dt21@school.edu.vn',
    studentCode: '20210456',
    className: 'K65-KTPM',
    examsCompleted: 6,
    totalExams: 6,
    avgDuration: 34,
    avgScore: 9.30,
    rankType: 'Giỏi',
  },
  {
    id: 6,
    name: 'Vũ Đức Huy',
    email: 'huy.vd21@school.edu.vn',
    studentCode: '20210512',
    className: 'K65-CNTT1',
    examsCompleted: 6,
    totalExams: 6,
    avgDuration: 32,
    avgScore: 9.20,
    rankType: 'Giỏi',
  },
])

// Mock Học sinh cần hỗ trợ
const atRiskStudents = ref([
  {
    id: 1,
    name: 'Đặng Văn Hùng',
    email: 'hung.dv21@school.edu.vn',
    studentCode: '20210892',
    className: 'K65-KTPM',
    avgScore: 3.80,
    belowPassCount: 3,
    issue: 'Điểm thấp phần Cấu trúc dữ liệu & Thuật toán đệ quy',
  },
  {
    id: 2,
    name: 'Ngô Quang Minh',
    email: 'minh.nq21@school.edu.vn',
    studentCode: '20210943',
    className: 'K65-CNTT1',
    avgScore: 4.20,
    belowPassCount: 2,
    issue: 'Vắng thi 1 buổi, nộp bài quá sớm (< 15 phút)',
  },
  {
    id: 3,
    name: 'Bùi Thanh Tùng',
    email: 'tung.bt20@school.edu.vn',
    studentCode: '20200711',
    className: 'K64-HTTT',
    avgScore: 4.50,
    belowPassCount: 2,
    issue: 'Hổng kiến thức Tầng Giao vận & phân đoạn TCP',
  },
])

// Mock Top câu hỏi sai nhiều
const mockMistakeQuestions = [
  {
    index: 18,
    level: 'Vận dụng cao',
    failRate: 68.5,
    question: 'Cho con trỏ int* ptr được cấp phát bằng new int[10]. Nếu thực hiện delete ptr thay vì delete[] ptr thì hiện tượng gì sẽ xảy ra?',
    correctAnswer: 'Undefined Behavior (Hành vi không xác định) và có thể gây rò rỉ bộ nhớ (Memory Leak).',
    explanation: 'Học sinh hay nhầm là trình biên dịch sẽ báo lỗi lúc dịch (Compile Error), nhưng thực tế là lỗi Undefined Behavior tại Runtime.',
  },
  {
    index: 25,
    level: 'Vận dụng',
    failRate: 54.2,
    question: 'Trong mô hình kế thừa đa hình (Polymorphism), từ khóa nào bắt buộc phải có ở hàm thành viên lớp cha để kích hoạt late binding?',
    correctAnswer: 'virtual',
    explanation: 'Nhiều học sinh nhầm lẫn với từ khóa override (override chỉ dùng ở lớp con).',
  },
  {
    index: 12,
    level: 'Thông hiểu',
    failRate: 47.8,
    question: 'Giao thức nào hoạt động tại Tầng Giao vận (Transport Layer) cung cấp dịch vụ truyền dữ liệu tin cậy có kết nối?',
    correctAnswer: 'TCP (Transmission Control Protocol)',
    explanation: 'Khoảng 48% sinh viên phân vân giữa UDP và TCP do đọc đề quá nhanh.',
  },
]

// Actions
const handleRefresh = () => {
  showToast('success', 'Đã làm mới dữ liệu', 'Toàn bộ chỉ số thống kê và biểu đồ đã được cập nhật mới nhất.')
}

const viewSessionDetail = (session: any) => {
  currentSelectedSession.value = session
  isOpenDetailModal.value = true
}

const sendReminder = (student: any) => {
  showToast('success', 'Đã gửi nhắc nhở', `Hệ thống đã gửi email thông báo học vụ đến sinh viên ${student.name} (${student.studentCode}).`)
}

const handleExport = () => {
  isOpenExportModal.value = false
  const formatName = exportFormat.value === 'excel' ? 'Excel (.xlsx)' : 'PDF (.pdf)'
  showToast('success', 'Đang tải xuống báo cáo', `Báo cáo thống kê định dạng ${formatName} đã được tạo thành công!`)
}
</script>

<style scoped>
/* Responsive tweaks if needed */
</style>
