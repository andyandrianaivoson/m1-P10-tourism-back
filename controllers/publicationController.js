import { Router } from "express";
import auth from "../middleware/auth.js";
import { add, addNote, getAll, getById } from "../services/publicationService.js";
import responde from "../utils/generalResponse.js";
import check from "../middleware/role.js";
import ROLES from "../constants/index.js";

const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, search = '' } = req.query;
        const pubs = await getAll(page, search);
        res.status(200).json(responde(pubs));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({}, error.message));
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const pubs = await getById(req.params.id);
        res.status(200).json(responde(pubs));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({}, error.message));
    }
});

router.post('/', auth, check(ROLES.admin), async (req, res) => {
    try {
        const {
            title,
            description,
            city,
            coordonates,
            categories,
            contact
        } = req.body;
        const pub = {
            title,
            description,
            city,
            coordonates,
            categories,
            contact
        }
        const {images=[]} =req.body;
        const newPub = await add(pub,images);
        res.status(200).json(responde(newPub));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({}, error.message));
    }
});

router.put('/note/:id',auth,async(req,res)=>{
    try {
        const {
            username,
            note
        } = req.body;
        const id =req.params.id;
        const newPub = addNote({username,note},id);
        res.status(200).json(responde(newPub));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({}, error.message));
    }
});

export default router;