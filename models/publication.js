import mongoose from "mongoose";
import {CategorieSchema} from "./categorie.js";

const CommentsSchema = mongoose.Schema({
    username :{type: String, required : true},
    comment :{type : String , trim : true,default : ':)'},
    commentDate : {type : Date , default : Date.now},
    likes :{ type :[String], default : []},
    nbLikes : {type : Number,default : 0},
    photos :[String]
});

const CommentsModel = mongoose.model('Comment',CommentsSchema);

const PublicationSchema = mongoose.Schema({
    title : {type : String,required : true,minLength :1},
    description : {type : String,required : true},
    city : {type : String,required : true},
    publicationDate : {type : Date,default : Date.now},
    coordonates :{
        latitue : Number,
        longitued : Number
    },
    defaultPhotos :{ type : [String] , default : []},
    categories : {type :[CategorieSchema],default :[]},
    contact : {
        phones :[{
            value : String,
            desc : String
        }],
        mails : [{
            value : String,
            desc : String
        }],
        links :[{
            value : String,
            desc : String
        }]
    },
    notes :[{
        username :{ type : String, required : true},
        note:{ type : Number, required : true}    
    }],
    nbNotes :{ type : Number, default:0},
    score :{ type : Number, default:0},
    rate :{ type : Number, default:0.0},
    comments :{type : [CommentsSchema],default : []},
    nbComments : {type : Number, default : 0},
    gallery : {type : [String],default : []}
});

const PublicationModel = mongoose.model('Publication',PublicationSchema);

export {PublicationModel,CommentsSchema,PublicationSchema,CommentsModel};