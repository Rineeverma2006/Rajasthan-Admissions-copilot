import { Link } from 'react-router-dom'
import { Compass, ExternalLink, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/90 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-navy-900 text-gold-400">
                <Compass size={20} />
              </div>
              <span className="font-heading text-lg font-bold text-navy-900">
                Rajasthan Admission Copilot
              </span>
            </Link>
            <p className="max-w-md text-sm text-slate-500 leading-relaxed">
              Your comprehensive, data-driven companion for navigating engineering and technical admissions across Rajasthan. Explore government and private universities, evaluate rank cutoffs, and compare fee structures with confidence.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold-800 bg-gold-50 border border-gold-200/80 rounded-lg p-2.5 max-w-md">
              <ShieldCheck size={16} className="text-gold-600 shrink-0" />
              <span>Independent student counseling tool • Built for REAP 2024 guidance</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
              Platform Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-royal transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-royal transition-colors">
                  Explore Colleges
                </Link>
              </li>
              <li>
                <Link to="/predictor" className="hover:text-royal transition-colors">
                  College Predictor
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-royal transition-colors">
                  Compare Colleges
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-royal transition-colors">
                  AI Admission Assistant
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-royal transition-colors">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Portals */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
              Official State Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://dte.rajasthan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-royal transition-colors"
                >
                  DTE Rajasthan <ExternalLink size={12} className="text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://rtu.ac.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-royal transition-colors"
                >
                  Rajasthan Technical University <ExternalLink size={12} className="text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://aicte-india.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-royal transition-colors"
                >
                  AICTE India <ExternalLink size={12} className="text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://jeemain.nta.ac.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-royal transition-colors"
                >
                  NTA JEE Main <ExternalLink size={12} className="text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 space-y-2">
          <p className="leading-relaxed">
            <strong className="text-slate-700">Statutory Notice:</strong> Rajasthan Admission Copilot is a non-governmental educational information prototype. All college rankings, sample closing cutoffs, fees, and admission criteria are demonstrative and illustrative. They do not constitute official admission confirmation or government seat allotment. For authoritative updates, seat matrix, and counselling deadlines, refer exclusively to the official REAP convening body and respective university portals.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-[11px]">
            <p>© {new Date().getFullYear()} Rajasthan Admission Copilot. Designed for students aspiring for higher technical education in Rajasthan.</p>
            <p className="text-slate-400">Jaipur • Jodhpur • Kota • Pilani • Ajmer • Bikaner</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
