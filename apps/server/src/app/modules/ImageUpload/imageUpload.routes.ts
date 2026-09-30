import express from 'express';
import { ImageUploadController } from './imageUpload.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();


router.post(
    '/',
    multerUpload.single('photo'),
    ImageUploadController.uploadImage
)

export const ImageUploadRoutes = router;