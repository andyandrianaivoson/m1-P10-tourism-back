import { Router } from "express";
import auth from "../middleware/auth.js";
import { add, addLike } from '../services/commentService.js';
import responde from "../utils/generalResponse.js";

const router = Router();

router.post('/',auth,async(req,res)=>{
    try {
        const {
           comment,
           publicationId
        } = req.body;
        const {username} = req.user;
        const {images=[]} =req.body;
        const cmt = {
            username,
            publicationId,
            comment
        }
        const newcomment = await add(cmt,images);
        res.status(200).json(responde(newcomment));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({}, error.message));
    }
});

router.put('/like/:id',auth,async(req,res)=>{
    try {
        const comsId = req.params.id;
        const username = req.user.username;
        const newcomment = await addLike(comsId,username);
        res.status(200).json(responde(newcomment));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({}, error.message));
    }
});

export default router;