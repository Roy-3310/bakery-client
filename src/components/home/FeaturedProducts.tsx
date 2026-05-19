import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProducts } from '../../services/productService'
import type { Product, ServerProduct } from '../../types'
import ProductCard from '../ui/ProductCard'
import styles from './FeaturedProducts.module.scss'

function toProduct(p: ServerProduct): Product {
  return {
    id: p._id,
    name: p.name,
    nameEn: p.nameEn,
    price: p.price,
    category: p.category,
    description: p.description,
    longDescription: p.longDescription,
    image: p.image,
    stock: p.stock,
    isFeatured: p.isFeatured,
    badge: p.badge ?? undefined,
  }
}

export default function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    getProducts({ featured: 'true', limit: '10' })
      .then(data => setFeatured(data.products.map(toProduct)))
      .catch(() => setFeatured([]))
  }, [])

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
  }

  if (featured.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* 標題列 */}
        <div className={styles.headerRow}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className={styles.eyebrow}>Featured Products</p>
            <h2 className={styles.heading}>本週招牌</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className={styles.scrollBtns}
          >
            <button
              className={styles.scrollBtn}
              disabled={!canScrollLeft}
              onClick={() => scroll('left')}
            >
              <ChevronLeftIcon />
            </button>
            <button
              className={styles.scrollBtn}
              disabled={!canScrollRight}
              onClick={() => scroll('right')}
            >
              <ChevronRightIcon />
            </button>
          </motion.div>
        </div>

        {/* 行動版輪播 */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className={styles.mobileCarousel}
        >
          {featured.map((product, i) => (
            <div key={product.id} className={styles.carouselItem}>
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>

        {/* 桌機 Grid */}
        <div className={styles.desktopGrid}>
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* 查看全部 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={styles.cta}
        >
          <Link to="/shop" className={styles.ctaLink}>
            查看全部商品
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}
