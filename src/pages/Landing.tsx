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
      desc: 'Explore demo college profiles and filters; verify admission routes, fees and cutoffs from official sources.',
      icon: Search,
      to: '/explore',
      cta: 'Explore All Colleges',
      badge: '10 Campuses',
      accent: 'navy',
    },
    {
      title: 'College Predictor',
      desc: 'Query verified historical REAP cutoffs when available. The live cutoff database is not populated yet.',
      icon: Sparkles,
      to: '/predictor',
      cta: 'Find My College',
      badge: 'Rank-Aware',
      accent: 'gold',
    },
    {
      title: 'Compare Colleges',
      desc: 'Compare the current profile fields side-by-side; sample values are clearly labelled as demo data.',
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
      desc: 'The live predictor searches verified cutoff records. Until records are added, it will show no matches rather than invent results.',
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
    <div className="space-y-10 pb-12">
      {/* Chatbot-first hero: the core product experience */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 px-5 py-8 text-white shadow-2xl sm:px-10 sm:py-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-white/10 px-3 py-1 text-xs font-semibold text-violet-100"><Sparkles size={14} /> Your AI-first B.E. / B.Tech guide</span>
            <h1 className="mt-5 max-w-2xl font-heading text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">Rajasthan engineering admissions, <span className="text-cyan-300">samjho apni bhasha mein.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">Ask about REAP, eligibility, branches, documents and counselling in English, हिन्दी, Hinglish or Marwari. Clear guidance, with official-source checks for important details.</p>
            <div className="mt-5 flex flex-wrap gap-2">{['English', 'हिन्दी', 'Hinglish', 'मारवाड़ी'].map(language => <span key={language} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">{language}</span>)}</div>
            <Link to="/assistant" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-cyan-200"><MessageSquare size={17} /> Chat with Admission Copilot <ArrowRight size={16} /></Link>
            <p className="mt-3 text-xs text-indigo-200">Focused only on Rajasthan B.E./B.Tech admissions through REAP.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md sm:p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4"><div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-300 text-slate-950"><MessageSquare size={22} /></div><div><p className="font-bold text-white">Ask your admission question</p><p className="mt-0.5 text-xs text-indigo-200">English · Hindi · Hinglish · Marwari</p></div><span className="ml-auto rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-200">AI CHAT</span></div>
            <div className="space-y-3 py-4"><div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white/10 p-3 text-sm text-indigo-50">Mhari JEE Main rank su B.Tech college mil sake?</div><div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-sm bg-cyan-300 p-3 text-sm font-medium text-slate-950">Apni rank, category aur Rajasthan domicile status batao. Main available REAP information ke basis par options samjhaunga—bina cutoff guess kiye.</div><div className="flex flex-wrap gap-2 pt-1">{['Eligibility kya hai?', 'College kaise choose karun?', 'REAP documents'].map(question => <Link key={question} to="/assistant" className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white transition hover:bg-white/10">{question}</Link>)}</div></div>
            <Link to="/assistant" className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">Open full chatbot <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>
      {/* Compact college search strip */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
            <input value={heroSearch} onChange={e => setHeroSearch(e.target.value)} placeholder="Find an engineering college, branch or city…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-950"><Search size={16} /> Explore colleges</button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600"><span className="font-semibold text-slate-500">Try:</span>{['CSE', 'Jaipur', 'Government colleges', 'Fees'].map(q => <button key={q} type="button" onClick={() => navigate(`/explore?q=${encodeURIComponent(q === 'Government colleges' ? 'Government' : q)}`)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 transition hover:border-indigo-300 hover:bg-indigo-50">{q}</button>)}</div>
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
              Explore institution profiles and interface filters. Fee and cutoff values are illustrative demo data; verify them with official sources.
            </p>
          </div>
          <Link
            to="/explore"
            className="btn-s text-xs font-semibold whitespace-nowrap self-start sm:self-auto"
          >
            Explore Colleges <ChevronRight size={14} />
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
