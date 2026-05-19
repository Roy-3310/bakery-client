import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage,
} from '../../services/productService'
import type { ServerProduct } from '../../types'
import styles from './ProductsPage.module.scss'

type ProductCategory = 'croissant' | 'bread' | 'pastry' | 'toast' | 'seasonal' | 'gift'
type Badge = '推薦' | '季節限定' | '新品' | '熱銷'

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'croissant', label: '可頌' },
  { value: 'bread', label: '歐包' },
  { value: 'pastry', label: '甜點' },
  { value: 'toast', label: '吐司' },
  { value: 'seasonal', label: '季節限定' },
  { value: 'gift', label: '禮盒' },
]

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c.label])
)

const BADGES: Badge[] = ['推薦', '季節限定', '新品', '熱銷']

const EMPTY_FORM = {
  name: '', nameEn: '', price: '', category: 'croissant' as ProductCategory,
  description: '', longDescription: '', image: '', stock: '0',
  isFeatured: false, badge: '' as Badge | '',
}

export default function ProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<ServerProduct[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<ServerProduct | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const tableFileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  if (user?.role !== 'admin') {
    return (
      <div className={styles.forbidden}>
        <p>您沒有權限訪問此頁面</p>
      </div>
    )
  }

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getProducts({ limit: '50' })
      setProducts(data.products)
      setTotal(data.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : '載入失敗')
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProducts() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setImageFile(null)
    setImagePreview('')
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (p: ServerProduct) => {
    setEditing(p)
    setForm({
      name: p.name, nameEn: p.nameEn, price: String(p.price),
      category: p.category as ProductCategory,
      description: p.description, longDescription: p.longDescription,
      image: p.image, stock: String(p.stock),
      isFeatured: p.isFeatured, badge: (p.badge ?? '') as Badge | '',
    })
    setImageFile(null)
    setImagePreview('')
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    setImageFile(null)
    setImagePreview('')
  }

  const handleImageFileChange = (file: File) => {
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      if (editing) {
        const payload = {
          name: form.name, nameEn: form.nameEn,
          price: Number(form.price), category: form.category,
          description: form.description, longDescription: form.longDescription,
          image: form.image,
          stock: Number(form.stock), isFeatured: form.isFeatured,
          badge: form.badge || null,
        }
        const updated = await updateProduct(editing._id, payload)
        setProducts(prev => prev.map(p => p._id === updated._id ? updated : p))
      } else {
        if (!imageFile) {
          setFormError('請選擇商品圖片')
          setSaving(false)
          return
        }
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('nameEn', form.nameEn)
        formData.append('price', form.price)
        formData.append('category', form.category)
        formData.append('description', form.description)
        formData.append('longDescription', form.longDescription)
        formData.append('stock', form.stock)
        formData.append('isFeatured', String(form.isFeatured))
        if (form.badge) formData.append('badge', form.badge)
        formData.append('image', imageFile)

        const created = await createProduct(formData)
        setProducts(prev => [created, ...prev])
        setTotal(t => t + 1)
      }
      closeModal()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : '儲存失敗')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('確定要刪除此商品嗎？此操作無法復原。')) return
    setDeletingId(id)
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p._id !== id))
      setTotal(t => t - 1)
    } catch (e) {
      alert(e instanceof Error ? e.message : '刪除失敗')
    } finally {
      setDeletingId(null)
    }
  }

  const handleImageUpload = async (productId: string, file: File) => {
    setUploadingId(productId)
    try {
      const { product } = await uploadProductImage(productId, file)
      setProducts(prev => prev.map(p => p._id === productId ? product : p))
    } catch (e) {
      alert(e instanceof Error ? e.message : '上傳失敗')
    } finally {
      setUploadingId(null)
    }
  }

  const f = (field: keyof typeof form, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>商品管理</h1>
          <p className={styles.subheading}>共 {total} 項商品</p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <PlusIcon /> 新增商品
        </button>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingRow}>載入中...</div>
        ) : products.length === 0 ? (
          <div className={styles.emptyRow}>尚無商品，點擊「新增商品」開始建立</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>圖片</th>
                  <th>商品名稱</th>
                  <th>分類</th>
                  <th>售價</th>
                  <th>庫存</th>
                  <th>標章</th>
                  <th>精選</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className={styles.imgCell}>
                        <img
                          src={p.image}
                          alt={p.name}
                          className={styles.productImg}
                          onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.avif' }}
                        />
                        <label className={styles.uploadLabel} title="更換圖片（上傳至 Supabase）">
                          {uploadingId === p._id ? '…' : <CameraIcon />}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            style={{ display: 'none' }}
                            ref={tableFileInputRef}
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(p._id, file)
                              e.target.value = ''
                            }}
                          />
                        </label>
                      </div>
                    </td>
                    <td>
                      <p className={styles.productName}>{p.name}</p>
                      <p className={styles.productNameEn}>{p.nameEn}</p>
                    </td>
                    <td>{CATEGORY_LABELS[p.category] ?? p.category}</td>
                    <td>NT$ {p.price.toLocaleString()}</td>
                    <td>
                      <span className={`${styles.stockBadge} ${p.stock === 0 ? styles.outOfStock : ''}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>{p.badge ?? '—'}</td>
                    <td>{p.isFeatured ? '✓' : '—'}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => openEdit(p)}>
                          編輯
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(p._id)}
                          disabled={deletingId === p._id}
                        >
                          {deletingId === p._id ? '…' : '刪除'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editing ? '編輯商品' : '新增商品'}</h2>
              <button className={styles.closeBtn} onClick={closeModal}><CloseIcon /></button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>商品名稱 *</label>
                  <input className={styles.input} value={form.name} onChange={e => f('name', e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>英文名稱 *</label>
                  <input className={styles.input} value={form.nameEn} onChange={e => f('nameEn', e.target.value)} required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>售價 (NT$) *</label>
                  <input className={styles.input} type="number" min="0" value={form.price} onChange={e => f('price', e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>庫存 *</label>
                  <input className={styles.input} type="number" min="0" value={form.stock} onChange={e => f('stock', e.target.value)} required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>分類 *</label>
                  <select className={styles.input} value={form.category} onChange={e => f('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>標章</label>
                  <select className={styles.input} value={form.badge} onChange={e => f('badge', e.target.value)}>
                    <option value="">無</option>
                    {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {editing ? (
                <div className={styles.field}>
                  <label className={styles.label}>目前圖片 URL（點擊表格中的相機圖示更換）</label>
                  <input className={styles.input} value={form.image} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
              ) : (
                <div className={styles.field}>
                  <label className={styles.label}>商品圖片 *（上傳至 Supabase Storage）</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className={styles.input}
                    required
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleImageFileChange(file)
                    }}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="預覽"
                      style={{ marginTop: 8, maxHeight: 120, borderRadius: 6, objectFit: 'cover' }}
                    />
                  )}
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>簡短描述 *</label>
                <input className={styles.input} value={form.description} onChange={e => f('description', e.target.value)} required />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>詳細描述 *</label>
                <textarea className={styles.textarea} rows={3} value={form.longDescription} onChange={e => f('longDescription', e.target.value)} required />
              </div>

              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => f('isFeatured', e.target.checked)} />
                設為精選商品（首頁展示）
              </label>

              {formError && <p className={styles.formError}>{formError}</p>}

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>取消</button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? '儲存中...' : '儲存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
