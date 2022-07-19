class DataStorage<T extends string | number> {
  private data: T[] = [];

  addItem(newItem: T) {
    this.data.push(newItem);
  }

  removeItem(searchItem: T) {
    const index = this.data.indexOf(searchItem);

    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  getItems() {
    return [...this.data];
  }
}

const artists = new DataStorage<string>();

artists.addItem("Joe Pass");
artists.addItem("John Coltrane");
artists.addItem("Bill Evans");
artists.removeItem("John Coltrane");

console.log(artists.getItems());
