import { UserModel as User } from "../models/user.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/jwt.js";
import { createAndResizeImage } from "../utils/img.js";
import mongoose from "mongoose";
import { PublicationModel as Pub } from "../models/publication.js";

const getToken = (user) => {
    const { _id: id, username, email, nom, prenom } = user;
    return generateToken({
        id, username, email, nom, prenom
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
        const registeredUser = await newUser.save({ session });
        const token = getToken(registeredUser);
        await session.commitTransaction();
        return token;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const addCommment = async (comment, session) => {
    let isSet = false;
    try {
        if (!session) {
            session = await mongoose.startSession();
            session.startTransaction();
            isSet = true;
        }
        const newUser = await User.findOneAndUpdate(
            { username: comment.username },
            {
                $push: { comments: comment }
            },
            { new: true, session }
        );
        if (isSet) await session.commitTransaction();
        return newUser;
    } catch (error) {
        if (isSet) await session.abortTransaction();
        throw error;
    } finally {
        if (isSet) session.endSession();
    }
}

const updateFavoris = async (publication, session) => {
    let isSet = false;
    try {
        if (!session) {
            session = await mongoose.startSession();
            session.startTransaction();
            isSet = true;
        }

        await User.updateMany(
            {
                favoris: { $elemMatch: { _id: publication._id } }
            },
            {
                $set: { 'favoris.$[pub]': publication }
            },
            {
                new: true,
                session,
                arrayFilters: [{ 'pub._id': publication._id }]
            }
        );

        if (isSet) await session.commitTransaction();
    } catch (error) {
        if (isSet) await session.abortTransaction();
        throw error;
    } finally {
        if (isSet) session.endSession();
    }
};

const addToFav = async (userId, publicationId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if(!publicationId) throw new Error('Publication undefined');
        const pub = await Pub.findById(publicationId);
        if (!pub) {
            throw new Error('Publication not found');
        }
        const exist = await User.findOne({
            _id: userId,
            favoris: { $elemMatch: { _id: publicationId } }
        });

        if(exist){
            throw new Error('Publication already in favorite');
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $push: { favoris: pub }
            },
            {
                new: true,
                session,
            }
        );

        await session.commitTransaction();
        return user;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const get = async (username) => {
    try {

        const user = await User.findOne({ username }, '-pwd -role -favoris');
        if (!user) {
            throw new Error(`No user as : ${username}`);
        }
        return user;
    } catch (err) {
        throw err;
    }
};

const getById =async (id)=>{
    try {
        const user = await User.findById(id, '-pwd');
        if (!user) {
            throw new Error(`No user as : ${id}`);
        }
        return user;
    } catch (err) {
        throw err;
    }
}

const addLike = async(comment,modif,session) =>{
    let isSet = false;
    try {
        if (!session) {
            session = await mongoose.startSession();
            session.startTransaction();
            isSet = true;
        }
        const newUser = await User.findOneAndUpdate(
            { username: comment.username },
            {
                ...modif
            },
            { 
                new: true, 
                session,
                arrayFilters: [{ 'elem._id': comment._id }]
            }
        );
        if (isSet) await session.commitTransaction();
        return newUser;
    } catch (error) {
        if (isSet) await session.abortTransaction();
        throw error;
    } finally {
        if (isSet) session.endSession();
    }
}

export { login, register, addCommment, updateFavoris, addToFav, get,getById,addLike };

