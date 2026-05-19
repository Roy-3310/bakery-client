import { useState } from "react";
import { motion } from "framer-motion";
import { submitContactForm } from "../services/contactService";
import styles from "./ContactPage.module.scss";

const hours = [
  { day: "週二 — 週五", time: "10:00 – 18:00" },
  { day: "週六 — 週日", time: "09:00 – 19:00" },
  { day: "週一", time: "公休" },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      await submitContactForm(
        formState.name,
        formState.email,
        formState.message,
      );
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "送出失敗，請稍後再試",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        {/* 頁首 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.pageHeader}
        >
          <p className={styles.eyebrow}>Contact Us</p>
          <h1 className={styles.heading}>聯絡我們</h1>
          <p className={styles.desc}>
            無論是訂購、客製化訂單、或是任何烘焙相關問題，我們很樂意為您服務。
          </p>
        </motion.div>

        <div className={styles.grid}>
          {/* 左欄：資訊 + 地圖 */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <div className={styles.infoCardIcon}>
                  <LocationIcon />
                </div>
                <div>
                  <p className={styles.infoCardLabel}>地址</p>
                  <p className={styles.infoCardValue}>
                    台北市大安區復興南路一段 136 號 10 樓<br />
                    <span style={{ color: "#A8A29E", fontSize: "0.75rem" }}>
                      近大安森林公園捷運站
                    </span>
                  </p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoCardIcon}>
                  <PhoneIcon />
                </div>
                <div>
                  <p className={styles.infoCardLabel}>電話</p>
                  <p className={styles.infoCardValue}>(02) 2700-1234</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoCardIcon}>
                  <EmailIcon />
                </div>
                <div>
                  <p className={styles.infoCardLabel}>Email</p>
                  <p className={styles.infoCardValue}>hello@purebakery.tw</p>
                </div>
              </div>
            </div>

            {/* 營業時間 */}
            <div className={styles.hoursBox}>
              <div className={styles.hoursHeader}>
                <ClockIcon />
                <p className={styles.hoursTitle}>營業時間</p>
              </div>
              <div className={styles.hoursRows}>
                {hours.map((h) => (
                  <div key={h.day} className={styles.hoursRow}>
                    <span className={styles.hoursDay}>{h.day}</span>
                    <span
                      className={`${styles.hoursTime} ${h.time === "公休" ? styles.closed : ""}`}
                    >
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 地圖 */}
            <div className={styles.mapWrapper}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.0236553027244!2d121.54255991500867!3d25.033976983968804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abc4f9620551%3A0x73a5b5b3a7cae3e4!2z5aSn5a6J5qCh5qCh5ZiJ5YWs5Y-4!5e0!3m2!1szh-TW!2stw!4v1620000000000!5m2!1szh-TW!2stw"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="店面位置"
              />
            </div>
          </motion.div>

          {/* 右欄：表單 */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className={styles.formCard}>
              <h2 className={styles.formHeading}>傳訊息給我們</h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={styles.successState}
                >
                  <div className={styles.successIcon}>
                    <CheckIcon />
                  </div>
                  <h3 className={styles.successTitle}>訊息已送出！</h3>
                  <p className={styles.successDesc}>感謝您的來信。</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div>
                    <label className={styles.fieldLabel}>您的姓名</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, name: e.target.value }))
                      }
                      placeholder="陳小明"
                      className={styles.input}
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel}>電子信箱</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, email: e.target.value }))
                      }
                      placeholder="your@email.com"
                      className={styles.input}
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel}>訊息內容</label>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, message: e.target.value }))
                      }
                      placeholder="請寫下您的問題或訂單需求..."
                      className={styles.textarea}
                    />
                  </div>
                  {submitError && (
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#dc2626",
                        margin: 0,
                      }}
                    >
                      {submitError}
                    </p>
                  )}
                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    type="submit"
                    className={styles.submitBtn}
                    disabled={submitting}
                  >
                    {submitting ? "傳送中..." : "送出訊息"}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function LocationIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C9A96E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
