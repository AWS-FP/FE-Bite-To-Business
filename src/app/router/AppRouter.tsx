import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../../features/auth/pages/LoginPage'
import AuthInformationPage from '../../features/auth/pages/AuthInformationPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<AuthInformationPage kind="register" />} />
        <Route path="/forgot-password" element={<AuthInformationPage kind="forgot" />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
