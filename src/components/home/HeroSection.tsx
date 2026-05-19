import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./HeroSection.module.scss";

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-15%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className={styles.section}>
      {/* 背景圖視差 */}
      <motion.div style={{ y: imageY }} className={styles.bgWrapper}>
        <img
          src="/images/151029-629-99-qbHuZ.jpg"
          alt="烘焙坊背景"
          className={styles.bgImage}
          fetchPriority="high"
        />
        <div className={styles.overlayH} />
        <div className={styles.overlayV} />
      </motion.div>

      {/* 文字 */}
      <div className={styles.content}>
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className={styles.textBlock}
        >
          <motion.div variants={FADE_UP} className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrowText}>Pure Handmade Bakery</span>
          </motion.div>

          <motion.h1 variants={FADE_UP} className={styles.heading}>
            每日新鮮出爐，
            <br />
            <em className={styles.headingAccent}>純手工</em>的
            <br />
            溫暖滋味。
          </motion.h1>

          <motion.p variants={FADE_UP} className={styles.subheading}>
            巴黎藍帶工藝 × 台灣職人精神， 用法國 AOP 奶油與天然酵母，
            為每一個清晨帶來最純粹的感動。
          </motion.p>

          <motion.div variants={FADE_UP} className={styles.ctaGroup}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/shop" className={styles.ctaPrimary}>
                探索商品
                <ArrowRightIcon />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/about" className={styles.ctaSecondary}>
                品牌故事
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll 指示器 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className={styles.scrollIndicator}
      >
        <span className={styles.scrollLabel}>scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className={styles.scrollLine}
        />
      </motion.div>
    </section>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
