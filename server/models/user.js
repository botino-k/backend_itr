import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    // lastLogin: { type: Date, default: Date.now },
    status: { type: Boolean, default: true},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
