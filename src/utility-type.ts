interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

function createProduct(formData: Omit<Product, "id">): Product {
  let data: Partial<Product>;

  data = { ...formData };
  data.id = Math.floor(Math.random() * 10000).toString();

  return data as Product;
}

const mockFormData = {
  name: "AirPods 3rd generation",
  description: "Spatial audio with dynamic head tracking.",
  price: 179,
};

const product = createProduct(mockFormData);

console.log(product);
