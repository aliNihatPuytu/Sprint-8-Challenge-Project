import React, { useState, useEffect } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useApi } from "../../hooks/useApi";
import { PIZZA_SIZES, CRUST_TYPES, TOPPINGS } from "../../utils/constants";
import { calculateTotalPrice, calculateToppingsPrice } from "../../utils/priceCalculator";
import Footer from "../Footer/Footer";
import "./OrderForm.css";

const OrderForm = ({ navigateTo, onSubmit, setIsLoading, selectedProduct }) => {
  const { makeRequest, loading, error: apiError } = useApi();
  const [quantity, setQuantity] = useState(1);

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
  } = useFormValidation({
    name: "", 
    size: "",
    crust: "",
    toppings: TOPPINGS.map((t) => ({ ...t, selected: false })),
    note: "",
  });

  const fallbackPrice = selectedProduct?.price ?? 85.5;
  const [basePrice, setBasePrice] = useState(fallbackPrice);

  useEffect(() => {
    if (formData.size) {
      const selectedSize = PIZZA_SIZES.find((s) => s.id === formData.size);
      setBasePrice(selectedSize ? selectedSize.basePrice : fallbackPrice);
    } else {
      setBasePrice(fallbackPrice);
    }
  }, [formData.size, fallbackPrice]);

  const handleSizeChange = (sizeId) => handleChange("size", sizeId);
  const handleCrustChange = (crustId) => handleChange("crust", crustId);

  const handleToppingChange = (toppingId) => {
    const selectedCount = formData.toppings.filter((t) => t.selected).length;
    const isSelected = formData.toppings.find((t) => t.id === toppingId)?.selected;
    if (!isSelected && selectedCount >= 10) return;

    const updated = formData.toppings.map((t) =>
      t.id === toppingId ? { ...t, selected: !t.selected } : t
    );
    handleChange("toppings", updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsLoading?.(true);

    try {
      const selectedToppings = formData.toppings.filter((t) => t.selected).map((t) => t.name);
      const selectedSize = PIZZA_SIZES.find((s) => s.id === formData.size);
      const selectedCrust = CRUST_TYPES.find((c) => c.id === formData.crust);

      const unitPrice = parseFloat(
        calculateTotalPrice(formData.size, formData.toppings, fallbackPrice)
      );

      const payload = {
        name: formData.name,
        size: selectedSize?.name,
        crust: selectedCrust?.name,
        toppings: selectedToppings,
        note: formData.note,
        quantity,
        totalPrice: unitPrice * quantity,
        productName: selectedProduct?.name || "Position Absolute Acı Pizza",
        productPrice: fallbackPrice,
      };

      const response = await makeRequest({
        url: "https://reqres.in/api/pizza",
        method: "POST",
        data: payload,
      });

      onSubmit?.({
        ...payload,
        id: response?.id || Math.random().toString(36).slice(2, 11),
        createdAt: response?.createdAt || new Date().toISOString(),
      });

    } catch (err) {
      console.error("Sipariş gönderilemedi:", err);
    }
  };

  const toppingsPrice = parseFloat(calculateToppingsPrice(formData.toppings)) * quantity;
  const totalPrice = basePrice * quantity + toppingsPrice;
  const selectedToppingsCount = formData.toppings.filter((t) => t.selected).length;

  return (
    <div className="order-form-page">
      <div className="hero">
        <div className="form-banner">
          <img
            src="images/iteration-2-images/pictures/form-banner.png"
            alt="Position Absolute Acı Pizza"
            className="banner-image"
          />
        </div>
        <div className="hero-inner">
          <nav className="breadcrumb-section" aria-label="Breadcrumb">
            <span className="breadcrumb-link" onClick={() => navigateTo?.("home")}>Anasayfa</span>
            <span className="separator"> &gt; </span>
            <span className="breadcrumb-current">Seçenekler</span>
            <span className="separator"> &gt; </span>
            <span className="breadcrumb-current highlight">Sipariş Oluştur</span>
          </nav>

          <section className="product-head">
            <h1 className="product-title">{selectedProduct?.name || "Position Absolute Acı Pizza"}</h1>
            <div className="price-rating-row">
              <p className="product-price">{basePrice.toFixed(2)}₺</p>
              <span className="rate">4.9</span>
              <span className="count">(200)</span>
            </div>

            <p className="product-desc">
              Frontend Dev olarak hala position:absolute kullanıyorsan bu çok acı pizza tam sana göre.
              Pizza, domates, peynir ve genellikle çeşitli diğer malzemelerle kaplanmış, daha sonra
              geleneksel olarak odun ateşinde bir fırında yüksek sıcaklıkta pişirilen, genellikle
              yuvarlak, düzleştirilmiş mayalı buğday bazlı hamurdan oluşan İtalyan kökenli lezzetli
              bir yemektir. Küçük bir pizzaya bazen pizzetta denir.
            </p>
          </section>
        </div>
      </div>

      <div className="container page-content">
        <form onSubmit={handleSubmit} noValidate className="order-card">
          <div className="rows two-col">
            <div className="form-group">
              <label className="form-label required">Boyut Seç</label>
              <div className="radio-group">
                {PIZZA_SIZES.map((size) => (
                  <label key={size.id} className="radio-label">
                    <input
                      type="radio"
                      name="size"
                      value={size.id}
                      checked={formData.size === size.id}
                      onChange={() => handleSizeChange(size.id)}
                      onBlur={() => handleBlur("size")}
                    />
                    <span className="radio-custom">{size.letter}</span>
                  </label>
                ))}
              </div>
              {touched.size && errors.size && <p className="error-text">{errors.size}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="crust-select" className="form-label required">Hamur Seç</label>
              <select
                id="crust-select"
                name="crust"
                value={formData.crust}
                onChange={(e) => handleCrustChange(e.target.value)}
                onBlur={() => handleBlur("crust")}
                className={touched.crust && errors.crust ? "input-error" : ""}
              >
                <option value="" disabled>- Hamur Kalınlığı Seç -</option>
                {CRUST_TYPES.map((crust) => (
                  <option key={crust.id} value={crust.id}>{crust.name}</option>
                ))}
              </select>
              {touched.crust && errors.crust && <p className="error-text">{errors.crust}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ek Malzemeler</label>
            <p className="toppings-note">En Fazla 10 malzeme seçebilirsiniz. 5₺</p>
            <div className="toppings-grid">
              {formData.toppings.map((topping) => (
                <label
                  key={topping.id}
                  className={`checkbox-label ${
                    !topping.selected && selectedToppingsCount >= 10 ? "disabled" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={topping.selected}
                    onChange={() => handleToppingChange(topping.id)}
                    disabled={!topping.selected && selectedToppingsCount >= 10}
                  />
                  <span>{topping.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name-input" className="form-label required">İsim</label>
            <input
              id="name-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="İsminizi girin"
              className={touched.name && errors.name ? "input-error" : ""}
            />
            {touched.name && errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="note-input" className="form-label">Sipariş Notu</label>
            <textarea
              id="note-input"
              name="note"
              value={formData.note}
              onChange={(e) => handleChange("note", e.target.value)}
              placeholder="Siparişine eklemek istediğin bir not var mı?"
            />
          </div>

          <hr className="form-divider" />

          <div className="actions-row">
            <div className="quantity-selector" aria-label="Adet seçici">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>

            <aside className="order-summary">
              <h3>Sipariş Toplamı</h3>
              <div className="price-details">
                <p>
                  <span>Seçimler</span>
                  <span>{toppingsPrice.toFixed(2)}₺</span>
                </p>
                <p className="total">
                  <span>Toplam</span>
                  <span>{totalPrice.toFixed(2)}₺</span>
                </p>
              </div>
              <button type="submit" className="submit-button" style={{ margin: 0 }} disabled={loading}>
                SİPARİŞ VER
              </button>
            </aside>
          </div>

          {apiError && <div className="api-error-message">{apiError}</div>}
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default OrderForm;
