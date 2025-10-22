import React, { useId, useMemo } from "react";
import "./Home.css";

const ENTER_KEYS = ["Enter", " "];

function asButtonHandlers(action) {
  return {
    onClick: action,
    onKeyDown: (e) => {
      if (ENTER_KEYS.includes(e.key)) {
        e.preventDefault();
        action();
      }
    },
  };
}

const PromoCard = ({ className, bgClass, title, subtitle, buttonLabel = "SİPARİŞ VER", onActivate, ariaLabel }) => {
  return (
    <div
      className={`promo-card ${className} ${bgClass}`}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      {...asButtonHandlers(onActivate)}
    >
      <div className="promo-card__content">
        {title}
        {subtitle ? <p className="promo-card__subtitle">{subtitle}</p> : null}
        <button
          className="promo-card__button"
          type="button"
          aria-label={`${buttonLabel} - ${ariaLabel}`}
          onClick={(e) => {
            e.stopPropagation();
            onActivate();
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onActivate }) => {
  return (
    <article
      className="product-card"
      role="button"
      tabIndex={0}
      aria-label={`Siparişe git: ${product.name}`}
      {...asButtonHandlers(onActivate)}
    >
      <img
        loading="lazy"
        decoding="async"
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <span className="rating-score">{product.rating}</span>
          <span className="rating-count">({product.ratingCount})</span>
          <span className="product-price">{product.price}₺</span>
        </div>
      </div>
    </article>
  );
};

const Home = ({ navigateTo }) => {
  const heroLabelId = useId();
  const products = useMemo(
    () => [
      { id: 1, name: "Terminal Pizza", price: 60, rating: 4.9, ratingCount: 200, image: "/images/iteration-2-images/pictures/food-1.png" },
      { id: 2, name: "Position Absolute Acı Pizza", price: 85.5, rating: 4.9, ratingCount: 928, image: "/images/iteration-2-images/pictures/food-2.png" },
      { id: 3, name: "useEffect Tavuklu Burger", price: 75, rating: 4.9, ratingCount: 462, image: "/images/iteration-2-images/pictures/food-3.png" },
    ],
    []
  );

  const specialProducts = useMemo(
    () => [
      { id: 4, name: "Position Absolute Acı Burger", type: "Özel Lezzetus" },
      { id: 5, name: "Hackathlon Burger Menü", type: "Burger Menü" },
      { id: 6, name: "Çooook hızlı npm gibi kurye", type: "Hızlı Kurye" },
    ],
    []
  );

  const navItems = [
    { id: "kore", label: "YENİ! Kore", icon: "/images/icons/1.svg" },
    { id: "pizza", label: "Pizza", icon: "/images/icons/2.svg" },
    { id: "burger", label: "Burger", icon: "/images/icons/3.svg" },
    { id: "fries", label: "Kızartmalar", icon: "/images/icons/4.svg" },
    { id: "fast", label: "Fast food", icon: "/images/icons/5.svg" },
    { id: "soda", label: "Gazlı içecek", icon: "/images/icons/6.svg" },
  ];

  const tabs = [
    { id: "ramen", label: "Ramen", icon: "/images/icons/1.svg", active: false },
    { id: "pizza", label: "Pizza", icon: "/images/icons/2.svg", active: true },
    { id: "burger", label: "Burger", icon: "/images/icons/3.svg", active: false },
    { id: "fries", label: "French fries", icon: "/images/icons/4.svg", active: false },
    { id: "fast", label: "Fast food", icon: "/images/icons/5.svg", active: false },
    { id: "soft", label: "Soft drinks", icon: "/images/icons/6.svg", active: false },
  ];

  return (
    <div className="home">
      <section className="hero-section" aria-labelledby={heroLabelId}>
        <div className="hero-content">
          <img
            className="logo-img"
            src="/images/iteration-1-images/logo.svg"
            alt="Teknolojik Yemekler"
          />
          <div className="hero-subtitle">fırsatı kaçırma</div>
          <h1 id={heroLabelId} className="hero-title">
            <span>KOD</span> <span>ACIKTIRIR</span> <br />
            <span>PIZZA,</span> <span>DOYURUR</span>
          </h1>
          <button
            className="cta-button"
            type="button"
            aria-label="Sipariş formuna git"
            onClick={() => navigateTo("order")}
          >
            ACIKTIM
          </button>
        </div>
        <div className="hero-decorations" aria-hidden="true"></div>
      </section>

      <nav className="nav-menu" aria-label="Kategoriler">
        {navItems.map((it) => (
          <a
            key={it.id}
            href="#"
            className="nav-item"
            onClick={(e) => e.preventDefault()}
          >
            <img src={it.icon} alt="" aria-hidden="true" />
            <span>{it.label}</span>
          </a>
        ))}
      </nav>

      <main className="content-section" id="main-content">
        <div className="cards-container">
          <PromoCard
            className="promo-card--red promo-card--square"
            bgClass="bg-kart1"
            ariaLabel="Özel Lezzetus - Position:Absolute Acı Burger"
            title={
              <h2 className="promo-card__title">
                Özel<br />Lezzetus
              </h2>
            }
            subtitle="Position:Absolute Acı Burger"
            onActivate={() => navigateTo("order", specialProducts[0])}
          />
          <div className="promo-column">
            <PromoCard
              className="promo-card--dark promo-card--rect"
              bgClass="bg-kart2"
              ariaLabel="Hackathlon Burger Menü"
              title={<h2 className="promo-card__title--sm">Hackathlon<br />Burger Menü</h2>}
              onActivate={() => navigateTo("order", specialProducts[1])}
            />
            <PromoCard
              className="promo-card--light promo-card--rect"
              bgClass="bg-kart3"
              ariaLabel="Çoooooook hızlı npm gibi kurye"
              title={
                <h2 className="promo-card__title--sm">
                  <span className="promo-card__accent">Çoooooook</span>{" "}
                  <span className="promo-card__muted">hızlı<br />npm gibi kurye</span>
                </h2>
              }
              onActivate={() => navigateTo("order", specialProducts[2])}
            />
          </div>
        </div>

        <header className="products-header">
          <p className="products-subtitle">en çok paketlenen menüler</p>
          <h2 className="products-title">Acıktıran Kodlara Doyuran Lezzetler</h2>
        </header>

        <div className="category-tabs" role="tablist" aria-label="Kategori Sekmeleri">
          {tabs.map((t) => (
            <a
              key={t.id}
              href="#"
              className={`tab${t.active ? " active" : ""}`}
              role="tab"
              aria-selected={t.active ? "true" : "false"}
              aria-current={t.active ? "page" : undefined}
              onClick={(e) => e.preventDefault()}
            >
              <img src={t.icon} alt="" aria-hidden="true" />
              <span>{t.label}</span>
            </a>
          ))}
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onActivate={() => navigateTo("order", product)}
            />
          ))}
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Product",
                name: p.name,
                image: p.image,
                offers: {
                  "@type": "Offer",
                  priceCurrency: "TRY",
                  price: p.price,
                  availability: "https://schema.org/InStock",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: p.rating,
                  reviewCount: p.ratingCount,
                },
              },
            })),
          }),
        }}
      />
    </div>
  );
};

export default Home;
