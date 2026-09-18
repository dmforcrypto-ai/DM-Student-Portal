import { useState } from 'react';
import { useParams } from 'react-router';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import {
  Button,
  CourseCode,
  Empty,
  ErrorNote,
  GradePill,
  Loading,
  Panel,
  average,
} from '../components/ui';

export default function CourseDetailPage() {
  const { id } = useParams();
  const courseId = Number(id);
  const { user, isAdmin } = useAuth();

  const course = useFetch(() => api.courses.get(courseId), [courseId]);
  const grades = useFetch(() => api.courses.grades(courseId), [courseId]);

  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (course.loading) return <Loading />;
  if (course.error) return <ErrorNote message={course.error} onRetry={course.reload} />;
  if (!course.data) return null;

  const detail = course.data;
  const enrolled = detail.students.some((s) => s.id === user?.id);
  const classAverage = average((grades.data ?? []).map((g) => g.grade));

  async function toggleEnrolment() {
    if (!user) return;
    setBusy(true);
    setActionError(null);
    try {
      if (enrolled) await api.courses.unenroll(courseId, user.id);
      else await api.courses.enroll(courseId);
      course.reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not update your enrolment');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-sm border border-(--line) bg-(--surface) px-6 py-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            <CourseCode code={detail.code} />
            <h2 className="display mt-2 text-[28px] font-semibold leading-tight tracking-tight">
              {detail.name}
            </h2>
            {detail.description && (
              <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-(--muted)">
                {detail.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-(--muted)">Class average</p>
              <p className="display figures text-3xl font-semibold">{classAverage ?? '—'}</p>
            </div>
            {!isAdmin && (
              <Button onClick={toggleEnrolment} disabled={busy} variant={enrolled ? 'quiet' : 'solid'}>
                {enrolled ? 'Leave course' : 'Enrol'}
              </Button>
            )}
          </div>
        </div>
        {actionError && <p className="mt-3 text-sm text-(--fail)">{actionError}</p>}
      </header>

      <Panel title={`Roster · ${detail.studentCount}`}>
        {detail.students.length === 0 ? (
          <Empty title="Nobody has enrolled yet" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line) text-left text-(--muted)">
                <th className="px-5 py-2.5 font-medium">Student</th>
                <th className="hidden px-5 py-2.5 font-medium sm:table-cell">Email</th>
                <th className="px-5 py-2.5 text-right font-medium">Grade</th>
                {isAdmin && <th className="px-5 py-2.5" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--line)">
              {detail.students.map((student) => {
                const gradeRow = (grades.data ?? []).find((g) => g.studentId === student.id);
                return (
                  <tr key={student.id}>
                    <td className="px-5 py-3 font-medium">{student.name}</td>
                    <td className="hidden px-5 py-3 text-(--muted) sm:table-cell">
                      {student.email}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {gradeRow ? (
                        <GradePill grade={gradeRow.grade} />
                      ) : (
                        <span className="text-xs text-(--muted)">Not posted</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3 text-right">
                        <GradeEditor
                          courseId={courseId}
                          studentId={student.id}
                          gradeId={gradeRow?.id}
                          current={gradeRow?.grade}
                          onSaved={grades.reload}
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}

/** Inline number input that creates a Grade row, or updates the existing one. */
function GradeEditor({
  courseId,
  studentId,
  gradeId,
  current,
  onSaved,
}: {
  courseId: number;
  studentId: number;
  gradeId?: number;
  current?: number;
  onSaved: () => void;
}) {
  const [value, setValue] = useState(current?.toString() ?? '');
  const [busy, setBusy] = useState(false);

  async function save() {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    setBusy(true);
    try {
      if (gradeId) await api.grades.update(gradeId, parsed);
      else await api.grades.create({ courseId, studentId, grade: parsed });
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Grade"
        className="figures w-16 rounded-sm border border-(--line) px-2 py-1 text-right text-sm"
      />
      <Button variant="quiet" onClick={save} disabled={busy || value === ''}>
        {gradeId ? 'Update' : 'Post'}
      </Button>
    </div>
  );
}
