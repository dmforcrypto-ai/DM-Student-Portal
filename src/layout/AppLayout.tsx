import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { to: '/', label: 'Overview', end: true },
  { to: '/courses', label: 'Courses' },
  { to: '/grades', label: 'Grades' },
];

const adminLinks = [
  { to: '/', label: 'Overview', end: true },
  { to: '/courses', label: 'Courses' },
  { to: '/students', label: 'Students' },
];

export default function AppLayout() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="min-h-full md:grid md:grid-cols-[232px_1fr]">
      {/* Sidebar — the spine of the portal. Fixed on desktop, a drawer on phones. */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-58 bg-(--ink) text-white/90 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-6">
          <p className="display text-[22px] font-semibold leading-none text-white">Registrar</p>
          <p className="mt-1.5 text-xs text-white/55">DM University Student portal</p>
        </div>

        <nav className="px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-sm px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/65 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 px-5 py-4">
          <p className="truncate text-sm text-white">{user?.name}</p>
          <p className="truncate text-xs text-white/50">{user?.email}</p>
          <button
            onClick={logout}
            className="mt-2.5 text-xs font-medium text-white/70 underline underline-offset-4 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="min-w-0">
        <header className="flex items-center gap-3 border-b border-(--line) bg-(--surface) px-4 py-3 md:px-8">
          <button
            onClick={() => setOpen(true)}
            className="rounded-sm border border-(--line) px-2.5 py-1.5 text-sm md:hidden"
            aria-label="Open navigation"
          >
            Menu
          </button>
          <h1 className="text-[15px] font-semibold tracking-tight">
            {titleFor(location.pathname, isAdmin)}
          </h1>
          <span className="ml-auto rounded-sm bg-(--brass-soft) px-2 py-1 text-xs font-medium text-(--brass)">
            {isAdmin ? 'Administrator' : 'Student'}
          </span>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function titleFor(path: string, isAdmin: boolean): string {
  if (path.startsWith('/courses/')) return 'Course';
  if (path.startsWith('/courses')) return 'Courses';
  if (path.startsWith('/grades')) return 'Grades';
  if (path.startsWith('/students')) return 'Students';
  return isAdmin ? 'Overview' : 'My term';
}
