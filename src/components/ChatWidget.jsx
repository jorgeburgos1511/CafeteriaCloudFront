import { useState, useRef, useEffect } from 'react'
import { sendMessage } from '../api/chatApi'

const WELCOME = '¡Hola! Soy CaféBot ☕\n\n¿En qué te puedo ayudar?\n• Registrar clientes\n• Agregar productos al menú\n• Crear una nota de venta\n• Ver el menú disponible'

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

function Bubble({ role, content, typing }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-1.5`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs shrink-0 mb-0.5">
          ☕
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
          isUser
            ? 'bg-amber-500 text-white rounded-br-sm px-3 py-2'
            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm px-3 py-2'
        }`}
      >
        {typing ? <TypingDots /> : content}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const newHistory = [...history, userMsg]
    setHistory(newHistory)
    setInput('')
    setLoading(true)

    try {
      const data = await sendMessage(text, history)
      setHistory([...newHistory, { role: 'assistant', content: data.response }])
    } catch {
      setHistory([...newHistory, { role: 'assistant', content: 'Ocurrió un error. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const clearChat = () => setHistory([])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-base shadow-sm">
                ☕
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">CaféBot</p>
                <p className="text-xs text-slate-400 leading-tight">Cafetería ITESO</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                title="Limpiar chat"
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded hover:bg-slate-700 transition-colors"
              >
                🗑
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white text-2xl leading-none w-7 h-7 flex items-center justify-center rounded hover:bg-slate-700 transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-slate-50">
            <Bubble role="assistant" content={WELCOME} />
            {history.map((msg, i) => (
              <Bubble key={i} role={msg.role} content={msg.content} />
            ))}
            {loading && <Bubble role="assistant" content="" typing />}
            <div ref={bottomRef} />
          </div>

          {/* Sugerencias rápidas */}
          {history.length === 0 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 bg-slate-50 shrink-0">
              {['¿Qué hay en el menú?', 'Registrar cliente', 'Agregar producto'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); }}
                  className="text-xs bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full hover:border-amber-300 hover:text-amber-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-slate-200 p-3 flex gap-2 bg-white shrink-0">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe tu mensaje..."
              className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="rounded-xl bg-amber-500 text-white px-3 py-2 text-sm font-bold hover:bg-amber-600 disabled:opacity-40 transition-colors shadow-sm"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-14 h-14 rounded-full text-white text-2xl shadow-lg flex items-center justify-center transition-all ${
          open
            ? 'bg-slate-700 hover:bg-slate-600 rotate-0'
            : 'bg-amber-500 hover:bg-amber-600 hover:scale-110'
        }`}
      >
        {open ? '×' : '☕'}
      </button>
    </div>
  )
}
