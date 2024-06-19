import AdminController from "../adaptors/adminController";
import ChatController from "../adaptors/chatController";
import EmployerController from "../adaptors/employerController";
import JobApplicantsController from "../adaptors/jobApplicantsController";
import JobsController from "../adaptors/jobsController";
import PostsController from "../adaptors/postsController";
import UserController from "../adaptors/userController";
import AdminRepository from "../infrastructure/repositories/adminRepository";
import AppliedJobsRepository from "../infrastructure/repositories/appliedJobsRepository";
import ChatRepository from "../infrastructure/repositories/chatRepository";
import EmployerOTPRepository from "../infrastructure/repositories/employerOTPRepository";
import EmployerRepository from "../infrastructure/repositories/employerRepository";
import JobApplicantsRepository from "../infrastructure/repositories/jobApplicantsRepository";
import JobsRepository from "../infrastructure/repositories/jobsRepository";
import PostsRepository from "../infrastructure/repositories/postsRepository";
import SavedJobsAndPostsRepository from "../infrastructure/repositories/savedJobsAndPostsRepository";
import UserOTPRepository from "../infrastructure/repositories/userOTPRepository";
import UserRepository from "../infrastructure/repositories/userRepository";
import AdminUseCase from "../use-case/adminUseCase";
import ChatUseCase from "../use-case/chatUseCase";
import EmployerUseCase from "../use-case/employerUseCase";
import JobApplicantsUseCase from "../use-case/jobApplicantsUseCase";
import JobsUseCase from "../use-case/jobsUseCase";
import PostsUseCase from "../use-case/postsUseCase";
import UserUseCase from "../use-case/userUseCase";
import GenerateOTP from "./generateOTP";
import Jwt from "./jwt";
import NodeMailer from "./nodeMailer";

// Providers
const jwt = new Jwt()
const OTPGenerator = new GenerateOTP()
const mailer = new NodeMailer()

// Repositories
const adminRepository = new AdminRepository()
const appliedJobsRepository = new AppliedJobsRepository()
const employerRepository = new EmployerRepository()
const employerOTPRepository = new EmployerOTPRepository()
const jobApplicantsRepository = new JobApplicantsRepository()
const jobsRepository = new JobsRepository()
const postsRepository = new PostsRepository()
const userRepository = new UserRepository()
const userOTPRepository = new UserOTPRepository()
const savedJobsAndPostsRepository = new SavedJobsAndPostsRepository()
const chatsRepository = new ChatRepository()

// UseCases
const adminUseCase = new AdminUseCase(adminRepository,userRepository,employerRepository,jwt);
const employerUseCase = new EmployerUseCase(employerRepository,employerOTPRepository,OTPGenerator,mailer,jwt);
const jobApplicantsUseCase = new JobApplicantsUseCase(jobApplicantsRepository,appliedJobsRepository,jwt);
const jobsUseCase = new JobsUseCase(jwt,jobsRepository,savedJobsAndPostsRepository);
const postsUseCase = new PostsUseCase(jwt,postsRepository);
const userUseCase = new UserUseCase(userRepository,employerRepository,chatsRepository,jwt,OTPGenerator,mailer,userOTPRepository);
const chatUseCase = new ChatUseCase(chatsRepository,userRepository,jwt);

// Controllers
export const adminController = new AdminController(adminUseCase);
export const employerController = new EmployerController(employerUseCase);
export const jobApplicantsController = new JobApplicantsController(jobApplicantsUseCase);
export const jobsController = new JobsController(jobsUseCase);
export const postsController = new PostsController(postsUseCase);
export const userController = new UserController(userUseCase);
export const chatController = new ChatController(chatUseCase);