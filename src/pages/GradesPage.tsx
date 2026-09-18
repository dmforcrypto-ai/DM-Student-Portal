import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import {
  CourseCode,
  Empty,
  ErrorNote,
  GradePill,
  Loading,
  Panel,
  average,
  letterFor,
} from '../components/ui';

export default function GradesPage() {
  const { data, loading, error, reload } = useFetch(() => api.me.grades(), []);

  if (loading) return <Loading label="Loading your grades" />;
  if (error) return <ErrorNote message={error} onRetry={reload} />;

  const grades = data ?? [];
  const avg = average(grades.map((g) => g.grade));

  return (
    <div className="space-y-6">
      <Panel
        title="Transcript"
        action={
          avg !== null ? (
            <span className="figures text-sm text-(--muted)">
              Average {avg} · {letterFor(avg)}
            </span>
          ) : undefined
        }
      >
        {grades.length === 0 ? (
          <Empty title="No grades on record">
            Once an instructor posts a mark it shows up here.
          </Empty>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line) text-left text-(--muted)">
                <th className="px-5 py-2.5 font-medium">Course</th>
                <th className="hidden px-5 py-2.5 font-medium sm:table-cell">Last updated</th>
                <th className="px-5 py-2.5 text-right font-medium">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--line)">
              {grades.map((g) => (
                <tr key={g.id}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <CourseCode code={g.course.code} />
                      <span className="font-medium">{g.course.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-(--muted) sm:table-cell">
                    {new Date(g.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <GradePill grade={g.grade} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
