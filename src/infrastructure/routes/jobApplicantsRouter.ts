import express from 'express'
import { jobApplicantsController } from '../../providers/controllers';
import userAuth from '../../middlewares/userAuth';
import employerAuth from '../../middlewares/employerAuth';

const router = express.Router()

router.route('/apply-job')
    .patch( userAuth, (req, res) => jobApplicantsController.applyJob(req, res))
router.route('/verify-application')
    .post( userAuth, (req, res) => jobApplicantsController.verifyUserApplication(req, res))
router.route('/applied-jobs').get( userAuth, (req, res) => jobApplicantsController.fetchAppliedJobs(req, res))
router.route('/applicants')
    .post( employerAuth, (req, res) => jobApplicantsController.fetchJobApplicants(req,res))
    .patch( employerAuth, (req, res) => jobApplicantsController.updateCandidateStatus(req, res))
router.route('/reject-application')
    .patch( employerAuth, (req, res) => jobApplicantsController.rejectCandidate(req, res))

export default router