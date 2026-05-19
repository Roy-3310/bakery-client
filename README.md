# 純粹手作烘焙坊 — 前端專案介紹

> **pure-handmade-bakery** | React 18 + TypeScript + Vite + SCSS Modules

---

## 專案概覽

這是一個烘焙坊品牌官網的前端作品，同時包含**消費者官網**與**後台管理系統**兩套介面，部署在同一個 React SPA 中。官網著重品牌質感呈現，後台提供訂單、商品、聯絡訊息的完整管理功能。

---

## 技術棧

| 類別 | 工具 / 版本 |
|------|------------|
| UI 框架 | React 18.3 |
| 語言 | TypeScript 5.5 |
| 建置工具 | Vite 5.4 |
| 路由 | React Router DOM 6.26 |
| 動畫 | Framer Motion 11 + GSAP 3.15 |
| 樣式 | SCSS + CSS Modules（搭配 Tailwind 工具類） |
| 部署 | Vercel（`vercel.json` 設定） |

---

## 路由架構

```
/login                    登入 / 建立帳號（獨立版面，無 Navbar）

/                         官網首頁
/shop                     商品頁
/about                    關於我們
/contact                  聯絡我們

/admin/dashboard          後台儀表板
/admin/orders             訂單管理
/admin/contacts           聯絡訊息管理
/admin/products           商品管理（僅 admin 角色可見）
```

**三層 Layout 設計：**

- `SiteLayout` — 官網公開頁，含 Navbar、Footer、CartSidebar；頁面切換套用 Framer Motion 淡入淡出過場
- `AdminLayout` — 後台側邊欄，依角色動態顯示導覽項目
- `/login` — 獨立頁面，不掛任何 Layout

---

## 目錄結構

```
src/
├── main.tsx                  # 進入點，掛載全域樣式
├── App.tsx                   # 路由定義、AnimatePresence 設定
│
├── services/                 # 所有 API 呼叫集中於此
│   ├── client.ts             # 底層 apiFetch（自動 token refresh）
│   ├── authService.ts        # login / logout / register / refreshSession
│   ├── productService.ts     # CRUD + 圖片上傳
│   ├── orderService.ts       # 訂單列表、狀態更新
│   └── contactService.ts     # 聯絡訊息列表、標記已讀
│
├── context/
│   ├── AuthContext.tsx        # user 狀態、App 啟動自動恢復 session
│   └── CartContext.tsx        # 購物車狀態（items、totalPrice、isOpen…）
│
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx # 路由守衛（需登入 / 需 admin）
│   ├── layout/
│   │   ├── Navbar.tsx         # 含後台入口 icon（角色判斷顯示）
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── ProductCard.tsx    # 商品卡片（含缺貨狀態）
│   │   ├── CartSidebar.tsx    # 滑出式購物車
│   │   └── CheckoutModal.tsx  # 結帳彈窗
│   └── home/
│       ├── HeroSection.tsx    # 首頁主視覺
│       ├── FeaturedProducts.tsx
│       ├── BrandPhilosophy.tsx
│       └── SocialProof.tsx
│
├── pages/
│   ├── HomePage.tsx
│   ├── ShopPage.tsx           # 商品列表（mock 資料 + 分類篩選）
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx        # POST /api/contact
│   ├── LoginPage.tsx          # 登入 & 建立帳號雙模式
│   └── admin/
│       ├── AdminLayout.tsx    # 側邊欄 + Outlet
│       ├── DashboardPage.tsx  # 統計概覽
│       ├── ProductsPage.tsx   # CRUD + .avif 圖片上傳
│       ├── OrdersPage.tsx     # 訂單狀態 / 付款狀態更新
│       └── ContactsPage.tsx   # 標記已讀
│
├── styles/                    # 全域設計 token
│   ├── main.scss              # 統一 @forward 入口
│   ├── _variables.scss        # 色票、字型、斷點、版面
│   ├── _mixins.scss           # RWD mixin、container、btn-primary
│   └── _base.scss             # reset、focus ring
│
├── types/index.ts             # 全域型別定義
└── data/mockData.ts           # ShopPage 靜態 mock 商品資料
```

---

## 認證機制

```
Access Token  →  存在 AuthContext 記憶體（不寫 localStorage）
Refresh Token →  存在 localStorage('refreshToken')
```

1. App 啟動時，`AuthProvider` 呼叫 `refreshSession()` 自動恢復登入狀態
2. 每次 API 呼叫由 `client.ts` 的 `apiFetch` 統一處理；收到 `401` 時自動嘗試 refresh，成功後重試原始請求
3. `ProtectedRoute` 包覆所有 `/admin/*` 路由，未登入自動導向 `/login`

---

## 樣式系統

採用 **SCSS + CSS Modules** 雙層架構：

### 全域層（`src/styles/`）

| 檔案 | 用途 |
|------|------|
| `_variables.scss` | 設計 token：`$cream-*`、`$gold-*`、`$charcoal-*`、`$font-display`、`$font-sans`、`$ease-apple` |
| `_mixins.scss` | `@include md` / `lg` RWD 斷點、`container`、`btn-primary`、`form-input` |
| `_base.scss` | html/body reset、全域 focus ring、`.scrollbar-none` |

### 元件層

每個元件搭配一個 `*.module.scss`，以 `@use '../../styles/variables' as *` 引入 token。條件樣式透過多 class 合併實現，例如：

```tsx
// 缺貨按鈕同時套用兩個 class
className={`${styles.addBtn} ${stock === 0 ? styles.soldOut : ''}`}
```

### 色票速查

| 群組 | 用途 |
|------|------|
| `$cream-50` ~ `$cream-400` | 頁面背景、卡片底色 |
| `$gold-300` ~ `$gold-700` | 主強調色（按鈕、active 狀態、badge） |
| `$charcoal-300` ~ `$charcoal-900` | 文字色階 |

---

## 型別設計重點

```typescript
// ProductCategory 含 'all' 作為 UI 篩選用虛擬分類
type ProductCategory = 'all' | 'croissant' | 'bread' | 'pastry' | 'toast' | 'seasonal' | 'gift'

// 商品實體的 category 欄位排除 'all'，避免錯誤資料
interface Product {
  category: Exclude<ProductCategory, 'all'>
  // ...
}

// 後端 Mongoose 文件形狀（_id、timestamps）與前端 Product 分開定義
interface ServerProduct { _id: string; createdAt: string; updatedAt: string; /* ... */ }
```

---

## 資料流

| 頁面 / 功能 | 資料來源 |
|------------|---------|
| ShopPage 商品列表 | `src/data/mockData.ts`（靜態 mock） |
| ContactPage 聯絡表單 | `POST /api/contact` |
| 所有後台頁面 | `/api/*`（透過 `src/services/` 各 service） |
| 認證 | `/api/auth/*` |
