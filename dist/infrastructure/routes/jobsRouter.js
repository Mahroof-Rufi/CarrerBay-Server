"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const employerAuth_1 = __importDefault(require("../../middlewares/employerAuth"));
const userAuth_1 = __importDefault(require("../../middlewares/userAuth"));
const adminAuth_1 = __importDefault(require("../../middlewares/adminAuth"));
const router = express_1.default.Router();
// Admin Jobs handlers
const handleAdminFetchJobById = (req, res) => controllers_1.jobsController.fetchJobById(req, res);
// Admin Jobs Routes
router.route('/admin-job').get(adminAuth_1.default, handleAdminFetchJobById);
// User Jobs Handlers
const handleUserFetchJobById = (req, res) => controllers_1.jobsController.fetchJobById(req, res);
const handleUserFetchJobsByUser = (req, res) => controllers_1.jobsController.fetchJobsByUSer(req, res);
const handleUserFetchJobsByEmployerId = (req, res) => controllers_1.jobsController.fetchJobsByEmployerId(req, res);
const handleUserSaveJob = (req, res) => controllers_1.jobsController.saveJob(req, res);
const handleUserIsJobSaved = (req, res) => controllers_1.jobsController.isJobSaved(req, res);
const handleUserUnSaveJob = (req, res) => controllers_1.jobsController.unSaveJob(req, res);
const handleUserLoadSavedJobs = (req, res) => controllers_1.jobsController.loadSavedJobs(req, res);
// User Jobs Routes
router.route('/job').get(userAuth_1.default, handleUserFetchJobById);
router.route('/jobs').get(userAuth_1.default, handleUserFetchJobsByUser);
router.route('/user-employer-jobs').get(userAuth_1.default, handleUserFetchJobsByEmployerId);
router.route('/save-job').post(userAuth_1.default, handleUserSaveJob);
router.route('/is-saved').post(userAuth_1.default, handleUserIsJobSaved);
router.route('/unsave-job').post(userAuth_1.default, handleUserUnSaveJob);
router.route('/saved-jobs').get(userAuth_1.default, handleUserLoadSavedJobs);
// Employer Jobs Handlers
const handleEmployerFetchJobById = (req, res) => controllers_1.jobsController.fetchJobById(req, res);
const handleEmployerFetchJobsByEmployer = (req, res) => controllers_1.jobsController.fetchJobsByEmployer(req, res);
const handleEmployerPostNewJob = (req, res) => controllers_1.jobsController.postNewJob(req, res);
const handleEmployerEditJob = (req, res) => controllers_1.jobsController.editJob(req, res);
const handleEmployerDeleteJob = (req, res) => controllers_1.jobsController.deleteJob(req, res);
const handleEmployerCloseHiring = (req, res) => controllers_1.jobsController.closeHiring(req, res);
// Employer jobs Routes
router.route('/employer-job').get(employerAuth_1.default, handleEmployerFetchJobById);
router.route('/employer-jobs')
    .get(employerAuth_1.default, handleEmployerFetchJobsByEmployer)
    .post(employerAuth_1.default, handleEmployerPostNewJob)
    .put(employerAuth_1.default, handleEmployerEditJob);
router.route('/employer-delete-job/:id').delete(employerAuth_1.default, handleEmployerDeleteJob);
router.route('/close-hiring').patch(employerAuth_1.default, handleEmployerCloseHiring);
exports.default = router;
