import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Compass,
  Menu,
  X,
  User,
  GitCompare,
  Bookmark,
  Sparkles,
  Search,
  MessageSquare,
  Home,
} from 'lucide-react'
import { useSaved, useCompare } from '../lib/store'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { saved } = useSaved()
  const { compared } = useCompare()
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore Colleges', icon: Search },
    { to: '/predictor', label: 'Predictor', icon: Sparkles },
    { to: '/compare', label: 'Compare', icon: GitCompare, badge: compared.length > 0 ? compared.length : undefined },
    { to: '/assistant', label: 'Chatbot', icon: MessageSquare },
  ]

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand / Logo */}
        <Link
          to="/"
          onClick={closeMobile}
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal rounded-lg"
          aria-label="Rajasthan Admission Copilot Home"
        >
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-gold-400 shadow-md transition-transform duration-200 group-hover:scale-105">
            <Compass size={22} className="stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gold-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-navy-900 group-hover:text-royal transition-colors">
                Rajasthan Admission Copilot
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-gold-50 border border-gold-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-800">
                REAP 2024
              </span>
            </div>
            <p className="hidden xs:block text-[11px] font-medium text-slate-500">
              Technical Admissions & Counseling Guidance
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Desktop Navigation">
          {navLinks.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-royal-50 text-royal-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
                }`
              }
            >
              <Icon size={15} />
              <span>{label}</span>
              {badge !== undefined && (
                <span className="grid h-4 w-4 place-items-center rounded-full bg-royal text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Icons (Saved & Profile) */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            to="/dashboard"
            className={`relative flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              location.pathname === '/dashboard'
                ? 'border-royal bg-royal-50 text-royal-700'
                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
            title="Saved Colleges & Checklist"
          >
            <Bookmark size={14} className={saved.length > 0 ? 'fill-gold-500 text-gold-500' : ''} />
            <span>Saved</span>
            {saved.length > 0 && (
              <span className="rounded-full bg-gold-100 px-1.5 py-0.2 text-[10px] font-bold text-gold-800">
                {saved.length}
              </span>
            )}
          </Link>

          <Link
            to="/dashboard"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:border-royal hover:bg-royal-50 hover:text-royal transition-all"
            title="Student Profile / Dashboard"
            aria-label="Student Profile"
          >
            <User size={16} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/dashboard"
            className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label="Saved Colleges"
          >
            <Bookmark size={16} className={saved.length > 0 ? 'fill-gold-500 text-gold-500' : ''} />
            {saved.length > 0 && (
              <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                {saved.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-navy-900"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pt-3 pb-5 md:hidden animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'bg-royal text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
                {badge !== undefined && (
                  <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-white">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/dashboard"
                onClick={closeMobile}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-royal"
              >
                <User size={16} />
                <span>Student Dashboard & Saved</span>
              </Link>
              {saved.length > 0 && (
                <span className="tag">{saved.length} colleges saved</span>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
