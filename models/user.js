import mongoose from "mongoose";
import '../constants/index.js';
import ROLES from "../constants/index.js";
import { PublicationSchema, CommentsSchema } from "./publication.js";

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, minLength: [1, 'userName empty'] },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
            },
            message: 'Invalid email format'
        }
    },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    pwd: { type: String, required: true },
    photo: { type: String, default: '' },
    role: {
        type: [String],
        enum: [ROLES.admin, ROLES.user],
        default: [ROLES.user]
    },
    favoris: { type: [PublicationSchema], default: [] },
    comments: { type: [CommentsSchema], default: [] }
});

const UserModel = mongoose.model('User', UserSchema);

export { UserSchema, UserModel }