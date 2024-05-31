import express from "express";
import { jobsController } from "../../providers/controllers";
import employerAuth from "../../middlewares/employerAuth";
import userAuth from "../../middlewares/userAuth";

const router = express.Router()

// USERS JOBS ROUTES
router.route('/jobs').get( userAuth, (req, res) => jobsController.fetchJobsByUSer(req, res));
router.route('/save-job').post( userAuth, (req, res) => jobsController.saveJob(req, res));
router.route('/is-saved').post( userAuth, (req, res) => jobsController.isJobSaved(req, res));
router.route('/unsave-job').post( userAuth, (req, res) => jobsController.unSaveJob(req, res));
router.route('/saved-jobs').get( userAuth, (req, res) => jobsController.loadSavedJobs(req, res));


// EMPLOYER JOBS ROUTES
router.route('/employer-jobs')
    .get( employerAuth, (req, res) => jobsController.fetchJobsByEmployer(req, res))
    .post( employerAuth, (req, res) => jobsController.postNewJob(req, res))
    .put( employerAuth, (req, res) => jobsController.editJob(req, res))
router.route('/employer-delete-job/:id').delete( employerAuth, (req, res) => jobsController.deleteJob(req, res))
router.route('/close-hiring').patch( employerAuth, (req, res) => jobsController.closeHiring(req, res) )
    


export default router