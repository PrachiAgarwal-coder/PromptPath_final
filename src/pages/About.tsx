import { useNavigate } from 'react-router-dom'

const steps = [
  { emoji: '📝', title: 'Sign Up', desc: 'Create your free account in seconds with just an email and password.' },
  { emoji: '🎯', title: 'Choose a Topic', desc: 'Tell PromptPath what you want to learn — anything from Python to Public Speaking.' },
  { emoji: '🧠', title: 'Answer 6 Questions', desc: 'Share your level, goals, time availability and learning style.' },
  { emoji: '🗺️', title: 'Get Your Roadmap', desc: 'AI generates a personalized 8-milestone roadmap just for you in seconds.' },
  { emoji: '📚', title: 'Study & Learn', desc: 'Expand each milestone, generate study material, get YouTube & Google links.' },
  { emoji: '🎓', title: 'Chat with AI Tutor', desc: 'Stuck on something? Chat with your personal AI tutor for any milestone.' },
  { emoji: '⚡', title: 'Optimize Your Prompts', desc: 'Use the Prompt Optimizer to get better answers from any AI tool.' },
  { emoji: '✅', title: 'Track Progress', desc: 'Mark milestones complete and watch your progress grow on the dashboard.' },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', color: 'white' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a0800, #2d1200, #1a0a00)', borderBottom: '1px solid rgba(251,146,60,0.15)', padding: '64px 20px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🧭</div>
          <h1 style={{ margin: '0 0 16px', fontSize: '42px', fontWeight: 800, background: 'linear-gradient(135deg, #fb923c, #f97316, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PromptPath</h1>
          <p style={{ margin: '0 0 8px', fontSize: '20px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>AI-powered personalized learning for everyone</p>
          <p style={{ margin: '0 0 32px', fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>PromptPath helps you learn anything faster with personalized AI roadmaps, an intelligent tutor, and smart prompt optimization — all in one place.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/')} style={{ padding: '13px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 700 }}>Get Started Free 🚀</button>
            <button onClick={() => navigate(-1)} style={{ padding: '13px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '15px' }}>← Go Back</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 20px' }}>

        {/* How to use */}
        <h2 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: 800, textAlign: 'center' }}>How to use PromptPath</h2>
        <p style={{ margin: '0 0 40px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: '15px' }}>Get started in minutes and learn anything with AI</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '64px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '28px', flexShrink: 0 }}>{s.emoji}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#fb923c', background: 'rgba(251,146,60,0.12)', padding: '2px 8px', borderRadius: '20px' }}>Step {i + 1}</span>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>{s.title}</h3>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* About the creator */}
        <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(234,88,12,0.06))', border: '1px solid rgba(251,146,60,0.2)', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px' }}>👩‍💻</div>
          <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 800 }}>Prachi Agarwal</h2>
          <p style={{ margin: '0 0 16px', color: '#fb923c', fontSize: '14px', fontWeight: 600 }}>Creator & Developer · RV University</p>
          <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.7, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            PromptPath was built as part of the AWS AI for Bharat Hackathon 2026. The vision was simple — make personalized, AI-driven learning accessible to everyone, regardless of background or experience level.
          </p>
          <p style={{ margin: '0 0 28px', color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: 1.7, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            As a CSE student at RV University, I wanted to solve a real problem — people spend hours searching for the right learning path. PromptPath eliminates that friction with AI that understands you and builds your path for you.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['CSE Student', 'RV University', 'AI Enthusiast', 'Hackathon Builder'].map(tag => (
              <span key={tag} style={{ padding: '6px 14px', borderRadius: '20px', background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)', fontSize: '13px', color: '#fdba74' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 32px', fontSize: '24px', fontWeight: 800 }}>What makes PromptPath different?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
            {[
              { emoji: '🎯', text: 'Fully personalized to your level and goals' },
              { emoji: '🤖', text: 'AI tutor available for every single milestone' },
              { emoji: '📄', text: 'Downloadable PDF study material' },
              { emoji: '⚡', text: 'Prompt optimizer for better AI interactions' },
              { emoji: '🔥', text: 'Multiple learning topics at once' },
              { emoji: '📊', text: 'Progress dashboard across all topics' },
            ].map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{f.emoji}</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button onClick={() => navigate('/')} style={{ padding: '14px 36px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}>Start Learning Now 🚀</button>
        </div>
      </div>
    </div>
  )
}