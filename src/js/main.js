import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { qs, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

// Get the element to insert the product cards into
const productListElement = qs('.product-list');

// Create an instance of ProductData for 'tents'
const dataSource = new ProductData('tents');

// Create an instance of ProductList
// Pass in the category, the data source, and the target element
const productList = new ProductList('tents', dataSource, productListElement);

// Initialize the product list
productList.init();
