import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import userModel from "../models/user.js";

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

    // const token = jwt.sign(
    //   {
    //     _id: user._id,
    //   },
    //   "whaaat",
    //   {
    //     expiresIn: "1d",
    //   }
    // );

    const { password: hash, ...userData } = user._doc;

    res.json({
      ...userData,
      // token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error. User is already exist",
    });
  }
};

export const login = async (req, res) => {
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

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "waaaat",
      {
        expiresIn: "1d",
      }
    );

    const { password: hash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error. Login failed",
    });
  }
};
