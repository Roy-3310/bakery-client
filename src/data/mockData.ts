import type { CategoryTab, NavLink } from "../types";

export const categoryTabs: CategoryTab[] = [
  { value: "all", label: "全部商品" },
  { value: "croissant", label: "可頌系列" },
  { value: "bread", label: "經典歐包" },
  { value: "pastry", label: "法式甜點" },
  { value: "toast", label: "手作吐司" },
  { value: "seasonal", label: "季節限定" },
  { value: "gift", label: "節慶禮盒" },
];

export const navLinks: NavLink[] = [
  { path: "/", label: "首頁" },
  { path: "/shop", label: "商品" },
  { path: "/about", label: "關於我們" },
  { path: "/contact", label: "聯絡" },
];
