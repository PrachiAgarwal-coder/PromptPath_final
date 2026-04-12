import { useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'

interface Topic {
  topicId: string
  topic: string
  level: string
  goal: string
  timeframe: string
  milestones: any[]
  createdAt: any
}

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
]

const topicColors = [
  { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)', accent: '#fb923c', bar: 'linear-gradient(90deg, #f97316, #ea580c)' },
  { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', accent: '#f87171', bar: 'linear-gradient(90deg, #ef4444, #dc2626)' },
  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', accent: '#fbbf24', bar: 'linear-gradient(90deg, #f59e0b, #d97706)' },
  { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)', accent: '#f472b6', bar: 'linear-gradient(90deg, #ec4899, #db2777)' },
  { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', accent: '#c084fc', bar: 'linear-gradient(90deg, #a855f7, #9333ea)' },
  { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', accent: '#facc15', bar: 'linear-gradient(90deg, #eab308, #ca8a04)' },
  { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', accent: '#fb923c', bar: 'linear-gradient(90deg, #f97316, #c2410c)' },
  { bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.3)', accent: '#fca5a5', bar: 'linear-gradient(90deg, #dc2626, #b91c1c)' },
]

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const quote = quotes[new Date().getDay() % quotes.length]
  const emojis = ['🎯', '🚀', '💡', '🧠', '🔥', '⚡', '🌟', '📚']

  useEffect(() => {
    const fetchTopics = async () => {
      const userId = auth.currentUser?.uid
      if (!userId) { navigate('/'); return }
      const snap = await getDocs(collection(db, 'users', userId, 'roadmaps'))
      const data = snap.docs.map(d => d.data() as Topic)
      data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      setTopics(data)
      setLoading(false)
    }
    fetchTopics()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '40px' }}>🔥</div><p>Loading your topics...</p></div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', color: 'white', padding: '32px 20px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800 }}>🧭 PromptPath</h1>
            <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Your learning journeys</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/about')} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '13px' }}>About</button>
            <button onClick={() => navigate('/optimizer')} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid rgba(251,146,60,0.3)', background: 'rgba(251,146,60,0.08)', color: '#fb923c', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>⚡ Prompt Optimizer</button>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', fontSize: '13px' }}>📊 Dashboard</button>
            <button onClick={() => navigate('/onboarding')} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>+ New Topic</button>
            <button onClick={async () => { await signOut(auth); navigate('/') }} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer', fontSize: '13px' }}>Sign Out</button>
          </div>
        </div>

        {/* Quote */}
        <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(234,88,12,0.08))', border: '1px solid rgba(251,146,60,0.2)', borderRadius: '14px', padding: '18px 22px', marginBottom: '28px' }}>
          <p style={{ margin: 0, fontSize: '15px', fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>"{quote.text}"</p>
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#fb923c' }}>— {quote.author}</p>
        </div>

        {topics.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌱</div>
            <h2 style={{ margin: '0 0 8px' }}>No learning paths yet</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>Start your first learning journey!</p>
            <button onClick={() => navigate('/onboarding')} style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}>Get Started 🚀</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
            {topics.map((t, i) => {
              const c = topicColors[i % topicColors.length]
              const completed = t.milestones?.filter((m: any) => m.completed).length || 0
              const total = t.milestones?.length || 0
              const percent = total ? Math.round((completed / total) * 100) : 0
              return (
                <div key={t.topicId} onClick={() => navigate(`/roadmap/${t.topicId}`)}
                  style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '18px', padding: '22px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${c.border}` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '32px' }}>{emojis[i % emojis.length]}</div>
                      <div>
                        <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'white' }}>{t.topic}</h2>
                        <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{t.level} · {t.timeframe}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: c.accent }}>{percent}%</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{completed}/{total}</div>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>🎯 {t.goal}</p>
                  <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: c.bar, borderRadius: '3px', transition: 'width 0.5s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}