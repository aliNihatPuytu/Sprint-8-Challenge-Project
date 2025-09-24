export const PIZZA_SIZES = [
  { id: 'small', name: 'Küçük', description: '20cm', letter: 'S', basePrice: 65.50 },
  { id: 'medium', name: 'Orta', description: '25cm', letter: 'M', basePrice: 85.50 },
  { id: 'large', name: 'Büyük', description: '30cm', letter: 'L', basePrice: 105.50 }
];

export const CRUST_TYPES = [
  { id: 'thin', name: 'Süpper İnce', description: 'İnce ve çıtır' },
  { id: 'normal', name: 'Normal', description: 'Klasik lezzet' },
  { id: 'thick', name: 'Kalın', description: 'Bol malzemeli' }
];

export const TOPPINGS = [
  { id: 'pepperoni', name: 'Pepperoni', price: 5, isVegan: false },
  { id: 'sosis', name: 'Sosis', price: 5, isVegan: false },
  { id: 'jambon', name: 'Kanada Jambonu', price: 5, isVegan: false },
  { id: 'tavuk', name: 'Tavuk Izgara', price: 5, isVegan: false },
  { id: 'sogan', name: 'Soğan', price: 5, isVegan: true },
  { id: 'domates', name: 'Domates', price: 5, isVegan: true },
  { id: 'misir', name: 'Mısır', price: 5, isVegan: true },
  { id: 'sucuk', name: 'Sucuk', price: 5, isVegan: false },
  { id: 'jalapeno', name: 'Jalepeno', price: 5, isVegan: true },
  { id: 'sarimsak', name: 'Sarımsak', price: 5, isVegan: true },
  { id: 'biber', name: 'Biber', price: 5, isVegan: true },
  { id: 'ananas', name: 'Ananas', price: 5, isVegan: true },
  { id: 'kabak', name: 'Kabak', price: 5, isVegan: true }
];

export const COLORS = { 
  yellow: '#FDC913',
  lightGray: '#5F5F5F',
  darkGray: '#292929',
  red: '#CE2829',
  beige: '#FAF7F2',
  white: '#FFFFFF'
};

export const FONTS = {
  robotoCondensed: '"Roboto Condensed", sans-serif',
  barlow: '"Barlow", sans-serif',
  quattrocento: '"Quattrocento", serif',
  satisfy: '"Satisfy", cursive'
};

export const API_ENDPOINTS = {
  pizzaOrder: 'https://reqres.in/api/pizza'
};