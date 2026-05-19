import { motion } from 'framer-motion'
import styles from './SocialProof.module.scss'

const igPosts = [
  { img: '/images/photo-1733210437318-b76aca1f18ba.avif', likes: 284 },
  { img: '/images/photo-1733210437567-ea3a30f0fb0d.avif', likes: 512 },
  { img: '/images/photo-1747459707225-65744d0ae6be.avif', likes: 391 },
  { img: '/images/premium_photo-1673111980901-f5b4ba78fbbc.avif', likes: 207 },
  { img: '/images/premium_photo-1692805433455-ff41be96b357.avif', likes: 445 },
  { img: '/images/premium_photo-1726718604345-efbf5a45fd8a.avif', likes: 328 },
]

const reviews = [
  {
    name: 'Lily C.',
    rating: 5,
    text: '可頌層次超級多，奶油香氣讓人一口接一口，每週必買！',
    product: '法式可頌',
  },
  {
    name: 'Marcus L.',
    rating: 5,
    text: '鄉村酸種麵包的氣孔真的很美，外皮超脆，是我吃過最好的歐包。',
    product: '鄉村酸種麵包',
  },
  {
    name: 'Sophie W.',
    rating: 5,
    text: '水果塔的卡仕達醬完全不甜膩，水果新鮮，視覺和味覺都是享受。',
    product: '季節水果塔',
  },
]

export default function SocialProof() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={styles.header}
        >
          <p className={styles.eyebrow}>@pure_bakery_tw</p>
          <h2 className={styles.heading}>顧客的真實互動</h2>
          <p className={styles.subheading}>跟著我們的 Instagram，感受每日新鮮出爐的溫度</p>
        </motion.div>

        {/* IG Grid */}
        <div className={styles.igGrid}>
          {igPosts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className={styles.igPost}
            >
              <img src={post.img} alt={`IG post ${i + 1}`} loading="lazy" />
              <div className={styles.igOverlay}>
                <div className={styles.igLikes}>
                  <span>♥</span>
                  <span>{post.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 評論 */}
        <div className={styles.reviewGrid}>
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className={styles.reviewCard}
            >
              <div className={styles.stars}>
                {Array.from({ length: r.rating }).map((_, j) => <span key={j}>★</span>)}
              </div>
              <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>
              <div className={styles.reviewMeta}>
                <span className={styles.reviewName}>{r.name}</span>
                <span className={styles.reviewProduct}>{r.product}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
