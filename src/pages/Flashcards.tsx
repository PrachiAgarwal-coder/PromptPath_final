import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { auth, db } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { callAI } from '../lib/ai'

interface Flashcard {
  question: string
  answer: string
}

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [topic, setTopic] = useState('')
  const [milestone, setMilestone] = useState('')
  const navigate = useNavigate()
  const { topicId, milestoneId } = useParams()

  useEffect(() => {
    const generate = async () => {
      const userId = auth.currentUser?.uid
      if (!userId) { navigate('/'); return }
      const snap = await getDoc(doc(db, 'users', userId, 'roadmaps', topicId!))
      if (snap.exists()) {
        const data = snap.data()
        setTopic(data.topic)
        const ms = data.milestones.find((m: any) => m.id === parseInt(milestoneId!))
        if (ms) {
          setMilestone(ms.title)
          const result = await callAI(
            `Generate 6 flashcards for the topic "${ms.title}" in the context of learning ${data.topic}. Return a JSON array of objects with "question" and "answer" fields. Keep answers concise (1-2 sentences).`,
            'You are an expert tutor. Return valid JSON array only, no markdown.'
          )
          setFlashcards(JSON.parse(result))
        }
      }
      setLoading(false)
    }
    generate()
  }, [])

  const next = () => { setFlipped(false); setTimeout(() => setCurrent(p => Math.min(p + 1, flashcards.length - 1)), 150) }
  const prev = () => { setFlipped(false); setTimeout(() => setCurrent(p => Math.max(p - 1, 0)), 150) }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '40px' }}>🃏</div><p>Generating flashcards...</p></div>
    </div>
  )

  const card = flashcards[current]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', color: 'white', padding: '32px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => navigate(`/roadmap/${topicId}`)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '14px', padding: 0, marginBottom: '24px' }}>← Back to Roadmap</button>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 800 }}>🃏 Flashcards</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>{topic} · {milestone}</p>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
          {flashcards.map((_, i) => (
            <div key={i} onClick={() => { setFlipped(false); setCurrent(i) }} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i === current ? '#fb923c' : 'rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.2s' }} />
          ))}
        </div>

        {/* Card */}
        <div onClick={() => setFlipped(!flipped)} style={{ cursor: 'pointer', perspective: '1000px', marginBottom: '24px' }}>
          <div style={{
            position: 'relative', width: '100%', height: '280px',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.5s ease'
          }}>
            {/* Front */}
            <div style={{
              position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.08))',
              border: '1px solid rgba(251,146,60,0.3)', borderRadius: '20px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', boxSizing: 'border-box'
            }}>
              <p style={{ fontSize: '12px', color: '#fb923c', fontWeight: 700, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Question {current + 1} of {flashcards.length}</p>
              <p style={{ fontSize: '20px', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>{card?.question}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '20px 0 0' }}>Tap to reveal answer</p>
            </div>
            {/* Back */}
            <div style={{
              position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(21,128,61,0.08))',
              border: '1px solid rgba(74,222,128,0.3)', borderRadius: '20px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', boxSizing: 'border-box'
            }}>
              <p style={{ fontSize: '12px', color: '#4ade80', fontWeight: 700, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Answer</p>
              <p style={{ fontSize: '18px', textAlign: 'center', lineHeight: 1.6, margin: 0, color: 'rgba(255,255,255,0.9)' }}>{card?.answer}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button onClick={prev} disabled={current === 0} style={{ padding: '12px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: current === 0 ? 'rgba(255,255,255,0.2)' : 'white', cursor: current === 0 ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600 }}>← Prev</button>
          <button onClick={next} disabled={current === flashcards.length - 1} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: current === flashcards.length - 1 ? 'rgba(251,146,60,0.3)' : 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', cursor: current === flashcards.length - 1 ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600 }}>Next →</button>
        </div>

        {current === flashcards.length - 1 && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: '#4ade80', fontSize: '16px', fontWeight: 600 }}>🎉 You've completed all flashcards!</p>
            <button onClick={() => navigate(`/quiz/${topicId}/${milestoneId}`)} style={{ marginTop: '12px', padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Take the Quiz →</button>
          </div>
        )}
      </div>
    </div>
  )
}