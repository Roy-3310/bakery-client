import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { createOrder } from '../../services/orderService'
import type { OrderCustomer } from '../../types'
import styles from './CheckoutModal.module.scss'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const EMPTY_FORM: OrderCustomer = {
  name: '',
  email: '',
  phone: '',
  address: '',
  note: '',
}

export default function CheckoutModal({ isOpen, onClose }: Props) {
  const { items, totalPrice, clearCart } = useCart()
  const [form, setForm] = useState<OrderCustomer>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  const set = (field: keyof OrderCustomer) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleClose = () => {
    if (submitting) return
    setForm(EMPTY_FORM)
    setError('')
    setOrderNumber('')
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        customer: form,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
      }
      const order = await createOrder(payload)
      setOrderNumber(order.orderNumber)
      clearCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : '訂單送出失敗，請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.overlay}
            onClick={orderNumber ? handleClose : undefined}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25 }}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
          >
            {orderNumber ? (
              /* 成功畫面 */
              <div className={styles.success}>
                <div className={styles.successIcon}><CheckIcon /></div>
                <h2 className={styles.successTitle}>訂單已成立！</h2>
                <p className={styles.successDesc}>感謝您的購買，我們將盡快為您準備。</p>
                <p className={styles.orderNumber}>訂單編號：<strong>{orderNumber}</strong></p>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={styles.doneBtn}
                  onClick={handleClose}
                >
                  完成
                </motion.button>
              </div>
            ) : (
              <>
                {/* 標題列 */}
                <div className={styles.header}>
                  <h2 className={styles.title}>填寫收件資料</h2>
                  <button className={styles.closeBtn} onClick={handleClose} aria-label="關閉">
                    <CloseIcon />
                  </button>
                </div>

                {/* 訂單摘要 */}
                <div className={styles.summary}>
                  <div className={styles.summaryRows}>
                    {items.map(item => (
                      <div key={item.id} className={styles.summaryRow}>
                        <span className={styles.summaryName}>{item.name} × {item.quantity}</span>
                        <span className={styles.summaryPrice}>NT${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.summaryTotal}>
                    <span>合計</span>
                    <span>NT${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* 表單 */}
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.row2}>
                    <div className={styles.field}>
                      <label className={styles.label}>姓名</label>
                      <input
                        className={styles.input}
                        type="text"
                        required
                        minLength={2}
                        placeholder="陳小明"
                        value={form.name}
                        onChange={set('name')}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>手機號碼</label>
                      <input
                        className={styles.input}
                        type="tel"
                        required
                        pattern="^09\d{8}$"
                        placeholder="09xxxxxxxx"
                        value={form.phone}
                        onChange={set('phone')}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>電子信箱</label>
                    <input
                      className={styles.input}
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={set('email')}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>收件地址</label>
                    <input
                      className={styles.input}
                      type="text"
                      required
                      minLength={5}
                      placeholder="台北市大安區..."
                      value={form.address}
                      onChange={set('address')}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>備註（選填）</label>
                    <textarea
                      className={styles.textarea}
                      rows={2}
                      maxLength={500}
                      placeholder="例：請勿按門鈴、指定時段..."
                      value={form.note}
                      onChange={set('note')}
                    />
                  </div>

                  {error && <p className={styles.error}>{error}</p>}

                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    type="submit"
                    className={styles.submitBtn}
                    disabled={submitting}
                  >
                    {submitting ? '送出中...' : '確認訂單'}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
