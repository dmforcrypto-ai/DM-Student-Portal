import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import { Button, CourseCode, Empty, ErrorNote, Field, Loading, Panel } from '../components/ui';
import type { CourseWithCount } from '../types';

export default function CoursesPage() {
  const { isAdmin } = useAuth();
  const { data, loading, error, reload } = useFetch(() => api.courses.list(), []);
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);

  const courses = useMemo(() => {
    const all: CourseWithCount[] = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
    );
  }, [data, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-55 flex-1">
          <Field
            label="Find a course"
            placeholder="Name or code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {isAdmin && (
          <Button onClick={() => setCreating((v) => !v)} variant={creating ? 'quiet' : 'solid'}>
            {creating ? 'Cancel' : 'New course'}
          </Button>
        )}
      </div>

      {creating && <CreateCourseForm onDone={() => { setCreating(false); reload(); }} />}

      <Panel title={`${courses.length} course${courses.length === 1 ? '' : 's'}`}>
        {loading && <Loading />}
        {error && <ErrorNote message={error} onRetry={reload} />}
        {!loading && !error && courses.length === 0 && (
          <Empty title="No courses match that search" />
        )}
        {!loading && !error && courses.length > 0 && (
          <ul className="divide-y divide-(--line)">
            {courses.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/courses/${c.id}`}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-4 hover:bg-(--canvas)"
                >
                  <CourseCode code={c.code} />
                  <span className="text-sm font-medium">{c.name}</span>
                  <span className="figures ml-auto text-xs text-(--muted)">
                    {c.studentCount} enrolled
                  </span>
                  {c.description && (
                    <p className="w-full max-w-[70ch] text-sm leading-relaxed text-(--muted)">
                      {c.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function CreateCourseForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({ name: '', code: '', description: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await api.courses.create({
        name: form.name,
        code: form.code,
        description: form.description || undefined,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the course');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel title="Add a course">
      <form
        className="space-y-4 px-5 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Course name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Field
            label="Course code"
            hint="Must be unique — your schema enforces it."
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />
        </div>
        <Field
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {error && <p className="text-sm text-(--fail)">{error}</p>}
        <Button type="submit" disabled={busy}>
          {busy ? 'Saving' : 'Save course'}
        </Button>
      </form>
    </Panel>
  );
}
