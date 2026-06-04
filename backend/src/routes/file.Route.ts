import { uploadFile } from '../controllers/file.controller.js'
import { Router } from "express";
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router:Router = Router();

router.post("/", authMiddleware, upload.single('file'), uploadFile )

export default router;