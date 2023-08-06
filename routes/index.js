import { Router } from "express";
import authRoute from '../controllers/authController.js';
import categRoute from '../controllers/categorieController.js';
import pubRoute from '../controllers/publicationController.js';
import comsRouter from '../controllers/commentController.js';
import userRouter from '../controllers/userController.js';

const routes = Router();

routes.use('/auth',authRoute);
routes.use('/category',categRoute);
routes.use('/publication',pubRoute);
routes.use('/comment',comsRouter);
routes.use('/user',userRouter);

export default routes;