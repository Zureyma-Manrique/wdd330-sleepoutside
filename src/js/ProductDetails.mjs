import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product.
    this.product = await this.dataSource.findProductById(this.productId);
    // once we have the product details, we can render out the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). Without it, 'this' will be the button, not the ProductDetails object
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    // get the existing cart or a new array
    let cart = getLocalStorage('so-cart') || [];

    // check to see if the item is already in the cart
    const existingItem = cart.find(item => item.Id === this.product.Id);

    if (existingItem) {
      // if it is, increment the quantity
      existingItem.Quantity++;
    } else {
      // if not, add the new product with a quantity of 1
      cart.push({ Id: this.product.Id, Quantity: 1 });
    }

    // save the updated cart
    setLocalStorage('so-cart', cart);

    // Add animation
    const button = document.getElementById('addToCart');
    button.classList.add('added');
    button.textContent = '✓ Added!';

    // Reset after animation
    setTimeout(() => {
      button.classList.remove('added');
      button.textContent = 'Add to Cart';
    }, 2000);
  }

  renderProductDetails() {
    const product = this.product;
    document.querySelector('title').innerHTML =
      `Sleep Outside | ${product.Name}`;

    const productDetailSection = document.querySelector('.product-detail');

    // Generate the HTML from the product data
    const productHTML = `
        <h3>${product.Brand.Name}</h3>
        <h2 class="divider">${product.NameWithoutBrand}</h2>
        <img
          class="divider"
          src="${product.Image}"
          alt="${product.Name}"
        />
        <p class="product-card__price">$${product.FinalPrice}</p>
        <p class="product__color">${product.Colors[0].ColorName}</p>
        <p class="product__description">
          ${product.DescriptionHtmlSimple}
        </p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>`;

    productDetailSection.innerHTML = productHTML;
  }
}
