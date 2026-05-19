import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartSidebar from './components/ui/CartSidebar'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import ProductsPage from './pages/admin/ProductsPage'
import OrdersPage from './pages/admin/OrdersPage'
import ContactsPage from './pages/admin/ContactsPage'
import styles from './App.module.scss'

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
}

function SiteLayout() {
  const location = useLocation()
  return (
    <div className={styles.root}>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} {...PAGE_TRANSITION}>
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <Footer />
      <CartSidebar />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* 登入頁（獨立版面） */}
            <Route path="/login" element={<LoginPage />} />

            {/* 後台（需登入） */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="contacts" element={<ContactsPage />} />
                <Route path="products" element={<ProductsPage />} />
              </Route>
            </Route>

            {/* 官網公開頁（含 Navbar / Footer） */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
