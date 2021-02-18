import mongoose from "mongoose";
import { Password } from "../utils/password";

/* An interface that describes the properties
that are required to create a new User */
interface UserAttrs {
  email: string;
  password: string;
}

/* An interface that describes the properties
that a User Model has */
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

/* An interface that describes the properties
that a User Dcoument has */
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//this will always run before saving a Document or db
//**don't use arrow function for callback, otherwise value of 'this' will be
//overidden to be context of this file instead of our User Document...
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    //get the users password from the Document and hash it
    const hashed = await Password.toHash(this.get("password"));

    //update the Document password to the hashed one
    this.set("password", hashed);
  }
  //for mongoose have to manually call done after all async work is done
  done();
});

//add custom function to User model by using statics property of schema
//add type checking by specifying UserAttrs type
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
