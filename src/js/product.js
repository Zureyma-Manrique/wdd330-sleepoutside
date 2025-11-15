import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

// get the product id from the URL
const productId = getParam('product');
// create a new ProductData object with the 'tents' category
const dataSource = new ProductData('tents');
// create a new ProductDetails object
const product = new ProductDetails(productId, dataSource);

// initialize the product details page
product.init();
