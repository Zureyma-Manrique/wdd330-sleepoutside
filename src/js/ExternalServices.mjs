// Get the API URL from the .env file, or use the hardcoded one as a fallback
const baseURL = import.meta.env.VITE_SERVER_URL || 'http://wdd330-backend.onrender.com/';

async function convertToJson(res) {
  const jsonResponse = await res.json(); // Parse the JSON body first
  if (res.ok) {
    return jsonResponse;
  } else {
    // Throw a custom error object with the server's error details
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    // Use the absolute path to the JSON file in the public folder
    this.path = `/json/${this.category}.json`;
  }

  async getData() {
    const response = await fetch(this.path);
    const data = await convertToJson(response);
    // Check if the data is wrapped in a 'Result' property (API) or plain array (Local)
    return data.Result || data;
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }

  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    // Send the order to the backend API
    return await fetch(baseURL + 'checkout', options).then(convertToJson);
  }
}
