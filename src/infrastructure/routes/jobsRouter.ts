import express from "express";
import { jobsController } from "../../providers/controllers";
import employerAuth from "../../middlewares/employerAuth";

const router = express.Router()

router.route('/employer-jobs').get( employerAuth, (req, res) => jobsController.fetchJobsByEmployer(req, res))



router.route('/')
    .get((req, res) => jobsController.fetchJobsByUSer(req, res));
router.route('/job')
    .get((req, res) => jobsController.fetchJobsByEmployer(req, res))
    .post((req, res) => jobsController.postNewJob(req, res))
router.route('/job/:id')
    .put((req, res) => jobsController.editJob(req, res))
    .delete((req, res) => jobsController.deleteJob(req, res));

export default router