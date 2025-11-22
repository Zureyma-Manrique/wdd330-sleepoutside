const baseURL = import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend.onrender.com/';

async function convertToJson(res) {
  const jsonResponse = await res.json(); // Parse body first
  if (res.ok) {
    return jsonResponse;
  } else {
    // Individual Activity: Throw object with server error details
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }
  async getData() {
    const response = await fetch(this.path);
    const data = await convertToJson(response);
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
    return await fetch(baseURL + 'checkout', options).then(convertToJson);
  }
}
