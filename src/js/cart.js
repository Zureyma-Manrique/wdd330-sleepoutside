import { getLocalStorage, qs } from './utils.mjs'; // IMPORT qs

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || []; // Add fallback for empty cart
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  qs('.product-list').innerHTML = htmlItems.join('');

  // --- NEW CODE TO CALCULATE AND DISPLAY TOTAL ---
  const total = cartItems.reduce(
    (acc, item) => acc + item.FinalPrice,
    0
  );

  const totalElement = qs('.cart-total-value');
  if (totalElement) {
    totalElement.textContent = total.toFixed(2);
  }
  // --- END NEW CODE ---
}

function cartItemTemplate(item) {
  const newItem = `<li class='cart-card divider'>
  <a href='#' class='cart-card__image'>
    <img
      src='${item.Image}'
      alt='${item.Name}'
    />
  </a>
  <a href='#'>
    <h2 class='card__name'>${item.Name}</h2>
  </a>
  <p class='cart-card__color'>${item.Colors[0].ColorName}</p>
  <p class='cart-card__quantity'>qty: 1</p>
  <p class='cart-card__price'>$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
