import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GitCompare,
  Plus,
  X,
  Building,
  MapPin,
  Check,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
} from 'lucide-react'
import { COLLEGES, College } from '../data/colleges'
import { useCompare, useSaved } from '../lib/store'
import CollegeImage from '../components/CollegeImage'
import CollegeModal from '../components/CollegeModal'

export default function Compare() {
  const { compared, toggle, clear, setCompared } = useCompare()
  const { isSaved, toggle: toggleSaved, saved } = useSaved()
  const [selectedCollegeModal, setSelectedCollegeModal] = useState<College | null>(null)

  const comparedColleges = COLLEGES.filter(c => compared.includes(c.id))
  const unselectedColleges = COLLEGES.filter(c => !compared.includes(c.id))

  const handleSelectCollege = (id: string) => {
    if (!id) return
    toggle(id)
  }

  const handleCompareSaved = () => {
    if (saved.length > 0) {
      setCompared(saved.slice(0, 4))
    }
  }

  const handleLoadPreset = (ids: string[]) => {
    setCompared(ids)
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="tag mb-2">Side-by-Side Evaluation</span>
            <h1 className="font-heading text-3xl font-extrabold text-navy-900 tracking-tight">
              Compare Colleges
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Evaluate tuition fees, cutoff ranks, campus scale, and academic branches side-by-side to prioritize your REAP choices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {saved.length > 0 && (
              <button
                type="button"
                onClick={handleCompareSaved}
                className="btn-s text-xs py-2 px-3"
                title="Load your bookmarked colleges"
              >
                <Bookmark size={13} className="text-gold-600" />
                Compare Saved ({saved.length})
              </button>
            )}
            {compared.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="btn-s text-xs py-2 px-3 text-rose-600 hover:text-rose-700"
              >
                <X size={13} /> Clear Table
              </button>
            )}
          </div>
        </div>
      </div>

      {/* College Selector Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-royal-50 text-royal">
              <Plus size={16} />
            </div>
            <div>
              <span className="font-heading text-sm font-bold text-navy-900 block">
                Add Colleges to Comparison (Max 4)
              </span>
              <span className="text-xs text-slate-500">
                {comparedColleges.length} of 4 slots filled
              </span>
            </div>
          </div>

          {unselectedColleges.length > 0 && compared.length < 4 && (
            <div className="w-full sm:w-72">
              <select
                className="inp text-xs py-2"
                onChange={e => {
                  handleSelectCollege(e.target.value)
                  e.target.value = ''
                }}
                defaultValue=""
                aria-label="Add a college to compare"
              >
                <option value="" disabled>
                  + Select a college to add...
                </option>
                {unselectedColleges.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city} • {c.type})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400">Currently comparing:</span>
          {comparedColleges.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No colleges selected yet.</span>
          ) : (
            comparedColleges.map(c => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-royal-50 border border-royal-200 px-2.5 py-1 text-xs font-semibold text-royal-900"
              >
                {c.name}
                <button
                  type="button"
                  onClick={() => toggle(c.id)}
                  aria-label={`Remove ${c.name}`}
                  className="rounded hover:bg-royal-200/60 p-0.5 text-royal-700 hover:text-royal-900"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Comparison View */}
      {comparedColleges.length === 0 ? (
        /* Empty State with Presets */
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-card max-w-xl mx-auto space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-royal-50 text-royal">
            <GitCompare size={32} />
          </div>
          <h3 className="font-heading text-xl font-bold text-navy-900">
            Compare Rajasthan Engineering Colleges
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Select 2 to 4 colleges from the dropdown above to view an in-depth side-by-side comparison of fees, cutoffs, campus facilities, and seat criteria.
          </p>

          <div className="pt-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Popular Comparisons:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadPreset(['mnit', 'bits', 'lnmiit'])}
                className="btn-s text-xs py-1.5 px-3"
              >
                MNIT Jaipur vs BITS Pilani vs LNMIIT
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(['iitj', 'mnit'])}
                className="btn-s text-xs py-1.5 px-3"
              >
                IIT Jodhpur vs MNIT Jaipur
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(['geca', 'gecb', 'gect'])}
                className="btn-s text-xs py-1.5 px-3"
              >
                Top Govt Colleges (Ajmer, Bikaner, Kota)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Clean Responsive Comparison Table */
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="w-48 p-4 font-heading text-xs font-bold uppercase tracking-wider text-slate-500 sticky left-0 bg-slate-50 z-20 shadow-xs">
                    College Attributes
                  </th>
                  {comparedColleges.map(c => (
                    <th key={c.id} className="p-4 align-top min-w-[220px]">
                      <div className="relative space-y-2">
                        <button
                          type="button"
                          onClick={() => toggle(c.id)}
                          className="absolute right-0 top-0 grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-slate-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                          title="Remove from comparison"
                          aria-label={`Remove ${c.name}`}
                        >
                          <X size={13} />
                        </button>
                        <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                          <CollegeImage
                            src={c.image}
                            fallbackSrc={c.fallbackImage}
                            alt={`${c.name} campus view`}
                            aspectRatio="video"
                            className="h-full w-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-heading text-base font-bold text-navy-900 line-clamp-1">
                            {c.name}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <MapPin size={11} className="text-gold-500" /> {c.city}, Rajasthan
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {/* Institution Type */}
                <tr>
                  <td className="p-4 font-semibold text-navy-900 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Institution Type
                  </td>
                  {comparedColleges.map(c => (
                    <td key={c.id} className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                          c.type === 'Government'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : c.type === 'Deemed/Autonomous'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                      >
                        <Building size={11} /> {c.type}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Sample Annual Fee */}
                <tr className="bg-slate-50/40">
                  <td className="p-4 font-semibold text-navy-900 sticky left-0 bg-slate-50 z-10 border-r border-slate-100">
                    Sample Annual Fee
                  </td>
                  {comparedColleges.map(c => (
                    <td key={c.id} className="p-4">
                      <span className="text-sm font-bold text-navy-900">
                        ₹{c.feeSample.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ academic year (illustrative)</span>
                    </td>
                  ))}
                </tr>

                {/* Sample Cutoff Rank */}
                <tr>
                  <td className="p-4 font-semibold text-navy-900 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Closing Cutoff (Sample)
                  </td>
                  {comparedColleges.map(c => (
                    <td key={c.id} className="p-4">
                      <span className="text-sm font-bold text-royal-700">
                        ~{c.cutoffSample.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block">General closing benchmark</span>
                    </td>
                  ))}
                </tr>

                {/* Established Year & Scale */}
                <tr className="bg-slate-50/40">
                  <td className="p-4 font-semibold text-navy-900 sticky left-0 bg-slate-50 z-10 border-r border-slate-100">
                    Established & Campus
                  </td>
                  {comparedColleges.map(c => (
                    <td key={c.id} className="p-4">
                      <span className="font-semibold text-slate-800 block">Est. {c.established}</span>
                      <span className="text-slate-500">{c.campusSize}</span>
                    </td>
                  ))}
                </tr>

                {/* Ranking / Accreditation */}
                <tr>
                  <td className="p-4 font-semibold text-navy-900 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Accreditation / NIRF
                  </td>
                  {comparedColleges.map(c => (
                    <td key={c.id} className="p-4">
                      {c.nirfRank ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-800 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded-md">
                          <Award size={12} /> {c.nirfRank}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Branches Offered */}
                <tr className="bg-slate-50/40">
                  <td className="p-4 font-semibold text-navy-900 sticky left-0 bg-slate-50 z-10 border-r border-slate-100">
                    Offered Branches
                  </td>
                  {comparedColleges.map(c => (
                    <td key={c.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {c.branches.map(b => (
                          <span
                            key={b}
                            className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Highlights */}
                <tr>
                  <td className="p-4 font-semibold text-navy-900 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Key Highlights
                  </td>
                  {comparedColleges.map(c => (
                    <td key={c.id} className="p-4">
                      <ul className="space-y-1 text-[11px] text-slate-600">
                        {c.highlights.map(h => (
                          <li key={h} className="flex items-start gap-1.5">
                            <Check size={12} className="text-royal shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr className="bg-slate-50/60">
                  <td className="p-4 font-semibold text-navy-900 sticky left-0 bg-slate-50 z-10 border-r border-slate-100">
                    Direct Actions
                  </td>
                  {comparedColleges.map(c => (
                    <td key={c.id} className="p-4 space-y-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCollegeModal(c)}
                        className="btn-p w-full text-xs py-2"
                      >
                        View Full Details <ChevronRight size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaved(c.id)}
                        className={`btn-s w-full text-xs py-2 ${
                          isSaved(c.id) ? 'bg-gold-50 border-gold-300 text-gold-900' : ''
                        }`}
                      >
                        <Bookmark size={13} className={isSaved(c.id) ? 'fill-gold-600 text-gold-600' : ''} />
                        {isSaved(c.id) ? 'Saved' : 'Save'}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* College Modal */}
      <CollegeModal
        college={selectedCollegeModal}
        onClose={() => setSelectedCollegeModal(null)}
      />
    </div>
  )
}
