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
import MySessions from '@/views/student/MySessions.vue'
import Results from '@/views/student/Results.vue'
import Profile from '@/views/shared/Profile.vue'
import ChangePassword from '@/views/shared/ChangePassword.vue'
import DetailClass from '@/views/teacher/DetailClass.vue'
import CreateExam from '@/views/teacher/CreateExam.vue'
import CreateExamFile from '@/views/teacher/CreateExamFile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   redirect: '/auth/login',
    // },
    {
      path: '/',
      redirect: '/student/dashboard',
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
          path: 'session-manage',
          name: 'teacher-sessions',
          meta: { title: 'Tổ chức ca thi' },
          component: SessionManage,
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
          path: 'my-sessions',
          name: 'student-sessions',
          meta: { title: 'Ca thi của tôi' },
          component: MySessions,
        },
        {
          path: 'results',
          name: 'student-results',
          meta: { title: 'Kết quả thi' },
          component: Results,
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
  ],
})

router.afterEach(() => {
  const scrollArea = document.getElementById('main-scroll-area')
  if (scrollArea) {
    scrollArea.scrollTop = 0
  }
})

export default router
