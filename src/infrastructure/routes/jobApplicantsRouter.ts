import express from 'express'
import { jobApplicantsController } from '../../providers/controllers';
import userAuth from '../../middlewares/userAuth';

const router = express.Router()

router.route('/apply-job')
    .patch( userAuth, (req, res) => jobApplicantsController.applyJob(req, res))
router.route('/verify-application')
    .post( userAuth, (req, res) => jobApplicantsController.verifyUserApplication(req, res))
router.route('/applied-jobs').get( userAuth, (req, res) => jobApplicantsController.fetchAppliedJobs(req, res))




    // .get( (req, res) => jobApplicantsController.fetchAppliedJobs(req, res))

router.route('/applicants/:employer_id')
    .post( (req, res) => jobApplicantsController.fetchJobApplicants(req, res))
    .patch( (req, res) => jobApplicantsController.updateCandidateStatus(req, res))

export default router