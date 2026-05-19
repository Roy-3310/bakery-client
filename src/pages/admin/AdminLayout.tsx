import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminLayout.module.scss'

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: '總覽', icon: <GridIcon /> },
  { to: '/admin/orders', label: '訂單管理', icon: <OrderIcon /> },
  { to: '/admin/contacts', label: '聯絡訊息', icon: <MailIcon /> },
]

const ADMIN_NAV_ITEMS = [
  { to: '/admin/products', label: '商品管理', icon: <BoxIcon /> },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const allNavItems = user?.role === 'admin'
    ? [...NAV_ITEMS, ...ADMIN_NAV_ITEMS]
    : NAV_ITEMS

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={styles.sidebarLogo}>
        <span className={styles.logoName}>Pure Bakery</span>
        <span className={styles.logoSub}>後台管理系統</span>
      </div>

      {/* 使用者資訊 */}
      <div className={styles.userInfo}>
        <div className={styles.userAvatar}>{user?.name?.[0] ?? 'U'}</div>
        <div>
          <p className={styles.userName}>{user?.name}</p>
          <span className={`${styles.roleBadge} ${user?.role === 'admin' ? styles.adminBadge : styles.staffBadge}`}>
            {user?.role === 'admin' ? '管理員' : '職員'}
          </span>
        </div>
      </div>

      {/* 導覽 */}
      <nav className={styles.nav}>
        {allNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 登出 */}
      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogoutIcon />
          登出
        </button>
      </div>
    </>
  )

  return (
    <div className={styles.layout}>
      {/* 桌機側邊欄 */}
      <aside className={styles.sidebar}>{sidebarContent}</aside>

      {/* 行動版覆層 */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`${styles.mobileSidebar} ${sidebarOpen ? styles.mobileSidebarOpen : ''}`}>
        {sidebarContent}
      </aside>

      {/* 主要內容 */}
      <div className={styles.main}>
        {/* 行動版頂部 */}
        <div className={styles.mobileHeader}>
          <button className={styles.hamburger} onClick={() => setSidebarOpen(true)}>
            <HamburgerIcon />
          </button>
          <span className={styles.mobileTitle}>Pure Bakery 後台</span>
        </div>

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
}

function OrderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}
