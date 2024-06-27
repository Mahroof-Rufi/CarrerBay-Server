import express from 'express';
import { jobsController } from '../../providers/controllers';
import employerAuth from '../../middlewares/employerAuth';
import userAuth from '../../middlewares/userAuth';
import adminAuth from '../../middlewares/adminAuth';
import { Request, Response } from 'express-serve-static-core';

const router = express.Router();

// Admin Jobs handlers
const handleAdminFetchJobById = (req: Request, res: Response) => jobsController.fetchJobById(req, res);

// Admin Jobs Routes
router.route('/admin-job').get(adminAuth, handleAdminFetchJobById);



// User Jobs Handlers
const handleUserFetchJobById = (req: Request, res: Response) => jobsController.fetchJobById(req, res);
const handleUserFetchJobsByUser = (req: Request, res: Response) => jobsController.fetchJobsByUSer(req, res);
const handleUserFetchJobsByEmployerId = (req: Request, res: Response) => jobsController.fetchJobsByEmployerId(req, res);
const handleUserSaveJob = (req: Request, res: Response) => jobsController.saveJob(req, res);
const handleUserIsJobSaved = (req: Request, res: Response) => jobsController.isJobSaved(req, res);
const handleUserUnSaveJob = (req: Request, res: Response) => jobsController.unSaveJob(req, res);
const handleUserLoadSavedJobs = (req: Request, res: Response) => jobsController.loadSavedJobs(req, res);

// User Jobs Routes
router.route('/job').get(userAuth, handleUserFetchJobById);
router.route('/jobs').get(userAuth, handleUserFetchJobsByUser);
router.route('/user-employer-jobs').get(userAuth, handleUserFetchJobsByEmployerId);
router.route('/save-job').post(userAuth, handleUserSaveJob);
router.route('/is-saved').post(userAuth, handleUserIsJobSaved);
router.route('/unsave-job').post(userAuth, handleUserUnSaveJob);
router.route('/saved-jobs').get(userAuth, handleUserLoadSavedJobs);



// Employer Jobs Handlers
const handleEmployerFetchJobById = (req: Request, res: Response) => jobsController.fetchJobById(req, res);
const handleEmployerFetchJobsByEmployer = (req: Request, res: Response) => jobsController.fetchJobsByEmployer(req, res);
const handleEmployerPostNewJob = (req: Request, res: Response) => jobsController.postNewJob(req, res);
const handleEmployerEditJob = (req: Request, res: Response) => jobsController.editJob(req, res);
const handleEmployerDeleteJob = (req: Request, res: Response) => jobsController.deleteJob(req, res);
const handleEmployerCloseHiring = (req: Request, res: Response) => jobsController.closeHiring(req, res);

// Employer jobs Routes
router.route('/employer-job').get(employerAuth, handleEmployerFetchJobById);
router.route('/employer-jobs')
    .get(employerAuth, handleEmployerFetchJobsByEmployer)
    .post(employerAuth, handleEmployerPostNewJob)
    .put(employerAuth, handleEmployerEditJob);
router.route('/employer-delete-job/:id').delete(employerAuth, handleEmployerDeleteJob);
router.route('/close-hiring').patch(employerAuth, handleEmployerCloseHiring);

export default router;
