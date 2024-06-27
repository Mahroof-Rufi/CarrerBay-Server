"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const employerAuth_1 = __importDefault(require("../../middlewares/employerAuth"));
const router = express_1.default.Router();
const profileImageUpload = multer_1.default.single('profile-img');
// Route handlers
const handleFetchEmployerData = (req, res) => controllers_1.employerController.fetchEmployerData(req, res);
const handleUpdateProfile = (req, res) => controllers_1.employerController.updateProfile(req, res);
// Routes
router.route('/').get(employerAuth_1.default, handleFetchEmployerData);
router.route('/update-profile').put(employerAuth_1.default, profileImageUpload, handleUpdateProfile);
exports.default = router;
