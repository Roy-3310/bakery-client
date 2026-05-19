import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProducts } from '../../services/productService'
import { getOrders } from '../../services/orderService'
import { getMessages } from '../../services/contactService'
import type { Order } from '../../types'
import styles from './DashboardPage.module.scss'

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '待確認', confirmed: '已確認', preparing: '製作中',
  ready: '待取貨', completed: '已完成', cancelled: '已取消',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'orange', confirmed: 'blue', preparing: 'purple',
  ready: 'green', completed: 'gray', cancelled: 'red',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ products: 0, orders: 0, unread: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersData, messagesData] = await Promise.all([
          getOrders({ limit: '5' }),
          getMessages({ isRead: 'false', limit: '1' }),
        ])

        let productTotal = 0
        if (user?.role === 'admin') {
          const pData = await getProducts({ limit: '1' })
          productTotal = pData.total
        }

        setStats({
          products: productTotal,
          orders: ordersData.total,
          unread: messagesData.total,
        })
        setRecentOrders(ordersData.orders)
      } catch {
        // ignore fetch errors on dashboard
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [user])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return '早安'
    if (h < 18) return '午安'
    return '晚安'
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>{greeting()}，{user?.name} 👋</h1>
        <p className={styles.subheading}>以下是今日後台概況</p>
      </div>

      {/* 統計卡片 */}
      <div className={styles.statsGrid}>
        {user?.role === 'admin' && (
          <Link to="/admin/products" className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.gold}`}><BoxIcon /></div>
            <div>
              <p className={styles.statLabel}>商品總數</p>
              <p className={styles.statValue}>{loading ? '—' : stats.products}</p>
            </div>
          </Link>
        )}
        <Link to="/admin/orders" className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}><OrderIcon /></div>
          <div>
            <p className={styles.statLabel}>訂單總數</p>
            <p className={styles.statValue}>{loading ? '—' : stats.orders}</p>
          </div>
        </Link>
        <Link to="/admin/contacts" className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}><MailIcon /></div>
          <div>
            <p className={styles.statLabel}>未讀訊息</p>
            <p className={styles.statValue}>{loading ? '—' : stats.unread}</p>
          </div>
        </Link>
      </div>

      {/* 最近訂單 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>最近訂單</h2>
          <Link to="/admin/orders" className={styles.sectionLink}>查看全部 →</Link>
        </div>

        {loading ? (
          <div className={styles.loadingRow}>載入中...</div>
        ) : recentOrders.length === 0 ? (
          <div className={styles.emptyRow}>目前沒有訂單</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>訂單編號</th>
                  <th>客戶</th>
                  <th>金額</th>
                  <th>狀態</th>
                  <th>日期</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td className={styles.orderNumber}>{order.orderNumber}</td>
                    <td>{order.customer.name}</td>
                    <td>NT$ {order.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[STATUS_COLOR[order.status] ?? 'gray']}`}>
                        {ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function BoxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function OrderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}
