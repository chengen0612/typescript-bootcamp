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

const accounting = new Department("d1", "Accounting");

accounting.addEmployee("Amy");
accounting.addEmployee("Tim");

accounting.printDescription();
accounting.printEmployeesList();
