import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email || !password) return alert('Please fill in all fields')
    setLoading(true)
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password)
        navigate('/onboarding')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        navigate('/topics')
      }
    } catch (err: any) { alert(err.message) }
    setLoading(false)
  }

  const features = [
    { emoji: '🧭', title: 'Personalized Roadmaps', desc: 'AI generates a custom learning path just for you' },
    { emoji: '🎓', title: 'AI Tutor', desc: 'Chat with your personal tutor for any milestone' },
    { emoji: '⚡', title: 'Prompt Optimizer', desc: 'Turn weak prompts into powerful ones instantly' },
    { emoji: '📊', title: 'Progress Tracking', desc: 'Track your journey across multiple topics' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'sans-serif', background: '#0a0a0a' }}>
      {/* Left side */}
      <div style={{ flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, #1a0a00, #2d1200, #1a0800)', borderRight: '1px solid rgba(251,146,60,0.15)' }}>
        <div style={{ maxWidth: '480px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧭</div>
          <h1 style={{ margin: '0 0 8px', fontSize: '36px', fontWeight: 800, color: 'white' }}>PromptPath</h1>
          <p style={{ margin: '0 0 48px', fontSize: '16px', color: 'rgba(251,146,60,0.7)' }}>Your AI-powered personalized learning companion</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {features.map(f => (
              <div key={f.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '24px', flexShrink: 0 }}>{f.emoji}</div>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'white', fontSize: '15px' }}>{f.title}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ width: '440px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', background: '#0f0f0f' }}>
        <div style={{ width: '100%', color: 'white' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 700 }}>{isSignup ? 'Create Account' : 'Welcome back'}</h2>
          <p style={{ margin: '0 0 32px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>{isSignup ? 'Start your learning journey today' : 'Continue where you left off'}</p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(251,146,60,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(251,146,60,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: loading ? 'rgba(251,146,60,0.4)' : 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={() => setIsSignup(!isSignup)} style={{ color: '#fb923c', cursor: 'pointer', fontWeight: 600 }}>
              {isSignup ? 'Sign In' : 'Sign Up'}
            </span>
          </p>

          <p onClick={() => navigate('/about')} style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>About PromptPath →</p>
        </div>
      </div>
    </div>
  )
}