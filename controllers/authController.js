import { Router } from "express";
import { register,login } from "../services/userService.js";
import responde from "../utils/generalResponse.js";

const router = Router();

router.post('/login', async(req,res)=>{
    const {username,pwd} = req.body;
    try {
        const token = await login(username,pwd);
        res.status(200).json(responde({token}));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({},error.message));
    }
});

router.post('/register',async(req,res)=>{
    const { email, username, nom, prenom,pwd,confPwd, imageName,imagePayload } = req.body;
    try {    
        if(pwd!==confPwd){
            return res.status(400).json(responde({},'password mismatch the confirmation password'));
        }

        const user = {
            email,
            username,
            nom,
            prenom,
            pwd
        }
        const imgObj = {
            imageName,
            base64payload : imagePayload
        }

        const token = await register(user,imgObj);
        console.log('user created');
        res.status(200).json(responde({token}));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responde({},error.message));
    }
});

export default router;