import express from "express";
import dotenv from 'dotenv';
import compression from 'compression';
import setupDB from "./utils/db.js";
import routes from "./routes/index.js";
import keys from "./configs/keys.js";
import cors from 'cors';

const staticDir = keys.paths.static;
console.log(staticDir);
const { port, apiUrl } = keys.app;

dotenv.config();

const app = express();

const api =`/${apiUrl}`;

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb' }));
app.use(cors());

setupDB();
app.use(api, routes),
app.use(express.static(staticDir));
app.use(api, (req, res) => res.status(404).json('No API route found'));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});