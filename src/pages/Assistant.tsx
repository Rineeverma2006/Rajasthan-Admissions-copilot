import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, RotateCcw, HelpCircle, BookOpen, ShieldAlert } from 'lucide-react'
import { SUGGESTED } from '../lib/chat'

interface Message {
  role: 'user' | 'bot'
  text: string
  time: string
}

interface ApiMessage { role: 'user' | 'assistant'; content: string }

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Namaste! I am your Rajasthan Admission Copilot Assistant. Ask me about required documents, REAP choice filling strategies, cutoff evaluation, or scholarship portals.',
      time: 'Just now',
    },
  ])
  const [input, setInput] = useState('')
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
        body: JSON.stringify({ message: q, history: prior })
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
        text: 'Conversation reset. Feel free to ask another admission question or click one of the suggested topics below.',
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
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="tag mb-1.5">Live AI • Source-Grounded When Data Is Available</span>
          <h1 className="font-heading text-3xl font-extrabold text-navy-900 tracking-tight">
            AI Admission Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Instant guidance on documents, counselling steps, seat allotments, and choice priority.
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
          <strong>Guidance Notice:</strong> Responses use the server-side AI API and, when configured, published knowledge-base records. Missing or outdated sources may limit accuracy. Always verify deadlines, seat matrices, fees and eligibility on the relevant official admission portal.
        </p>
      </div>

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
              placeholder="Ask about REAP, eligibility, documents, fees, deadlines..."
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
