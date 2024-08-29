import express from 'express';
import { uploadImage } from '../controllers/projectController';

const router = express.Router();

router.post("/update", uploadImage);

export default router;
