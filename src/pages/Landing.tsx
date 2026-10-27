import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  GitCompare,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  Building2,
  FileCheck2,
  ChevronRight,
} from 'lucide-react'
import { COLLEGES, College } from '../data/colleges'
import CollegeCard from '../components/CollegeCard'
import CollegeModal from '../components/CollegeModal'

export default function Landing() {
  const navigate = useNavigate()
  const [heroSearch, setHeroSearch] = useState('')
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [activeTab, setActiveTab] = useState<'All' | 'Government' | 'Deemed/Autonomous' | 'Private'>('All')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (heroSearch.trim()) {
      navigate(`/explore?q=${encodeURIComponent(heroSearch.trim())}`)
    } else {
      navigate('/explore')
    }
  }

  const filteredColleges =
    activeTab === 'All'
      ? COLLEGES.slice(0, 6)
      : COLLEGES.filter(c => c.type === activeTab).slice(0, 6)

  const featureCards = [
    {
      title: 'AI Admission Assistant',
      desc: 'Ask questions about required REAP documents, reservation quotas, and seat allotment rounds.',
      icon: MessageSquare,
      to: '/assistant',
      cta: 'Chat with Assistant',
      badge: 'Interactive',
      accent: 'royal',
    },
    {
      title: 'Explore Colleges',
      desc: 'Discover premier engineering universities across Jaipur, Jodhpur, Kota, and Pilani with transparent fees.',
      icon: Search,
      to: '/explore',
      cta: 'Explore All Colleges',
      badge: '10 Campuses',
      accent: 'navy',
    },
    {
      title: 'College Predictor',
      desc: 'Calculate your admission probability into Likely, Possible, and Stretch options based on your rank.',
      icon: Sparkles,
      to: '/predictor',
      cta: 'Find My College',
      badge: 'Rank-Aware',
      accent: 'gold',
    },
    {
      title: 'Compare Colleges',
      desc: 'Evaluate tuition fees, cutoff trends, branches, and campus facilities side-by-side in one place.',
      icon: GitCompare,
      to: '/compare',
      cta: 'Compare Side-by-Side',
      badge: 'Multi-Select',
      accent: 'royal',
    },
  ]

  const steps = [
    {
      step: '01',
      title: 'Input Rank & Target Branch',
      desc: 'Enter your JEE Main / REAP merit rank, select your dream branch (CSE, ECE, Mechanical), and set your budget.',
      icon: SlidersHorizontal,
    },
    {
      step: '02',
      title: 'Get Transparent Fit Analysis',
      desc: 'Our deterministic model benchmarks your score against historical cutoffs to group colleges into Likely, Possible, and Stretch fits.',
      icon: Building2,
    },
    {
      step: '03',
      title: 'Compare & Fill REAP Choices',
      desc: 'Shortlist top colleges, inspect fee structures side-by-side, and make confident decisions for official choice filling.',
      icon: FileCheck2,
    },
  ]

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-navy-950 text-white shadow-2xl border border-navy-800">
        {/* Background Image with Dark Navy Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=80"
            alt="Rajasthan architectural heritage campus"
            onError={e => {
              // fallback to local vector svg
              const target = e.target as HTMLImageElement
              if (target.src !== '/images/rajasthan-hero.svg') {
                target.src = '/images/rajasthan-hero.svg'
              }
            }}
            className="h-full w-full object-cover object-center opacity-30"
          />
          {/* Deep Navy / Indigo Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-950/80" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-navy-950/40 to-navy-950" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24 max-w-4xl">
          {/* Subtle Rajasthan Heritage Tag */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-500/15 border border-gold-400/30 px-3.5 py-1 text-xs font-semibold text-gold-300 backdrop-blur-md mb-6">
            <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
            <span>Rajasthan Technical Admissions 2024–25 • REAP & Direct Entry</span>
          </div>

          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
            Find Your Future in <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-amber-200 to-gold-400">Rajasthan</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Navigate government, deemed, and premier private engineering colleges across Jaipur, Jodhpur, Kota, and Pilani. Access transparent fee structures, cutoff benchmarks, and smart admission tools.
          </p>

          {/* Prominent Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 flex flex-col sm:flex-row items-stretch gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur-md border border-white/20 shadow-xl max-w-2xl"
          >
            <div className="relative flex-1 flex items-center">
              <Search size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                placeholder="Search colleges, courses (CSE, ECE), or cities (Jaipur, Kota)..."
                className="w-full rounded-xl bg-white px-4 py-3 pl-10 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-royal shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="btn-p py-3 px-6 text-sm font-semibold whitespace-nowrap bg-royal hover:bg-royal-700 shadow-lg text-white"
            >
              Search Colleges
            </button>
          </form>

          {/* Quick Filter Pill Shortcuts */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Popular searches:</span>
            {['MNIT Jaipur', 'IIT Jodhpur', 'CSE', 'Govt Colleges', 'Under ₹1.5L'].map(q => (
              <button
                key={q}
                type="button"
                onClick={() => navigate(`/explore?q=${encodeURIComponent(q === 'Govt Colleges' ? 'Government' : q)}`)}
                className="rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-2.5 py-0.5 transition-colors text-slate-200"
              >
                {q}
              </button>
            ))}
          </div>

          {/* CTA Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/explore"
              className="btn-p py-3 px-6 text-sm font-semibold rounded-xl bg-royal hover:bg-royal-700 shadow-md flex items-center gap-2"
            >
              Explore Colleges <ArrowRight size={16} />
            </Link>
            <Link
              to="/predictor"
              className="btn-s py-3 px-6 text-sm font-semibold rounded-xl bg-white/15 text-white border-white/30 hover:bg-white/25 hover:text-white backdrop-blur-sm"
            >
              Find My College (Predictor)
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div>
              <span className="block font-heading text-2xl font-bold text-white">10+</span>
              <span className="text-xs text-slate-400">Curated Campuses</span>
            </div>
            <div>
              <span className="block font-heading text-2xl font-bold text-gold-400">₹60K - ₹4.8L</span>
              <span className="text-xs text-slate-400">Sample Annual Fees</span>
            </div>
            <div>
              <span className="block font-heading text-2xl font-bold text-white">100%</span>
              <span className="text-xs text-slate-400">Free Open Guidance</span>
            </div>
            <div>
              <span className="block font-heading text-2xl font-bold text-royal-400">REAP 2024</span>
              <span className="text-xs text-slate-400">Ready Reference</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR FEATURE CARDS */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="tag-royal">Smart Guidance Tools</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900">
            Everything You Need for Rajasthan Admissions
          </h2>
          <p className="text-sm text-slate-600">
            Integrated tools designed to simplify complex REAP counselling rules, cutoffs, and college shortlisting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
          {featureCards.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                to={item.to}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-royal/40 hover:shadow-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-royal-50 text-royal transition-colors group-hover:bg-royal group-hover:text-white">
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-navy-900 group-hover:text-royal transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-royal group-hover:gap-2 transition-all">
                  <span>{item.cta}</span>
                  <ArrowRight size={13} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 3. EXPLORE TOP COLLEGES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="tag">Premier Engineering Institutions</span>
            <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-navy-900">
              Explore Top Colleges in Rajasthan
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Handpicked institutions featuring verified campus photos, benchmark closing cutoffs, and fee breakdowns.
            </p>
          </div>
          <Link
            to="/explore"
            className="btn-s text-xs font-semibold whitespace-nowrap self-start sm:self-auto"
          >
            View All 10 Colleges <ChevronRight size={14} />
          </Link>
        </div>

        {/* Institution Type Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {(['All', 'Government', 'Deemed/Autonomous', 'Private'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-navy-900'
              }`}
            >
              {tab === 'All' ? 'All Institutes' : tab}
            </button>
          ))}
        </div>

        {/* College Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map(college => (
            <CollegeCard
              key={college.id}
              college={college}
              onSelectDetails={col => setSelectedCollege(col)}
            />
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-8 sm:p-12 border border-slate-200/80 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="tag-royal">Effortless REAP Guidance</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900">
            How Rajasthan Admission Copilot Works
          </h2>
          <p className="text-sm text-slate-600">
            Three intuitive steps to cut through admission ambiguity and prepare your best choice list.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {steps.map(s => {
            const Icon = s.icon
            return (
              <div
                key={s.step}
                className="relative rounded-2xl bg-white p-6 border border-slate-200/70 shadow-card flex flex-col items-start"
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy-900 text-gold-400">
                    <Icon size={22} />
                  </div>
                  <span className="font-heading text-2xl font-black text-slate-300">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-navy-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. CTA & TRUST BANNER */}
      <section className="rounded-3xl bg-navy-900 text-white p-8 sm:p-12 shadow-xl border border-navy-800 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-96 h-96 rounded-full bg-royal/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="tag bg-gold-400/20 text-gold-300 border-gold-400/30">
            100% Free & Open Resource
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Uncertain about which college matches your rank?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Run your score through our rank predictor to see Likely, Possible, and Stretch colleges, or ask our built-in assistant about eligibility guidelines.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/predictor" className="btn-p bg-royal hover:bg-royal-600 text-sm py-3 px-6 shadow-lg">
              Launch Predictor
            </Link>
            <Link to="/assistant" className="btn-s bg-white/10 text-white border-white/20 hover:bg-white/20 text-sm py-3 px-6">
              Ask Admission Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* College Modal for Detailed View */}
      <CollegeModal
        college={selectedCollege}
        onClose={() => setSelectedCollege(null)}
      />
    </div>
  )
}
