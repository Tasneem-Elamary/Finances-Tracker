import { Router } from 'express';
import { addCategory,getAllCategories } from '../controller/category.controller';
import { isAuth } from '../middleware/auth.middleware';
import { uploadImage } from '../middleware/imageUpload';

const router = Router();

router.post('/', isAuth,uploadImage, addCategory);
router.get('/', isAuth, getAllCategories);

export default router;