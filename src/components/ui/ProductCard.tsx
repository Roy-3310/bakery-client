import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import styles from './ProductCard.module.scss'

interface ProductCardProps {
  product: Product
  index?: number
  priority?: boolean
}

const BADGE_CLASS: Record<string, string> = {
  '推薦': styles.badgeRecommend,
  '熱銷': styles.badgeHot,
  '季節限定': styles.badgeSeasonal,
  '新品': styles.badgeNew,
}

export default function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  const btnClass = [
    styles.addBtn,
    product.stock === 0 ? styles.soldOut : added ? styles.added : '',
  ].join(' ')

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      {...(priority
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' } }
      )}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={styles.card}
    >
      {/* 圖片 */}
      <div className={styles.imageWrapper}>
        {!imgLoaded && <div className={styles.imageSkeleton} />}
        <motion.img
          src={product.image}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`${styles.cardImage} ${imgLoaded ? styles.visible : styles.hidden}`}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {product.badge && (
          <span className={`${styles.badge} ${BADGE_CLASS[product.badge] ?? styles.badgeRecommend}`}>
            {product.badge}
          </span>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          className={styles.favoriteBtn}
          aria-label="收藏"
        >
          <HeartIcon />
        </motion.button>
      </div>

      {/* 文字 */}
      <div className={styles.content}>
        <div>
          <p className={styles.nameEn}>{product.nameEn}</p>
          <h3 className={styles.name}>{product.name}</h3>
        </div>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.cardFooter}>
          <span className={styles.price}>NT${product.price}</span>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={btnClass}
          >
            {product.stock === 0 ? (
              '已售完'
            ) : added ? (
              <><CheckIcon />已加入</>
            ) : (
              <><PlusIcon />加入購物車</>
            )}
          </motion.button>
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className={styles.stockWarning}>僅剩 {product.stock} 件</p>
        )}
      </div>
    </motion.article>
  )
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
