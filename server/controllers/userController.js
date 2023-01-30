import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import userModel from "../models/user-model.js";

export const signUp = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const doc = new userModel({
      email: req.body.email,
      fullName: req.body.fullName,
      password: passwordHash,
    });
    const user = await doc.save();
    const { password: hash, ...userData } = user._doc;
    res.json({ ...userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error. User is already exist",
    });
  }
};

export const logIn = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.password
    );
    if (!isValidPass) {
      return res.status(400).json({
        message: "Wrong password or email",
      });
    }
    const token = jwt.sign({ _id: user._id }, "whaaat", { expiresIn: "1d" });
    const { password: hash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error. Login failed",
    });
  }
};

export const getUserAuth = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Please logIn",
      });
    }
    const { password: hash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error. Server is not valuable",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    const userList = users.map((elem) => {
      const { password: hash, ...userData } = elem._doc;
      console.log(userData);
      return userData;
    });
    res.json(userList);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error. Server is not valuable",
    });
  }
};

export const removeUser = async (req, res) => {
  try {
    const userId = req.params.id;
    userModel.findOneAndDelete(
      {
        _id: userId,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Server Error",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "User not found",
          });
        }
        res.json({
          message: "User was deleted",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};

export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findOneAndUpdate(
      {
        _id: userId,
        status: true,
      },
      {
        status: false,
      },
      {
        new: true,
      }
    );
    console.log(user.status);
    res.json({
      message: "User was blocked",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to block user",
    });
  }
};
