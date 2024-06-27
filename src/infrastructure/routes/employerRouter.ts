import express from 'express';
import { employerController } from '../../providers/controllers';
import upload from '../../middlewares/multer';
import employerAuth from '../../middlewares/employerAuth';
import { Request, Response } from 'express-serve-static-core';

const router = express.Router();
const profileImageUpload = upload.single('profile-img');

// Route handlers
const handleFetchEmployerData = (req: Request, res: Response) => employerController.fetchEmployerData(req, res);
const handleUpdateProfile = (req: Request, res: Response) => employerController.updateProfile(req, res);

// Routes
router.route('/').get(employerAuth, handleFetchEmployerData);
router.route('/update-profile').put(employerAuth, profileImageUpload, handleUpdateProfile);

export default router;
