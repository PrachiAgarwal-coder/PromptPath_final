import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { auth, db } from '../lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { callAI } from '../lib/ai'

interface Question {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [topic, setTopic] = useState('')
  const [milestone, setMilestone] = useState('')
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const navigate = useNavigate()
  const { topicId, milestoneId } = useParams()
  const autoComplete = new URLSearchParams(window.location.search).get('autoComplete') === 'true'

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
          setMilestoneTitle(ms.title)
          const result = await callAI(
            `Generate 5 multiple choice questions for "${ms.title}" in the context of learning ${data.topic}. Return a JSON array of objects with: "question" (string), "options" (array of 4 strings), "correct" (index 0-3 of correct option), "explanation" (string explaining why the answer is correct).`,
            'You are an expert tutor. Return valid JSON array only, no markdown.'
          )
          setQuestions(JSON.parse(result))
        }
      }
      setLoading(false)
    }
    generate()
  }, [])

  const handleAnswer = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === questions[current].correct) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (current === questions.length - 1) {
      const finalScore = score + (selected === questions[current]?.correct ? 1 : 0)
      setFinished(true)
      saveScore(finalScore)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const saveScore = async (finalScore: number) => {
    const userId = auth.currentUser?.uid
    if (!userId) return
    const snap = await getDoc(doc(db, 'users', userId, 'roadmaps', topicId!))
    if (!snap.exists()) return
    const data = snap.data()
    const passed = (finalScore / questions.length) * 100 >= 60

    // Schedule spaced repetition review (3 days from now)
    const reviewDate = new Date()
    reviewDate.setDate(reviewDate.getDate() + 3)

    // Knowledge gap — if failed, add a review milestone
    let milestones = data.milestones.map((m: any) =>
      m.id === parseInt(milestoneId!) ? {
        ...m,
        quizScore: finalScore,
        quizDone: true,
        completed: autoComplete && passed ? true : m.completed,
        reviewDate: reviewDate.toISOString(),
        needsReview: !passed
      } : m
    )

    // If failed, add knowledge gap milestone if not already there
    if (!passed) {
      const gapExists = milestones.some((m: any) => m.isGap && m.gapFor === milestoneTitle)
      if (!gapExists) {
        milestones = [...milestones, {
          id: Date.now(),
          title: `📖 Review: ${milestoneTitle}`,
          description: `You scored below 60% on the quiz for "${milestoneTitle}". This is a focused review session to strengthen your understanding.`,
          duration: '1-2 hours',
          topics: [`${milestoneTitle} fundamentals`, 'Key concepts review', 'Common mistakes'],
          resources: [`${milestoneTitle} beginner guide`, `${milestoneTitle} practice exercises`],
          completed: false,
          isGap: true,
          gapFor: milestoneTitle
        }]
      }
    }

    await updateDoc(doc(db, 'users', userId, 'roadmaps', topicId!), { milestones })
  }

  const finalScore = finished ? score : 0
  const percent = questions.length ? Math.round((finalScore / questions.length) * 100) : 0

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '40px' }}>📝</div><p>Generating quiz...</p></div>
    </div>
  )

  if (finished) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{percent >= 80 ? '🏆' : percent >= 60 ? '👍' : '💪'}</div>
        <h1 style={{ margin: '0 0 8px', fontSize: '32px', fontWeight: 800 }}>Quiz Complete!</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>{milestone}</p>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', marginBottom: '20px' }}>
          <div style={{ fontSize: '56px', fontWeight: 800, color: percent >= 80 ? '#4ade80' : percent >= 60 ? '#fb923c' : '#f87171' }}>{percent}%</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '8px 0 0' }}>You got {finalScore} out of {questions.length} correct</p>
        </div>

        {autoComplete && (
          <div style={{ padding: '14px 20px', borderRadius: '12px', background: percent >= 60 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${percent >= 60 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, marginBottom: '20px' }}>
            <p style={{ margin: 0, color: percent >= 60 ? '#4ade80' : '#f87171', fontWeight: 600, fontSize: '15px' }}>
              {percent >= 60 ? '✅ Milestone marked as complete!' : '❌ Score below 60% — keep studying! A review session has been added to your roadmap.'}
            </p>
          </div>
        )}

        {!autoComplete && percent < 60 && (
          <div style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', marginBottom: '20px' }}>
            <p style={{ margin: 0, color: '#f87171', fontWeight: 600, fontSize: '14px' }}>⚠️ A review session has been added to your roadmap to help fill this knowledge gap!</p>
          </div>
        )}

        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px', fontSize: '14px' }}>
          {percent >= 80 ? '🎉 Excellent work! You\'ve mastered this topic.' : percent >= 60 ? '👍 Good job! Keep going.' : '💪 Don\'t give up — review and try again!'}
        </p>

        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginBottom: '20px' }}>📅 This topic has been scheduled for review in 3 days</p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(`/roadmap/${topicId}`)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Back to Roadmap</button>
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false) }} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '14px' }}>Retry Quiz</button>
        </div>
      </div>
    </div>
  )

  const q = questions[current]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', color: 'white', padding: '32px 20px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <button onClick={() => navigate(`/roadmap/${topicId}`)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '14px', padding: 0, marginBottom: '24px' }}>← Back to Roadmap</button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>📝 {milestone}</h1>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{current + 1}/{questions.length}</span>
          </div>
          <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${((current + 1) / questions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: '2px', transition: 'width 0.3s' }} />
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px', marginBottom: '16px' }}>
          <p style={{ fontSize: '18px', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>{q?.question}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {q?.options.map((opt, i) => {
            let bg = 'rgba(255,255,255,0.04)'
            let border = 'rgba(255,255,255,0.08)'
            let color = 'rgba(255,255,255,0.85)'
            if (answered) {
              if (i === q.correct) { bg = 'rgba(74,222,128,0.12)'; border = 'rgba(74,222,128,0.4)'; color = '#4ade80' }
              else if (i === selected) { bg = 'rgba(248,113,113,0.12)'; border = 'rgba(248,113,113,0.4)'; color = '#f87171' }
            } else if (selected === i) { bg = 'rgba(251,146,60,0.15)'; border = 'rgba(251,146,60,0.4)'; color = '#fb923c' }
            return (
              <div key={i} onClick={() => handleAnswer(i)} style={{ padding: '14px 18px', borderRadius: '12px', border: `1px solid ${border}`, background: bg, cursor: answered ? 'default' : 'pointer', color, fontSize: '15px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1.5px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{['A', 'B', 'C', 'D'][i]}</span>
                {opt}
                {answered && i === q.correct && <span style={{ marginLeft: 'auto' }}>✓</span>}
                {answered && i === selected && i !== q.correct && <span style={{ marginLeft: 'auto' }}>✗</span>}
              </div>
            )
          })}
        </div>

        {answered && (
          <div style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', color: '#fb923c', fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase' }}>💡 Explanation</p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6 }}>{q?.explanation}</p>
          </div>
        )}

        {answered && (
          <button onClick={handleNext} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 700 }}>
            {current === questions.length - 1 ? 'See Results 🏆' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}