import mongoose from "mongoose";

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

//add custom function to User model by using statics property of schema
//add type checking by specifying UserAttrs type
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
