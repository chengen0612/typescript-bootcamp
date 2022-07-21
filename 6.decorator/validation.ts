/* Type */
enum Rules {
  Required = "required",
  Positive = "positive",
}

interface FormSchemaValidator {
  [formName: string]: {
    [fieldName: string]: Rules[];
  };
}

/* Property decorator */
function Require(target: object, propertyName: string) {
  formValidators[target.constructor.name] = {
    ...formValidators[target.constructor.name],
    [propertyName]: [
      ...(formValidators[target.constructor.name]?.[propertyName] ?? []),
      Rules.Required,
    ],
  };
}

function Positive(target: object, propertyName: string) {
  formValidators[target.constructor.name] = {
    ...formValidators[target.constructor.name],
    [propertyName]: [
      ...(formValidators[target.constructor.name]?.[propertyName] ?? []),
      Rules.Positive,
    ],
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
    rules.forEach((rule) => {
      const inputValue = target[propertyName];

      switch (rule) {
        case Rules.Required:
          if (!(inputValue.trim().length > 0)) {
            throw new Error(`Field "${propertyName}" cannot be empty`);
          }
          break;

        case Rules.Positive:
          if (!(inputValue > 0)) {
            throw new Error(`Field "${propertyName}" must be positive number`);
          }
          break;

        default:
          throw new Error(`Unrecognized validation rule ${rule}`);
      }
    });
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
