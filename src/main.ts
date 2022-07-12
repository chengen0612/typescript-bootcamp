class Department {
  private employees: string[];

  constructor(readonly id: string, public name: string) {
    this.employees = [];
  }

  printDescription(this: Department) {
    console.log(`Department (${this.id}): ${this.name}`);
  }

  addEmployee(name: string) {
    this.employees.push(name);
  }

  printEmployeesList() {
    console.log(this.employees);
  }
}

class ITDepartment extends Department {
  constructor(id: string, name: string, private languages: string[]) {
    super(id, name);

    this.languages = languages;
  }

  printLanguages() {
    console.log(`Prefer languages list: ${this.languages}`);
  }
}

const it = new ITDepartment("d1", "IT", ["JavaScript, GoLang"]);

it.addEmployee("Amy");
it.addEmployee("Tim");

it.printDescription();
it.printEmployeesList();
it.printLanguages();
