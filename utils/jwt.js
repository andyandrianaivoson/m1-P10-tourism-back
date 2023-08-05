import jwt from 'jsonwebtoken';
import '../configs/keys.js';
import keys from '../configs/keys.js';

const {jwt:jwtConf} = keys; 

const generateToken = (payload={})=>{
    return jwt.sign(payload, jwtConf.secret, { expiresIn: jwtConf.tokenLife });
};

const verifyToken = (token) =>{
    return jwt.verify(token,jwtConf.secret);
}

export {generateToken,verifyToken};