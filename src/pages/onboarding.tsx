import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../lib/firebase'
import { doc, setDoc, collection } from 'firebase/firestore'
import { callAI } from '../lib/ai'

const questions = [
  { q: "What topic do you want to master?", placeholder: "e.g. Machine Learning, Web Development, Public Speaking...", emoji: "🎯" },
  { q: "What's your current level?", placeholder: "Beginner / Intermediate / Advanced", emoji: "📊", options: ["Beginner", "Intermediate", "Advanced"] },
  { q: "How many hours per day can you dedicate?", placeholder: "e.g. 1 hour, 2 hours...", emoji: "⏰", options: ["30 mins", "1 hour", "2 hours", "3+ hours"] },
  { q: "What's your main learning goal?", placeholder: "e.g. Get a job, Build a project, Pass an exam...", emoji: "🏆" },
  { q: "What's your preferred learning style?", placeholder: "Theory / Hands-on / Mixed", emoji: "🧠", options: ["Theory first", "Hands-on practice", "Mixed approach"] },
  { q: "What's your deadline or timeframe?", placeholder: "e.g. 3 months, 6 months, 1 year...", emoji: "📅", options: ["1 month", "3 months", "6 months", "1 year"] }
]

export default function Onboarding() {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''))
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const setAnswer = (val: string) => {
    const a = [...answers]; a[current] = val; setAnswers(a)
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const userId = auth.currentUser?.uid!
      const topicId = Date.now().toString()

      const roadmap = await callAI(
        `Create a detailed learning roadmap for: Topic: ${answers[0]}, Level: ${answers[1]}, Hours/day: ${answers[2]}, Goal: ${answers[3]}, Style: ${answers[4]}, Timeframe: ${answers[5]}. Return a JSON array of 8 milestone objects with fields: id (number), title (string), description (string 2-3 sentences), duration (string), topics (array of 4-5 strings), resources (array of 3 strings - specific book names, course names, or website names relevant to ${answers[0]}).`,
        'You are an expert learning coach. Always respond with valid JSON array only, no markdown, no explanation.'
      )

      const milestones = JSON.parse(roadmap)

      await setDoc(doc(collection(db, 'users', userId, 'roadmaps'), topicId), {
        topicId,
        milestones,
        topic: answers[0],
        level: answers[1],
        goal: answers[3],
        timeframe: answers[5],
        createdAt: new Date()
      })

      navigate(`/roadmap/${topicId}`)
    } catch (err: any) { alert(err.message) }
    setLoading(false)
  }

  const q = questions[current]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '560px', color: 'white' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {questions.map((_, i) => (
            <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= current ? '#8b5cf6' : 'rgba(255,255,255,0.15)', transition: 'background 0.3s' }} />
          ))}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>{q.emoji}</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 8px' }}>Question {current + 1} of {questions.length}</p>
          <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: 700 }}>{q.q}</h2>

          {q.options ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {q.options.map(opt => (
                <button key={opt} onClick={() => setAnswer(opt)} style={{
                  padding: '10px 20px', borderRadius: '12px',
                  border: `1px solid ${answers[current] === opt ? '#8b5cf6' : 'rgba(255,255,255,0.15)'}`,
                  background: answers[current] === opt ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)',
                  color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: answers[current] === opt ? 600 : 400
                }}>{opt}</button>
              ))}
            </div>
          ) : (
            <input
              value={answers[current]} onChange={e => setAnswer(e.target.value)}
              placeholder={q.placeholder}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginBottom: '24px' }}
            />
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            {current > 0 && (
              <button onClick={() => setCurrent(current - 1)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '15px' }}>Back</button>
            )}
            {current < questions.length - 1 ? (
              <button onClick={() => setCurrent(current + 1)} disabled={!answers[current]} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: answers[current] ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99,102,241,0.3)', color: 'white', cursor: answers[current] ? 'pointer' : 'not-allowed', fontSize: '15px', fontWeight: 600 }}>Next →</button>
            ) : (
              <button onClick={handleFinish} disabled={loading || !answers[current]} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: 600 }}>
                {loading ? '✨ Generating your roadmap...' : 'Generate My Roadmap 🚀'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}