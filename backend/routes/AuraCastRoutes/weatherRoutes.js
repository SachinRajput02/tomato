// weatherRoutes.js
import express from "express";
import {analyzeWeather} from "../../controllers/AuraCastControllers/weatherController.js";


const weatherRouter = express.Router();
weatherRouter.post('/analyze', analyzeWeather);
export default weatherRouter;
