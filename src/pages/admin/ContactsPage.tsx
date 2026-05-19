import { useEffect, useState } from 'react'
import { getMessages, markMessageAsRead } from '../../services/contactService'
import type { ContactMessage } from '../../types'
import styles from './ContactsPage.module.scss'

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterRead, setFilterRead] = useState<'' | 'false' | 'true'>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [markingId, setMarkingId] = useState<string | null>(null)

  const fetchMessages = async (isRead?: '' | 'false' | 'true') => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string> = { limit: '50' }
      if (isRead) params.isRead = isRead
      const data = await getMessages(params)
      setMessages(data.messages)
      setTotal(data.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : '載入失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages(filterRead) }, [filterRead])

  const handleMarkRead = async (id: string) => {
    setMarkingId(id)
    try {
      const updated = await markMessageAsRead(id)
      setMessages(prev => prev.map(m => m._id === id ? updated : m))
    } catch (e) {
      alert(e instanceof Error ? e.message : '操作失敗')
    } finally {
      setMarkingId(null)
    }
  }

  const unreadCount = messages.filter(m => !m.isRead).length

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>聯絡訊息</h1>
          <p className={styles.subheading}>
            共 {total} 則訊息
            {unreadCount > 0 && <span className={styles.unreadBadge}>{unreadCount} 未讀</span>}
          </p>
        </div>
      </div>

      {/* 篩選 */}
      <div className={styles.filters}>
        {([['', '全部'], ['false', '未讀'], ['true', '已讀']] as const).map(([val, label]) => (
          <button
            key={val}
            className={`${styles.filterBtn} ${filterRead === val ? styles.filterActive : ''}`}
            onClick={() => setFilterRead(val)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingRow}>載入中...</div>
        ) : messages.length === 0 ? (
          <div className={styles.emptyRow}>沒有符合的訊息</div>
        ) : (
          <div className={styles.list}>
            {messages.map(msg => (
              <div key={msg._id} className={`${styles.msgItem} ${!msg.isRead ? styles.unread : ''}`}>
                <div className={styles.msgMain}>
                  <div className={styles.msgMeta}>
                    {!msg.isRead && <span className={styles.unreadDot} />}
                    <span className={styles.msgName}>{msg.name}</span>
                    <span className={styles.msgEmail}>{msg.email}</span>
                    <span className={styles.msgDate}>
                      {new Date(msg.createdAt).toLocaleString('zh-TW', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className={styles.msgPreview}>
                    {expandedId === msg._id ? msg.message : msg.message.slice(0, 80) + (msg.message.length > 80 ? '...' : '')}
                  </p>
                </div>

                <div className={styles.msgActions}>
                  {msg.message.length > 80 && (
                    <button
                      className={styles.expandBtn}
                      onClick={() => setExpandedId(expandedId === msg._id ? null : msg._id)}
                    >
                      {expandedId === msg._id ? '收起' : '展開'}
                    </button>
                  )}
                  {!msg.isRead && (
                    <button
                      className={styles.readBtn}
                      onClick={() => handleMarkRead(msg._id)}
                      disabled={markingId === msg._id}
                    >
                      {markingId === msg._id ? '...' : '標記已讀'}
                    </button>
                  )}
                  {msg.isRead && <span className={styles.readLabel}>已讀</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
