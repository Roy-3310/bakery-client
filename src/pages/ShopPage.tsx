import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categoryTabs } from "../data/mockData";
import { getProducts } from "../services/productService";
import type { Product, ProductCategory, ServerProduct } from "../types";
import ProductCard from "../components/ui/ProductCard";
import styles from "./ShopPage.module.scss";

function toProduct(p: ServerProduct): Product {
  return {
    id: p._id,
    name: p.name,
    nameEn: p.nameEn,
    price: p.price,
    category: p.category,
    description: p.description,
    longDescription: p.longDescription,
    image: p.image,
    stock: p.stock,
    isFeatured: p.isFeatured,
    badge: p.badge ?? undefined,
  };
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: "100" })
      .then((data) => setProducts(data.products.map(toProduct)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        {/* 頁首 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={styles.pageHeader}
        >
          <p className={styles.eyebrow}>Menu / Shop</p>
          <h1 className={styles.heading}>線上商店</h1>
          <p className={styles.desc}>
            每日限量，新鮮出爐。從可頌到歐包，從法式甜點到季節限定，
            每款都是職人手作的用心之作。
          </p>
        </motion.div>

        {/* 分類 Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={styles.tabBar}
        >
          {categoryTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={`${styles.tab} ${activeCategory === tab.value ? styles.tabActive : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <>
            <p className={styles.count}>載入中...</p>
            <p className={styles.count}>
              請稍後，在Render部屬的server需要大約30秒的喚醒時間
            </p>
          </>
        ) : (
          <p className={styles.count}>共 {filtered.length} 款商品</p>
        )}

        {/* 商品 Grid */}
        {!loading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className={styles.productGrid}
            >
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  priority={i < 4}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.empty}
          >
            <p className={styles.emptyTitle}>目前尚無此類別商品</p>
            <p className={styles.emptyDesc}>敬請期待季節限定新品</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
