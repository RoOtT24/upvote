import {Router} from 'express';
import * as postController from './Controller/Post.controller.js';
import * as commentController from './Controller/Comment.controller.js';
import { auth } from '../../Middleware/auth.middleware.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
// import validation from '../../Middleware/validation.js'
// import * as validators from './Post.validation.js';;
const router =Router();

router.get('/', postController.getPosts);
router.post('/', auth,fileUpload(fileValidation.image).single('image'), postController.createPost);
router.patch('/:id/like', auth, postController.likePost);
router.patch('/:id/disLike', auth, postController.unLikePost);

////////////////

router.post('/:id/comment', auth, fileUpload(fileValidation.image).single('image'), commentController.createComment);

export default router;