import { PIZZA_SIZES } from "./constants";

export const calculateTotalPrice = (sizeId, toppings, baseProductPrice = 85.50) => {
  const selectedSize = PIZZA_SIZES.find(size => size.id === sizeId);
  let total = selectedSize ? selectedSize.basePrice : baseProductPrice;

  toppings.forEach(topping => {
    if (topping.selected) {
      total += topping.price;
    }
  });

  return total.toFixed(2);
};

export const calculateToppingsPrice = (toppings) => {
  return toppings
    .filter(t => t.selected)
    .reduce((total, topping) => total + topping.price, 0)
    .toFixed(2);
};