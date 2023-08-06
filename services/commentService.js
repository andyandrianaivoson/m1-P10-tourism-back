import mongoose from "mongoose";
import { CommentsModel as Comment } from "../models/publication.js";
import { addCommment as addCommmentToUser, updateFavoris,addLike as addLikeOnUser } from "./userService.js";
import { addCommment as addCommentToPub, addLike as addLikeOnPub } from "./publicationService.js";
import { createAndResizeImage } from "../utils/img.js";

const add = async (comment, images) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const imgUrls = [];
        //upload the images
        const promises = images.map(image => createAndResizeImage(image.imageName, image.base64payload));
        const results = await Promise.allSettled(promises);
        results.forEach(item => item.status === 'fulfilled' ? imgUrls.push(item.value) : console.log(`an error occured while processing image ; reson : ${item.reason}`));
        comment.photos = imgUrls;
        //create a new Comment
        const cmt = new Comment(comment);
        const newComment = await cmt.save({ session });
        //add the comment to the user
        const user = await addCommmentToUser(newComment, session);
        const pub = await addCommentToPub(newComment, session);
        //await updateFavoris(pub,session);

        await session.commitTransaction();
        return pub;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

const addLike = async (commentId, username) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let modif = {
            comment: {
                $push: { likes: username },
                $inc: { nbLikes: 1 }
            },
            publication: {
                $push: { 'comments.$[elem].likes': username },
                $inc: { 'comments.$[elem].nbLikes': 1 }
            },
            user: {
                $push: { 'comments.$[elem].likes': username },
                $inc: { 'comments.$[elem].nbLikes': 0 }
            }
        }
        const exist = await Comment.findOne({
            _id: commentId,
            likes: username
        });

        if (exist) {
            modif = {
                comment: {
                    $pull: { likes: username },
                    $inc: { nbLikes: -1 }
                },
                publication: {
                    $pull: { 'comments.$[elem].likes': username },
                    $inc: { 'comments.$[elem].nbLikes': -1 }
                },
                user: {
                    $pull: { 'comments.$[elem].likes': username },
                    $inc: { 'comments.$[elem].nbLikes': -1 }
                }
            }
        }
        const newComment = await Comment.findByIdAndUpdate(
            commentId,
            { ...modif.comment },
            {
                new: true,
                session
            }
        );
        const pub = await addLikeOnPub(newComment, modif.publication, session);
        const user = await addLikeOnUser(newComment,modif.user,session);
        await updateFavoris(pub, session);
        await session.commitTransaction();
        return newComment;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export { addLike, add };