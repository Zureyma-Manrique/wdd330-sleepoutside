import { getParam, loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

loadHeaderFooter();
// get the product id from the URL
const productId = getParam('product');
// create a new ExternalServices object with the 'tents' category
const dataSource = new ExternalServices('tents');
// create a new ProductDetails object
const product = new ProductDetails(productId, dataSource);

// initialize the product details page
product.init();
