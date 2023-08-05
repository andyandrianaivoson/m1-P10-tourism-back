import { Router } from "express";
import authRoute from '../controllers/authController.js';

const routes = Router();

routes.use('/auth',authRoute);

export default routes;