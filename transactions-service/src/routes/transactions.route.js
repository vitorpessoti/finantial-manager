import express from "express";
import httpStatus from "http-status";
import TeamGenerationsService from "../services/team-generations.service.js";
import TeamGenerationsValidator from "../validators/team-generations.validator.js";
import validate from "../middlewares/validate.middleware.js"; // Import validation middleware

const router = express.Router();

router.post(
    "/build",
    ...TeamGenerationsValidator.defaultValidation(),
    validate,
    async (req, res, next) => {
        try {
            //TODO: fix excel data parsing number fields to int
            const result = await new TeamGenerationsService().buildGenerations(req.body);
            res.status(httpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
);

export default router;