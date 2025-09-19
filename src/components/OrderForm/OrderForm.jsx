import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useApi } from "../../hooks/useApi";
import { PIZZA_SIZES, CRUST_TYPES, TOPPINGS } from "../../utils/contants";
import { calculateTotalPrice, calculateToppingsPrice } from "../../utils/priceCalculator";
import "./OrderForm.css"

const OrderForm = ({ navigateTo, onsubmit, setIsLoading }) => {
    const { makeRequest, loading, error: apiError } = useApi()

    const { formData, errors, touched, handleChange, handleBlur, validateAll, setFormData } = useFormValidation({
        name: "",
        size: "",
        crust: "",
        toppings: TOPPINGS.map(t => ({ ...t, selected: false })),
        note: ""
    })

    const [basePrice, setBasePrice] = useState(0)
    
    useEffect(() => {
        handleChange("size", "medium")
    }, [])

    useEffect(() => {
        if (formData.size) {
            const selectedSize = PIZZA_SIZES.find(size => size.id === formData.size)
            setBasePrice(selectedSize ? selectedSize.price : 0)
        }
    }, [formData.size])

    useEffect(() => {
        setIsLoading(loading)
    }, [loading, setIsLoading])

    const handleSizeChange = (sizeId) => {
        handleChange("size", sizeId)
    }

    const handleCrustChange = (crustId) => {
        handleChange("crust", crustId)
    }

    const handleToppingChange = (toppingId) => {
        const updatedToppings = formData.toppings.map(topping => 
            topping.id === toppingId
            ? { ...topping, selected: !topping.selected }
            : topping
        )
        
        handleChange("toppings", updatedToppings)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateAll()) return 
        
        try {
            const selectedToppings = formData.toppings
            .filter(t => t.selected)
            .map(t => t.name)

            const selectedSize = PIZZA_SIZES.find(s => s.id === formData.size)
            const selectedCrust = CRUST_TYPES.find(c => c.id === formData.crust)

            const payload = {
                name: formData.name,
                size: selectedSize.name,
                crust: selectedCrust.name,
                toppings: selectedToppings,
                note: formData.note,
                totalPrice: calculateTotalPrice(formData.size, formData.toppings)
            }

            const response = await makeRequest({
                url: "https://reqres.in/api/pizza",
                method: "POST",
                data: payload
            })

            console.log("Sipariş yanıtı:", response)

            onsubmit({
                ...payload,
                id: response.id || Math.random().toString(36).substr(2, 9),
                createdAt: response.createdAt || new Date().toISOString()
            })
        } catch (error) {
            console.error("Sipariş gönderilemedi:", error)
        }
    }

    const totalPrice = calculateTotalPrice(formData.size, formData.toppings)
    const toppingsPrice = calculateToppingsPrice(formData.toppings)
    const selectedToppingsCount = formData.toppings.filter(t => t.selected).length

    return (
        <section className="order-form">
            <div className="container">
                <h2>Sipariş Oluştur</h2>

                <div className="pizza-info">
                    <h3>Position Absolute Acı Pizza</h3>
                    <div className="price-rating">
                        <span className="price">{basePrice} ₺</span>
                        <span className="rating">4.9 (200)</span>
                    </div>
                    <p className="description">
                        Frontend Dev olarak hala position:absolute kullanıyorsan bu çok acı pizza tam sana göre. 
            Pizza, domates, peynir ve genellikle çeşitli diğer malzemelerle kaplanmış, daha sonra 
            geleneksel olarak odun ateşinde bir fırında yüksek sıcaklıkta pişirilen, genellikle 
            yuvarlak, düzleştirilmiş mayalı buğday bazlı hamurdan oluşan İtalyan kökenli lezzetli 
            bir yemektir. Küçük bir pizzaya bazen pizzetta denir.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="form" noValidate>
                    <div className="form-group">
                        <label htmlFor="name" className="required">İsim</label>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        className={errors.name ? "name-error" : undefined}
                        aria-required="true"
                        />
                        {errors.name && (
                            <span id="name-error" className="error-message" role="alert">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <fieldset>
                            <legend className="required">Boyut Seç</legend>
                            {errors.size && (
                                <span className="error-message" role="alert">{errors.size}</span>
                            )}
                            <div className="radio-group">
                                {PIZZA_SIZES.map(size => (
                                    <div key={size.id} className="radio-option">
                                        <input
                                        type="radio"
                                        id={`size-${size.id}`}
                                        name="size"
                                        checked={formData.size === size.id}
                                        onChange={() => handleSizeChange(size.id)}
                                        onBlur={() => handleBlur("size")}
                                        aria-required="true"
                                        />
                                        <label htmlFor={`size-${size.id}`}>
                                            {size.name} <span className="size-desc">({size.description})</span>
                                        </label>
                                        </div>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <div className="form-group">
                        <fieldset>
                            <legend className="required">Hamur Seç</legend>
                            {errors.crust && (
                                <span className="error-message" role="alert">{errors.crust}</span>
                            )}
                            <div className="radio-group">
                                {CRUST_TYPES.map(crust => (
                                    <div key={crust.id} className="radio-option">
                                        <input
                                        type="radio"
                                        id={`crust-${crust.id}`}
                                        name="crust"
                                        checked={formData.crust === crust.id}
                                        onChange={() => handleCrustChange(crust.id)}
                                        onBlur={() => handleBlur("crust")}
                                        aria-required="true"
                                        />
                                        <label htmlFor={`crust-${crust.id}`}>
                                            {crust.name} <span className="crust-desc">({crust.description})</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <div className="form-group">
                        <fieldset>
                            <legend>
                                Ek Malzemeler
                                <span className="subtext">En Fazla 10 malzeme seçebilirsiniz. 5₺</span>
                            </legend>
                            {errors.toppings && (
                                <span className="error-message" role="alert">{errors.toppings}</span>
                            )}
                            <div className="toppings-selected">
                                {selectedToppingsCount > 0 && (
                                    <span>{selectedToppingsCount} malzeme seçildi</span>
                                )}
                            </div>

                            <div className="checkbox-grid">
                                {formData.toppings.map(topping => (
                                    <div key={topping.id} className="checkbox-option">
                                        <input 
                                        type="checkbox"
                                        id={`topping-${topping.id}`}
                                        checked={topping.selected}
                                        onChange={() => handleToppingChange(topping.id)}
                                        onBlur={() => handleBlur("toppings")}
                                        disabled={!topping.selected && selectedToppingsCount >= 10}
                                        />
                                        <label htmlFor={`${topping.id}`}> 
                                            {topping.name}
                                            {topping.isVegan && <span className="vegan-badge">Vegan</span>}
                                        </label>
                                        </div>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <div className="form-group">
                        <label htmlFor="note">Sipariş Notu</label>
                        <textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={(e) => handleChange("note", e.target.value)}
                        placeholder="Siparişine eklemek istediğin bir not var mı?"
                        rows="3"
                        />
                    </div>

                    <div className="order-summary">
                        <h3>Sipariş Toplamı</h3>
                        <div className="summary-line">
                            <span>Seçimler</span>
                            <span>{toppingsPrice} ₺</span>
                        </div>
                            <div className="summary-line total">
                                <span>Toplam</span>
                                <span>{totalPrice} ₺</span>
                            </div>
                    </div>

                    {apiError && ( 
                        <div className="api-error" role="alert">
                            {apiError}
                        </div>
                    )}
                    <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading || Object.values(errors).some(error => error)}
                    aria-busy={loading}
                    >
                        {loading ? "GÖNDERİLİYOR..." : "SİPARİŞ VER"}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default OrderForm