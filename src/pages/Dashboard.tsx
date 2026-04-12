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
  milestones: any[]
}

export default function Dashboard() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const userId = auth.currentUser?.uid
      if (!userId) { navigate('/'); return }
      const snap = await getDocs(collection(db, 'users', userId, 'roadmaps'))
      setTopics(snap.docs.map(d => d.data() as Topic))
      setLoading(false)
    }
    fetchData()
  }, [])

  const totalMilestones = topics.reduce((acc, t) => acc + (t.milestones?.length || 0), 0)
  const totalCompleted = topics.reduce((acc, t) => acc + (t.milestones?.filter((m: any) => m.completed).length || 0), 0)
  const overallPercent = totalMilestones ? Math.round((totalCompleted / totalMilestones) * 100) : 0

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '40px' }}>⚡</div><p>Loading...</p></div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'sans-serif', color: 'white', padding: '32px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <button onClick={() => navigate('/topics')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '14px', padding: 0, marginBottom: '8px' }}>← All Topics</button>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>📊 Dashboard</h1>
            <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.5)' }}>Overall learning progress</p>
          </div>
          <button onClick={async () => { await signOut(auth); navigate('/') }} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(255,100,100,0.1)', color: 'white', cursor: 'pointer', fontSize: '14px' }}>Sign Out</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Topics', value: topics.length, emoji: '🗺️' },
            { label: 'Total Milestones', value: totalMilestones, emoji: '📌' },
            { label: 'Completed', value: totalCompleted, emoji: '✅' },
            { label: 'Progress', value: `${overallPercent}%`, emoji: '📈' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.emoji}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#a78bfa' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <p style={{ margin: '0 0 12px', fontWeight: 600 }}>Overall Progress</p>
          <div style={{ height: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ width: `${overallPercent}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '6px', transition: 'width 0.5s' }} />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{overallPercent}% complete across all topics</p>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {topics.map(t => {
            const comp = t.milestones?.filter((m: any) => m.completed).length || 0
            const tot = t.milestones?.length || 0
            const pct = tot ? Math.round((comp / tot) * 100) : 0
            return (
              <div key={t.topicId} onClick={() => navigate(`/roadmap/${t.topicId}`)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{t.topic}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{t.level} · {comp}/{tot} milestones</p>
                  </div>
                  <span style={{ color: '#a78bfa', fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '3px' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}