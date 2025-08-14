import { Router } from 'express';
// import statusRoute from './status.route';
import transactionsRoute from "./transactions.route.js";
import authRoute from "./auth.route.js";

const router  = Router();
const baseRoute = '/api/v1';

// router.use(`${baseRoute}/status`, statusRoute);
router.use(`${baseRoute}/auth`, authRoute);
router.use(`${baseRoute}/transactions`, transactionsRoute);

export default router;