import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, RotateCcw, HelpCircle, BookOpen, ShieldAlert, Languages } from 'lucide-react'
import { SUGGESTED } from '../lib/chat'

interface Message {
  role: 'user' | 'bot'
  text: string
  time: string
}

interface ApiMessage { role: 'user' | 'assistant'; content: string }
type ChatLanguage = 'auto' | 'english' | 'hindi' | 'hinglish' | 'marwari'
const LANGUAGES: { id: ChatLanguage; label: string; helper: string }[] = [
  { id: 'auto', label: 'Auto detect', helper: 'Match my language' },
  { id: 'english', label: 'English', helper: 'Clear English' },
  { id: 'hindi', label: 'हिन्दी', helper: 'सरल हिन्दी' },
  { id: 'hinglish', label: 'Hinglish', helper: 'Hindi + English' },
  { id: 'marwari', label: 'मारवाड़ी', helper: 'Marwari / Rajasthani' },
]

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Namaste सा! I am your Rajasthan B.E./B.Tech Admission Copilot. English, हिन्दी, Hinglish ya Marwari mein puchho—REAP eligibility, branches, documents, counselling aur college options par madad karunga.',
      time: 'Just now',
    },
  ])
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState<ChatLanguage>('auto')
  const [isTyping, setIsTyping] = useState(false)
  const [apiError, setApiError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async (textToSend: string) => {
    const q = textToSend.trim()
    if (!q || isTyping) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const prior = messages.filter(m => m.role !== 'bot' || messages.indexOf(m) > 0).slice(-8)
      .filter(m => m.text && !(m.role === 'bot' && m.text.startsWith('Namaste!')))
      .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text } as ApiMessage))
    setMessages(prev => [...prev, { role: 'user', text: q, time: now }])
    setInput('')
    setIsTyping(true)
    setApiError('')
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, history: prior, language })
      })
      const data = await response.json() as { answer?: string; error?: string }
      if (!response.ok || !data.answer) throw new Error(data.error || 'Could not get an AI response.')
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => [...prev, { role: 'bot', text: data.answer!, time: botTime }])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.'
      setApiError(message)
      setMessages(prev => [...prev, { role: 'bot', text: `I could not verify an answer right now. ${message} Please try again later. Do not rely on an unverified deadline or cutoff.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        role: 'bot',
        text: 'राम-राम सा! Chat reset ho gayi. REAP B.E./B.Tech admission ke baare mein English, हिन्दी, Hinglish ya Marwari mein puchho.',
        time: 'Just now',
      },
    ])
    setInput('')
  }

  // Format assistant response nicely (separating disclaimer if present)
  const formatBotMessage = (text: string) => {
    const parts = text.split('\n\n')
    const mainBody = parts[0]
    const disclaimer = parts.length > 1 ? parts.slice(1).join('\n\n') : null

    return (
      <div className="space-y-2.5">
        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
          {mainBody}
        </p>
        {disclaimer && (
          <div className="rounded-lg bg-slate-100/80 border border-slate-200/80 p-2.5 text-[11px] text-slate-500 leading-normal flex items-start gap-1.5">
            <BookOpen size={13} className="text-royal shrink-0 mt-0.5" />
            <span>{disclaimer}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="tag mb-1.5"><Sparkles size={12} /> REAP B.E./B.Tech • Multilingual AI</span>
          <h1 className="font-heading text-3xl font-extrabold text-navy-900 tracking-tight">
            AI Admission Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Ask naturally in English, Hindi, Hinglish or Marwari. Focused only on Rajasthan B.E./B.Tech admissions.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="btn-s text-xs py-2 px-3"
          title="Reset chat conversation"
        >
          <RotateCcw size={13} /> Reset Chat
        </button>
      </div>

      {/* Advisory Notice */}
      <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Guidance Notice:</strong> This assistant focuses only on Rajasthan B.E./B.Tech admissions via REAP. It uses published knowledge-base records when available; verify deadlines, seat matrix, fees and eligibility on the official REAP portal.
        </p>
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-navy-900"><Languages size={18} className="text-royal" /> Choose your language</div>
        <p className="mt-1 text-xs text-slate-600">Auto-detect is best if you mix Hindi and English. Marwari support is conversational; for complex official terms, I can explain in Hinglish too.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LANGUAGES.map(option => <button key={option.id} type="button" aria-pressed={language === option.id} onClick={() => setLanguage(option.id)} className={`rounded-xl border px-3 py-2 text-left transition ${language === option.id ? 'border-royal bg-royal text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-royal/40'}`}>
            <span className="block text-xs font-bold">{option.label}</span><span className={`mt-0.5 block text-[10px] ${language === option.id ? 'text-indigo-100' : 'text-slate-500'}`}>{option.helper}</span>
          </button>)}
        </div>
      </section>

      {/* Suggested Questions Pill Row */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <HelpCircle size={13} className="text-royal" /> Suggested Topics
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => handleSend(s)}
              className="rounded-full bg-white border border-slate-200/90 hover:border-royal/40 hover:bg-royal-50/60 px-3 py-1.5 text-xs text-slate-700 transition-all shadow-2xs hover:text-royal font-medium text-left"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div
        className="rounded-2xl border border-slate-200/90 bg-white shadow-card flex flex-col min-h-[440px] max-h-[580px]"
        aria-live="polite"
      >
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`grid h-8 w-8 place-items-center rounded-xl shrink-0 shadow-2xs ${
                  m.role === 'user'
                    ? 'bg-royal text-white'
                    : 'bg-navy-900 text-gold-400'
                }`}
              >
                {m.role === 'user' ? <User size={15} /> : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-subtle ${
                  m.role === 'user'
                    ? 'bg-royal text-white rounded-tr-sm'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-sm'
                }`}
              >
                {m.role === 'user' ? (
                  <p className="text-sm leading-relaxed whitespace-pre-line font-medium text-white">
                    {m.text}
                  </p>
                ) : (
                  formatBotMessage(m.text)
                )}
                <span
                  className={`block text-[10px] mt-1.5 ${
                    m.role === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-navy-900 text-gold-400 shrink-0">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 px-4 py-3 flex items-center gap-1.5 shadow-subtle">
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSend(input)
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Apni rank, REAP eligibility, branch ya documents ke baare mein puchho..."
              className="inp bg-white shadow-inner text-sm"
              aria-label="Your admission question"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="btn-p py-2.5 px-4 shadow-sm"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
