"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ShopDialogs, type Overlay, type InfoKey } from "@/components/shop-dialogs";
import { colors, type CartItem, type ColorKey, type Product } from "@/lib/catalog";

function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand ${light ? "brand-light" : ""}`} href="#home" aria-label="Simply & So home"><span className="brand-word">Simply <span className="brand-amp">&</span> So</span><span className="brand-tag">SIMPLY RIGHT. SO ESSENTIAL.</span></a>;
}

function Stars() {
  return <span className="stars" aria-label="5 out of 5 stars">{[1, 2, 3, 4, 5].map((star) => <Icon name="star" size={13} key={star} />)}</span>;
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatus("success"); setMessage(result.message); setEmail("");
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again."); }
  }
  return <div className="newsletter"><div><span className="eyebrow">A LITTLE GOODNESS, DELIVERED</span><h2>Stay in the flow.</h2><p>Fresh colours, thoughtful stories, and a little inspiration to live lighter.</p></div><div className="newsletter-form-wrap">{status === "success" ? <div className="newsletter-success" role="status"><Icon name="check" size={23} /><span>{message}</span></div> : <form onSubmit={subscribe} className="newsletter-form"><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input type="email" id="newsletter-email" required maxLength={254} placeholder="Your email address" value={email} onChange={(event) => { setEmail(event.target.value); if (status === "error") setStatus("idle"); }} autoComplete="email" /><button type="submit" disabled={status === "loading"} aria-label="Join the Simply & So newsletter">{status === "loading" ? <span className="spinner" /> : <Icon name="arrow" size={23} />}</button></form>}{status === "error" ? <p className="newsletter-note error" role="alert">{message}</p> : <p className="newsletter-note">Only the good stuff. No inbox clutter.</p>}</div></div>;
}

export function Storefront({ products }: { products: Product[] }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [filter, setFilter] = useState("All bottles");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [reviewsIndex, setReviewsIndex] = useState(0);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("simplyso-bag") || localStorage.getItem("puresta-bag") || "[]");
      if (Array.isArray(saved)) setCart(saved.filter((item): item is CartItem => item && typeof item.productId === "string" && products.some((p) => p.id === item.productId) && Object.prototype.hasOwnProperty.call(colors, item.color) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 10));
    } catch { /* A fresh bag is used if browser storage is unavailable. */ }
    setCartLoaded(true);
  }, [products]);
  useEffect(() => { if (cartLoaded) { try { localStorage.setItem("simplyso-bag", JSON.stringify(cart)); } catch { /* Shopping still works without local storage. */ } } }, [cart, cartLoaded]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 4200); return () => clearTimeout(timer); }, [toast]);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const visibleProducts = products.filter((product) => filter === "All bottles" || product.category === filter);
  function addItem(productId: string, color: ColorKey, quantity = 1) {
    const product = products.find((entry) => entry.id === productId);
    if (!product || product.inventory < 1) { setToast("This bottle is currently sold out."); return; }
    const current = cart.find((item) => item.productId === productId && item.color === color);
    const productTotal = cart.filter((item) => item.productId === productId).reduce((sum, item) => sum + item.quantity, 0);
    if ((current?.quantity || 0) + quantity > 10 || productTotal + quantity > product.inventory) { setToast("You've reached the available quantity for this bottle."); return; }
    setCart((items) => {
      const exists = items.find((item) => item.productId === productId && item.color === color);
      return exists ? items.map((item) => item === exists ? { ...item, quantity: item.quantity + quantity } : item) : [...items, { productId, color, quantity }];
    });
    setToast(`${product.name} added to your bag`);
  }
  function changeQuantity(productId: string, color: ColorKey, quantity: number) {
    if (quantity <= 0) { setCart((items) => items.filter((item) => !(item.productId === productId && item.color === color))); return; }
    const product = products.find((entry) => entry.id === productId);
    const others = cart.filter((item) => item.productId === productId && item.color !== color).reduce((sum, item) => sum + item.quantity, 0);
    if (!product || quantity > 10 || quantity + others > product.inventory) { setToast("You've reached the available quantity for this bottle."); return; }
    setCart((items) => items.map((item) => item.productId === productId && item.color === color ? { ...item, quantity } : item));
  }
  function openProduct(product: Product, color: ColorKey) { setOverlay({ type: "product", productId: product.id, color }); }
  function openInfo(key: InfoKey) { setOverlay({ type: "info", key }); }
  const reviews = [
    { quote: "Finally, a bottle that looks as good on my desk as it does on a trail. The little details make all the difference.", name: "Ananya S.", location: "Bengaluru", initials: "AS", tone: "sage" },
    { quote: "Filled it with cold water in the morning. Still ice-cold after my evening workout. My everyday essential, without a doubt.", name: "Rohan M.", location: "Mumbai", initials: "RM", tone: "rose" },
    { quote: "The finish, the colour, the way it feels in your hand. It's one of those things you don't realise you needed until you have it.", name: "Meera K.", location: "New Delhi", initials: "MK", tone: "sand" },
    { quote: "From the office to weekend getaways, my Nomad goes everywhere. More refills, less plastic, and a colour I absolutely love.", name: "Kabir P.", location: "Pune", initials: "KP", tone: "blue" },
  ];

  return <div id="home">
    <a href="#collection" className="skip-link">Skip to the collection</a>
    <div className="announcement-bar"><Icon name="leaf" size={13} /><span>A little better for you. A lot better for the planet.</span><span className="announcement-divider">|</span><span>Free shipping on orders ₹999+</span></div>
    <header className="site-header"><div className="header-inner"><Brand /><nav className="desktop-nav" aria-label="Main navigation"><a className="nav-active" href="#collection">Shop bottles <Icon name="chevron" size={12} /></a><a href="#our-story">Our story</a><a href="#the-difference">The Simply & So difference</a></nav><div className="header-actions"><span className="currency-label">INDIA · INR ₹</span><button className="icon-button" aria-label="Search the collection" onClick={() => setOverlay({ type: "search" })}><Icon name="search" size={21} /></button><button className="icon-button bag-button" aria-label={`Open shopping bag, ${count} items`} onClick={() => setOverlay({ type: "cart" })}><Icon name="bag" size={22} /><span className="bag-count">{count}</span></button><button className="icon-button mobile-menu-button" aria-label={mobileMenu ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}><Icon name={mobileMenu ? "close" : "menu"} /></button></div></div>{mobileMenu && <nav className="mobile-nav" aria-label="Mobile navigation">{[["Shop bottles", "#collection"], ["Our story", "#our-story"], ["The Simply & So difference", "#the-difference"]].map(([label, href]) => <a href={href} key={href} onClick={() => setMobileMenu(false)}>{label}<Icon name="arrow" size={18} /></a>)}<span>Thoughtfully crafted. Ready for your everyday.</span></nav>}</header>

    <main>
      <section className="hero page-gutter" aria-labelledby="hero-title"><div className="hero-inner"><Image src="/images/simplyso-hero.jpg" alt="Simply & So merlot and porcelain ivory insulated bottles on a cream stone plinth in warm light" fill priority sizes="100vw" className="hero-image" /><div className="hero-shade" /><div className="hero-content"><div className="eyebrow hero-eyebrow"><span />SIMPLY RIGHT. SO ESSENTIAL.</div><h1 id="hero-title">Beautifully simple.<br />So <em>essential.</em></h1><p>Thoughtfully designed bottles for every sip,<br />and every beautiful version of your day.</p><a href="#collection" className="button button-cream">Discover the collection <Icon name="arrow" size={20} /></a><div className="hero-social-proof"><div className="avatar-stack"><span>AS</span><span>RM</span><span>MK</span></div><div><Stars /><span>Loved by everyday explorers</span></div></div></div><div className="hero-stamp"><Icon name="leaf" size={26} /><span>SIMPLY RIGHT.<br />SO ESSENTIAL.</span></div><div className="hero-bottom-note"><span className="tiny-dot" /> LESS PLASTIC. MORE POSSIBILITY.</div><div className="hero-index"><span>01</span><span className="index-line" /><span>THE EVERYDAY COLLECTION</span></div></div></section>

      <section className="benefits content-width" aria-label="The Simply & So promise">{[
        { icon: "thermometer" as const, title: "Cold for 24h. Hot for 12h.", text: "Just the way you like it." },
        { icon: "shield" as const, title: "Pure sips. Zero worries.", text: "BPA-free, food-grade steel." },
        { icon: "leaf" as const, title: "Made to refill. Built to last.", text: "Less waste, every single day." },
        { icon: "truck" as const, title: "Good things, delivered.", text: "Free shipping on orders ₹999+." },
      ].map((benefit) => <div className="benefit" key={benefit.title}><Icon name={benefit.icon} size={30} /><div><h3>{benefit.title}</h3><p>{benefit.text}</p></div></div>)}</section>

      <section className="collection-section content-width" id="collection"><div className="section-heading"><div><span className="eyebrow">FIND YOUR EVERYDAY COMPANION</span><h2>Good habits. <em>Great bottles.</em></h2></div><p>A colour for your mood.<br />A size for your kind of day.</p></div><div className="collection-toolbar"><div className="collection-tabs" role="tablist" aria-label="Filter the bottle collection">{["All bottles", "Everyday", "On the move"].map((tab) => <button key={tab} role="tab" aria-selected={filter === tab} aria-controls="product-grid" onClick={() => setFilter(tab)} className={filter === tab ? "active" : ""}>{tab}{tab === "All bottles" && <span>{products.length}</span>}</button>)}</div><span className="collection-caption">THOUGHTFUL IN EVERY DETAIL <Icon name="arrow-up" size={14} /></span></div><div className="product-grid" id="product-grid" role="tabpanel" aria-label={filter}>{visibleProducts.map((product) => <ProductCard product={product} onOpen={openProduct} onAdd={addItem} key={product.id} />)}</div><div className="collection-footnote"><Icon name="drop" size={16} /><span>One small switch. A whole lot of good.</span><span className="footnote-separator">·</span><span>Premium 18/8 stainless steel. Always.</span></div></section>

      <section className="story-section page-gutter" id="our-story"><div className="story-inner"><div className="story-image-wrap"><Image src="/images/simplyso-hero.jpg" alt="Simply & So merlot and porcelain ivory bottles resting on a warm stone plinth" fill sizes="(max-width: 760px) 100vw, 50vw" className="story-image" /><div className="story-image-label"><span>LESS, BUT BETTER.</span><Icon name="leaf" size={20} /></div></div><div className="story-copy"><span className="eyebrow">NOT JUST A BOTTLE. A BETTER WAY.</span><h2>A small ritual.<br /><em>A lasting difference.</em></h2><p>We believe the things you use every day should feel good. In your hand. In your life. And on the planet.</p><p>That's why we created Simply & So. Thoughtfully crafted bottles that make staying hydrated feel a little more intentional—and a lot more you.</p><a href="#the-difference" className="text-link">Get to know Simply & So <Icon name="arrow" size={18} /></a><div className="story-values"><div><Icon name="recycle" size={24} /><span>Refill, don't replace.</span></div><div><Icon name="drop" size={23} /><span>Simply better.</span></div></div></div></div></section>

      <section className="difference-section content-width" id="the-difference"><div className="section-heading"><div><span className="eyebrow">IT'S THE LITTLE THINGS</span><h2>Simply better. <em>By design.</em></h2></div><p>No fuss. No compromises.<br />Just a bottle that gets it right.</p></div><div className="difference-grid">{[
        { num: "01", icon: "thermometer" as const, title: "Your temperature. All day.", body: "Double-wall vacuum insulation keeps your water crisp for 24 hours and your tea cosy for 12." },
        { num: "02", icon: "shield" as const, title: "All the good. None of the bad.", body: "Food-grade 18/8 stainless steel. BPA-free. No lingering flavours. Just your drink, as it should be." },
        { num: "03", icon: "drop" as const, title: "A little less to worry about.", body: "A secure, leakproof lid and a comfortable carry handle. Toss it in your bag and find your flow." },
      ].map((item) => <article className="difference-card" key={item.num}><div className="difference-top"><Icon name={item.icon} size={28} /><span>{item.num}</span></div><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>

      <div className="belief-strip" aria-label="Refill, reuse, repeat"><span>REFILL. REUSE. REPEAT.</span><Icon name="leaf" size={22} /><span>A BETTER KIND OF EVERYDAY.</span><Icon name="drop" size={22} /><span>LESS PLASTIC. MORE POSSIBILITY.</span><Icon name="leaf" size={22} /><span>REFILL. REUSE. REPEAT.</span></div>

      <section className="reviews-section content-width" id="community"><div className="reviews-heading"><span className="eyebrow">GOOD COMPANY. GREAT SIPS.</span><h2>Out in the world. <em>Right at home.</em></h2><p>A few words from the people making Simply & So part of their everyday.</p></div><div className="reviews-grid">{[0, 1, 2].map((offset) => { const review = reviews[(reviewsIndex + offset) % reviews.length]; return <article className="review-card" key={review.name}><Stars /><blockquote>“{review.quote}”</blockquote><div className="review-person"><span className={`review-avatar avatar-${review.tone}`}>{review.initials}</span><div><h3>{review.name}<Icon name="check" size={12} /></h3><p>{review.location} <span>· Simply & So community</span></p></div></div></article>; })}</div><div className="review-controls"><span>Real routines. A little more Simply & So.</span><div><button className="round-button" aria-label="Previous reviews" onClick={() => setReviewsIndex((reviewsIndex + reviews.length - 1) % reviews.length)}><Icon name="arrow" size={17} className="rotate-arrow" /></button><button className="round-button" aria-label="Next reviews" onClick={() => setReviewsIndex((reviewsIndex + 1) % reviews.length)}><Icon name="arrow" size={17} /></button></div></div></section>

      <section className="faq-section content-width"><div><span className="eyebrow">A FEW GOOD ANSWERS</span><h2>Wondering<br />about <em>something?</em></h2><button className="text-link" onClick={() => openInfo("care")}>A little bottle care <Icon name="arrow" size={18} /></button></div><div className="faq-list"><details><summary>Will my Simply & So really keep water cold all day?<Icon name="plus" size={18} /></summary><p>Yes. Our double-wall vacuum insulation keeps drinks cold for up to 24 hours and hot for up to 12. For best results, pre-chill your bottle and keep the lid closed between sips.</p></details><details><summary>Is it completely leakproof?<Icon name="plus" size={18} /></summary><p>Absolutely. The screw-top lid has a food-safe silicone seal. Secure it firmly before placing your bottle in your bag, and you're good to go.</p></details><details><summary>How long will delivery take?<Icon name="plus" size={18} /></summary><p>Standard delivery within India usually takes 4–7 business days after dispatch. Shipping is on us for orders of ₹999 or more. You can pay on delivery at checkout.</p></details><details><summary>How do I take care of my bottle?<Icon name="plus" size={18} /></summary><p>A little warm water, mild soap, and a bottle brush are all you need. Hand wash only, leave the lid off to air dry, and avoid the microwave or freezer.</p></details></div></section>
    </main>

    <footer className="site-footer"><div className="content-width"><Newsletter /><div className="footer-main"><div className="footer-brand-col"><Brand light /><p>Beautifully simple.<br />So essential.</p><button className="footer-community-link" onClick={() => document.getElementById("community")?.scrollIntoView({ behavior: "smooth" })}>Meet our community <Icon name="arrow-up" size={15} /></button></div><div className="footer-link-col"><h3>EXPLORE</h3><a href="#collection" onClick={() => setFilter("All bottles")}>Shop all bottles</a><a href="#our-story">Our story</a><a href="#the-difference">The Simply & So difference</a></div><div className="footer-link-col"><h3>HERE TO HELP</h3><button onClick={() => openInfo("shipping")}>Shipping & returns</button><button onClick={() => openInfo("care")}>Bottle care guide</button><button onClick={() => openInfo("contact")}>Get in touch</button></div><div className="footer-note"><Icon name="leaf" size={28} /><p>Small choices.<br />A more beautiful planet.</p><span>DESIGNED WITH PURPOSE.</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Simply & So. Simply right. So essential.</span><div><button onClick={() => openInfo("privacy")}>Privacy policy</button><button onClick={() => openInfo("terms")}>Terms of service</button><span className="payment-note"><Icon name="lock" size={12} />Secure checkout · Pay on delivery</span></div></div></div></footer>
    <ShopDialogs overlay={overlay} setOverlay={setOverlay} products={products} cart={cart} addItem={addItem} changeQuantity={changeQuantity} onOrderComplete={(orderId, total) => { setCart([]); setToast(""); setOverlay({ type: "success", orderId, total }); router.refresh(); }} />
    {toast && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={16} /></span><span>{toast}</span><button onClick={() => { setToast(""); setOverlay({ type: "cart" }); }}>View bag <Icon name="arrow" size={15} /></button><button className="toast-close" onClick={() => setToast("")} aria-label="Dismiss notification"><Icon name="close" size={16} /></button></div>}
  </div>;
}
