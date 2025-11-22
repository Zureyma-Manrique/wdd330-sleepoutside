import { getLocalStorage, setLocalStorage, qs, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';

loadHeaderFooter();

// Get the product data source
const dataSource = new ProductData('tents');

/**
 * Renders the cart contents on the page.
 */
async function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const productListEl = qs('.product-list');
  const cartFooterEl = qs('.cart-footer');
  const cartTotalEl = qs('.cart-total-value');

  // Check if the cart is empty
  if (cartItems.length === 0) {
    // Cart is empty: show message and hide footer
    productListEl.innerHTML = '<li><p>Your cart is empty.</p></li>';
    cartTotalEl.textContent = '0.00';
    cartFooterEl.style.display = 'none';
    return;
  }

  // Cart has items: fetch full product details
  try {
    const products = await Promise.all(
      cartItems.map(item => dataSource.findProductById(item.Id))
    );

    // Generate HTML for each cart item
    const htmlItems = products.map((product, index) =>
      cartItemTemplate(product, cartItems[index])
    );
    productListEl.innerHTML = htmlItems.join('');

    // Calculate the total cart value (price × quantity for each item)
    const total = products.reduce((acc, product, index) => {
      return acc + (product.FinalPrice * cartItems[index].Quantity);
    }, 0);

    // Display the total
    cartTotalEl.textContent = total.toFixed(2);

    // Show the cart footer
    cartFooterEl.style.display = 'block';
  } catch (error) {
    console.error('Error loading cart items:', error);
    productListEl.innerHTML = '<li><p>Error loading cart. Please try again.</p></li>';
    cartFooterEl.style.display = 'none';
  }
}

/**
 * Creates the HTML template for a single cart item.
 * @param {object} product - The full product object
 * @param {object} cartItem - The cart item with Id and Quantity
 * @returns {string} The HTML string for the item
 */
function cartItemTemplate(product, cartItem) {
  const itemTotal = (product.FinalPrice * cartItem.Quantity).toFixed(2);

  const newItem = `<li class='cart-card divider'>
  <a href='../product_pages/?product=${product.Id}' class='cart-card__image'>
    <img
      src='${product.Image}'
      alt='${product.Name}'
    />
  </a>
  <a href='../product_pages/?product=${product.Id}'>
    <h2 class='card__name'>${product.Name}</h2>
  </a>
  <p class='cart-card__color'>${product.Colors[0].ColorName}</p>
  <p class='cart-card__quantity'>qty: ${cartItem.Quantity}</p>
  <p class='cart-card__price'>$${itemTotal}</p>
  <span class='cart-card__remove' data-id='${product.Id}'>X</span>
</li>`;

  return newItem;
}

/**
 * Handles the click event to remove an item from the cart.
 * @param {Event} e - The click event
 */
function removeItemFromCart(e) {
  const target = e.target;

  // Check if the clicked element is the remove button
  if (target.classList.contains('cart-card__remove')) {
    const productId = target.dataset.id;
    let cartItems = getLocalStorage('so-cart') || [];

    // Find the index of the item with this ID
    // Convert both to strings to ensure proper comparison
    const itemIndex = cartItems.findIndex(item => item.Id.toString() === productId);

    if (itemIndex > -1) {
      // Remove the item from the array
      cartItems.splice(itemIndex, 1);

      // Save the updated cart back to local storage
      setLocalStorage('so-cart', cartItems);

      // Rerender the cart to show changes and update the total
      renderCartContents();
    }
  }
}

// Run the render function when the page loads
renderCartContents();

// Add event listener to the list for removing items
qs('.product-list').addEventListener('click', removeItemFromCart);
