import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Onboarding from './pages/onboarding'
import Roadmap from './pages/roadmap'
import Dashboard from './pages/Dashboard'
import Topics from './pages/Topics'
import PromptOptimizer from './pages/PromptOptimizer'
import ChatTutor from './pages/ChatTutor'
import About from './pages/About'
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
    </Routes>
  )
}

export default App