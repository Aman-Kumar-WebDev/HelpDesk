import { Navigate, Route, Routes } from 'react-router'
import GuestRoute from './components/GuestRoute.tsx'
import ProtectedLayout from './components/ProtectedLayout.tsx'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/LoginPage.tsx'

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route element={<ProtectedLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
