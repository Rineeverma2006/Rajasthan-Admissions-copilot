import { Route, Routes, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import Predictor from './pages/Predictor'
import Assistant from './pages/Assistant'
import Compare from './pages/Compare'

export default function App() {
  return (
    <div className="app-shell flex min-h-screen flex-col bg-[#080d1b] font-sans text-slate-100 antialiased selection:bg-cyan-300/30 selection:text-cyan-100">
      {/* Top Premium Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-md py-16 text-center">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
                  <h2 className="font-heading text-2xl font-bold text-navy-900">
                    404 — Page Not Found
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    The requested page could not be located on Rajasthan Admission Copilot.
                  </p>
                  <Link to="/" className="btn-p mt-5 text-xs py-2 px-4 inline-flex">
                    Return to Homepage
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Modern Detailed Footer */}
      <Footer />
    </div>
  )
}
