import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Bird,
  Package,
  MapPin,
  Image,
  BookOpen,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { logoutThunk } from '../../store/slice/authSlice';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/admin/hero',      label: 'Hero Section',  icon: Image           },
  { to: '/admin/story',     label: 'My Story',      icon: BookOpen        },
  { to: '/admin/service',   label: 'Services',      icon: Package         },
  { to: '/admin/coverage',  label: 'Coverage',      icon: MapPin          },
  { to: '/admin/gallery',   label: 'Gallery',       icon: Bird            },
  { to: '/admin/contact',   label: 'User Messages', icon: MessageSquare   },
  { to: '/admin/users',     label: 'Users',         icon: Users           },
];

const AdminSidebar = () => {
  const dispatch  = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const navContent = (
    <>
      {/* Brand */}
      <div className="px-6 py-7 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-[#8aab84] uppercase mb-0.5">
            Kitui · Makueni · Est. 2019
          </p>
          <span className="font-serif text-lg text-white">
            Ken Mutua <span className="text-[#6db56d]">Farms</span>
          </span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden text-[#8aab84] hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                isActive
                  ? 'bg-[#2d5a27] text-white'
                  : 'text-[#a0b89a] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-5 border-t border-white/10">
        <button
          onClick={() => dispatch(logoutThunk())}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm text-[#a0b89a] hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar — sticky ── */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#1a2e1a] sticky top-0 h-screen">
        {navContent}
      </aside>

      {/* ── Mobile hamburger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-40 text-[#1a2e1a] p-1"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* ── Mobile backdrop ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-[#1a2e1a] flex flex-col z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
};

export default AdminSidebar;