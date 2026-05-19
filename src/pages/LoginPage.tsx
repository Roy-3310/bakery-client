import { useState, type FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import styles from './LoginPage.module.scss'

type Tab = 'login' | 'register'

export default function LoginPage() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'staff' | 'admin'>('staff')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin/dashboard" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password, role)
      }
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* 左側裝飾 */}
      <div className={styles.brand}>
        <div className={styles.brandInner}>
          <div className={styles.brandLogo}>
            <span className={styles.brandName}>Pure Bakery</span>
            <span className={styles.brandSub}>純粹手作烘焙坊</span>
          </div>
          <p className={styles.brandTagline}>
            以麵粉與時間為素材，<br />在每一個清晨烘焙誠意。
          </p>
        </div>
      </div>

      {/* 右側表單 */}
      <div className={styles.formSide}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>後台管理系統</h1>

          {/* Tab 切換 */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
              onClick={() => { setTab('login'); setError('') }}
              type="button"
            >
              登入
            </button>
            <button
              className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
              onClick={() => { setTab('register'); setError('') }}
              type="button"
            >
              建立帳號
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {tab === 'register' && (
              <div className={styles.field}>
                <label className={styles.label}>姓名</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="王小明"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>電子信箱</label>
              <input
                type="email"
                className={styles.input}
                placeholder="admin@purebakery.tw"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>密碼</label>
              <input
                type="password"
                className={styles.input}
                placeholder="至少 8 個字元"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {tab === 'register' && (
              <div className={styles.field}>
                <label className={styles.label}>角色</label>
                <select
                  className={styles.input}
                  value={role}
                  onChange={e => setRole(e.target.value as 'staff' | 'admin')}
                >
                  <option value="staff">職員（Staff）</option>
                  <option value="admin">管理員（Admin）</option>
                </select>
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <motion.button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? '請稍候...' : tab === 'login' ? '登入' : '建立帳號'}
            </motion.button>
          </form>

          <p className={styles.backLink}>
            <a href="/">← 回到官網首頁</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
