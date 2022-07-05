let userName: string;
let any: any;
let unknown: unknown;

userName = any;
// userName = unknown;

if (typeof unknown === "string") {
  userName = unknown;
}
