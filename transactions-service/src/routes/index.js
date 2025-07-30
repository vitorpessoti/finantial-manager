import { Router } from 'express';
import statusRoute from './status.route.js';
import teamGenerationsRoute from "./team-generations.route.js";
import playersRoute from "./players.route.js";

const router  = Router();
const baseRoute = '/api/v1';

router.use(`${baseRoute}/status`, statusRoute);
router.use(`${baseRoute}/team-generations`, teamGenerationsRoute);
router.use(`${baseRoute}/players`, playersRoute);

export default router;