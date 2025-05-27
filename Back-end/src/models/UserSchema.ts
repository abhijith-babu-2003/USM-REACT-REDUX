import mongoose, { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: number;
  password: string;
  profileImage?: string;
  role: "user" | "admin";
  isBlocked: boolean;
}


const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default :""
    },
    role: {
      type: String,
      enum: ["user", "admin"], 
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);