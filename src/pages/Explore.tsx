import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, RotateCcw, Building2, Sliders } from 'lucide-react'
import { COLLEGES, College } from '../data/colleges'
import CollegeCard from '../components/CollegeCard'
import CollegeModal from '../components/CollegeModal'

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQ = searchParams.get('q') || ''

  const [q, setQ] = useState(initialQ)
  const [branch, setBranch] = useState('')
  const [type, setType] = useState('')
  const [maxFee, setMaxFee] = useState(500000)
  const [sort, setSort] = useState<'name' | 'fee-asc' | 'fee-desc' | 'cutoff'>('name')
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)

  // Keep state synchronized with URL query parameter
  useEffect(() => {
    const query = searchParams.get('q')
    if (query !== null && query !== q) {
      setQ(query)
    }
  }, [searchParams])

  const branches = useMemo(
    () => [...new Set(COLLEGES.flatMap(c => c.branches))].sort(),
    []
  )

  const cities = useMemo(
    () => [...new Set(COLLEGES.map(c => c.city))].sort(),
    []
  )

  const filteredList = useMemo(() => {
    return COLLEGES.filter(c => {
      const query = q.toLowerCase().trim()
      const matchesQuery =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query) ||
        c.branches.some(b => b.toLowerCase().includes(query)) ||
        c.type.toLowerCase().includes(query)

      const matchesBranch = !branch || c.branches.includes(branch)
      const matchesType = !type || c.type === type
      const matchesFee = c.feeSample <= maxFee

      return matchesQuery && matchesBranch && matchesType && matchesFee
    }).sort((a, b) => {
      if (sort === 'fee-asc') return a.feeSample - b.feeSample
      if (sort === 'fee-desc') return b.feeSample - a.feeSample
      if (sort === 'cutoff') return a.cutoffSample - b.cutoffSample
      return a.name.localeCompare(b.name)
    })
  }, [q, branch, type, maxFee, sort])

  const hasActiveFilters = q || branch || type || maxFee < 500000 || sort !== 'name'

  const clearFilters = () => {
    setQ('')
    setBranch('')
    setType('')
    setMaxFee(500000)
    setSort('name')
    setSearchParams({})
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="tag mb-2">Rajasthan Technical Catalog</span>
            <h1 className="font-heading text-3xl font-extrabold text-navy-900 tracking-tight">
              Explore Colleges in Rajasthan
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Browse demo college profiles and use filters to explore the interface. Fee and cutoff figures are illustrative—not verified REAP data.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Showing
            </span>
            <span className="font-heading text-2xl font-bold text-royal">
              {filteredList.length} <span className="text-sm font-normal text-slate-500">of {COLLEGES.length} colleges</span>
            </span>
          </div>
        </div>
      </div>

      <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"><strong>Demo dataset notice:</strong> College cards and displayed fee/rank figures are illustrative UI data, not verified current REAP records. Confirm each institution’s admission route and current details from official sources before relying on them.</div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Filter size={14} className="text-royal" />
            <span>Search & Filter Criteria</span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              <RotateCcw size={12} />
              Reset All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search Input */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              className="inp pl-9"
              aria-label="Search name, city or branch"
              placeholder="Search name, city, branch..."
              value={q}
              onChange={e => {
                setQ(e.target.value)
                if (e.target.value) {
                  setSearchParams({ q: e.target.value })
                } else {
                  setSearchParams({})
                }
              }}
            />
          </div>

          {/* Branch Filter */}
          <div>
            <select
              className="inp"
              aria-label="Engineering Branch"
              value={branch}
              onChange={e => setBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {branches.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Institution Type Filter */}
          <div>
            <select
              className="inp"
              aria-label="Institution Type"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="">All Institution Types</option>
              <option value="Government">Government</option>
              <option value="Deemed/Autonomous">Deemed / Autonomous</option>
              <option value="Private">Private</option>
            </select>
          </div>

          {/* Max Sample Fee Filter */}
          <div>
            <select
              className="inp"
              aria-label="Maximum Sample Fee"
              value={maxFee}
              onChange={e => setMaxFee(Number(e.target.value))}
            >
              <option value={500000}>Budget: Any Sample Fee</option>
              <option value={100000}>Up to ₹1,00,000 / yr</option>
              <option value={200000}>Up to ₹2,00,000 / yr</option>
              <option value={300000}>Up to ₹3,00,000 / yr</option>
              <option value={400000}>Up to ₹4,00,000 / yr</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              className="inp"
              aria-label="Sort Order"
              value={sort}
              onChange={e => setSort(e.target.value as any)}
            >
              <option value="name">Sort: College Name</option>
              <option value="cutoff">Sort: Cutoff Rank (Low to High)</option>
              <option value="fee-asc">Sort: Fee (Lowest First)</option>
              <option value="fee-desc">Sort: Fee (Highest First)</option>
            </select>
          </div>
        </div>

        {/* Quick Active Filters Summary Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400">Active filters:</span>
            {q && (
              <span className="rounded-md bg-royal-50 border border-royal-200 px-2.5 py-0.5 text-royal-700 font-medium">
                Keyword: "{q}"
              </span>
            )}
            {branch && (
              <span className="rounded-md bg-royal-50 border border-royal-200 px-2.5 py-0.5 text-royal-700 font-medium">
                Branch: {branch}
              </span>
            )}
            {type && (
              <span className="rounded-md bg-royal-50 border border-royal-200 px-2.5 py-0.5 text-royal-700 font-medium">
                Type: {type}
              </span>
            )}
            {maxFee < 500000 && (
              <span className="rounded-md bg-royal-50 border border-royal-200 px-2.5 py-0.5 text-royal-700 font-medium">
                Fee &le; ₹{maxFee.toLocaleString()}
              </span>
            )}
            {sort !== 'name' && (
              <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-slate-700 font-medium">
                Sorted: {sort}
              </span>
            )}
          </div>
        )}
      </div>

      {/* College Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-card max-w-lg mx-auto">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500 mb-4">
            <Building2 size={28} />
          </div>
          <h3 className="font-heading text-lg font-bold text-navy-900">
            No Colleges Found
          </h3>
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
            We couldn't find any colleges matching your selected filters. Try broadening your budget or clearing branch filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="btn-p mt-5 text-xs py-2.5 px-5"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map(college => (
            <CollegeCard
              key={college.id}
              college={college}
              onSelectDetails={col => setSelectedCollege(col)}
            />
          ))}
        </div>
      )}

      {/* College Details Modal */}
      <CollegeModal
        college={selectedCollege}
        onClose={() => setSelectedCollege(null)}
      />
    </div>
  )
}
