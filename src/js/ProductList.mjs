// Function to create the product card template
function productCardTemplate(product) {
  return `<li class='product-card'>
    <a href='product_pages/?product=${product.Id}'>
      <img
        src='${product.Image}'
        alt='Image of ${product.Name}'
      />
      <h3 class='card__brand'>${product.Brand.Name}</h3>
      <h2 class='card__name'>${product.NameWithoutBrand}</h2>
      <p class='product-card__price'>$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    // Save properties for later use
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // The dataSource will return a Promise, so we can use await
    const list = await this.dataSource.getData();
    // Render the list of products
    this.renderList(list);
  }

  renderList(list) {
    // Map over the list of products and create an HTML string for each one
    const htmlStrings = list.map(productCardTemplate);
    // Join the strings together and insert them into the list element
    this.listElement.innerHTML = htmlStrings.join('');
  }
}
