import express from 'express';
import { jobApplicantsController } from '../../providers/controllers';
import userAuth from '../../middlewares/userAuth';
import employerAuth from '../../middlewares/employerAuth';
import upload from '../../middlewares/multer';
import { Request, Response } from 'express-serve-static-core';

const router = express.Router();
const resumeHandler = upload.fields([{ name: 'resume' }]);

// Route handlers
const handleApplyJob = (req: Request, res: Response) => jobApplicantsController.applyJob(req, res);
const handleVerifyUserApplication = (req: Request, res: Response) => jobApplicantsController.verifyUserApplication(req, res);
const handleFetchAppliedJobs = (req: Request, res: Response) => jobApplicantsController.fetchAppliedJobs(req, res);
const handleFetchJobApplicants = (req: Request, res: Response) => jobApplicantsController.fetchJobApplicants(req, res);
const handleUpdateCandidateStatus = (req: Request, res: Response) => jobApplicantsController.updateCandidateStatus(req, res);
const handleRejectCandidate = (req: Request, res: Response) => jobApplicantsController.rejectCandidate(req, res);

// Routes
router.route('/apply-job').post(userAuth, resumeHandler, handleApplyJob);
router.route('/verify-application').post(userAuth, handleVerifyUserApplication);
router.route('/applied-jobs').get(userAuth, handleFetchAppliedJobs);
router.route('/reject-application').patch(employerAuth, handleRejectCandidate);
router.route('/applicants')
    .post(employerAuth, handleFetchJobApplicants)
    .patch(employerAuth, handleUpdateCandidateStatus);

export default router;
