import { createRouter, createWebHistory } from 'vue-router'

import TeacherLayout from '@/layouts/TeacherLayout.vue'
import StudentLayout from '@/layouts/StudentLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import DashboardTeacher from '@/views/teacher/Dashboard.vue'
import ClassManage from '@/views/teacher/ClassManage.vue'
import ExamManage from '@/views/teacher/ExamManage.vue'
import Reports from '@/views/teacher/Reports.vue'
import SessionManage from '@/views/teacher/SessionManage.vue'
import DashboardStudent from '@/views/student/Dashboard.vue'
import JoinClass from '@/views/student/JoinClass.vue'
import ClassDetailStudent from '@/views/student/ClassDetail.vue'
import MySessions from '@/views/student/MySessions.vue'
import Results from '@/views/student/Results.vue'
import ResultDetail from '@/views/student/ResultDetail.vue'
import Profile from '@/views/shared/Profile.vue'
import ChangePassword from '@/views/shared/ChangePassword.vue'
import DetailClass from '@/views/teacher/DetailClass.vue'
import ExamDetail from '@/views/teacher/ExamDetail.vue'
import CreateExam from '@/views/teacher/CreateExam.vue'
import CreateExamFile from '@/views/teacher/CreateExamFile.vue'
import CreateExamQuestion from '@/views/teacher/CreateExamQuestion.vue'
import TakeExam from '@/views/student/TakeExam.vue'
import SessionFollow from '@/views/teacher/SessionFollow.vue'
import QuestionBank from '@/views/teacher/QuestionBank.vue'
import SessionPrepare from '@/views/student/SessionPrepare.vue'
import AdminLogin from '@/views/auth/AdminLogin.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import DashboardAdmin from '@/views/admin/DashboardAdmin.vue'
import UsersManage from '@/views/admin/UsersManage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },

    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login,
        },
        {
          path: 'register',
          name: 'register',
          component: Register,
        },
      ],
    },
    {
      path: '/auth/system-admin/login',
      name: 'admin-login',
      component: AdminLogin,
    },
    {
      path: '/teacher',
      component: TeacherLayout,
      children: [
        {
          path: 'dashboard',
          name: 'teacher-dashboard',
          meta: { title: 'Tổng quan' },
          component: DashboardTeacher,
        },
        {
          path: 'class-manage',
          name: 'teacher-classes',
          meta: { title: 'Quản lý lớp học' },
          component: ClassManage,
        },
        {
          path: 'question-bank',
          name: 'teacher-question-bank',
          meta: { title: 'Ngân hàng câu hỏi' },
          component: QuestionBank,
        },
        {
          path: 'class-manage/:id',
          name: 'teacher-class-detail',
          meta: { title: 'Chi tiết lớp học' },
          component: DetailClass,
        },
        {
          path: 'exam-manage',
          name: 'teacher-exams',
          meta: { title: 'Quản lý đề thi' },
          component: ExamManage,
        },
        {
          path: 'exam-manage/create-exam',
          meta: { title: 'Tạo đề thi thủ công' },
          component: CreateExam,
        },
        {
          path: 'exam-manage/create-exam-file',
          meta: { title: 'Tạo đề thi từ file' },
          component: CreateExamFile,
        },
        {
          path: 'exam-manage/create-exam-question',
          name: 'teacher-create-exam-question',
          meta: { title: 'Tạo đề thi từ ngân hàng câu hỏi' },
          component: CreateExamQuestion,
        },
        {
          path: 'exam-manage/:id',
          name: 'teacher-exam-detail',
          meta: { title: 'Chi tiết đề thi' },
          component: ExamDetail,
        },
        {
          path: 'session-manage',
          name: 'teacher-sessions',
          meta: { title: 'Tổ chức ca thi' },
          component: SessionManage,
        },
        {
          path: 'session-manage/:id',
          name: 'teacher-session-follow',
          meta: { title: 'Theo dõi ca thi' },
          component: SessionFollow,
        },
        {
          path: 'reports',
          name: 'teacher-reports',
          meta: { title: 'Báo cáo thống kê' },
          component: Reports,
        },
        {
          path: 'profile',
          name: 'teacher-profile',
          meta: { title: 'Tài khoản' },
          component: Profile,
        },
        {
          path: 'change-password',
          name: 'teacher-password',
          meta: { title: 'Đổi mật khẩu' },
          component: ChangePassword,
        },
      ],
    },
    {
      path: '/student',
      component: StudentLayout,
      children: [
        {
          path: 'dashboard',
          name: 'student-dashboard',
          meta: { title: 'Tổng quan' },
          component: DashboardStudent,
        },
        {
          path: 'join-class',
          name: 'student-classes',
          meta: { title: 'Tham gia lớp học' },
          component: JoinClass,
        },
        {
          path: 'join-class/:id',
          name: 'student-class-detail',
          meta: { title: 'Chi tiết lớp học' },
          component: ClassDetailStudent,
        },
        {
          path: 'my-sessions',
          name: 'student-sessions',
          meta: { title: 'Ca thi của tôi' },
          component: MySessions,
        },
        {
          path: 'my-sessions/:id',
          name: 'student-session-prepare',
          component: SessionPrepare,
        },
        {
          path: 'results',
          name: 'student-results',
          meta: { title: 'Kết quả thi' },
          component: Results,
        },
        {
          path: 'results/:id',
          name: 'student-result-detail',
          meta: { title: 'Chi tiết bài thi' },
          component: ResultDetail,
        },
        {
          path: 'profile',
          name: 'student-profile',
          meta: { title: 'Tài khoản' },
          component: Profile,
        },
        {
          path: 'change-password',
          name: 'student-password',
          meta: { title: 'Đổi mật khẩu' },
          component: ChangePassword,
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          meta: { title: 'Tổng quan' },
          component: DashboardAdmin,
        },
        {
          path: 'users',
          name: 'admin-users',
          meta: { title: 'Quản lý người dùng' },
          component: UsersManage,
        },
      ],
    },
    {
      path: '/student/take-exam/:id',
      name: 'student-take-exam',
      component: TakeExam,
    },
  ],
})

router.beforeEach((to, from, next) => {
  // lấy thông tin user và token từ localstorage
  const token = localStorage.getItem('token')
  const userString = localStorage.getItem('user')
  // chuyển string thành obj bằng parse
  const user = userString ? JSON.parse(userString) : null
  // publicPages: mảng định nghĩa các đường dẫn công khai khoong cần đăng nhập đăng ký
  const publicPages = ['/auth/login', '/auth/register', '/auth/system-admin/login']
  // to : đối tượng chứa thông tin trang đích mà người dùng muốn tới
  // authRequired: biến cờ boolean
  // .includes(to.path) : kiểm tra xem đường dẫn đích có nằm trong mảng ngoại lệ không
  // => nếu đường dẫn đích không nằm trong mảng publicPages thì authRequired = true (buộc phải có token ( đăng nhập ) mới được vào trang đó)
  const authRequired = !publicPages.includes(to.path)
  // nếu chưa đăng nhập mà vẫn truy cập vào các trang cần đăng nhập -> chuyển hướng về trang login
  if (authRequired && !token) {
    if (to.path.startsWith('/admin')) {
      return next('/auth/system-admin/login')
    }
    return next('/auth/login')
  }
  // nếu đăng nhập rồi mà vẫn cố truy cập lại trang login và register -> chuyển hướng về trang dashboard
  if (!authRequired && token && user) {
    if (user.role === 'admin') return next('/admin/dashboard')
    if (user.role === 'teacher') return next('/teacher/dashboard')
    if (user.role === 'student') return next('/student/dashboard')
  }
  // phân quyền
  // nếu ng dùng muốn truy cập vào các trang cần đăng nhập mới vào được, và đã đăng nhập rồi
  if (authRequired && user && user.role) {
    const role = user.role
     if (to.path.startsWith('/admin') && role !== 'admin') {
      return next(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')
    }
    if (to.path.startsWith('/teacher') && role !== 'teacher') {
      return next(role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
    }
    if (to.path.startsWith('/student') && role !== 'student') {
      return next(role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard')

    }
   
  }
  if (to.meta.title) {
    document.title = `${to.meta.title} | OnlineQuizz`
  } else {
    document.title = 'OnlineQuizz'
  }
  next()
})

router.afterEach(() => {
  const scrollArea = document.getElementById('main-scroll-area')
  if (scrollArea) {
    scrollArea.scrollTop = 0
  }
})

export default router
