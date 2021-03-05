import bcrypt from "bcrypt";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

//convert scrypt from callback based implementation to promise based implementation
const scryptAsync = promisify(scrypt);

export class PasswordOld {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");

    //ts doesn't know what buffer is (doesn't know what happened during promisify process)
    //so just tell it to treat it as Buffer
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

    //a buffer is like an array with raw data inside of it
    return `${buffer.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    //get stored hashed password in db
    const [hashedPassword, salt] = storedPassword.split(".");

    //hash the supplied password
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    //compare the two
    return buffer.toString("hex") === hashedPassword;
  }
}

export class Password {
  static async toHash(password: string) {
    return bcrypt.hash(password, 8);
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    return bcrypt.compare(suppliedPassword, storedPassword);
  }
}
