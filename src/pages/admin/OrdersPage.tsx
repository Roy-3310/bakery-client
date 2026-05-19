import { useEffect, useState } from 'react'
import { getOrders, updateOrderStatus } from '../../services/orderService'
import type { Order, OrderStatus, PaymentStatus } from '../../types'
import styles from './OrdersPage.module.scss'

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: '待確認' },
  { value: 'confirmed', label: '已確認' },
  { value: 'preparing', label: '製作中' },
  { value: 'ready', label: '待取貨' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
]

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'unpaid', label: '未付款' },
  { value: 'paid', label: '已付款' },
  { value: 'refunded', label: '已退款' },
]

const STATUS_COLOR: Record<string, string> = {
  pending: 'orange', confirmed: 'blue', preparing: 'purple',
  ready: 'teal', completed: 'gray', cancelled: 'red',
}

const PAYMENT_COLOR: Record<string, string> = {
  unpaid: 'orange', paid: 'green', refunded: 'red',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = async (status?: OrderStatus | '') => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string> = { limit: '50' }
      if (status) params.status = status
      const data = await getOrders(params)
      setOrders(data.orders)
      setTotal(data.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : '載入失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders(filterStatus) }, [filterStatus])

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setUpdatingId(id)
    try {
      const updated = await updateOrderStatus(id, status)
      setOrders(prev => prev.map(o => o._id === id ? updated : o))
    } catch (e) {
      alert(e instanceof Error ? e.message : '更新失敗')
    } finally {
      setUpdatingId(null)
    }
  }

  const handlePaymentChange = async (id: string, paymentStatus: PaymentStatus, currentStatus: OrderStatus) => {
    setUpdatingId(id)
    try {
      const updated = await updateOrderStatus(id, currentStatus, paymentStatus)
      setOrders(prev => prev.map(o => o._id === id ? updated : o))
    } catch (e) {
      alert(e instanceof Error ? e.message : '更新失敗')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>訂單管理</h1>
          <p className={styles.subheading}>共 {total} 筆訂單</p>
        </div>
      </div>

      {/* 狀態篩選 */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filterStatus === '' ? styles.filterActive : ''}`}
          onClick={() => setFilterStatus('')}
        >
          全部
        </button>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s.value}
            className={`${styles.filterBtn} ${filterStatus === s.value ? styles.filterActive : ''}`}
            onClick={() => setFilterStatus(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingRow}>載入中...</div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyRow}>沒有符合的訂單</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>訂單編號</th>
                  <th>客戶</th>
                  <th>金額</th>
                  <th>訂單狀態</th>
                  <th>付款狀態</th>
                  <th>日期</th>
                  <th>詳情</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <>
                    <tr key={order._id} className={expandedId === order._id ? styles.expandedRow : ''}>
                      <td className={styles.orderNumber}>{order.orderNumber}</td>
                      <td>
                        <p className={styles.customerName}>{order.customer.name}</p>
                        <p className={styles.customerEmail}>{order.customer.email}</p>
                      </td>
                      <td className={styles.amount}>NT$ {order.totalAmount.toLocaleString()}</td>
                      <td>
                        <select
                          className={`${styles.statusSelect} ${styles[STATUS_COLOR[order.status] ?? 'gray']}`}
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value as OrderStatus)}
                          disabled={updatingId === order._id}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className={`${styles.statusSelect} ${styles[PAYMENT_COLOR[order.paymentStatus] ?? 'gray']}`}
                          value={order.paymentStatus}
                          onChange={e => handlePaymentChange(order._id, e.target.value as PaymentStatus, order.status)}
                          disabled={updatingId === order._id}
                        >
                          {PAYMENT_OPTIONS.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                      </td>
                      <td>
                        <button
                          className={styles.expandBtn}
                          onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                        >
                          {expandedId === order._id ? '收起' : '展開'}
                        </button>
                      </td>
                    </tr>

                    {expandedId === order._id && (
                      <tr key={`${order._id}-detail`}>
                        <td colSpan={7} className={styles.detailCell}>
                          <div className={styles.detailGrid}>
                            <div>
                              <h4 className={styles.detailSection}>客戶資訊</h4>
                              <p>電話：{order.customer.phone}</p>
                              <p>地址：{order.customer.address}</p>
                              {order.customer.note && <p>備註：{order.customer.note}</p>}
                            </div>
                            <div>
                              <h4 className={styles.detailSection}>訂購商品</h4>
                              {order.items.map((item, i) => (
                                <p key={i}>{item.name} × {item.quantity} — NT$ {(item.price * item.quantity).toLocaleString()}</p>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
