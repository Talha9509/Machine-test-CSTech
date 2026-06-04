import { DistributeList } from '../controllers/distributedList.controller.js'
import { Router } from "express";
import { authMiddleware } from '../middleware/auth.middleware.js';

const router:Router = Router();

router.get("/", authMiddleware, DistributeList )

export default router;


