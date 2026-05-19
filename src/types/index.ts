export type ProductCategory =
  | 'all'
  | 'croissant'
  | 'bread'
  | 'pastry'
  | 'toast'
  | 'seasonal'
  | 'gift'

export interface Product {
  id: string
  name: string
  nameEn: string
  price: number
  category: Exclude<ProductCategory, 'all'>
  description: string
  longDescription: string
  image: string
  stock: number
  isFeatured: boolean
  badge?: '推薦' | '季節限定' | '新品' | '熱銷'
}

export interface CartItem extends Product {
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export interface CategoryTab {
  value: ProductCategory
  label: string
}

export interface NavLink {
  path: string
  label: string
}

// ── Auth ─────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff'
}

// ── Server Product (Mongoose doc shape) ──────────────────────
export interface ServerProduct {
  _id: string
  name: string
  nameEn: string
  price: number
  category: Exclude<ProductCategory, 'all'>
  description: string
  longDescription: string
  image: string
  stock: number
  isFeatured: boolean
  badge?: '推薦' | '季節限定' | '新品' | '熱銷' | null
  createdAt: string
  updatedAt: string
}

// ── Order ─────────────────────────────────────────────────────
export interface OrderCustomer {
  name: string
  email: string
  phone: string
  address: string
  note?: string
}

export interface OrderItem {
  productId: string
  name: string
  nameEn?: string
  price: number
  quantity: number
  image?: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export interface Order {
  _id: string
  orderNumber: string
  customer: OrderCustomer
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
}

// ── Contact Message ───────────────────────────────────────────
export interface ContactMessage {
  _id: string
  name: string
  email: string
  message: string
  isRead: boolean
  repliedAt?: string
  createdAt: string
}
