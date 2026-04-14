import { useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { signOut, deleteUser } from 'firebase/auth'

interface Topic {
  topicId: string
  topic: string
  level: string
  goal: string
  milestones: any[]
}

const badges = [
  { id: 'first_milestone', emoji: '🌱', title: 'First Step', desc: 'Complete your first milestone', condition: (completed: number) => completed >= 1 },
  { id: 'five_milestones', emoji: '🔥', title: 'On Fire', desc: 'Complete 5 milestones', condition: (completed: number) => completed >= 5 },
  { id: 'ten_milestones', emoji: '⚡', title: 'Lightning Learner', desc: 'Complete 10 milestones', condition: (completed: number) => completed >= 10 },
  { id: 'first_topic', emoji: '🎯', title: 'Goal Setter', desc: 'Add your first learning topic', condition: (_: number, topics: number) => topics >= 1 },
  { id: 'multi_topic', emoji: '🧠', title: 'Multi-Learner', desc: 'Learn 3 topics at once', condition: (_: number, topics: number) => topics >= 3 },
  { id: 'halfway', emoji: '🏃', title: 'Halfway There', desc: 'Complete 50% of a roadmap', condition: (_: number, __: number, maxPercent: number) => maxPercent >= 50 },
  { id: 'completionist', emoji: '🏆', title: 'Completionist', desc: 'Finish an entire roadmap', condition: (_: number, __: number, maxPercent: number) => maxPercent >= 100 },
  { id: 'quiz_master', emoji: '📝', title: 'Quiz Master', desc: 'Complete a quiz', condition: (_: number, __: number, ___: number, quizDone: boolean) => quizDone },
]

export default function Dashboard() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const userId = auth.currentUser?.uid
      if (!userId) { navigate('/'); return }
      const snap = await getDocs(collection(db, 'users', userId, 'roadmaps'))
      setTopics(snap.docs.map(d => d.data() as Topic))
      const lastLogin = localStorage.getItem('lastLogin')
      const today = new Date().toDateString()
      const storedStreak = parseInt(localStorage.getItem('streak') || '0')
      if (lastLogin === today) {
        setStreak(storedStreak)
      } else if (lastLogin === new Date(Date.now() - 86400000).toDateString()) {
        const newStreak = storedStreak + 1
        setStreak(newStreak)
        localStorage.setItem('streak', newStreak.toString())
        localStorage.setItem('lastLogin', today)
      } else {
        setStreak(1)
        localStorage.setItem('streak', '1')
        localStorage.setItem('lastLogin', today)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const totalMilestones = topics.reduce((acc, t) => acc + (t.milestones?.length || 0), 0)
  const totalCompleted = topics.reduce((acc, t) => acc + (t.milestones?.filter((m: any) => m.completed).length || 0), 0)
  const overallPercent = totalMilestones ? Math.round((totalCompleted / totalMilestones) * 100) : 0
  const maxPercent = topics.reduce((max, t) => {
    const comp = t.milestones?.filter((m: any) => m.completed).length || 0
    const tot = t.milestones?.length || 0
    return Math.max(max, tot ? Math.round((comp / tot) * 100) : 0)
  }, 0)
  const quizDone = topics.some(t => t.milestones?.some((m: any) => m.quizDone))
  const unlockedBadges = badges.filter(b => b.condition(totalCompleted, topics.length, maxPercent, quizDone))

  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm('Are you sure you want to delete your account? This cannot be undone.')
    if (!confirm1) return
    const confirm2 = window.confirm('This will permanently delete all your learning data, roadmaps and progress. Continue?')
    if (!confirm2) return
    try {
      const userId = auth.currentUser?.uid!
      const snap = await getDocs(collection(db, 'users', userId, 'roadmaps'))
      for (const d of snap.docs) await deleteDoc(doc(db, 'users', userId, 'roadmaps', d.id))
      await deleteDoc(doc(db, 'users', userId))
      await deleteUser(auth.currentUser!)
      navigate('/')
    } catch (err: any) { alert(err.message) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '40px' }}>🔥</div><p>Loading...</p></div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', color: 'white', padding: '32px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <button onClick={() => navigate('/topics')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '14px', padding: 0, marginBottom: '8px' }}>← All Topics</button>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>📊 Dashboard</h1>
          </div>
          <button onClick={async () => { await signOut(auth); navigate('/') }} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer', fontSize: '14px' }}>Sign Out</button>
        </div>

        {/* Streak */}
        <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.08))', border: '1px solid rgba(251,146,60,0.25)', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '40px' }}>🔥</div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#fb923c' }}>{streak} day{streak !== 1 ? 's' : ''}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Current learning streak</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Topics', value: topics.length, emoji: '🗺️' },
            { label: 'Milestones Done', value: totalCompleted, emoji: '✅' },
            { label: 'Total', value: totalMilestones, emoji: '📌' },
            { label: 'Progress', value: `${overallPercent}%`, emoji: '📈' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.emoji}</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#fb923c' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: '14px' }}>Overall Progress</p>
          <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${overallPercent}%`, height: '100%', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: '5px', transition: 'width 0.5s' }} />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{overallPercent}% complete across all topics</p>
        </div>

        {/* Badges */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 16px', fontWeight: 600, fontSize: '14px' }}>🏆 Badges</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
            {badges.map(b => {
              const unlocked = unlockedBadges.find(u => u.id === b.id)
              return (
                <div key={b.id} style={{ padding: '14px', borderRadius: '12px', background: unlocked ? 'rgba(251,146,60,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${unlocked ? 'rgba(251,146,60,0.3)' : 'rgba(255,255,255,0.05)'}`, textAlign: 'center', opacity: unlocked ? 1 : 0.4 }}>
                  <div style={{ fontSize: '28px', marginBottom: '6px', filter: unlocked ? 'none' : 'grayscale(1)' }}>{b.emoji}</div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 700, color: unlocked ? '#fb923c' : 'rgba(255,255,255,0.5)' }}>{b.title}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{b.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
        {/* Spaced Repetition Reviews */}
{topics.some(t => t.milestones?.some((m: any) => m.reviewDate && !m.completed)) && (
  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(251,146,60,0.2)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
    <p style={{ margin: '0 0 16px', fontWeight: 600, fontSize: '14px', color: '#fb923c' }}>📅 Due for Review</p>
    {topics.map(t => t.milestones?.filter((m: any) => {
      if (!m.reviewDate || m.completed) return false
      return new Date(m.reviewDate) <= new Date()
    }).map((m: any) => (
      <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{m.title}</p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{t.topic}</p>
        </div>
        <button onClick={() => navigate(`/quiz/${t.topicId}/${m.id}`)} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Review Now</button>
      </div>
    )))}
  </div>
)}

        {/* Topics list */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
          <p style={{ margin: '0 0 16px', fontWeight: 600, fontSize: '14px' }}>Your Topics</p>
          {topics.map(t => {
            const comp = t.milestones?.filter((m: any) => m.completed).length || 0
            const tot = t.milestones?.length || 0
            const pct = tot ? Math.round((comp / tot) * 100) : 0
            return (
              <div key={t.topicId} onClick={() => navigate(`/roadmap/${t.topicId}`)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600 }}>{t.topic}</p>
                  <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: '2px' }} />
                  </div>
                </div>
                <span style={{ fontSize: '13px', color: '#fb923c', fontWeight: 700, minWidth: '40px', textAlign: 'right' }}>{pct}%</span>
              </div>
            )
          })}
        </div>

        {/* GDPR Section */}
        <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '14px', padding: '20px', marginTop: '20px' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: '14px', color: '#f87171' }}>⚠️ Danger Zone</p>
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Permanently delete your account and all associated data. This cannot be undone. (GDPR: Right to be Forgotten)</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleDeleteAccount} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>🗑️ Delete My Account</button>
            <button onClick={() => navigate('/privacy')} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px' }}>📄 Privacy Policy</button>
          </div>
        </div>
      </div>
    </div>
  )
}