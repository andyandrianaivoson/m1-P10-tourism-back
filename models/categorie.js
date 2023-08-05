import mongoose from "mongoose";

const CategorieSchema = mongoose.Schema({
    value: {
        type: String,
        required : true
    },
    desc: {
        type : String,
        default : null
    },
});

const CategorieModel = mongoose.model("Categorie", CategorieSchema);
export  {CategorieModel,CategorieSchema};
