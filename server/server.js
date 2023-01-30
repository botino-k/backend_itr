import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import {
  signUpValidation,
  loginValidation,
} from "./validation/userValidation.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { userController } from "./controllers/index.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/auth/me", checkAuth, userController.getUserAuth);
app.get("/auth/users", checkAuth, userController.getAllUsers);
app.delete("/auth/:id", checkAuth, userController.removeUser);
app.patch("/auth/:id", checkAuth, userController.blockUser);
app.post(
  "/auth/signup",
  signUpValidation,
  handleValidationErrors,
  userController.signUp
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  userController.logIn
);

mongoose.set("strictQuery", false);
mongoose
  .connect(
    process.env.ATLAS_URI ||
      "mongodb+srv://root:Dbx6BWaWP1YyGvb1@cluster0.5rz5za8.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DataBase connection"))
  .catch((err) => console.log("DataBase error", err));

app.listen(4444, (error) => {
  if (error) {
    return console.log("error:", error);
  }
  console.log("server connection", 4444);
});
