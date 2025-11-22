import { setLocalStorage, getLocalStorage, alertMessage } from './utils.mjs'; // Import alertMessage

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cart = getLocalStorage('so-cart') || [];
    const existingItem = cart.find(item => item.Id === this.product.Id);
    if (existingItem) {
      existingItem.Quantity++;
    } else {
      this.product.Quantity = 1; // Ensure quantity starts at 1
      cart.push(this.product);
    }
    setLocalStorage('so-cart', cart);

    // STRETCH GOAL: Alert user on success
    alertMessage(`${this.product.NameWithoutBrand} added to cart!`);
  }

  renderProductDetails() {
    const product = this.product;
    document.querySelector('title').innerHTML = `Sleep Outside | ${product.Name}`;
    const productDetailSection = document.querySelector('.product-detail');
    const productHTML = `
        <h3>${product.Brand.Name}</h3>
        <h2 class="divider">${product.NameWithoutBrand}</h2>
        <img class="divider" src="${product.Image}" alt="${product.Name}" />
        <p class="product-card__price">$${product.FinalPrice}</p>
        <p class="product__color">${product.Colors[0].ColorName}</p>
        <p class="product__description">${product.DescriptionHtmlSimple}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>`;
    productDetailSection.innerHTML = productHTML;
  }
}
