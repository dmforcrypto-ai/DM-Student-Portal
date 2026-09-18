// Types that mirror your Prisma schema.
// Dates arrive over JSON as strings, not Date objects — that's why they're `string`.

export type Role = 'STUDENT' | 'ADMIN';

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  // never send `password` to the frontend
};

export type Course = {
  id: number;
  name: string;
  code: string;
  description: string | null;
  createdAt: string;
};

export type Grade = {
  id: number;
  grade: number;
  studentId: number;
  courseId: number;
  createdAt: string;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// Response shapes the UI expects. These are Prisma models plus the relations
// you `include`. Keep your Express responses matching these and the UI works.
// ---------------------------------------------------------------------------

/** A course with how many students are enrolled. Used on the course list. */
export type CourseWithCount = Course & {
  studentCount: number;
};

/** A course with the enrolled students. Used on the course detail page. */
export type CourseDetail = Course & {
  students: User[];
  studentCount: number;
};

/** A grade with the course attached. Used on the student's grade list. */
export type GradeWithCourse = Grade & {
  course: Course;
};

/** A grade with the student attached. Used on the admin grade table. */
export type GradeWithStudent = Grade & {
  student: User;
};

/** A grade with both sides attached. Used on the course detail page. */
export type GradeFull = Grade & {
  student: User;
  course: Course;
};

/** A student plus their enrolment/grade counts. Used on the admin student list. */
export type StudentSummary = User & {
  courseCount: number;
  average: number | null;
};

/** Everything the dashboard needs, in one request. */
export type DashboardSummary = {
  user: User;
  courseCount: number;
  gradeCount: number;
  average: number | null;
  courses: CourseWithCount[];
  recentGrades: GradeWithCourse[];
};

// --- Auth ---

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };
export type AuthResponse = { token: string; user: User };

// --- Write payloads ---

export type CourseInput = { name: string; code: string; description?: string };
export type GradeInput = { studentId: number; courseId: number; grade: number };
