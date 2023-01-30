import { body } from "express-validator";

export const loginValidation = [
  body("email", "Invalid email").isEmail(),
  body("password", "Invalid password").isLength({ min: 1 }),
];

export const signUpValidation = [
  body("email", "Invalid email").isEmail(),
  body("password", "Invalid password").isLength({ min: 1 }),
  body("fullName", "Name must contain more than 3 characters").isLength({ min: 3 }),
];
