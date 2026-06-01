import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
// Pages will be added as features are implemented
// import { Dashboard } from '@/pages/Dashboard'
// import { Login } from '@/pages/Login'
// import { KillLog } from '@/pages/KillLog'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#13151f',
            color: '#e8e8e8',
            border: '1px solid #2a2d42',
          },
        }}
      />
      {/* Routes will be enabled as each feature is built */}
      <Routes>
        <Route path="/" element={<PlaceholderHome />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function PlaceholderHome() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-4">
      <h1 className="font-display text-rag-accent text-sm">TRUEMMO MVP Timer</h1>
      <p className="text-rag-muted text-sm">🚧 Under construction — see GitHub Issues for progress</p>
    </div>
  )
}
