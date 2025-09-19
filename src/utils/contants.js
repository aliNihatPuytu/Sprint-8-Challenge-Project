export const PIZZA_SIZES = [
  { id: 'small', name: 'Küçük', price: 65.50, description: '20cm' },
  { id: 'medium', name: 'Orta', price: 85.50, description: '25cm' },
  { id: 'large', name: 'Büyük', price: 105.50, description: '30cm' }
]

export const CRUST_TYPES = [
  { id: 'thin', name: 'İnce Hamur', description: 'İnce ve çıtır' },
  { id: 'normal', name: 'Normal Hamur', description: 'Klasik lezzet' },
  { id: 'thick', name: 'Kalın Hamur', description: 'Bol malzemeli' }
]

export const TOPPINGS = [
  { id: 'pepperoni', name: 'Pepperoni', price: 5, isVegan: false },
  { id: 'sausage', name: 'Sosis', price: 5, isVegan: false },
  { id: 'ham', name: 'Kanada Jambonu', price: 5, isVegan: false },
  { id: 'chicken', name: 'Tavuk Izgara', price: 5, isVegan: false },
  { id: 'onion', name: 'Soğan', price: 5, isVegan: true },
  { id: 'tomato', name: 'Domates', price: 5, isVegan: true },
  { id: 'corn', name: 'Mısır', price: 5, isVegan: true },
  { id: 'sucuk', name: 'Sucuk', price: 5, isVegan: false },
  { id: 'jalapeno', name: 'Jalepeno', price: 5, isVegan: true },
  { id: 'garlic', name: 'Sarımsak', price: 5, isVegan: true },
  { id: 'pepper', name: 'Biber', price: 5, isVegan: true },
  { id: 'pineapple', name: 'Ananas', price: 5, isVegan: true },
  { id: 'zucchini', name: 'Kabak', price: 5, isVegan: true }
]

export const COLORS = {
  yellow: '#FDC913',
  lightGray: '#5F5F5F',
  darkGray: '#292929',
  red: '#CE2829',
  beige: '#FAF7F2',
  white: '#FFFFFF'
}

export const FONTS = {
  robotoCondensed: '"Roboto Condensed", sans-serif',
  barlow: '"Barlow", sans-serif',
  quattrocento: '"Quattrocento", serif',
  satisfy: '"Satisfy", cursive'
}

export const API_ENDPOINTS = {
  pizzaOrder: 'https://reqres.in/api/pizza'
}