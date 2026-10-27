import { X, MapPin, Building, GraduationCap, Award, CheckCircle2, Bookmark, GitCompare, ExternalLink } from 'lucide-react'
import { College } from '../data/colleges'
import CollegeImage from './CollegeImage'
import { useSaved, useCompare } from '../lib/store'

interface CollegeModalProps {
  college: College | null
  onClose: () => void
}

export default function CollegeModal({ college, onClose }: CollegeModalProps) {
  const { isSaved, toggle: toggleSaved } = useSaved()
  const { isCompared, toggle: toggleCompared } = useCompare()

  if (!college) return null

  const saved = isSaved(college.id)
  const compared = isCompared(college.id)

  const typeColor =
    college.type === 'Government'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : college.type === 'Deemed/Autonomous'
      ? 'bg-purple-50 text-purple-800 border-purple-200'
      : 'bg-blue-50 text-blue-800 border-blue-200'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-college-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200/80 p-0 text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative">
          <CollegeImage
            src={college.image}
            fallbackSrc={college.fallbackImage}
            alt={`${college.name} campus building`}
            aspectRatio="wide"
            className="w-full"
          />
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-3.5 top-3.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-navy-900/70 text-white backdrop-blur hover:bg-navy-900 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur bg-white/95 ${typeColor}`}>
              <Building size={12} /> {college.type}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-navy-900/90 text-white px-2.5 py-0.5 text-xs font-medium backdrop-blur">
              <MapPin size={12} className="text-gold-400" /> {college.city}, Rajasthan
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="modal-college-title" className="text-2xl font-bold text-navy-900">
                {college.name}
              </h2>
              {college.nirfRank && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-700 bg-gold-50 border border-gold-200 px-2.5 py-1 rounded-md">
                  <Award size={13} /> {college.nirfRank}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{college.tagline}</p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3">
              <span className="text-xs text-slate-500 font-medium block">Sample Annual Fee</span>
              <span className="text-base font-bold text-navy-900">₹{college.feeSample.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block">/ academic year</span>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3">
              <span className="text-xs text-slate-500 font-medium block">Sample Cutoff Rank</span>
              <span className="text-base font-bold text-royal-700">~{college.cutoffSample.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block">General closing</span>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3">
              <span className="text-xs text-slate-500 font-medium block">Established</span>
              <span className="text-base font-bold text-slate-800">{college.established}</span>
              <span className="text-[10px] text-slate-400 block">{new Date().getFullYear() - college.established}+ yrs legacy</span>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3">
              <span className="text-xs text-slate-500 font-medium block">Campus Area</span>
              <span className="text-base font-bold text-slate-800">{college.campusSize}</span>
              <span className="text-[10px] text-slate-400 block">Green campus</span>
            </div>
          </div>

          {/* Branches Offered */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <GraduationCap size={15} className="text-royal" /> Engineering Branches Offered
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {college.branches.map(b => (
                <span
                  key={b}
                  className="rounded-lg bg-royal-50 border border-royal-200/70 px-3 py-1 text-xs font-semibold text-royal-800"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {college.highlights && college.highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                <CheckCircle2 size={15} className="text-emerald-600" /> Key Highlights & Facilities
              </h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {college.highlights.map(h => (
                  <li key={h} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-600" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Source Disclaimer */}
          <div className="rounded-lg bg-amber-50/70 border border-amber-200/80 p-3 text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">Note on Admission Data:</span>
            All cutoff and fee figures shown are illustrative benchmark samples ({college.year}). Candidates must consult official REAP (reap2024.com) / DTE Rajasthan announcements and individual college brochures for final seat matrix and counselling schedules.
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSaved(college.id)}
                className={`btn-s text-xs py-2 ${
                  saved ? 'bg-gold-50 border-gold-300 text-gold-900' : ''
                }`}
              >
                <Bookmark size={15} className={saved ? 'fill-gold-600 text-gold-600' : ''} />
                {saved ? 'Saved' : 'Save College'}
              </button>
              <button
                type="button"
                onClick={() => toggleCompared(college.id)}
                className={`btn-s text-xs py-2 ${
                  compared ? 'bg-royal-50 border-royal-300 text-royal-700' : ''
                }`}
              >
                <GitCompare size={15} />
                {compared ? 'In Comparison' : 'Add to Compare'}
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-p text-xs py-2 px-5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
