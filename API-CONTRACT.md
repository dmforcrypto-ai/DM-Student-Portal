# Backend contract

This is the list of routes the frontend calls. Build these in Express and the UI
works without any changes. Base URL comes from `VITE_API_URL`.

**Rules that apply everywhere**

- Every response is JSON.
- Errors return `{ "message": "human readable reason" }` with a 4xx/5xx status.
  The UI shows that `message` directly to the user, so write it for a person.
- Protected routes read `Authorization: Bearer <token>`.
- Never include `password` in any user object you send back.
- Dates go out as ISO strings — `res.json()` on a Prisma result already does this.

---

## Auth

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | `{ name, email, password }` | `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |
| GET | `/api/auth/me` | — | `user` |

`user` is `{ id, name, email, role, createdAt }`.

`/api/auth/me` exists because a page refresh wipes React state but not
localStorage. The app sends the saved token and asks "who is this?".

---

## The logged-in student

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/api/me/summary` | `DashboardSummary` |
| GET | `/api/me/courses` | `CourseWithCount[]` |
| GET | `/api/me/grades` | `GradeWithCourse[]` |

`DashboardSummary` is one request that fills the whole dashboard:

```json
{
  "user": { "id": 1, "name": "Ana Reyes", "email": "...", "role": "STUDENT", "createdAt": "..." },
  "courseCount": 5,
  "gradeCount": 4,
  "average": 88,
  "courses": [ { "id": 1, "name": "...", "code": "CS101", "description": null, "createdAt": "...", "studentCount": 34 } ],
  "recentGrades": [ { "id": 9, "grade": 92, "studentId": 1, "courseId": 1, "createdAt": "...", "updatedAt": "...", "course": { "id": 1, "name": "...", "code": "CS101", "description": null, "createdAt": "..." } } ]
}
```

`recentGrades` should be **oldest first** — the dashboard's bar strip reads left
to right, and the "Recently posted" list reverses it. Cap it around 8.

`average` is `null` when the student has no grades yet. The UI prints `—` for
that, so don't send `0`.

---

## Courses

| Method | Path | Body | Returns | Who |
| --- | --- | --- | --- | --- |
| GET | `/api/courses` | — | `CourseWithCount[]` | any signed-in user |
| GET | `/api/courses/:id` | — | `CourseDetail` | any signed-in user |
| GET | `/api/courses/:id/grades` | — | `GradeFull[]` | student: own row only. admin: all rows |
| POST | `/api/courses` | `{ name, code, description? }` | `Course` | admin |
| PATCH | `/api/courses/:id` | partial course | `Course` | admin |
| DELETE | `/api/courses/:id` | — | 204 | admin |
| POST | `/api/courses/:id/enroll` | `{}` or `{ studentId }` | `CourseDetail` | student enrols self. admin can pass `studentId` |
| DELETE | `/api/courses/:id/enroll/:studentId` | — | 204 | student removes self. admin removes anyone |

`CourseWithCount` = course fields + `studentCount: number`.
`CourseDetail` = course fields + `students: User[]` + `studentCount: number`.
`GradeFull` = grade fields + `student: User` + `course: Course`.

The two that need a little Prisma care:

- `studentCount` comes from `_count: { select: { students: true } }`. Prisma
  nests it as `_count.studentCount`, so flatten it before sending — the UI
  expects a plain `studentCount` key.
- Enrolment is the implicit many-to-many `StudentCourses` relation, so you
  connect and disconnect rather than insert a row:
  `students: { connect: { id: studentId } }` / `{ disconnect: { id: studentId } }`.

---

## Grades

| Method | Path | Body | Returns | Who |
| --- | --- | --- | --- | --- |
| POST | `/api/grades` | `{ studentId, courseId, grade }` | `GradeFull` | admin |
| PATCH | `/api/grades/:id` | `{ grade }` | `GradeFull` | admin |
| DELETE | `/api/grades/:id` | — | 204 | admin |

Your schema doesn't stop the same student getting two grades in one course. The
UI assumes one grade per student per course — it picks the first match. Either
add `@@unique([studentId, courseId])` to the `Grade` model, or use `upsert` in
the POST handler.

Worth rejecting on the server: a grade outside 0–100, and a `studentId` who
isn't actually enrolled in that `courseId`.

---

## Students (admin)

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/api/students` | `StudentSummary[]` |
| GET | `/api/students/:id` | `StudentSummary` |

`StudentSummary` = user fields + `courseCount: number` + `average: number | null`.

The average is a per-student mean of their grades. Rounding to a whole number on
the server keeps it consistent with the dashboard.

---

## Order to build them in

1. `register`, `login`, `me` — nothing else works until the token flows.
2. `GET /api/courses` — proves the token, the CORS setup, and the list UI.
3. `POST /api/courses` and enrol/unenrol — first writes.
4. `POST /api/grades` and `PATCH /api/grades/:id`.
5. `GET /api/me/summary` — build it last, it just assembles what you already have.

## CORS

Vite runs on 5173, Express on 5000, so the browser treats them as different
origins. In your server:

```js
app.use(cors({ origin: 'http://localhost:5173' }));
```

Without this every request fails before it reaches your route handler, and the
error in the browser console will mention CORS rather than your code.
