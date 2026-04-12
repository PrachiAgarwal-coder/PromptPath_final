import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { callAI } from '../lib/ai'

export default function PromptOptimizer() {
  const [prompt, setPrompt] = useState('')
  const [optimized, setOptimized] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<{ original: string, optimized: string }[]>([])
  const navigate = useNavigate()

  const optimize = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const result = await callAI(
        `Analyze this prompt and return a JSON object with two fields: "optimized" (an improved version of the prompt that is clearer, more specific, and will get better AI responses) and "explanation" (2-3 sentences explaining what you improved and why). Original prompt: "${prompt}"`,
        'You are an expert prompt engineer. Always respond with valid JSON only, no markdown.'
      )
      const parsed = JSON.parse(result)
      setOptimized(parsed.optimized)
      setExplanation(parsed.explanation)
      setHistory(prev => [{ original: prompt, optimized: parsed.optimized }, ...prev.slice(0, 4)])
    } catch (err: any) { alert(err.message) }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'sans-serif', color: 'white', padding: '32px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate('/topics')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '14px', padding: 0, marginBottom: '16px' }}>← Back to Topics</button>
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>⚡ Prompt Optimizer</h1>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.5)' }}>Turn weak prompts into powerful ones using AI</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px' }}>Your original prompt</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. explain machine learning... or tell me about python..."
            rows={4}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'sans-serif' }}
          />
          <button onClick={optimize} disabled={loading || !prompt.trim()} style={{ marginTop: '12px', padding: '12px 28px', borderRadius: '12px', border: 'none', background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? '⚡ Optimizing...' : '⚡ Optimize Prompt'}
          </button>
        </div>

        {optimized && (
          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '24px' }}>
              <p style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 600, margin: '0 0 12px' }}>✨ Optimized Prompt</p>
              <p style={{ fontSize: '15px', lineHeight: 1.7, margin: '0 0 16px', color: 'rgba(255,255,255,0.9)' }}>{optimized}</p>
              <button onClick={() => navigator.clipboard.writeText(optimized)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.15)', color: 'white', cursor: 'pointer', fontSize: '13px' }}>📋 Copy</button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '24px' }}>
              <p style={{ fontSize: '13px', color: '#60a5fa', fontWeight: 600, margin: '0 0 12px' }}>💡 What was improved</p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, margin: 0, color: 'rgba(255,255,255,0.7)' }}>{explanation}</p>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>🕐 Recent optimizations</p>
            {history.map((h, i) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: i < history.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' }}>Original: {h.original}</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>→ {h.optimized}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}