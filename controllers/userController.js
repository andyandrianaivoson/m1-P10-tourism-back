import { Router } from "express";
import auth from "../middleware/auth.js";
import { addToFav, get, getById } from "../services/userService.js";
import responde from "../utils/generalResponse.js";

const router = Router();

router.get('/',auth,async(req,res)=>{
    try {
        const user = await getById(req.user._id);
        res.status(200).json(responde(user));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({}, error.message));
    }
});

router.get('/:username',auth,async (req,res)=>{
    try {
        const username = req.params.username;
        const user = await get(username);
        res.status(200).json(responde(user));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({}, error.message));
    }
});

router.put('/favoris/:idPub',auth,async(req,res)=>{
    try {
        const idPub = req.params.idPub;
        const userId = req.user._id;
        const user = await addToFav(userId,idPub);
        res.status(200).json(responde(user));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({}, error.message));
    }
});

export default router;