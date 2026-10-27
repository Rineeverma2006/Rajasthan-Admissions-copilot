import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  CheckCircle2,
  Bookmark,
  Sparkles,
  GitCompare,
  ArrowRight,
  RotateCcw,
  Building,
  GraduationCap,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { COLLEGES, College } from '../data/colleges'
import { useSaved, useLocal, useCompare } from '../lib/store'
import CollegeCard from '../components/CollegeCard'
import CollegeModal from '../components/CollegeModal'

const TASKS = [
  { id: 't1', title: 'Review REAP / JEE Main Eligibility Criteria', desc: 'Ensure 45% aggregate in 10+2 with Physics, Mathematics, and one optional subject.' },
  { id: 't2', title: 'Prepare Necessary Certificates & Documents', desc: 'Domicile, 10th/12th marksheet, entrance scorecard, category (OBC/EWS/SC/ST) if applicable.' },
  { id: 't3', title: 'Complete Online Candidate Registration', desc: 'Register with valid email and phone number on the official admission portal.' },
  { id: 't4', title: 'Submit Application & Counselling Fee', desc: 'Pay non-refundable application fee via online net-banking or debit card.' },
  { id: 't5', title: 'Fill & Prioritize College Branch Choices', desc: 'Arrange colleges from dream choices (stretch) down to safe anchor options.' },
  { id: 't6', title: 'Review Seat Allotment Round Results', desc: 'Check seat allotment status and decide between upward movement or seat acceptance.' },
  { id: 't7', title: 'Complete Physical Document Reporting', desc: 'Report to the allotted engineering institute with original documents for verification.' },
]

export default function Dashboard() {
  const { saved, toggle: toggleSaved } = useSaved()
  const { toggle: toggleCompared } = useCompare()
  const [done, setDone] = useLocal<string[]>('rac.tasks', ['t1'])
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)

  const savedColleges = COLLEGES.filter(c => saved.includes(c.id))
  const pct = Math.round((done.length / TASKS.length) * 100)

  const toggleTask = (id: string) => {
    setDone(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const resetTasks = () => setDone([])

  return (
    <div className="space-y-8 pb-12">
      {/* Student Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 p-6 sm:p-8 text-white shadow-xl border border-navy-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-royal text-white shadow-lg border-2 border-white/20">
              <User size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome, Candidate
                </h1>
                <span className="rounded-full bg-gold-400/20 border border-gold-300/30 px-2.5 py-0.5 text-[10px] font-bold uppercase text-gold-300">
                  REAP 2024 Aspirant
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Track your admission journey, check off counselling milestones, and review your shortlisted colleges.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/predictor"
              className="btn-p text-xs py-2.5 px-4 bg-royal hover:bg-royal-600 shadow-md flex items-center gap-1.5"
            >
              <Sparkles size={14} /> Predictor
            </Link>
            <Link
              to="/explore"
              className="btn-s text-xs py-2.5 px-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Browse Colleges
            </Link>
          </div>
        </div>

        {/* Journey Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2 text-slate-200">
              <GraduationCap size={16} className="text-gold-400" />
              Admission Milestone Completion
            </span>
            <span className="text-gold-300 font-bold">{pct}% Completed ({done.length}/{TASKS.length} Steps)</span>
          </div>
          <div
            className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-400 to-amber-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist + Saved Colleges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Admission Journey Checklist */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-heading text-lg font-bold text-navy-900">
                  Admission Journey Checklist
                </h2>
                <p className="text-xs text-slate-500">
                  Essential steps for Rajasthan technical counselling.
                </p>
              </div>
              {done.length > 0 && (
                <button
                  type="button"
                  onClick={resetTasks}
                  className="text-xs font-semibold text-slate-400 hover:text-navy-900 flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            <ul className="mt-4 space-y-3">
              {TASKS.map(t => {
                const isChecked = done.includes(t.id)
                return (
                  <li
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      isChecked
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-slate-200/80 bg-white hover:border-royal/30 hover:bg-slate-50/50'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-royal focus:ring-royal cursor-pointer"
                      />
                      <div className="text-xs">
                        <span
                          className={`font-semibold block ${
                            isChecked
                              ? 'line-through text-slate-400'
                              : 'text-navy-900'
                          }`}
                        >
                          {t.title}
                        </span>
                        <p className="mt-0.5 text-[11px] text-slate-500 leading-normal">
                          {t.desc}
                        </p>
                      </div>
                    </label>
                  </li>
                )
              })}
            </ul>

            {pct === 100 && (
              <div className="mt-4 rounded-xl bg-emerald-100/70 border border-emerald-300 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Congratulations! You have completed all counselling stages.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Saved Colleges Gallery */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-navy-900">
                Shortlisted Colleges ({savedColleges.length})
              </h2>
              <p className="text-xs text-slate-500">
                Colleges you have bookmarked for priority consideration.
              </p>
            </div>
            {savedColleges.length > 0 && (
              <Link to="/compare" className="btn-s text-xs py-1.5 px-3">
                <GitCompare size={13} /> Compare All
              </Link>
            )}
          </div>

          {savedColleges.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card space-y-3">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <Bookmark size={26} />
              </div>
              <h3 className="font-heading text-base font-bold text-navy-900">
                No Colleges Saved Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Click the bookmark icon on any college card in Explore or Predictor to save it here for quick access.
              </p>
              <Link to="/explore" className="btn-p text-xs py-2 px-4 inline-flex items-center gap-1.5 mt-2">
                Explore Colleges Now <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {savedColleges.map(c => (
                <CollegeCard
                  key={c.id}
                  college={c}
                  onSelectDetails={col => setSelectedCollege(col)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* College Modal */}
      <CollegeModal
        college={selectedCollege}
        onClose={() => setSelectedCollege(null)}
      />
    </div>
  )
}
