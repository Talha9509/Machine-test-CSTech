
import { AddAgent } from '../controllers/agent.controller.js'
import { Router } from "express";
import { authMiddleware } from '../middleware/auth.middleware.js';

const router:Router = Router();

router.post("/", authMiddleware, AddAgent )

export default router;

