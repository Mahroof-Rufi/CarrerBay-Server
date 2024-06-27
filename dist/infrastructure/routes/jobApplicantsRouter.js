"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const userAuth_1 = __importDefault(require("../../middlewares/userAuth"));
const employerAuth_1 = __importDefault(require("../../middlewares/employerAuth"));
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = express_1.default.Router();
const resumeHandler = multer_1.default.fields([{ name: 'resume' }]);
// Route handlers
const handleApplyJob = (req, res) => controllers_1.jobApplicantsController.applyJob(req, res);
const handleVerifyUserApplication = (req, res) => controllers_1.jobApplicantsController.verifyUserApplication(req, res);
const handleFetchAppliedJobs = (req, res) => controllers_1.jobApplicantsController.fetchAppliedJobs(req, res);
const handleFetchJobApplicants = (req, res) => controllers_1.jobApplicantsController.fetchJobApplicants(req, res);
const handleUpdateCandidateStatus = (req, res) => controllers_1.jobApplicantsController.updateCandidateStatus(req, res);
const handleRejectCandidate = (req, res) => controllers_1.jobApplicantsController.rejectCandidate(req, res);
// Routes
router.route('/apply-job').post(userAuth_1.default, resumeHandler, handleApplyJob);
router.route('/verify-application').post(userAuth_1.default, handleVerifyUserApplication);
router.route('/applied-jobs').get(userAuth_1.default, handleFetchAppliedJobs);
router.route('/reject-application').patch(employerAuth_1.default, handleRejectCandidate);
router.route('/applicants')
    .post(employerAuth_1.default, handleFetchJobApplicants)
    .patch(employerAuth_1.default, handleUpdateCandidateStatus);
exports.default = router;
