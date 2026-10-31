import { useState } from 'react'
import { Sparkles, SlidersHorizontal, AlertCircle, Info, RotateCcw, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react'
import { COLLEGES, College } from '../data/colleges'
import { recommend, Result } from '../lib/predict'
import CollegeCard from '../components/CollegeCard'
import CollegeModal from '../components/CollegeModal'

const cities = [...new Set(COLLEGES.map(c => c.city))].sort()

type LivePrediction = { results: Array<{ id: number; college_name: string; city: string; branch: string; annual_fee: number | null; cutoff_rank: number; cutoff_year: number; counselling: string; source_url: string; verified_at: string | null; fit: 'Likely' | 'Possible' | 'Stretch' | 'Historical reference'; note: string }>; count: number; dataStatus: string; disclaimer: string }

export default function Predictor() {
  const [f, setF] = useState({
    rank: '',
    branch: 'CSE',
    city: '',
    budget: '300000',
  })
  const [err, setErr] = useState('')
  const [res, setRes] = useState<Result[] | null>(null)
  const [liveResults, setLiveResults] = useState<LivePrediction | null>(null)
  const [liveError, setLiveError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const rank = Number(f.rank)
    if (!f.rank || !Number.isInteger(rank) || rank < 1) {
      setErr('Please enter a valid entrance rank (whole number of 1 or greater).')
      setRes(null)
      setLiveResults(null)
      return
    }
    setErr('')
    setLiveError('')
    setLoading(true)
    setRes(null)
    setLiveResults(null)
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rank, branch: f.branch, city: f.city, budget: Number(f.budget), counselling: 'REAP' })
      })
      const data = await response.json() as LivePrediction & { error?: string }
      if (!response.ok) throw new Error(data.error || 'Unable to retrieve live database results.')
      setLiveResults(data)
    } catch (error) {
      setLiveError(error instanceof Error ? error.message : 'Prediction request failed.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreset = (presetRank: string, branch: string, budget: string) => {
    setF({ rank: presetRank, branch, city: '', budget })
    setErr('')
    setRes(null)
    setLiveResults(null)
    setLiveError('')
  }

  const handleReset = () => {
    setF({ rank: '', branch: 'CSE', city: '', budget: '300000' })
    setErr('')
    setRes(null)
    setLiveResults(null)
    setLiveError('')
  }

  const likelyCount = res ? res.filter(r => r.fit === 'Likely').length : 0
  const possibleCount = res ? res.filter(r => r.fit === 'Possible').length : 0
  const stretchCount = res ? res.filter(r => r.fit === 'Stretch').length : 0

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="tag mb-2">Rank-Aware Decision Engine</span>
        <h1 className="font-heading text-3xl font-extrabold text-navy-900 tracking-tight">
          Rajasthan College Predictor
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl">
          Compare your details against available historical REAP records. Results marked “Historical reference” are not verified closing ranks or current-year admission predictions.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Preferences */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-royal-50 text-royal">
                  <SlidersHorizontal size={16} />
                </div>
                <h2 className="font-heading text-base font-bold text-navy-900">
                  Student Details & Criteria
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-navy-900 flex items-center gap-1"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
              {/* Entrance Rank */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Entrance Rank (JEE Main / REAP Merit) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className={`inp text-base font-semibold ${err ? 'border-rose-300 focus:ring-rose-200' : ''}`}
                    placeholder="e.g. 15000"
                    inputMode="numeric"
                    value={f.rank}
                    onChange={e => {
                      setF({ ...f, rank: e.target.value })
                      if (err) setErr('')
                    }}
                    aria-invalid={!!err}
                    aria-describedby={err ? 'rank-error' : undefined}
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-medium text-slate-400 pointer-events-none">
                    Rank #
                  </span>
                </div>
                {err && (
                  <p id="rank-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                    <AlertCircle size={13} /> {err}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-slate-400">
                  Enter your expected or overall all-India / state merit rank.
                </p>
              </div>

              {/* Preferred Branch */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Target Engineering Branch
                </label>
                <select
                  className="inp"
                  value={f.branch}
                  onChange={e => setF({ ...f, branch: e.target.value })}
                >
                  <option value="">Any Branch (All Disciplines)</option>
                  {['CSE', 'ECE', 'Mechanical', 'Civil', 'Electrical'].map(b => (
                    <option key={b} value={b}>
                      {b} — {b === 'CSE' ? 'Computer Science & Engg' : b === 'ECE' ? 'Electronics & Comm.' : b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Preferred City / Region
                </label>
                <select
                  className="inp"
                  value={f.city}
                  onChange={e => setF({ ...f, city: e.target.value })}
                >
                  <option value="">Any City in Rajasthan</option>
                  {cities.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Maximum Sample Fee */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Maximum Sample Fee / Year
                </label>
                <select
                  className="inp"
                  value={f.budget}
                  onChange={e => setF({ ...f, budget: e.target.value })}
                >
                  <option value="100000">Up to ₹1,00,000 / yr (Subsidized Govt)</option>
                  <option value="200000">Up to ₹2,00,000 / yr (MNIT / Standard)</option>
                  <option value="300000">Up to ₹3,00,000 / yr (IIT / Mid Private)</option>
                  <option value="500000">Up to ₹5,00,000 / yr (BITS / Full Range)</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-p w-full py-3 text-sm font-semibold shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  {loading ? 'Checking Verified Database…' : 'Find My College Recommendations'}
                </button>
              </div>
            </form>

            {/* Quick Test Presets */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="block text-xs font-semibold text-slate-500 mb-2">
                Quick test presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePreset('5000', 'CSE', '300000')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs text-slate-700 transition-colors"
                >
                  Top Rank: 5,000 (CSE)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('22000', 'CSE', '400000')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs text-slate-700 transition-colors"
                >
                  Mid Rank: 22,000 (CSE)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('65000', 'ECE', '200000')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs text-slate-700 transition-colors"
                >
                  State Rank: 65,000 (ECE)
                </button>
              </div>
            </div>
          </div>

          {/* Logic Explanation Box */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 text-xs text-slate-600 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-navy-900">
              <Info size={15} className="text-royal" />
              <span>How Fits Are Categorized</span>
            </div>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  <strong className="text-slate-800">Likely:</strong> Rank is within 85% of sample cutoff (High probability).
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                <span>
                  <strong className="text-slate-800">Possible:</strong> Rank is between 85% and 115% of cutoff (Competitive).
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                <span>
                  <strong className="text-slate-800">Stretch:</strong> Rank is above 115% of sample cutoff (Aspirational target).
                </span>
              </li>
            </ul>
            <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
              <strong>Illustrative benchmark notice:</strong> Only verified records stored in the live database can produce results. The current database has no cutoff records. Sample/demo data is not used as a substitute.
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations or Onboarding State */}
        <div className="lg:col-span-7 space-y-5">
          {liveError ? (
            <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-card">
              <h3 className="font-heading text-lg font-bold text-amber-950">Live prediction unavailable</h3>
              <p className="mt-2 text-sm text-amber-900">{liveError}</p>
              <p className="mt-2 text-xs text-amber-800">This predictor requires the deployed database and verified historical cutoff records. It will not substitute mock cutoffs for live results.</p>
            </div>
          ) : liveResults !== null ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <h3 className="font-heading text-lg font-bold text-navy-900">Database-backed recommendations ({liveResults.count})</h3>
                <p className="mt-1 text-xs text-slate-500">Rank {Number(f.rank).toLocaleString()} · {f.branch || 'All branches'} · {liveResults.count > 0 ? `${liveResults.count} historical/database record${liveResults.count === 1 ? '' : 's'} found` : 'No matching records found'}</p>
                <p className="mt-3 text-xs text-amber-800">{liveResults.disclaimer}</p>
              </div>
              {liveResults.results.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">No records match these filters. This can mean the database has not yet been populated with verified cutoff data.</div> : (
                <div className="space-y-3">{liveResults.results.map((c) => (
                  <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div><h4 className="font-heading font-bold text-navy-900">{c.college_name}</h4><p className="mt-1 text-xs text-slate-500">{c.city} · {c.branch} · {c.counselling}</p></div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${c.fit === 'Likely' ? 'bg-emerald-50 text-emerald-800' : c.fit === 'Possible' ? 'bg-amber-50 text-amber-800' : c.fit === 'Historical reference' ? 'bg-sky-50 text-sky-800' : 'bg-rose-50 text-rose-800'}`}>{c.fit}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-600"><div>Historical cutoff rank<strong className="block mt-1 text-slate-900">{Number(c.cutoff_rank).toLocaleString()} ({c.cutoff_year})</strong></div><div>Annual fee<strong className="block mt-1 text-slate-900">{c.annual_fee == null ? 'Not available' : '₹' + Number(c.annual_fee).toLocaleString('en-IN')}</strong></div></div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">{c.note}</p>
                    <a className="mt-2 inline-block text-xs font-semibold text-royal underline" href={c.source_url} target="_blank" rel="noreferrer">View source record ↗</a>
                    {c.verified_at && <p className="mt-1 text-[11px] text-slate-400">Verified: {new Date(c.verified_at).toLocaleDateString()}</p>}
                  </div>
                ))}</div>
              )}
            </div>
          ) : res === null ? (
            /* Empty / Guide State */
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-card">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-royal-50 text-royal mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy-900">
                Check available historical references
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Enter your details to search the available database. Historical MBM University indicative merits may appear; these are self-declared, not verified closing ranks, and do not establish current-year admission chances.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-emerald-700 font-bold text-xs uppercase mb-1">
                    🟢 Likely Choices
                  </div>
                  <p className="text-[11px] text-slate-500">Historical comparison only; it is not a guarantee of allotment.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-amber-700 font-bold text-xs uppercase mb-1">
                    🟡 Possible Choices
                  </div>
                  <p className="text-[11px] text-slate-500">Historical comparison only; actual allotment depends on category, quota and round.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-rose-700 font-bold text-xs uppercase mb-1">
                    🔴 Stretch Choices
                  </div>
                  <p className="text-[11px] text-slate-500">Historical comparison only; do not use this as a prediction without verified matching records.</p>
                </div>
              </div>
            </div>
          ) : res.length === 0 ? (
            /* No Results Matched */
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-card">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
                <AlertCircle size={28} />
              </div>
              <h3 className="font-heading text-lg font-bold text-navy-900">
                No matching records for these filters
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                No records matched this branch, city and budget combination. Try clearing the city filter or increasing the budget. Historical records may have unknown fees and cannot confirm budget fit.
              </p>
              <button
                type="button"
                onClick={() => setF({ ...f, city: '', budget: '500000', branch: '' })}
                className="btn-p mt-5 text-xs py-2 px-5"
              >
                Broaden Preferences & Re-predict
              </button>
            </div>
          ) : (
            /* Results Available */
            <div className="space-y-5">
              {/* Summary Bar */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading text-base font-bold text-navy-900">
                    Recommended Colleges ({res.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    For Rank {Number(f.rank).toLocaleString()} • {f.branch || 'All Branches'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  {likelyCount > 0 && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-emerald-800">
                      Likely: {likelyCount}
                    </span>
                  )}
                  {possibleCount > 0 && (
                    <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-amber-800">
                      Possible: {possibleCount}
                    </span>
                  )}
                  {stretchCount > 0 && (
                    <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-rose-800">
                      Stretch: {stretchCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Recommendation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {res.map(r => (
                  <CollegeCard
                    key={r.college.id}
                    college={r.college}
                    fit={r.fit}
                    reasons={r.reasons}
                    onSelectDetails={col => setSelectedCollege(col)}
                  />
                ))}
              </div>
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
