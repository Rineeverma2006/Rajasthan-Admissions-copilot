import { Bookmark, GitCompare, MapPin, Building, ChevronRight, Check } from 'lucide-react'
import { College } from '../data/colleges'
import CollegeImage from './CollegeImage'
import { useSaved, useCompare } from '../lib/store'

interface CollegeCardProps {
  college: College
  onSelectDetails?: (college: College) => void
  fit?: 'Likely' | 'Possible' | 'Stretch'
  reasons?: string[]
}

export default function CollegeCard({
  college,
  onSelectDetails,
  fit,
  reasons,
}: CollegeCardProps) {
  const { isSaved, toggle: toggleSaved } = useSaved()
  const { isCompared, toggle: toggleCompared } = useCompare()

  const saved = isSaved(college.id)
  const compared = isCompared(college.id)

  const typeBadgeColor =
    college.type === 'Government'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : college.type === 'Deemed/Autonomous'
      ? 'bg-purple-50 text-purple-800 border-purple-200'
      : 'bg-blue-50 text-blue-800 border-blue-200'

  const fitBadge =
    fit === 'Likely'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : fit === 'Possible'
      ? 'bg-amber-100 text-amber-800 border-amber-300'
      : fit === 'Stretch'
      ? 'bg-rose-100 text-rose-800 border-rose-300'
      : null

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-royal/40 hover:shadow-card-hover">
      {/* Top Image Section */}
      <div className="relative overflow-hidden">
        <CollegeImage
          src={college.image}
          fallbackSrc={college.fallbackImage}
          alt={`${college.name} campus architecture`}
          aspectRatio="video"
          className="transition-transform duration-500 group-hover:scale-105"
        />

        {/* Type & City Badges Overlay */}
        <div className="absolute bottom-2 right-3 z-10"><span className="rounded-md border border-amber-200 bg-amber-100/95 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-950 shadow">Demo data · verify before use</span></div>
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur bg-white/95 shadow-2xs ${typeBadgeColor}`}>
            <Building size={11} /> {college.type}
          </span>
          {fit && (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold shadow-2xs ${fitBadge}`}>
              {fit === 'Likely' && '● Likely Fit'}
              {fit === 'Possible' && '▲ Possible Fit'}
              {fit === 'Stretch' && '◆ Stretch Target'}
            </span>
          )}
        </div>

        {/* Save & Compare Quick Actions Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={() => toggleCompared(college.id)}
            title={compared ? 'Remove from compare' : 'Add to compare'}
            aria-label={`Compare ${college.name}`}
            className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur transition-all ${
              compared
                ? 'bg-royal text-white shadow-md'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-royal shadow-xs'
            }`}
          >
            <GitCompare size={14} />
          </button>
          <button
            type="button"
            onClick={() => toggleSaved(college.id)}
            title={saved ? 'Remove bookmark' : 'Bookmark college'}
            aria-label={`Save ${college.name}`}
            className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur transition-all ${
              saved
                ? 'bg-gold-500 text-white shadow-md'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-gold-600 shadow-xs'
            }`}
          >
            <Bookmark size={14} className={saved ? 'fill-white' : ''} />
          </button>
        </div>

        <div className="absolute bottom-2 left-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-md bg-navy-900/80 px-2 py-0.5 text-[11px] font-medium text-slate-100 backdrop-blur">
            <MapPin size={11} className="text-gold-400" /> {college.city}, Rajasthan
          </span>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg font-bold text-navy-900 group-hover:text-royal transition-colors line-clamp-1">
              {college.name}
            </h3>
            {college.nirfRank && (
              <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                {college.nirfRank}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {college.tagline}
          </p>
        </div>

        {/* Prediction Reasons if present */}
        {reasons && reasons.length > 0 && (
          <div className="my-2.5 rounded-lg bg-slate-50 border border-slate-200/80 p-2.5 text-xs text-slate-700">
            <span className="font-semibold text-navy-900 block mb-1">Match Analysis:</span>
            <ul className="space-y-1">
              {reasons.map((r, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                  <Check size={13} className="text-royal shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Fee & Cutoff Grid */}
        <div className="mt-auto pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block">Illustrative Fee</span>
            <span className="font-bold text-navy-900 text-sm">
              ₹{college.feeSample.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Illustrative Rank</span>
            <span className="font-bold text-royal-700 text-sm">
              ~{college.cutoffSample.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-2.5 py-2 text-[10px] leading-relaxed text-amber-900">Demo profile only. Fees and ranks are not verified REAP cutoffs; confirm admission route and figures with the institution and official REAP portal.</p>

        {/* Branch Chips */}
        <div className="mt-3 flex flex-wrap gap-1">
          {college.branches.slice(0, 3).map(b => (
            <span
              key={b}
              className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {b}
            </span>
          ))}
          {college.branches.length > 3 && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              +{college.branches.length - 3} more
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSelectDetails?.(college)}
            className="btn-p w-full text-xs py-2 group-hover:bg-royal-700"
          >
            View Details <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}
