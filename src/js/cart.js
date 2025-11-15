import { getLocalStorage, qs } from './utils.mjs';
import ProductData from './ProductData.mjs'; // Import ProductData

// Get the product data source
const dataSource = new ProductData('tents');

async function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const productListEl = document.querySelector('.product-list');
  const cartFooterEl = document.querySelector('.cart-footer');
  const cartTotalEl = document.querySelector('.cart-total-value');

  // Hide the cart footer by default
  cartFooterEl.style.display = 'none';

  if (cartItems.length > 0) {
    // Show the cart footer
    cartFooterEl.style.display = 'block';

    // Get full product details for each item in the cart
    const products = await Promise.all(
      cartItems.map(item => dataSource.findProductById(item.Id))
    );

    // Generate HTML for each cart item
    const htmlItems = products.map((product, index) =>
      cartItemTemplate(product, cartItems[index])
    );
    productListEl.innerHTML = htmlItems.join('');

    // Calculate the total cart value
    const total = products.reduce((acc, product, index) => {
      return acc + product.FinalPrice * cartItems[index].Quantity;
    }, 0);

    // Display the total
    cartTotalEl.innerText = `${total.toFixed(2)}`;
  } else {
    // If cart is empty, show a message
    productListEl.innerHTML = '<li>Your cart is empty.</li>';
  }
}

function cartItemTemplate(item, cartItem) {
  const newItem = `<li class='cart-card divider'>
  <a href='../product_pages/?product=${item.Id}' class='cart-card__image'>
    <img
      src='${item.Image}'
      alt='${item.Name}'
    />
  </a>
  <a href='../product_pages/?product=${item.Id}'>
    <h2 class='card__name'>${item.Name}</h2>
  </a>
  <p class='cart-card__color'>${item.Colors[0].ColorName}</p>
  <p class='cart-card__quantity'>qty: ${cartItem.Quantity}</p>
  <p class='cart-card__price'>$${item.FinalPrice.toFixed(2)}</p>
</li>`;

  return newItem;
}

renderCartContents();
