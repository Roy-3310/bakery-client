import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface Props {
  requiredRole?: 'admin'
}

export default function ProtectedRoute({ requiredRole }: Props) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#FEFDF9',
      }}>
        <span style={{ color: '#C9A96E', fontSize: '0.875rem', letterSpacing: '0.1em' }}>
          載入中...
        </span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/admin/orders" replace />
  }

  return <Outlet />
}
