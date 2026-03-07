// weatherRoutes.js
import express from "express";

import {getLocationSuggestions} from "../../controllers/AuraCastControllers/autocompleteController.js";

const locationRouter = express.Router();
locationRouter.get('/suggestions', getLocationSuggestions);
export default locationRouter;
