import { CommentsModel as Comment, PublicationModel as Pub } from "./models/publication.js";
import setupDB from "./utils/db.js";

setupDB();

const ajouterCommentaire = async ()=>{
    try {
        const coms = await Comment.findById('64cfbd4782a6cf2931ad2a62');
        console.dir('coms : ',coms);
        const newPub = await Pub.findOneAndUpdate(
            {_id : coms.publicationId},
            {
                $push: { comments: coms }
            },
            { new: true} // Return the updated document
        );
        console.dir('pub :',newPub);    
    } catch (error) {
        console.log(error);
    }
};

(async ()=>{
    setTimeout(ajouterCommentaire,6000);
})();