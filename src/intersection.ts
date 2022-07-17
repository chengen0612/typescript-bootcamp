/* Example 1 */
interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "Evans",
  privileges: ["code review", "structural design"],
  startDate: new Date(),
};

console.log(e1);

/* Example 2 */
type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;
