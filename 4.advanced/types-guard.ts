interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

type ElevatedEmployee = Admin & Employee;
type UnknownEmployee = Admin | Employee;

const e1: ElevatedEmployee = {
  name: "Evans",
  privileges: ["code review", "structural design"],
  startDate: new Date(),
};

const e2: UnknownEmployee = {
  name: "Tracy",
  privileges: ["unit test"],
};

const printEmployeeInformation = (employee: UnknownEmployee) => {
  if ("startDate" in employee) {
    console.log(
      `${employee.name} started working on ${employee.startDate.toUTCString()}.`
    );
  }

  if ("privileges" in employee) {
    console.log(`${employee.name} takes charge with ${employee.privileges}.`);
  }
};

printEmployeeInformation(e1);
printEmployeeInformation(e2);
