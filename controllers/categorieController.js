import { Router } from "express";
import auth from "../middleware/auth.js";
import responde from "../utils/generalResponse.js";
import { add, getAll } from "../services/categorieService.js";
import check from "../middleware/role.js";
import ROLES from "../constants/index.js";

const router = Router();

router.get('/',auth,async (req,res)=>{
    try {
        const categories = await getAll();
        res.status(200).json(responde(categories));
    } catch (error) {
        return res.status(400).json(responde({},error.message));
    }
});

router.post('/',auth,check(ROLES.admin),async (req,res)=>{
    try {
        const {value , desc} = req.body;
        const categ = {
            value,
            desc
        }
        const newCateg = await add(categ);
        res.status(200).json(responde(newCateg));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({},error.message));
    }
});

export default router;