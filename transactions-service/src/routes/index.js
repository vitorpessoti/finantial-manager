import { Router } from 'express';
// import statusRoute from './status.route';
import transactionsRoute from "./transactions.route.js";

const router  = Router();
const baseRoute = '/api/v1';

// router.use(`${baseRoute}/status`, statusRoute);
router.use(`${baseRoute}/transactions`, transactionsRoute);

export default router;