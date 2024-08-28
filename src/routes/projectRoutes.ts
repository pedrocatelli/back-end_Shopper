import express from 'express';
import { uploadImage } from '../controllers/projectController';

const router = express.Router();

router.post('/upload', uploadImage);
router.patch('/confirm', uploadImage);
router.get('/<customer code>/list', uploadImage);

export default router;
