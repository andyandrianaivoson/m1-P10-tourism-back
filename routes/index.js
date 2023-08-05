import { Router } from "express";
import authRoute from '../controllers/authController.js';
import categRoute from '../controllers/categorieController.js';

const routes = Router();

routes.use('/auth',authRoute);
routes.use('/category',categRoute);

export default routes;