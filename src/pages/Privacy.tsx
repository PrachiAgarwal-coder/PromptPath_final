import { useNavigate } from 'react-router-dom'

export default function Privacy() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', color: 'white', padding: '32px 20px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '14px', padding: 0, marginBottom: '24px' }}>← Back</button>
        <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 800 }}>📄 Privacy Policy</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '40px', fontSize: '14px' }}>Last updated: April 2026</p>

        {[
          { title: '1. Data We Collect', content: 'We collect your email address for authentication, your learning preferences and goals entered during onboarding, your progress data including completed milestones and quiz scores, and prompts you enter into the AI chat and optimizer features.' },
          { title: '2. How We Use Your Data', content: 'Your data is used solely to provide personalized learning experiences. We use it to generate your learning roadmap, track your progress, and improve AI responses. We do not sell your data to third parties.' },
          { title: '3. Third-Party Services', content: 'We use Firebase (Google) for authentication and data storage, and Groq AI for generating learning content. Your prompts are sent to Groq AI to generate responses. We anonymize data where possible before sending to third-party services.' },
          { title: '4. Your Rights (GDPR)', content: 'You have the right to access your data at any time through your dashboard. You have the right to delete your account and all associated data permanently using the "Delete My Account" button in your dashboard. You have the right to data portability.' },
          { title: '5. Data Security', content: 'All data is transmitted over HTTPS. Firebase provides encryption at rest and in transit. We follow industry best practices for data security.' },
          { title: '6. Data Retention', content: 'Your data is retained as long as your account is active. When you delete your account, all your data is permanently removed from our systems within 24 hours.' },
          { title: '7. Contact', content: 'For any privacy concerns or data requests, contact us at prachi0923.agarwal@gmail.com' },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: '28px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 700, color: '#fb923c' }}>{s.title}</h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}