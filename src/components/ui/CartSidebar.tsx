import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import CheckoutModal from './CheckoutModal'
import styles from './CartSidebar.module.scss'

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩 */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className={styles.backdrop}
          />

          {/* 側面板 */}
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className={styles.panel}
          >
            {/* Header */}
            <div className={styles.header}>
              <div>
                <h2 className={styles.title}>購物車</h2>
                <p className={styles.subtitle}>
                  {items.length > 0
                    ? `共 ${items.reduce((s, i) => s + i.quantity, 0)} 件商品`
                    : '尚無商品'}
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className={styles.closeBtn} aria-label="關閉">
                <CloseIcon />
              </button>
            </div>

            {/* 商品列表 */}
            <div className={styles.itemList}>
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.emptyState}
                  >
                    <div className={styles.emptyIcon}><BagEmptyIcon /></div>
                    <p className={styles.emptyTitle}>購物車是空的</p>
                    <p className={styles.emptyDesc}>快去挑選您喜歡的商品吧</p>
                  </motion.div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className={styles.cartItem}
                    >
                      <div className={styles.itemThumb}>
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className={styles.itemInfo}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <p className={styles.itemUnitPrice}>NT${item.price} × {item.quantity}</p>
                        <div className={styles.qtyControls}>
                          <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                      </div>

                      <div className={styles.itemActions}>
                        <span className={styles.itemTotal}>NT${item.price * item.quantity}</span>
                        <button onClick={() => removeItem(item.id)} className={styles.removeBtn} aria-label="移除">
                          <TrashIcon />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* 結帳區 */}
            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotalRow}>
                  <span className={styles.subtotalLabel}>小計</span>
                  <span className={styles.subtotalValue}>NT${totalPrice.toLocaleString()}</span>
                </div>
                <p className={styles.shippingNote}>運費將於結帳時計算</p>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={styles.checkoutBtn}
                  onClick={() => setCheckoutOpen(true)}
                >
                  立即結帳 →
                </motion.button>

                <button onClick={clearCart} className={styles.clearBtn}>清空購物車</button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>

    <CheckoutModal
      isOpen={checkoutOpen}
      onClose={() => setCheckoutOpen(false)}
    />
    </>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function BagEmptyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  )
}
