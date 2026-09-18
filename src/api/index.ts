// Every endpoint the UI uses, in one file.
// This is your to-do list for the backend: build these routes in Express and
// the frontend is done. Nothing else in the app calls fetch directly.

import { request } from './client';
import type {
  AuthResponse,
  Course,
  CourseDetail,
  CourseInput,
  CourseWithCount,
  DashboardSummary,
  GradeFull,
  GradeInput,
  GradeWithCourse,
  LoginPayload,
  RegisterPayload,
  StudentSummary,
  User,
} from '../types';

export const api = {
  auth: {
    login: (payload: LoginPayload) =>
      request<AuthResponse>('/api/auth/login', { method: 'POST', body: payload }),

    register: (payload: RegisterPayload) =>
      request<AuthResponse>('/api/auth/register', { method: 'POST', body: payload }),

    /** Verifies the stored token and returns the logged-in user. */
    me: () => request<User>('/api/auth/me'),
  },

  me: {
    /** Dashboard needs several numbers at once — one round trip instead of four. */
    summary: () => request<DashboardSummary>('/api/me/summary'),

    courses: () => request<CourseWithCount[]>('/api/me/courses'),

    grades: () => request<GradeWithCourse[]>('/api/me/grades'),
  },

  courses: {
    list: () => request<CourseWithCount[]>('/api/courses'),

    get: (id: number) => request<CourseDetail>(`/api/courses/${id}`),

    /** Grades for one course. Students see only their own; admins see all. */
    grades: (id: number) => request<GradeFull[]>(`/api/courses/${id}/grades`),

    create: (payload: CourseInput) =>
      request<Course>('/api/courses', { method: 'POST', body: payload }),

    update: (id: number, payload: Partial<CourseInput>) =>
      request<Course>(`/api/courses/${id}`, { method: 'PATCH', body: payload }),

    remove: (id: number) => request<void>(`/api/courses/${id}`, { method: 'DELETE' }),

    /** Connects a User to a Course on the StudentCourses relation. */
    enroll: (courseId: number, studentId?: number) =>
      request<CourseDetail>(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        body: studentId ? { studentId } : {},
      }),

    unenroll: (courseId: number, studentId: number) =>
      request<void>(`/api/courses/${courseId}/enroll/${studentId}`, { method: 'DELETE' }),
  },

  grades: {
    create: (payload: GradeInput) =>
      request<GradeFull>('/api/grades', { method: 'POST', body: payload }),

    update: (id: number, grade: number) =>
      request<GradeFull>(`/api/grades/${id}`, { method: 'PATCH', body: { grade } }),

    remove: (id: number) => request<void>(`/api/grades/${id}`, { method: 'DELETE' }),
  },

  students: {
    list: () => request<StudentSummary[]>('/api/students'),

    get: (id: number) => request<StudentSummary>(`/api/students/${id}`),
  },
};
