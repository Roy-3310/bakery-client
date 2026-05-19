import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* 主要區塊 */}
        <div className={styles.mainGrid}>
          {/* 品牌 */}
          <div className={styles.brand}>
            <h3 className={styles.brandName}>Pure Bakery</h3>
            <p className={styles.brandSub}>純粹手作烘焙坊</p>
            <p className={styles.brandDesc}>
              每日新鮮出爐，純手工的溫暖滋味。
              結合巴黎藍帶工藝與台灣在地食材，
              為您獻上最純粹的烘焙感動。
            </p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Instagram" className={styles.socialLink}><InstagramIcon /></a>
              <a href="#" aria-label="LINE" className={styles.socialLink}><LineIcon /></a>
              <a href="mailto:info@purebakery.tw" aria-label="Email" className={styles.socialLink}><EmailIcon /></a>
            </div>
          </div>

          {/* 導覽 */}
          <div>
            <h4 className={styles.colHeading}>探索</h4>
            <ul className={styles.navList}>
              {[
                { path: '/', label: '首頁' },
                { path: '/shop', label: '線上商店' },
                { path: '/about', label: '關於我們' },
                { path: '/contact', label: '聯絡我們' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className={styles.navListLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 聯絡資訊 */}
          <div>
            <h4 className={styles.colHeading}>聯絡資訊</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}><LocationIcon /></span>
                <span>台北市大安區復興南路一段<br />136號 10樓</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}><ClockIcon /></span>
                <span>10:00 – 18:00（週一公休）</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}><PhoneIcon /></span>
                <span>(02) 2700-1234</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 電子報 */}
        <div className={styles.newsletter}>
          <div>
            <p className={styles.newsletterTitle}>訂閱電子報</p>
            <p className={styles.newsletterSub}>每週新品、季節限定，第一時間掌握。</p>
          </div>
          <form onSubmit={e => e.preventDefault()} className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="your@email.com"
              className={styles.newsletterInput}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className={styles.newsletterBtn}
            >
              訂閱
            </motion.button>
          </form>
        </div>

        {/* 版權列 */}
        <div className={styles.bottomBar}>
          <span>© 2025 Pure Bakery. All rights reserved.</span>
          <span>Crafted with ❤️ in Taipei</span>
        </div>
      </div>
    </footer>
  )
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  )
}

function LineIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.44 5.43 3.71 7.14L4.5 22l4.22-2.1C9.7 20.28 10.84 20.5 12 20.5c5.52 0 10-4.03 10-9S17.52 2 12 2zm-2.5 11.5H8v-5h1.5v5zm3.5 0h-1.5v-3l-2 3H8v-5h1.5v3l2-3H11v5zm4 0h-3.5v-5H17v1.5h-2V9h2V7.5h-2V6H17v5h-1.5V10H14v1.5h1.5v2z"/>
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
    </svg>
  )
}
