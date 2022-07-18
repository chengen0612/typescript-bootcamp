interface ValidationMessages {
  [key: string]: string;
}

const registerErrors: ValidationMessages = {
  email: "Invalid email format.",
  password: "Password must be at least 8 characters.",
};
