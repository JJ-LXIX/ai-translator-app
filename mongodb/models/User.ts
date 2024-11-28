import mongoose, { Document, Schema } from "mongoose";
import connectDB from "../db";
import { timeStamp } from "console";

export interface ITranslation extends Document {
  timestamp: Date;
  fromText: string;
  from: string;
  toText: string;
  to: string;
}

interface IUser extends Document {
  userId: string;
  translations: Array<ITranslation>;
}

const translationSchema = new Schema<ITranslation>({
  timestamp: { type: Date, default: Date.now },
  fromText: String,
  from: String,
  toText: String,
  to: String,
});

const userSchema = new Schema<IUser>({
  userId: String,
  translations: [translationSchema],
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export async function addOrUpdateUser(
  userId: string,
  translation: {
    fromText: string;
    from: string;
    toText: string;
    to: string;
  }
): Promise<IUser> {
  const filter = { userId: userId };
  const update = {
    $set: { userId: userId },
    $push: { translations: translation },
  };

  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  await connectDB();

  try {
    const user: IUser | null = await User.findOneAndUpdate(
      filter,
      update,
      options
    );

    console.log("User added or updated: ", user);

    if (!user) {
      throw new Error("User not found and was not created");
    }
    return user;
  } catch (error) {
    console.error("error adding or updating user:", error);
    throw error;
  }
}
