import mongoose from "mongoose";
import { PublicationModel as Pub } from "../models/publication.js";
import { createAndResizeImage } from "../utils/img.js";
import keys from "../configs/keys.js";
import { updateFavoris } from "./userService.js";

const { itemsPerPage } = keys.dbQuery;

const getAll = async (page, searchQuery) => {
    try {

        const query = searchQuery.trim().length == 0 ? {} : {
            $or: [
                { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive title search
                { description: { $regex: searchQuery, $options: "i" } } // Case-insensitive description search
            ]
        };
        const options = {
            sort: { publicationDate: -1 }, // Sort by publicationDate in descending order
            skip: (page - 1) * itemsPerPage, // Calculate the number of items to skip
            limit: itemsPerPage // Limit the number of items per page
        };
        const pubs = await Pub.find(query, null, options);
        return pubs;
    } catch (error) {
        throw error;
    }
};

const getById = async (id) => {
    try {
        const pub = await Pub.findById(id);
        return pub;
    } catch (error) {
        throw error;
    }
};

const add = async (pub, images = []) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const imgUrls = [];
        //upload the images
        const promises = images.map(image => createAndResizeImage(image.imageName, image.base64payload));
        const results = await Promise.allSettled(promises);
        results.forEach(item => item.status === 'fulfilled' ? imgUrls.push(item.value) : console.log(`an error occured while processing image ; reson : ${item.reason}`));
        //create the publication
        const pubToInsert = new Pub(pub);
        pubToInsert.defaultPhotos = imgUrls;
        pubToInsert.gallery = imgUrls;
        const newPub = await pubToInsert.save({ session });
        await session.commitTransaction();
        return newPub;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const addNote = async (note, pubId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const exist = await Pub.findOne({
            _id : pubId,
            notes :{$elemMatch: {username : note.username}}
        });
        if(exist){
            throw new Error('You have already noted this publication');
        }
        const newPub = await Pub.findByIdAndUpdate(
            pubId,
            {
                $push: { notes: note },
                $inc: { nbNotes: 1, score: note.note },
                $set: { rate: { $divide: ["$score", "$nbNotes"] } }
            },
            { new: true, session } // Return the updated document
        );
        const user = await updateFavoris(newPub,session);
        await session.commitTransaction();
        return newPub;
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

        const newPub = await Pub.findOneAndUpdate(
            { _id: comment.publicationId },
            {
                $push: { comments: comment, gallery: { $each: comment.photos } },
                $inc: { nbComments: 1 }
            },
            { new: true, session } // Return the updated document
        );

        if (isSet) await session.commitTransaction();
        return newPub;
    } catch (error) {
        if (isSet) await session.abortTransaction();
        throw error;
    } finally {
        if (isSet) session.endSession();
    }
};

const addLike = async (comment,modif, session) => {
    let isSet = false;
    try {
        if (!session) {
            session = await mongoose.startSession();
            session.startTransaction();
            isSet = true;
        }

        const newPub = await Pub.findOneAndUpdate(
            { _id: comment.publicationId },
            {...modif},
            {
                new: true,
                session,
                arrayFilters: [{ 'elem._id': comment._id }]
            }
        );

        if (isSet) await session.commitTransaction();
        return newPub;
    } catch (error) {
        if (isSet) await session.abortTransaction();
        throw error;
    } finally {
        if (isSet) session.endSession();
    }
};

export { add, addCommment, addNote, getById, getAll, addLike };