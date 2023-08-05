import { UserModel as User } from "../models/user.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/jwt.js";
import { createAndResizeImage } from "../utils/img.js";
import mongoose from "mongoose";

const getToken = (user) => {
    const { _id: id, username, email, nom, prenom, role } = user;
    return generateToken({
        id, username, email, nom, prenom, role
    });
};

const login = async (username, pwd) => {
    try {
        if (!username || !pwd) {
            throw new Error('login invalide');
        }

        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('login invalide');
        }

        const isMatch = await bcrypt.compare(pwd, user.pwd);
        if (!isMatch) {
            throw new Error('login invalide');
        }

        return getToken(user);
    } catch (err) {
        throw err;
    }
};

const register = async (user, imgObj) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { username, email } = user;
        const defaultUser = await User.find({ $or: [{ username }, { email }] });
        if (defaultUser && defaultUser.length > 0) {
            throw new Error('username or email already exists');
        }
        const imageUrl = await createAndResizeImage(imgObj.imageName, imgObj.base64payload);
        user.photo = imageUrl;
        const newUser = new User({
            ...user
        });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.pwd, salt);

        newUser.pwd = hash;
        const registeredUser = await newUser.save({session});
        const token =getToken(registeredUser);
        await session.commitTransaction();
        return token;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export { login, register };

