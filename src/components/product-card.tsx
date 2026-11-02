"use client";

import Image from "next/image";
import { useState } from "react";
import { colors, formatCapacity, formatPrice, type ColorKey, type Product } from "@/lib/catalog";
import { Icon } from "@/components/icons";

export function ProductCard({ product, onOpen, onAdd }: { product: Product; onOpen: (product: Product, color: ColorKey) => void; onAdd: (id: string, color: ColorKey) => void }) {
  const [selectedColor, setSelectedColor] = useState<ColorKey>(product.defaultColor);
  return (
    <article className="product-card">
      <div className={`product-visual tone-${selectedColor}`}>
        <button className="product-photo-button" onClick={() => onOpen(product, selectedColor)} aria-label={`Discover ${product.name}`}>
          <Image src={colors[selectedColor].image} alt={`${product.name} in ${colors[selectedColor].name}`} width={720} height={900} sizes="(max-width: 600px) 46vw, (max-width: 900px) 45vw, 24vw" className="product-photo" />
        </button>
        {product.badge && <span className={`product-badge ${product.id === "everyday" ? "badge-green" : ""}`}>{product.badge}</span>}
        <button className="quick-add" onClick={() => onAdd(product.id, selectedColor)} disabled={product.inventory < 1} aria-label={`Add ${product.name} in ${colors[selectedColor].name} to bag`}><Icon name="plus" size={20} /><span>Quick add</span></button>
      </div>
      <div className="product-name-line"><button onClick={() => onOpen(product, selectedColor)} className="product-name">{product.name}</button><span className="product-capacity">{formatCapacity(product.capacity)}</span></div>
      <p className="product-subtitle">{product.subtitle}</p>
      <div className="product-bottom"><div className="product-price">{formatPrice(product.price)} <span>{formatPrice(product.compareAt)}</span></div><div className="color-swatches">{(Object.keys(colors) as ColorKey[]).map((color) => <button key={color} title={colors[color].name} aria-label={`${product.name}: ${colors[color].name}`} aria-pressed={selectedColor === color} onClick={() => setSelectedColor(color)} className={`color-swatch ${selectedColor === color ? "selected" : ""}`} style={{ "--swatch": colors[color].hex } as React.CSSProperties} />)}</div></div>
    </article>
  );
}
