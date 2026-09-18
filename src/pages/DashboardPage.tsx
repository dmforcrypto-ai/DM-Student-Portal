import { Link } from 'react-router';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import {
  CourseCode,
  Empty,
  ErrorNote,
  GradePill,
  Loading,
  Panel,
  bandFor,
  letterFor,
} from '../components/ui';
import type { DashboardSummary } from '../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch<DashboardSummary>(
    () => api.me.summary(),
    [],
  );

  if (loading) return <Loading label="Loading your term" />;
  if (error) return <ErrorNote message={error} onRetry={reload} />;
  if (!data) return null;

  const { average, courseCount, gradeCount, courses, recentGrades } = data;

  return (
    <div className="space-y-6">
      {/* Hero: the one number a student actually opens this portal to see. */}
      <section className="rounded-sm border border-(--line) bg-(--surface) px-6 py-7 md:px-8">
        <p className="text-sm text-(--muted)">
          Good to see you, {user?.name.split(' ')[0]}.
        </p>

        <div className="mt-5 flex flex-wrap items-end gap-x-10 gap-y-6">
          <div>
            <p className="display figures text-[76px] font-semibold leading-[0.85] tracking-tight">
              {average ?? '—'}
            </p>
            <p className="mt-2.5 text-sm text-(--muted)">
              {average === null
                ? 'No grades posted yet'
                : `Term average · ${letterFor(average)}`}
            </p>
          </div>

          <dl className="flex gap-10 pb-2">
            <div>
              <dt className="text-sm text-(--muted)">Enrolled</dt>
              <dd className="figures mt-1 text-2xl font-semibold">{courseCount}</dd>
            </div>
            <div>
              <dt className="text-sm text-(--muted)">Grades posted</dt>
              <dd className="figures mt-1 text-2xl font-semibold">{gradeCount}</dd>
            </div>
          </dl>
        </div>

        {/* Ledger strip: one bar per graded course, in course order. */}
        {recentGrades.length > 0 && (
          <div className="mt-7 border-t border-(--line) pt-5">
            <div className="flex items-end gap-1.5" style={{ height: 64 }}>
              {recentGrades.map((g) => (
                <div
                  key={g.id}
                  title={`${g.course.code} — ${g.grade}`}
                  className="min-w-2.5 flex-1 rounded-t-xs"
                  style={{
                    height: `${Math.max(g.grade, 5)}%`,
                    backgroundColor: `var(--${bandFor(g.grade)})`,
                    opacity: 0.85,
                  }}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-(--muted)">
              Each bar is one posted grade, newest on the right.
            </p>
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Your courses"
          action={
            <Link to="/courses" className="text-sm underline underline-offset-4">
              All courses
            </Link>
          }
        >
          {courses.length === 0 ? (
            <Empty title="You aren't enrolled in anything yet">
              <Link to="/courses" className="underline underline-offset-4">
                Browse the catalog
              </Link>
            </Empty>
          ) : (
            <ul className="divide-y divide-(--line)">
              {courses.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/courses/${c.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-(--canvas)"
                  >
                    <CourseCode code={c.code} />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.name}</span>
                    <span className="figures text-xs text-(--muted)">
                      {c.studentCount} enrolled
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recently posted">
          {recentGrades.length === 0 ? (
            <Empty title="Nothing posted yet">
              Grades appear here as soon as an instructor records them.
            </Empty>
          ) : (
            <ul className="divide-y divide-(--line)">
              {[...recentGrades].reverse().map((g) => (
                <li key={g.id} className="flex items-center gap-3 px-5 py-3.5">
                  <CourseCode code={g.course.code} />
                  <span className="min-w-0 flex-1 truncate text-sm">{g.course.name}</span>
                  <GradePill grade={g.grade} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
