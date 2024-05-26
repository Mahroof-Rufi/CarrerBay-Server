import express from "express";
import { jobsController } from "../../providers/controllers";
import employerAuth from "../../middlewares/employerAuth";

const router = express.Router()

// EMPLOYER USERS ROUTES
router.route('/')
    .get((req, res) => jobsController.fetchJobsByUSer(req, res));

// EMPLOYER JOBS ROUTES
router.route('/employer-jobs')
    .get( employerAuth, (req, res) => jobsController.fetchJobsByEmployer(req, res))
    .post( employerAuth, (req, res) => jobsController.postNewJob(req, res))
    .put( employerAuth, (req, res) => jobsController.editJob(req, res))
router.route('/employer-delete-job/:id')
    .delete( employerAuth, (req, res) => jobsController.deleteJob(req, res))
    


export default router