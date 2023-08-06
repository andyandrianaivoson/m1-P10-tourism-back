import mongoose from "mongoose";
import { CategorieModel as Category } from "../models/categorie.js";

const getAll = async()=>{
    const categories = await Category.find({});
    return categories;
};

const add = async(categorie)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const categ = new Category(categorie);
        const newCateg = await categ.save({session});
        await session.commitTransaction();
        return newCateg;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }finally{
        session.endSession()
    }
};

export {add,getAll};

