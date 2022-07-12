class Catalog {
  constructor(protected products: string[]) {}
}

class FashionCatalog extends Catalog {
  private inSeasons: string[];
  private offSeasons: string[];

  constructor(products: string[]) {
    super(products);
    this.inSeasons = [...products];
    this.offSeasons = [];
  }

  addNewProduct(product: string) {
    this.products.push(product);
    this.inSeasons.push(product);
  }
}

const c = new FashionCatalog(["p1", "p2", "p3"]);

c.addNewProduct("p4");

console.log(c);
