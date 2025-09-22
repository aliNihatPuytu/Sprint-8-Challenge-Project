import React, { useState, useEffect } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useApi } from "../../hooks/useApi";
import { PIZZA_SIZES, CRUST_TYPES, TOPPINGS } from "../../utils/constants";
import { calculateTotalPrice, calculateToppingsPrice } from "../../utils/priceCalculator";
import "./OrderForm.css";

const OrderForm = ({ navigateTo, onSubmit, setIsLoading, selectedProduct }) => {
  const { makeRequest, loading, error: apiError } = useApi();
  const [quantity, setQuantity] = useState(1);

  const { formData, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation({
    name: "",
    size: "medium",
    crust: "normal",
    toppings: TOPPINGS.map(t => ({ ...t, selected: false })),
    note: ""
  });

  const [basePrice, setBasePrice] = useState(selectedProduct?.price || 85.50);
  
  useEffect(() => {
    if (formData.size) {
      const selectedSize = PIZZA_SIZES.find(size => size.id === formData.size);
      setBasePrice(
        selectedSize
          ? selectedSize.basePrice + (selectedProduct?.basePrice || 0)
          : (selectedProduct?.price || 0)
      );
    }
  }, [formData.size, selectedProduct]);

  const handleSizeChange = (sizeId) => {
    handleChange("size", sizeId);
  };

  const handleCrustChange = (crustId) => {
    handleChange("crust", crustId);
  };

  const handleToppingChange = (toppingId) => {
    const updatedToppings = formData.toppings.map(topping => 
      topping.id === toppingId
        ? { ...topping, selected: !topping.selected }
        : topping
    );
    handleChange("toppings", updatedToppings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    setIsLoading(true);

    try {
      const selectedToppings = formData.toppings
        .filter(t => t.selected)
        .map(t => t.name);

      const selectedSize = PIZZA_SIZES.find(s => s.id === formData.size);
      const selectedCrust = CRUST_TYPES.find(c => c.id === formData.crust);

      const unitPrice = parseFloat(
        calculateTotalPrice(
          formData.size,
          formData.toppings,
          selectedProduct?.price || 85.50
        )
      );

      const payload = {
        name: formData.name,
        size: selectedSize.name,
        crust: selectedCrust.name,
        toppings: selectedToppings,
        note: formData.note,
        quantity: quantity,
        totalPrice: unitPrice * quantity,
        productName: selectedProduct?.name || "Position Absolute Acı Pizza",
        productPrice: selectedProduct?.price || 85.50
      };

      const response = await makeRequest({
        url: "https://reqres.in/api/pizza",
        method: "POST",
        data: payload
      });

      console.log("Sipariş yanıtı:", response);

      onSubmit({
        ...payload,
        id: response?.id || Math.random().toString(36).substr(2, 9),
        createdAt: response?.createdAt || new Date().toISOString()
      });

    } catch (error) {
      console.error("Sipariş gönderilemedi:", error);
      setIsLoading(false);
    }
  };

  const totalPrice = parseFloat(
    calculateTotalPrice(
      formData.size,
      formData.toppings,
      selectedProduct?.price || 85.50
    )
  ) * quantity;

  const toppingsPrice = parseFloat(calculateToppingsPrice(formData.toppings)) * quantity;
  const selectedToppingsCount = formData.toppings.filter(t => t.selected).length;

  return (
    <div className="order-form-page">
      <div className="breadcrumb-section">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => navigateTo("home")} className="breadcrumb-link">
              Anasayfa
            </span>
            <span className="separator"> - </span>
            <span>Seçenekler</span>
            <span className="separator"> - </span>
            <span className="current">Sipariş Oluştur</span>
          </div>
        </div>
      </div>

      <div className="pizza-info-section">
        <div className="container">
          <div className="pizza-details">
            <h1 className="pizza-name">{selectedProduct?.name || "Position Absolute Acı Pizza"}</h1>
            <div className="pizza-meta">
              <div className="pizza-price">{basePrice.toFixed(2)}₺</div>
              <div className="pizza-rating">
                <span className="rating-score">4.9</span>
                <span className="rating-count">(200)</span>
              </div>
            </div>
            <p className="pizza-description">
              Frontend Dev olarak hala position:absolute kullanıyorsan bu çok acı pizza tam sana göre. 
              Pizza, domates, peynir ve genellikle çeşitli diğer malzemelerle kaplanmış, daha sonra 
              geleneksel olarak odun ateşinde bir fırında yüksek sıcaklıkta pişirilen, genellikle 
              yuvarlak, düzleştirilmiş mayalı buğday bazlı hamurdan oluşan İtalyan kökenli lezzetli 
              bir yemektir. Küçük bir pizzaya bazen pizzetta denir.
            </p>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="container">
          <form onSubmit={handleSubmit} className="pizza-form" noValidate>
            <div className="form-group">
              <label htmlFor="name" className="required">İsim</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className={touched.name && errors.name ? "error" : ""}
                placeholder="İsminiz"
              />
              {touched.name && errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <legend className="required">Boyut Seç</legend>
                <div className="size-options">
                  {PIZZA_SIZES.map(size => (
                    <label key={size.id} className="size-option">
                      <input
                        type="radio"
                        name="size"
                        value={size.id}
                        checked={formData.size === size.id}
                        onChange={() => handleSizeChange(size.id)}
                        onBlur={() => handleBlur("size")}
                        className="size-input"
                      />
                      <span className="size-circle">{size.letter}</span>
                      <span className="size-label">{size.name} ({size.description})</span>
                    </label>
                  ))}
                </div>
                {touched.size && errors.size && <span className="error-message">{errors.size}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="crust" className="required">Hamur Kalınlığı Seç</label>
                <select
                  id="crust"
                  name="crust"
                  value={formData.crust}
                  onChange={(e) => handleCrustChange(e.target.value)}
                  onBlur={() => handleBlur("crust")}
                  className={touched.crust && errors.crust ? "error" : ""}
                >
                  {CRUST_TYPES.map(crust => (
                    <option key={crust.id} value={crust.id}>{crust.name}</option>
                  ))}
                </select>
                {touched.crust && errors.crust && <span className="error-message">{errors.crust}</span>}
              </div>
            </div>

            <div className="form-group">
              <legend>Ek Malzemeler</legend>
              <p className="toppings-info">En Fazla 10 malzeme seçebilirsiniz. Her biri +5₺</p>
              <div className="toppings-grid">
                {formData.toppings.map(topping => (
                  <label
                    key={topping.id}
                    className={`topping-option ${topping.selected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={topping.selected}
                      onChange={() => handleToppingChange(topping.id)}
                      onBlur={() => handleBlur("toppings")}
                      disabled={!topping.selected && selectedToppingsCount >= 10}
                    />
                    <span className="topping-name">{topping.name}</span>
                    {topping.isVegan && <span className="vegan-badge">VE</span>}
                  </label>
                ))}
              </div>
              {touched.toppings && errors.toppings && <span className="error-message">{errors.toppings}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="note">Sipariş Notu</label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
                onBlur={() => handleBlur("note")}
                placeholder="Siparişinizle ilgili eklemek istediğiniz not var mı?"
                rows="3"
              />
            </div>

            <div className="order-controls">
              <div className="quantity-section">
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>

              <div className="order-summary">
                <h3>Sipariş Toplamı</h3>
                <div className="summary-row">
                  <span>Seçimler</span>
                  <span>{toppingsPrice}₺</span>
                </div>
                <div className="summary-row total">
                  <span>Toplam</span>
                  <span>{totalPrice}₺</span>
                </div>
              </div>
            </div>

            {apiError && (
              <div className="api-error">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              className="submit-order-btn"
              disabled={loading}
            >
              SİPARİŞ VER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
