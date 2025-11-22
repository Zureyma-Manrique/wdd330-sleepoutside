function productCardTemplate(product) {
  // Update the href to point correctly to the product details page
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Image}"
        alt="Image of ${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    // We passed in this information to make our class as reusable as possible.
    // Being able to define these things when we use the class will make it very flexible
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // our dataSource will return a Promise...so we can use await to resolve it.
    const list = await this.dataSource.getData();

    // This check is crucial! It handles if the data comes back as a simple array 
    // or as an object with a 'Result' property (like the API does).
    const productList = list.Result || list;

    // render the list
    this.renderList(productList);
  }

  renderList(list) {
    // Map over the list of products and create an HTML string for each one
    const htmlStrings = list.map(productCardTemplate);
    // Join the strings together and insert them into the list element
    this.listElement.innerHTML = htmlStrings.join('');
  }
}
