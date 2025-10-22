import React, { useEffect, useId, useMemo, useState } from "react";
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

const Icon = ({ name, alt = "", ...rest }) => {
  const bases = ["/images/icons", "/images/iteration-2-images/icons"];
  const [i, setI] = useState(0);
  const src = `${bases[i]}/${name}.svg`;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (i < bases.length - 1) setI(i + 1);
      }}
      {...rest}
    />
  );
};

const ProductImg = ({ file, alt, className }) => {
  const bases = ["/images/pictures", "/images/iteration-2-images/pictures"];
  const [i, setI] = useState(0);
  const [src, setSrc] = useState(`${bases[0]}/${file}`);

  useEffect(() => {
    setI(0);
    setSrc(`${bases[0]}/${file}`);
  }, [file]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (i < bases.length - 1) {
          const ni = i + 1;
          setI(ni);
          setSrc(`${bases[ni]}/${file}`);
        }
      }}
    />
  );
};

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
      <ProductImg file={product.image} alt={product.name} className="product-image" />
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
      { id: 1, name: "Terminal Pizza",                 price: 60,   rating: 4.9, ratingCount: 200, image: "food-1.png" },
      { id: 2, name: "Position Absolute Acı Pizza",    price: 85.5, rating: 4.9, ratingCount: 928, image: "food-2.png" },
      { id: 3, name: "useEffect Tavuklu Burger",       price: 75,   rating: 4.9, ratingCount: 462, image: "food-3.png" },
    ],
    []
  );

  const specialProducts = useMemo(
    () => [
      { id: 4, name: "Position Absolute Acı Burger", type: "Özel Lezzetus" },
      { id: 5, name: "Hackathlon Burger Menü",       type: "Burger Menü" },
      { id: 6, name: "Çooook hızlı npm gibi kurye",  type: "Hızlı Kurye" },
    ],
    []
  );

  const navItems = [
    { id: "kore",  label: "YENİ! Kore",     iconName: "1" },
    { id: "pizza", label: "Pizza",          iconName: "2" },
    { id: "burger",label: "Burger",         iconName: "3" },
    { id: "fries", label: "French fries",   iconName: "4" },
    { id: "fast",  label: "Fast food",      iconName: "5" },
    { id: "soda",  label: "Soft drinks",    iconName: "6" },
  ];

  const tabs = [
    { id: "ramen",  label: "Ramen",        iconName: "1", active: false },
    { id: "pizza",  label: "Pizza",        iconName: "2", active: true  },
    { id: "burger", label: "Burger",       iconName: "3", active: false },
    { id: "fries",  label: "French fries", iconName: "4", active: false },
    { id: "fast",   label: "Fast food",    iconName: "5", active: false },
    { id: "soft",   label: "Soft drinks",  iconName: "6", active: false },
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
            <Icon name={it.iconName} alt="" aria-hidden="true" />
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
              <Icon name={t.iconName} alt="" aria-hidden="true" />
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
