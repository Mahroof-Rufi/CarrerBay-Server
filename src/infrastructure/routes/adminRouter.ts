import express from "express";
import adminRepository from "../repository/adminRepository";
import adminUseCase from "../../use-case/adminUseCase";
import Jwt from "../utils/jwt";
import adminController from "../../adaptor/adminController";
import userRepository from "../repository/userRepository";
import employerRepository from "../repository/employerRepository";

const router = express.Router()

const jwt = new Jwt()

const repository = new adminRepository()
const userRepo = new userRepository()
const employerRepo = new employerRepository()
const useCase = new adminUseCase(repository,userRepo,employerRepo,jwt)
const controller = new adminController(useCase)

router.post('/login', (req, res) => controller.login(req, res))

router.route('/users')
    .get((req, res) => controller.loadUsers(req, res))
    .patch((req, res) => controller.userAction(req, res))

router.route('/companies')
    .get((req, res) => controller.loadCompanies(req, res))
    .patch((req, res) => controller.employerAction(req, res))

export default router