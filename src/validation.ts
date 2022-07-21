/* Type */
enum Rules {
  Required = "required",
  Positive = "positive",
}

interface FormSchemaValidator {
  [formName: string]: {
    [fieldName: string]: string[];
  };
}

/* Property decorator */
function Require(target: object, propertyName: string) {
  formValidators[target.constructor.name] = {
    ...formValidators[target.constructor.name],
    [propertyName]: [Rules.Required],
  };
}

function Positive(target: object, propertyName: string) {
  formValidators[target.constructor.name] = {
    ...formValidators[target.constructor.name],
    [propertyName]: [Rules.Positive],
  };
}

/* Class */
const formValidators: FormSchemaValidator = {};

class Product {
  @Require
  title: string;

  @Positive
  price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}

/* Utility */
function validate(target: any) {
  const validator = formValidators[target.constructor.name];

  Object.entries(validator).forEach(([propertyName, rules]) => {
    switch (rules[0]) {
      case Rules.Required:
        if (!(target[propertyName].trim().length > 0)) {
          throw new Error(`Field "${propertyName}" cannot be empty`);
        }
        break;

      case Rules.Positive:
        if (!(target[propertyName] > 0)) {
          throw new Error(`Field "${propertyName}" must be positive number`);
        }
        break;

      default:
        throw new Error(`Unrecognized validation rule ${rules[0]}`);
    }
  });
}

/* Body */
const domString = `
  <form>
    <input name="title" type="text" placeholder="Enter title..." />
    <input name="price" type="text" placeholder="Enter price..." />
    <button type="submit">Submit</button>
  </form>
`;

document.body.insertAdjacentHTML("afterbegin", domString);

const form = document.querySelector("form")! as HTMLFormElement;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const title = formData.get("title")! as string;
  const price = formData.get("price")! as string;

  const product = new Product(title, +price);

  try {
    validate(product);
    alert("All validation passed!");
  } catch (error: any) {
    alert(error.message);
  }
});
