import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Onboarding from './pages/onboarding'
import Roadmap from './pages/roadmap'
import Dashboard from './pages/Dashboard'
import Topics from './pages/Topics'
import PromptOptimizer from './pages/PromptOptimizer'
import ChatTutor from './pages/ChatTutor'
import About from './pages/About'
import Flashcards from './pages/Flashcards'
import Quiz from './pages/Quiz'
import Privacy from './pages/Privacy'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/topics" element={<Topics />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/roadmap/:topicId" element={<Roadmap />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/optimizer" element={<PromptOptimizer />} />
      <Route path="/chat/:topicId/:milestoneId" element={<ChatTutor />} />
      <Route path="/about" element={<About />} />
      <Route path="/flashcards/:topicId/:milestoneId" element={<Flashcards />} />
      <Route path="/quiz/:topicId/:milestoneId" element={<Quiz />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  )
}

export default App