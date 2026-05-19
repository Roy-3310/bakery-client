import { motion } from 'framer-motion'
import styles from './AboutPage.module.scss'

const ingredients = [
  {
    name: '法國 AOP 發酵奶油',
    nameEn: 'French AOP Butter',
    desc: '產自諾曼第的 AOP 認證發酵奶油，含有豐富的天然乳脂，帶來無可取代的奶香層次。',
    img: '/images/premium_photo-1692805433455-ff41be96b357.avif',
  },
  {
    name: '日本嚴選高筋麵粉',
    nameEn: 'Japanese Bread Flour',
    desc: '精選日本製粉廠高蛋白質麵粉，吸水性佳，烘烤後形成極致綿密Q彈的組織結構。',
    img: '/images/premium_photo-1726718604345-efbf5a45fd8a.avif',
  },
  {
    name: '台灣小農放牧雞蛋',
    nameEn: 'Local Free-Range Eggs',
    desc: '每日直送花蓮小農放牧雞蛋，蛋黃橙黃飽滿，為糕點帶來天然色澤與濃郁風味。',
    img: '/images/premium_photo-1726761768709-32b3dcc03112.avif',
  },
]

const timeline = [
  { year: '2016', event: '主廚赴法就讀巴黎藍帶學院（Le Cordon Bleu），取得甜點文憑' },
  { year: '2018', event: '於巴黎 Pierre Hermé 實習，深研法式酥皮工藝' },
  { year: '2020', event: '返台，在台北大安區創立 Pure Bakery，以法式工藝詮釋在地食材' },
  { year: '2022', event: '引進天然酵母培養技術，推出酸種系列，廣受好評' },
  { year: '2024', event: '線上商店正式啟動，將職人烘焙送達全台每個清晨' },
]

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        {/* 頁首 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroText}
        >
          <p className={styles.eyebrow}>Our Story</p>
          <h1 className={styles.heading}>
            從巴黎街角，<br />
            到台灣清晨的<br />
            溫暖麥香。
          </h1>
          <p className={styles.intro}>
            Pure Bakery 的故事，是一個關於執著與熱愛的旅程。
            每一個麵包的背後，都是對食材的尊重與對工藝的堅持。
          </p>
        </motion.div>

        {/* 主廚雙欄 */}
        <div className={styles.chefSection}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className={styles.chefImageCol}
          >
            <div className={styles.chefImageWrapper}>
              <img src="/images/premium_photo-1673111980901-f5b4ba78fbbc.avif" alt="主廚 Chen" loading="lazy" />
            </div>
            <div className={styles.chefBadge}>
              <p className={styles.chefName}>Chef Chen</p>
              <p className={styles.chefTitle}>Le Cordon Bleu, Paris</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className={styles.chefTextCol}
          >
            <h2 className={styles.chefHeading}>烘焙師的故事</h2>
            <div className={styles.chefParas}>
              <p>主廚 Chen 從小在外婆的廚房裡長大，麵包出爐的香氣是他最深的童年記憶。帶著對烘焙的熱愛，他遠赴法國巴黎藍帶學院深造，在那裡學習了最嚴謹的法式甜點與麵包工藝。</p>
              <p>在巴黎的三年裡，他跑遍大街小巷的麵包坊，在 Pierre Hermé 的廚房實習，深刻理解了什麼是真正的「職人精神」——不是技術的炫耀，而是對每個細節的專注與用心。</p>
              <p>2020年，Chef Chen 帶著對台灣這片土地的情感，在台北大安區開設 Pure Bakery。他將法式工藝與台灣在地食材融合，創造出屬於這個時代、這片土地的獨特風味。</p>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.timeline}
        >
          <h2 className={styles.timelineHeading}>品牌歷程</h2>
          <div className={styles.timelineTrack}>
            <div className={styles.timelineItems}>
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`${styles.timelineItem} ${i % 2 !== 0 ? styles.even : ''}`}
                >
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineYear}>{item.year}</div>
                  <div className={styles.timelineEvent}>{item.event}</div>
                  <div className={styles.timelineEventMobile}>{item.event}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 嚴選食材 */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.ingredientsHeader}
          >
            <p className={styles.eyebrow}>Our Ingredients</p>
            <h2 className={styles.heading} style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)' }}>嚴選食材</h2>
          </motion.div>

          <div className={styles.ingredientsGrid}>
            {ingredients.map((ing, i) => (
              <motion.div
                key={ing.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={styles.ingredientCard}
              >
                <div className={styles.ingredientImageWrapper}>
                  <img src={ing.img} alt={ing.name} className={styles.ingredientImage} loading="lazy" />
                </div>
                <p className={styles.ingredientNameEn}>{ing.nameEn}</p>
                <h3 className={styles.ingredientName}>{ing.name}</h3>
                <p className={styles.ingredientDesc}>{ing.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
