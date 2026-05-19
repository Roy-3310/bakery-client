import { motion } from 'framer-motion'
import styles from './BrandPhilosophy.module.scss'

const pillars = [
  {
    icon: '🥐',
    title: '巴黎藍帶傳承',
    titleEn: 'Le Cordon Bleu',
    desc: '主廚曾受訓於巴黎藍帶學院，將頂級法式甜點工藝帶回台灣，每一口都有工藝的重量。',
  },
  {
    icon: '🧈',
    title: '法國 AOP 發酵奶油',
    titleEn: 'French AOP Butter',
    desc: '精選法國 AOP 認證發酵奶油，搭配日本嚴選高筋麵粉，構築極致酥脆與細膩層次。',
  },
  {
    icon: '🥚',
    title: '台灣小農雞蛋',
    titleEn: 'Local Farm Eggs',
    desc: '每日直送台灣小農放牧雞蛋，蛋黃飽滿橙黃，為成品帶來天然的色澤與濃醇風味。',
  },
  {
    icon: '🌾',
    title: '天然酵母慢發酵',
    titleEn: 'Natural Sourdough',
    desc: '自養天然酵種，以時間換取層次——48 小時低溫長時間發酵，是時間與溫度的傑作。',
  },
]

export default function BrandPhilosophy() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* 圖片欄 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={styles.imageCol}
          >
            <div className={styles.imageWrapper}>
              <img
                src="/images/premium_photo-1675604220150-38028d3690d0.avif"
                alt="職人烘焙"
                loading="lazy"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={styles.floatingBadge}
            >
              <p className={styles.badgeNumber}>8+</p>
              <p className={styles.badgeLabel}>年職人經驗</p>
            </motion.div>
          </motion.div>

          {/* 文字欄 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className={styles.eyebrow}>Brand Philosophy</p>
            <h2 className={styles.heading}>
              每日新鮮出爐，<br />
              用天然發酵與<br />
              職人手作，<br />
              帶來最純粹的<br />
              溫暖滋味。
            </h2>
            <p className={styles.desc}>
              我們相信，真正的美味需要時間的沉澱與職人的堅持。
              拒絕工業化，每一個麵包、每一口甜點，
              都是對品質的承諾。
            </p>

            <div className={styles.pillarsGrid}>
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
                  className={styles.pillar}
                >
                  <span className={styles.pillarIcon}>{p.icon}</span>
                  <h4 className={styles.pillarTitle}>{p.title}</h4>
                  <p className={styles.pillarDesc}>{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
