class Fetch {
  static methods = ["get", "post", "put", "patch", "delete"];

  static create(uri: string) {
    return new Promise((resolve, reject) => {
      fetch(uri)
        .then((res) => res.json())
        .then(resolve)
        .catch(reject);
    });
  }

  printMethods() {
    console.log(Fetch.methods);
  }
}

const request = Fetch.create("https://mock");
console.log("methods: ", Fetch.methods);
console.log("request: ", request);

const f = new Fetch();
f.printMethods();
