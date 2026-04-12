import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { auth, db } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { callAI } from '../lib/ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatTutor() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [milestone, setMilestone] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { topicId, milestoneId } = useParams()

  useEffect(() => {
    const fetchContext = async () => {
      const userId = auth.currentUser?.uid
      if (!userId) { navigate('/'); return }
      const snap = await getDoc(doc(db, 'users', userId, 'roadmaps', topicId!))
      if (snap.exists()) {
        const data = snap.data()
        setTopic(data.topic)
        const ms = data.milestones.find((m: any) => m.id === parseInt(milestoneId!))
        if (ms) setMilestone(ms.title)
        setMessages([{
          role: 'assistant',
          content: `Hi! I'm your AI tutor for **${data.topic}** — specifically here to help you with **${ms?.title || 'this milestone'}**. Ask me anything — concepts, examples, exercises, or anything you're stuck on! 🎓`
        }])
      }
    }
    fetchContext()
  }, [topicId, milestoneId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`).join('\n')
      const reply = await callAI(
        `Conversation so far:\n${history}\nStudent: ${input}`,
        `You are an expert, friendly tutor helping a student learn ${topic}, currently on the topic "${milestone}". Give clear, concise explanations. Use examples. If they ask for exercises, give them one. Keep responses focused and under 200 words unless a detailed explanation is needed.`
      )
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err: any) { alert(err.message) }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'sans-serif', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)' }}>
        <button onClick={() => navigate(`/roadmap/${topicId}`)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '14px', padding: 0 }}>←</button>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎓</div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '15px' }}>AI Tutor</p>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{topic} · {milestone}</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', maxWidth: '800px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginRight: '10px', flexShrink: 0, alignSelf: 'flex-end' }}>🎓</div>
            )}
            <div style={{
              maxWidth: '70%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.08)',
              border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎓</div>
            <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '10px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask your tutor anything..."
            style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '15px', outline: 'none' }}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '20px' }}>↑</button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '8px 0 0' }}>Press Enter to send</p>
      </div>
    </div>
  )
}