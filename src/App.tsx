import HomePage from './pages/HomePage'
import { AdminDashboard, AdminRegistrations } from './pages/AdminPages'
import AdminLogin from './pages/AdminLogin'

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/holywin/2026/admin/login') return <AdminLogin />
  if (path === '/holywin/2026/admin/dashboard') return <AdminDashboard />
  if (path === '/holywin/2026/admin/registrations') return <AdminRegistrations />

  return <HomePage />
}
