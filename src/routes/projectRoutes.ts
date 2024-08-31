import express from 'express';
import { confirmImage } from '../controllers/confirmController';
import { uploadImage } from '../controllers/projectController';

const router = express.Router();

router.post("/update", uploadImage);
router.patch("/confirm", confirmImage);

export default router;
