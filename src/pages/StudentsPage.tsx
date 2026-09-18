import { useMemo, useState } from 'react';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import { Empty, ErrorNote, Field, GradePill, Loading, Panel } from '../components/ui';

export default function StudentsPage() {
  const { data, loading, error, reload } = useFetch(() => api.students.list(), []);
  const [query, setQuery] = useState('');

  const students = useMemo(() => {
    const all = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q),
    );
  }, [data, query]);

  return (
    <div className="space-y-6">
      <div className="max-w-[320px]">
        <Field
          label="Find a student"
          placeholder="Name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Panel title={`${students.length} student${students.length === 1 ? '' : 's'}`}>
        {loading && <Loading />}
        {error && <ErrorNote message={error} onRetry={reload} />}
        {!loading && !error && students.length === 0 && <Empty title="No students match" />}
        {!loading && !error && students.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line) text-left text-(--muted)">
                <th className="px-5 py-2.5 font-medium">Name</th>
                <th className="hidden px-5 py-2.5 font-medium md:table-cell">Email</th>
                <th className="px-5 py-2.5 text-right font-medium">Courses</th>
                <th className="px-5 py-2.5 text-right font-medium">Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--line)">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3.5">
                    <span className="font-medium">{s.name}</span>
                    {s.role === 'ADMIN' && (
                      <span className="ml-2 rounded-sm bg-(--brass-soft) px-1.5 py-0.5 text-[11px] font-medium text-(--brass)">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="hidden px-5 py-3.5 text-(--muted) md:table-cell">
                    {s.email}
                  </td>
                  <td className="figures px-5 py-3.5 text-right">{s.courseCount}</td>
                  <td className="px-5 py-3.5 text-right">
                    {s.average === null ? (
                      <span className="text-xs text-(--muted)">—</span>
                    ) : (
                      <GradePill grade={s.average} />
                    )}
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
